import { router, protectedProcedure } from "@/lib/trpc/trpc";
import { prisma } from "@/lib/db/prisma";
import { shuffleArray } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const practiceRouter = router({
  getTopics: protectedProcedure
    .input(z.object({ examType: z.enum(["PD1", "PD2"]) }))
    .query(async ({ ctx, input }) => {
      const topics = await prisma.topic.findMany({
        where: { exam: { type: input.examType }, isActive: true },
        include: {
          progress: {
            where: { userId: ctx.userId },
          },
        },
        orderBy: { sortOrder: "asc" },
      });

      return topics.map((topic) => {
        const progress = topic.progress[0];
        return {
          id: topic.id,
          name: topic.name,
          slug: topic.slug,
          weight: topic.weight,
          questionsAttempted: progress?.questionsAttempted ?? 0,
          accuracyPercentage: progress?.accuracyPercentage ?? 0,
        };
      });
    }),
  getQuestions: protectedProcedure
    .input(
      z.object({
        examType: z.enum(["PD1", "PD2"]),
        topicId: z.string().optional(),
        count: z.number().min(1).max(50).default(10),
        difficulty: z.number().min(1).max(5).optional(),
        excludeAnswered: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const exam = await prisma.exam.findUnique({
        where: { type: input.examType },
      });

      if (!exam) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exam not found" });
      }

      const hasPremium =
        (await prisma.subscription.findFirst({
          where: { userId: ctx.userId, status: "ACTIVE" },
        })) !== null;

      const questions = await prisma.question.findMany({
        where: {
          examId: exam.id,
          isActive: true,
          isPremium: hasPremium ? undefined : false,
          difficulty: input.difficulty ?? undefined,
          ...(input.topicId
            ? {
                topic: {
                  OR: [{ id: input.topicId }, { slug: input.topicId }],
                },
              }
            : {}),
          ...(input.excludeAnswered
            ? {
                userAnswers: {
                  none: { userId: ctx.userId },
                },
              }
            : {}),
        },
        include: {
          topic: { select: { id: true, name: true, slug: true } },
          answers: { select: { id: true, content: true, sortOrder: true } },
        },
        orderBy: { createdAt: "desc" },
        take: input.count,
      });

      return questions.map((question) => ({
        ...question,
        answers: shuffleArray(question.answers),
      }));
    }),
  submitAnswer: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        selectedAnswerIds: z.array(z.string()),
        timeSpent: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const question = await prisma.question.findUnique({
        where: { id: input.questionId },
        include: { answers: true, topic: true },
      });

      if (!question) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Question not found" });
      }

      const validAnswerIds = new Set(question.answers.map((a) => a.id));
      const invalid = input.selectedAnswerIds.some((id) => !validAnswerIds.has(id));
      if (invalid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid answer selection" });
      }

      const correctAnswerIds = question.answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.id);

      const selectedSet = new Set(input.selectedAnswerIds);
      const correctSet = new Set(correctAnswerIds);
      const isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((id) => correctSet.has(id));

      const userAnswer = await prisma.userAnswer.create({
        data: {
          userId: ctx.userId,
          questionId: question.id,
          isCorrect,
          timeSpent: input.timeSpent,
          context: "PRACTICE",
          selections: {
            create: input.selectedAnswerIds.map((answerId) => ({ answerId })),
          },
        },
      });

      const existingProgress = await prisma.userProgress.findUnique({
        where: {
          userId_examId_topicId: {
            userId: ctx.userId,
            examId: question.examId,
            topicId: question.topicId,
          },
        },
      });

      const nextAttempted = (existingProgress?.questionsAttempted ?? 0) + 1;
      const nextCorrect = (existingProgress?.questionsCorrect ?? 0) + (isCorrect ? 1 : 0);
      const accuracy = Number(((nextCorrect / nextAttempted) * 100).toFixed(2));

      if (existingProgress) {
        await prisma.userProgress.update({
          where: { id: existingProgress.id },
          data: {
            questionsAttempted: nextAttempted,
            questionsCorrect: nextCorrect,
            accuracyPercentage: accuracy,
            lastPracticedAt: new Date(),
          },
        });
      } else {
        await prisma.userProgress.create({
          data: {
            userId: ctx.userId,
            examId: question.examId,
            topicId: question.topicId,
            questionsAttempted: nextAttempted,
            questionsCorrect: nextCorrect,
            accuracyPercentage: accuracy,
            lastPracticedAt: new Date(),
          },
        });
      }

      return {
        userAnswerId: userAnswer.id,
        isCorrect,
        correctAnswerIds,
        explanation: question.explanation,
        referenceUrl: question.referenceUrl,
      };
    }),
});

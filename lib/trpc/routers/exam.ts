import { router, protectedProcedure } from "@/lib/trpc/trpc";
import { prisma } from "@/lib/db/prisma";
import { shuffleArray } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const examRouter = router({
  start: protectedProcedure
    .input(z.object({ examType: z.enum(["PD1", "PD2"]) }))
    .mutation(async ({ ctx, input }) => {
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

      const allQuestions = await prisma.question.findMany({
        where: {
          examId: exam.id,
          isActive: true,
          isPremium: hasPremium ? undefined : false,
        },
        select: { id: true },
      });

      if (allQuestions.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No questions available" });
      }

      const selected = shuffleArray(allQuestions).slice(0, exam.questionCount);

      const attempt = await prisma.examAttempt.create({
        data: {
          userId: ctx.userId,
          examId: exam.id,
          questionCount: selected.length,
          durationMinutes: exam.durationMinutes,
          questions: {
            create: selected.map((question, index) => ({
              questionId: question.id,
              sortOrder: index,
            })),
          },
        },
      });

      const firstQuestion = await prisma.question.findUnique({
        where: { id: selected[0].id },
        include: {
          topic: { select: { id: true, name: true, slug: true } },
          answers: {
            select: { id: true, content: true, sortOrder: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      return {
        examAttemptId: attempt.id,
        firstQuestion: firstQuestion ?? null,
      };
    }),
  getAttempt: protectedProcedure
    .input(z.object({ examAttemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempt = await prisma.examAttempt.findFirst({
        where: { id: input.examAttemptId, userId: ctx.userId },
        include: {
          exam: true,
          questions: {
            orderBy: { sortOrder: "asc" },
            include: {
              question: {
                include: {
                  topic: { select: { id: true, name: true, slug: true } },
                  answers: {
                    select: { id: true, content: true, sortOrder: true },
                    orderBy: { sortOrder: "asc" },
                  },
                },
              },
            },
          },
        },
      });

      if (!attempt) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exam attempt not found" });
      }

      const startedAt = attempt.startedAt.getTime();
      const elapsedMinutes = (Date.now() - startedAt) / 1000 / 60;
      const remainingMinutes = Math.max(attempt.durationMinutes - elapsedMinutes, 0);

      return {
        id: attempt.id,
        status: attempt.status,
        startedAt: attempt.startedAt,
        durationMinutes: attempt.durationMinutes,
        timeRemainingMinutes: Math.ceil(remainingMinutes),
        questions: attempt.questions.map((item) => ({
          id: item.id,
          questionId: item.questionId,
          sortOrder: item.sortOrder,
          isFlagged: item.isFlagged,
          userAnswerId: item.userAnswerId,
          question: item.question,
        })),
      };
    }),
  submitAnswer: protectedProcedure
    .input(
      z.object({
        examAttemptId: z.string(),
        questionId: z.string(),
        selectedAnswerIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const question = await prisma.question.findUnique({
        where: { id: input.questionId },
        include: { answers: true },
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
          context: "EXAM",
          examAttemptId: input.examAttemptId,
          selections: {
            create: input.selectedAnswerIds.map((answerId) => ({ answerId })),
          },
        },
      });

      await prisma.examAttemptQuestion.updateMany({
        where: {
          examAttemptId: input.examAttemptId,
          questionId: question.id,
        },
        data: { userAnswerId: userAnswer.id },
      });

      return { ok: true };
    }),
  flagQuestion: protectedProcedure
    .input(
      z.object({
        examAttemptId: z.string(),
        questionId: z.string(),
        isFlagged: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await prisma.examAttemptQuestion.updateMany({
        where: {
          examAttemptId: input.examAttemptId,
          questionId: input.questionId,
          examAttempt: { userId: ctx.userId },
        },
        data: { isFlagged: input.isFlagged },
      });

      if (updated.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exam question not found" });
      }

      return { ok: true };
    }),
  complete: protectedProcedure
    .input(z.object({ examAttemptId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const attempt = await prisma.examAttempt.findFirst({
        where: { id: input.examAttemptId, userId: ctx.userId },
        include: { exam: true },
      });

      if (!attempt) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exam attempt not found" });
      }

      const answers = await prisma.userAnswer.findMany({
        where: { examAttemptId: attempt.id, userId: ctx.userId },
        select: { isCorrect: true },
      });

      const correct = answers.filter((answer) => answer.isCorrect).length;
      const score = Math.round((correct / attempt.questionCount) * 100);
      const passed = score >= attempt.exam.passingScore;

      await prisma.examAttempt.update({
        where: { id: attempt.id },
        data: {
          status: "COMPLETED",
          score,
          passed,
          completedAt: new Date(),
        },
      });

      return { score, passed };
    }),
  getHistory: protectedProcedure
    .input(
      z.object({
        examType: z.enum(["PD1", "PD2"]).optional(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const attempts = await prisma.examAttempt.findMany({
        where: {
          userId: ctx.userId,
          ...(input.examType ? { exam: { type: input.examType } } : {}),
        },
        orderBy: { startedAt: "desc" },
        take: input.limit,
        include: { exam: true },
      });

      return attempts.map((attempt) => ({
        id: attempt.id,
        examType: attempt.exam.type,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        score: attempt.score,
        passed: attempt.passed,
        status: attempt.status,
      }));
    }),
});

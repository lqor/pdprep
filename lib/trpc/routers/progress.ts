import { router, protectedProcedure } from "@/lib/trpc/trpc";
import { prisma } from "@/lib/db/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const progressRouter = router({
  getOverview: protectedProcedure
    .input(z.object({ examType: z.enum(["PD1", "PD2"]) }))
    .query(async ({ ctx, input }) => {
      const progress = await prisma.userProgress.findMany({
        where: { userId: ctx.userId, exam: { type: input.examType } },
        include: { topic: true },
      });

      const totalAttempted = progress.reduce(
        (sum, item) => sum + item.questionsAttempted,
        0
      );
      const totalCorrect = progress.reduce(
        (sum, item) => sum + item.questionsCorrect,
        0
      );
      const accuracy = totalAttempted
        ? Number(((totalCorrect / totalAttempted) * 100).toFixed(2))
        : 0;

      return {
        totalAttempted,
        totalCorrect,
        accuracy,
        topics: progress.map((item) => ({
          topicId: item.topicId,
          topicName: item.topic.name,
          topicSlug: item.topic.slug,
          questionsAttempted: item.questionsAttempted,
          questionsCorrect: item.questionsCorrect,
          accuracyPercentage: item.accuracyPercentage,
        })),
      };
    }),
  getTopicProgress: protectedProcedure
    .input(
      z.object({
        examType: z.enum(["PD1", "PD2"]),
        topicId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const topic = await prisma.topic.findFirst({
        where: {
          exam: { type: input.examType },
          OR: [{ id: input.topicId }, { slug: input.topicId }],
        },
      });

      if (!topic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Topic not found" });
      }

      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_examId_topicId: {
            userId: ctx.userId,
            examId: topic.examId,
            topicId: topic.id,
          },
        },
      });

      return {
        topicId: topic.id,
        topicName: topic.name,
        questionsAttempted: progress?.questionsAttempted ?? 0,
        questionsCorrect: progress?.questionsCorrect ?? 0,
        accuracyPercentage: progress?.accuracyPercentage ?? 0,
      };
    }),
  getReadinessScore: protectedProcedure
    .input(z.object({ examType: z.enum(["PD1", "PD2"]) }))
    .query(async ({ ctx, input }) => {
      const progress = await prisma.userProgress.findMany({
        where: { userId: ctx.userId, exam: { type: input.examType } },
      });

      const totalAttempted = progress.reduce(
        (sum, item) => sum + item.questionsAttempted,
        0
      );
      const totalCorrect = progress.reduce(
        (sum, item) => sum + item.questionsCorrect,
        0
      );

      const accuracy = totalAttempted ? totalCorrect / totalAttempted : 0;
      const readinessScore = Math.round(accuracy * 100);

      return { readinessScore };
    }),
});

import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./helpers";

export const getOverview = query({
  args: { examType: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const exam = await ctx.db
      .query("exams")
      .withIndex("by_type", (q) => q.eq("type", args.examType))
      .first();
    if (!exam) return { totalAttempted: 0, totalCorrect: 0, accuracy: 0, topics: [] };

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId_examId", (q) =>
        q.eq("userId", userId).eq("examId", exam._id)
      )
      .collect();

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

    const topics = await Promise.all(
      progress.map(async (item) => {
        const topic = await ctx.db.get(item.topicId);
        return {
          topicId: item.topicId,
          topicName: topic?.name ?? "Unknown",
          topicSlug: topic?.slug ?? "",
          questionsAttempted: item.questionsAttempted,
          questionsCorrect: item.questionsCorrect,
          accuracyPercentage: item.accuracyPercentage,
        };
      })
    );

    return { totalAttempted, totalCorrect, accuracy, topics };
  },
});

export const getTopicProgress = query({
  args: {
    examType: v.string(),
    topicId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const exam = await ctx.db
      .query("exams")
      .withIndex("by_type", (q) => q.eq("type", args.examType))
      .first();
    if (!exam) throw new Error("Exam not found");

    // Try to find topic by slug first, then by ID
    let topic = await ctx.db
      .query("topics")
      .withIndex("by_examId_slug", (q) =>
        q.eq("examId", exam._id).eq("slug", args.topicId)
      )
      .first();

    if (!topic) {
      topic = await ctx.db.get(args.topicId as any);
    }

    if (!topic) throw new Error("Topic not found");

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId_examId_topicId", (q) =>
        q.eq("userId", userId).eq("examId", exam._id).eq("topicId", topic!._id)
      )
      .first();

    return {
      topicId: topic._id,
      topicName: topic.name,
      questionsAttempted: progress?.questionsAttempted ?? 0,
      questionsCorrect: progress?.questionsCorrect ?? 0,
      accuracyPercentage: progress?.accuracyPercentage ?? 0,
    };
  },
});

export const getReadinessScore = query({
  args: { examType: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const exam = await ctx.db
      .query("exams")
      .withIndex("by_type", (q) => q.eq("type", args.examType))
      .first();
    if (!exam) return { readinessScore: 0 };

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId_examId", (q) =>
        q.eq("userId", userId).eq("examId", exam._id)
      )
      .collect();

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
  },
});

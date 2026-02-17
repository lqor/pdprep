import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedExam = internalMutation({
  args: {
    type: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    questionCount: v.number(),
    passingScore: v.number(),
    durationMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("exams")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("exams", {
      ...args,
      isActive: true,
    });
  },
});

export const seedTopic = internalMutation({
  args: {
    examId: v.id("exams"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    weight: v.number(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("topics")
      .withIndex("by_examId_slug", (q) =>
        q.eq("examId", args.examId).eq("slug", args.slug)
      )
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("topics", {
      ...args,
      isActive: true,
    });
  },
});

export const seedQuestions = internalMutation({
  args: {
    questions: v.array(
      v.object({
        examId: v.id("exams"),
        topicId: v.id("topics"),
        content: v.string(),
        codeSnippet: v.optional(v.string()),
        type: v.string(),
        difficulty: v.number(),
        explanation: v.string(),
        referenceUrl: v.optional(v.string()),
        isPremium: v.boolean(),
        answers: v.array(
          v.object({
            id: v.string(),
            content: v.string(),
            isCorrect: v.boolean(),
            sortOrder: v.number(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const q of args.questions) {
      await ctx.db.insert("questions", {
        ...q,
        isActive: true,
      });
      count++;
    }
    return { inserted: count };
  },
});

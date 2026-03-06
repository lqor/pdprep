import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./helpers";

export const getById = query({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const question = await ctx.db.get(args.id);
    if (!question) throw new Error("Question not found");
    if (!question.isActive) throw new Error("Question not found");

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const hasPremium = subscription?.status === "ACTIVE";
    if (question.isPremium && !hasPremium) {
      throw new Error("Question not found");
    }

    const topic = await ctx.db.get(question.topicId);
    if (!topic?.isActive) throw new Error("Question not found");

    return {
      ...question,
      id: question._id,
      topic: topic
        ? { id: topic._id, name: topic.name, slug: topic.slug }
        : null,
      answers: question.answers.map((a) => ({
        id: a.id,
        content: a.content,
        sortOrder: a.sortOrder,
      })),
    };
  },
});

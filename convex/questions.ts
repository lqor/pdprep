import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./helpers";

export const getById = query({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const question = await ctx.db.get(args.id);
    if (!question) throw new Error("Question not found");

    const topic = await ctx.db.get(question.topicId);

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

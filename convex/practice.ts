import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, shuffleArray } from "./helpers";
import { Id } from "./_generated/dataModel";

export const getTopics = query({
  args: { examType: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const exam = await ctx.db
      .query("exams")
      .withIndex("by_type", (q) => q.eq("type", args.examType))
      .first();
    if (!exam) return [];

    const topics = await ctx.db
      .query("topics")
      .withIndex("by_examId", (q) => q.eq("examId", exam._id))
      .collect();

    const activeTopics = topics
      .filter((t) => t.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const result = await Promise.all(
      activeTopics.map(async (topic) => {
        const progress = await ctx.db
          .query("userProgress")
          .withIndex("by_userId_examId_topicId", (q) =>
            q.eq("userId", userId).eq("examId", exam._id).eq("topicId", topic._id)
          )
          .first();

        return {
          id: topic._id,
          name: topic.name,
          slug: topic.slug,
          weight: topic.weight,
          questionsAttempted: progress?.questionsAttempted ?? 0,
          accuracyPercentage: progress?.accuracyPercentage ?? 0,
        };
      })
    );

    return result;
  },
});

export const getQuestions = query({
  args: {
    examType: v.string(),
    topicId: v.optional(v.string()),
    count: v.number(),
    difficulty: v.optional(v.number()),
    excludeAnswered: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const exam = await ctx.db
      .query("exams")
      .withIndex("by_type", (q) => q.eq("type", args.examType))
      .first();
    if (!exam) throw new Error("Exam not found");

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const hasPremium = subscription?.status === "ACTIVE";

    // Resolve topicId — could be a slug or an _id
    let targetTopicId: Id<"topics"> | undefined;
    if (args.topicId) {
      const topicBySlug = await ctx.db
        .query("topics")
        .withIndex("by_examId_slug", (q) =>
          q.eq("examId", exam._id).eq("slug", args.topicId!)
        )
        .first();
      if (topicBySlug) {
        targetTopicId = topicBySlug._id;
      } else {
        // Try as a direct ID
        targetTopicId = args.topicId as Id<"topics">;
      }
    }

    let questions;
    if (targetTopicId) {
      questions = await ctx.db
        .query("questions")
        .withIndex("by_topicId", (q) => q.eq("topicId", targetTopicId!))
        .collect();
    } else {
      questions = await ctx.db
        .query("questions")
        .withIndex("by_examId", (q) => q.eq("examId", exam._id))
        .collect();
    }

    // Filter active
    questions = questions.filter((q) => q.isActive);

    // Filter by premium access
    if (!hasPremium) {
      questions = questions.filter((q) => !q.isPremium);
    }

    // Filter by difficulty
    if (args.difficulty) {
      questions = questions.filter((q) => q.difficulty === args.difficulty);
    }

    // Exclude answered
    if (args.excludeAnswered) {
      const userAnswers = await ctx.db
        .query("userAnswers")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();
      const answeredQuestionIds = new Set(userAnswers.map((a) => a.questionId));
      questions = questions.filter((q) => !answeredQuestionIds.has(q._id));
    }

    // Shuffle and take count
    const shuffled = shuffleArray(questions).slice(0, args.count);

    return Promise.all(
      shuffled.map(async (q) => {
        const topic = await ctx.db.get(q.topicId);
        return {
          id: q._id,
          content: q.content,
          codeSnippet: q.codeSnippet,
          type: q.type,
          difficulty: q.difficulty,
          topic: topic
            ? { id: topic._id, name: topic.name, slug: topic.slug }
            : null,
          answers: shuffleArray(
            q.answers.map((a) => ({
              id: a.id,
              content: a.content,
              sortOrder: a.sortOrder,
            }))
          ),
        };
      })
    );
  },
});

export const submitAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    selectedAnswerIds: v.array(v.string()),
    timeSpent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");

    // Validate answer IDs
    const validAnswerIds = new Set(question.answers.map((a) => a.id));
    const invalid = args.selectedAnswerIds.some((id) => !validAnswerIds.has(id));
    if (invalid) throw new Error("Invalid answer selection");

    // Check correctness
    const correctAnswerIds = question.answers
      .filter((a) => a.isCorrect)
      .map((a) => a.id);
    const selectedSet = new Set(args.selectedAnswerIds);
    const correctSet = new Set(correctAnswerIds);
    const isCorrect =
      selectedSet.size === correctSet.size &&
      [...selectedSet].every((id) => correctSet.has(id));

    // Record the answer
    const userAnswerId = await ctx.db.insert("userAnswers", {
      userId,
      questionId: question._id,
      isCorrect,
      timeSpent: args.timeSpent,
      context: "PRACTICE",
      selectedAnswerIds: args.selectedAnswerIds,
      answeredAt: Date.now(),
    });

    // Update progress (upsert pattern)
    const existingProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId_examId_topicId", (q) =>
        q
          .eq("userId", userId)
          .eq("examId", question.examId)
          .eq("topicId", question.topicId)
      )
      .first();

    const nextAttempted = (existingProgress?.questionsAttempted ?? 0) + 1;
    const nextCorrect =
      (existingProgress?.questionsCorrect ?? 0) + (isCorrect ? 1 : 0);
    const accuracy = Number(((nextCorrect / nextAttempted) * 100).toFixed(2));

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        questionsAttempted: nextAttempted,
        questionsCorrect: nextCorrect,
        accuracyPercentage: accuracy,
        lastPracticedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userProgress", {
        userId,
        examId: question.examId,
        topicId: question.topicId,
        questionsAttempted: nextAttempted,
        questionsCorrect: nextCorrect,
        accuracyPercentage: accuracy,
        lastPracticedAt: Date.now(),
      });
    }

    return {
      userAnswerId,
      isCorrect,
      correctAnswerIds,
      explanation: question.explanation,
      referenceUrl: question.referenceUrl,
    };
  },
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, shuffleArray } from "./helpers";

export const start = mutation({
  args: { examType: v.string() },
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

    let allQuestions = await ctx.db
      .query("questions")
      .withIndex("by_examId", (q) => q.eq("examId", exam._id))
      .collect();

    allQuestions = allQuestions.filter((q) => q.isActive);
    if (!hasPremium) {
      allQuestions = allQuestions.filter((q) => !q.isPremium);
    }

    if (allQuestions.length === 0) {
      throw new Error("No questions available");
    }

    const selected = shuffleArray(allQuestions).slice(0, exam.questionCount);

    const attemptId = await ctx.db.insert("examAttempts", {
      userId,
      examId: exam._id,
      questionCount: selected.length,
      durationMinutes: exam.durationMinutes,
      status: "IN_PROGRESS",
      startedAt: Date.now(),
    });

    for (let i = 0; i < selected.length; i++) {
      await ctx.db.insert("examAttemptQuestions", {
        examAttemptId: attemptId,
        questionId: selected[i]._id,
        sortOrder: i,
        isFlagged: false,
      });
    }

    const firstQ = selected[0];
    const topic = await ctx.db.get(firstQ.topicId);

    return {
      examAttemptId: attemptId,
      firstQuestion: {
        id: firstQ._id,
        content: firstQ.content,
        codeSnippet: firstQ.codeSnippet,
        type: firstQ.type,
        topic: topic
          ? { id: topic._id, name: topic.name, slug: topic.slug }
          : null,
        answers: firstQ.answers.map((a) => ({
          id: a.id,
          content: a.content,
          sortOrder: a.sortOrder,
        })),
      },
    };
  },
});

export const getAttempt = query({
  args: { examAttemptId: v.id("examAttempts") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const attempt = await ctx.db.get(args.examAttemptId);
    if (!attempt || attempt.userId !== userId) {
      throw new Error("Exam attempt not found");
    }

    const exam = await ctx.db.get(attempt.examId);

    const attemptQuestions = await ctx.db
      .query("examAttemptQuestions")
      .withIndex("by_examAttemptId", (q) =>
        q.eq("examAttemptId", attempt._id)
      )
      .collect();

    attemptQuestions.sort((a, b) => a.sortOrder - b.sortOrder);

    const questionsRaw = await Promise.all(
      attemptQuestions.map(async (aq) => {
        const question = await ctx.db.get(aq.questionId);
        if (!question) return null;
        const topic = await ctx.db.get(question.topicId);
        return {
          id: aq._id,
          questionId: aq.questionId,
          sortOrder: aq.sortOrder,
          isFlagged: aq.isFlagged,
          userAnswerId: aq.userAnswerId,
          question: {
            id: question._id,
            content: question.content,
            codeSnippet: question.codeSnippet,
            type: question.type,
            topic: topic
              ? { id: topic._id, name: topic.name, slug: topic.slug }
              : null,
            answers: question.answers.map((a) => ({
              id: a.id,
              content: a.content,
              sortOrder: a.sortOrder,
            })),
          },
        };
      })
    );
    const questions = questionsRaw.filter(
      (q): q is NonNullable<typeof q> => q !== null
    );

    const elapsedMinutes = (Date.now() - attempt.startedAt) / 1000 / 60;
    const remainingMinutes = Math.max(
      attempt.durationMinutes - elapsedMinutes,
      0
    );

    return {
      id: attempt._id,
      status: attempt.status,
      startedAt: attempt.startedAt,
      durationMinutes: attempt.durationMinutes,
      timeRemainingMinutes: Math.ceil(remainingMinutes),
      questions,
    };
  },
});

export const submitAnswer = mutation({
  args: {
    examAttemptId: v.id("examAttempts"),
    questionId: v.id("questions"),
    selectedAnswerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");

    // Validate answer IDs
    const validAnswerIds = new Set(question.answers.map((a) => a.id));
    const invalid = args.selectedAnswerIds.some(
      (id) => !validAnswerIds.has(id)
    );
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
      context: "EXAM",
      examAttemptId: args.examAttemptId,
      selectedAnswerIds: args.selectedAnswerIds,
      answeredAt: Date.now(),
    });

    // Link to exam attempt question
    const attemptQuestion = await ctx.db
      .query("examAttemptQuestions")
      .withIndex("by_examAttemptId_questionId", (q) =>
        q
          .eq("examAttemptId", args.examAttemptId)
          .eq("questionId", question._id)
      )
      .first();

    if (attemptQuestion) {
      await ctx.db.patch(attemptQuestion._id, { userAnswerId });
    }

    return { ok: true };
  },
});

export const flagQuestion = mutation({
  args: {
    examAttemptId: v.id("examAttempts"),
    questionId: v.id("questions"),
    isFlagged: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Verify ownership
    const attempt = await ctx.db.get(args.examAttemptId);
    if (!attempt || attempt.userId !== userId) {
      throw new Error("Exam attempt not found");
    }

    const attemptQuestion = await ctx.db
      .query("examAttemptQuestions")
      .withIndex("by_examAttemptId_questionId", (q) =>
        q
          .eq("examAttemptId", args.examAttemptId)
          .eq("questionId", args.questionId)
      )
      .first();

    if (!attemptQuestion) throw new Error("Exam question not found");

    await ctx.db.patch(attemptQuestion._id, { isFlagged: args.isFlagged });

    return { ok: true };
  },
});

export const complete = mutation({
  args: { examAttemptId: v.id("examAttempts") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const attempt = await ctx.db.get(args.examAttemptId);
    if (!attempt || attempt.userId !== userId) {
      throw new Error("Exam attempt not found");
    }

    const exam = await ctx.db.get(attempt.examId);
    if (!exam) throw new Error("Exam not found");

    const answers = await ctx.db
      .query("userAnswers")
      .withIndex("by_examAttemptId", (q) =>
        q.eq("examAttemptId", attempt._id)
      )
      .collect();

    const userAnswers = answers.filter((a) => a.userId === userId);
    const correct = userAnswers.filter((a) => a.isCorrect).length;
    const score = Math.round((correct / attempt.questionCount) * 100);
    const passed = score >= exam.passingScore;

    await ctx.db.patch(attempt._id, {
      status: "COMPLETED",
      score,
      passed,
      completedAt: Date.now(),
    });

    return { score, passed };
  },
});

export const getHistory = query({
  args: {
    examType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const limit = args.limit ?? 10;

    const attempts = await ctx.db
      .query("examAttempts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Filter by exam type if specified
    let filtered = attempts;
    if (args.examType) {
      const exam = await ctx.db
        .query("exams")
        .withIndex("by_type", (q) => q.eq("type", args.examType!))
        .first();
      if (exam) {
        filtered = attempts.filter((a) => a.examId === exam._id);
      } else {
        filtered = [];
      }
    }

    // Sort by startedAt descending and take limit
    filtered.sort((a, b) => b.startedAt - a.startedAt);
    filtered = filtered.slice(0, limit);

    return Promise.all(
      filtered.map(async (attempt) => {
        const exam = await ctx.db.get(attempt.examId);
        return {
          id: attempt._id,
          examType: exam?.type ?? "PD1",
          startedAt: attempt.startedAt,
          completedAt: attempt.completedAt,
          score: attempt.score,
          passed: attempt.passed,
          status: attempt.status,
        };
      })
    );
  },
});

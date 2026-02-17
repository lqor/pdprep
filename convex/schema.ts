import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authAccounts: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    providerAccountId: v.string(),
    secret: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  })
    .index("by_provider_account", ["provider", "providerAccountId"])
    .index("by_userId", ["userId"]),

  authSessions: defineTable({
    userId: v.id("users"),
    expirationTime: v.number(),
  }).index("by_userId", ["userId"]),

  authRefreshTokens: defineTable({
    sessionId: v.id("authSessions"),
    expirationTime: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  authVerificationCodes: defineTable({
    accountId: v.id("authAccounts"),
    code: v.string(),
    expirationTime: v.number(),
    verifier: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    phoneVerified: v.optional(v.string()),
  })
    .index("by_accountId", ["accountId"])
    .index("by_code", ["code"]),

  authVerifiers: defineTable({
    sessionId: v.optional(v.id("authSessions")),
    signature: v.optional(v.string()),
  }),

  authRateLimits: defineTable({
    identifier: v.string(),
    lastAttemptTime: v.number(),
    attemptsLeft: v.number(),
  }).index("by_identifier", ["identifier"]),

  users: defineTable({
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    selectedExam: v.optional(v.string()),
    emailNotifications: v.optional(v.boolean()),
    lastActiveAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.string(),
    plan: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),

  exams: defineTable({
    type: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    questionCount: v.number(),
    passingScore: v.number(),
    durationMinutes: v.number(),
    isActive: v.boolean(),
  }).index("by_type", ["type"]),

  topics: defineTable({
    examId: v.id("exams"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    weight: v.number(),
    sortOrder: v.number(),
    isActive: v.boolean(),
  })
    .index("by_examId", ["examId"])
    .index("by_examId_slug", ["examId", "slug"]),

  questions: defineTable({
    examId: v.id("exams"),
    topicId: v.id("topics"),
    content: v.string(),
    codeSnippet: v.optional(v.string()),
    type: v.string(),
    difficulty: v.number(),
    explanation: v.string(),
    referenceUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    isActive: v.boolean(),
    answers: v.array(
      v.object({
        id: v.string(),
        content: v.string(),
        isCorrect: v.boolean(),
        sortOrder: v.number(),
      })
    ),
  })
    .index("by_examId", ["examId"])
    .index("by_topicId", ["topicId"]),

  userProgress: defineTable({
    userId: v.id("users"),
    examId: v.id("exams"),
    topicId: v.id("topics"),
    questionsAttempted: v.number(),
    questionsCorrect: v.number(),
    accuracyPercentage: v.number(),
    lastPracticedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_examId", ["userId", "examId"])
    .index("by_userId_examId_topicId", ["userId", "examId", "topicId"]),

  userAnswers: defineTable({
    userId: v.id("users"),
    questionId: v.id("questions"),
    isCorrect: v.boolean(),
    timeSpent: v.optional(v.number()),
    context: v.string(),
    examAttemptId: v.optional(v.id("examAttempts")),
    selectedAnswerIds: v.array(v.string()),
    answeredAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_questionId", ["questionId"])
    .index("by_userId_questionId", ["userId", "questionId"])
    .index("by_examAttemptId", ["examAttemptId"]),

  examAttempts: defineTable({
    userId: v.id("users"),
    examId: v.id("exams"),
    questionCount: v.number(),
    durationMinutes: v.number(),
    status: v.string(),
    score: v.optional(v.number()),
    passed: v.optional(v.boolean()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_examId", ["userId", "examId"]),

  examAttemptQuestions: defineTable({
    examAttemptId: v.id("examAttempts"),
    questionId: v.id("questions"),
    sortOrder: v.number(),
    userAnswerId: v.optional(v.id("userAnswers")),
    isFlagged: v.boolean(),
  })
    .index("by_examAttemptId", ["examAttemptId"])
    .index("by_examAttemptId_questionId", ["examAttemptId", "questionId"]),
});

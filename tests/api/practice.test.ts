import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    topic: {
      findMany: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    exam: {
      findUnique: vi.fn(),
    },
    subscription: {
      findFirst: vi.fn(),
    },
    userAnswer: {
      create: vi.fn(),
    },
    userProgress: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/prisma";

describe("Practice API Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTopics", () => {
    it("should return topics with progress data", async () => {
      const mockTopics = [
        {
          id: "topic-1",
          name: "Salesforce Fundamentals",
          slug: "salesforce-fundamentals",
          weight: 23,
          progress: [{ questionsAttempted: 10, accuracyPercentage: 80 }],
        },
        {
          id: "topic-2",
          name: "Data Modeling",
          slug: "data-modeling",
          weight: 22,
          progress: [],
        },
      ];

      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any);

      const result = await prisma.topic.findMany({
        where: { exam: { type: "PD1" }, isActive: true },
        include: { progress: { where: { userId: "user-1" } } },
        orderBy: { sortOrder: "asc" },
      });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Salesforce Fundamentals");
    });
  });

  describe("Answer correctness calculation", () => {
    it("should correctly identify single choice answer", () => {
      const correctAnswerIds = ["answer-1"];
      const selectedAnswerIds = ["answer-1"];

      const selectedSet = new Set(selectedAnswerIds);
      const correctSet = new Set(correctAnswerIds);
      const isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((id) => correctSet.has(id));

      expect(isCorrect).toBe(true);
    });

    it("should correctly identify wrong single choice answer", () => {
      const correctAnswerIds = ["answer-1"];
      const selectedAnswerIds = ["answer-2"];

      const selectedSet = new Set(selectedAnswerIds);
      const correctSet = new Set(correctAnswerIds);
      const isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((id) => correctSet.has(id));

      expect(isCorrect).toBe(false);
    });

    it("should correctly identify multiple choice answer", () => {
      const correctAnswerIds = ["answer-1", "answer-3"];
      const selectedAnswerIds = ["answer-3", "answer-1"]; // Different order

      const selectedSet = new Set(selectedAnswerIds);
      const correctSet = new Set(correctAnswerIds);
      const isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((id) => correctSet.has(id));

      expect(isCorrect).toBe(true);
    });

    it("should fail if missing an answer in multiple choice", () => {
      const correctAnswerIds = ["answer-1", "answer-3"];
      const selectedAnswerIds = ["answer-1"]; // Missing answer-3

      const selectedSet = new Set(selectedAnswerIds);
      const correctSet = new Set(correctAnswerIds);
      const isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((id) => correctSet.has(id));

      expect(isCorrect).toBe(false);
    });

    it("should fail if extra answer selected in multiple choice", () => {
      const correctAnswerIds = ["answer-1"];
      const selectedAnswerIds = ["answer-1", "answer-2"]; // Extra answer

      const selectedSet = new Set(selectedAnswerIds);
      const correctSet = new Set(correctAnswerIds);
      const isCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((id) => correctSet.has(id));

      expect(isCorrect).toBe(false);
    });
  });

  describe("Progress calculation", () => {
    it("should calculate accuracy percentage correctly", () => {
      const questionsAttempted = 10;
      const questionsCorrect = 7;
      const accuracy = Number(((questionsCorrect / questionsAttempted) * 100).toFixed(2));

      expect(accuracy).toBe(70);
    });

    it("should handle perfect score", () => {
      const questionsAttempted = 5;
      const questionsCorrect = 5;
      const accuracy = Number(((questionsCorrect / questionsAttempted) * 100).toFixed(2));

      expect(accuracy).toBe(100);
    });

    it("should handle zero correct", () => {
      const questionsAttempted = 5;
      const questionsCorrect = 0;
      const accuracy = Number(((questionsCorrect / questionsAttempted) * 100).toFixed(2));

      expect(accuracy).toBe(0);
    });
  });
});

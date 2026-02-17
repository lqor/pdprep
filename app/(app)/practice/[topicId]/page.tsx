"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUESTIONS_PER_SESSION = 10;

export default function PracticeSessionPage({
  params,
}: {
  params: { topicId: string };
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<{
    isCorrect: boolean;
    correctAnswerIds: string[];
    explanation: string;
  } | null>(null);
  const [sessionResults, setSessionResults] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });
  const [isPending, setIsPending] = useState(false);

  const questions = useQuery(api.practice.getQuestions, {
    examType: "PD1",
    topicId: params.topicId,
    count: QUESTIONS_PER_SESSION,
  });
  const isLoading = questions === undefined;

  const submitAnswerMutation = useMutation(api.practice.submitAnswer);

  const question = questions?.[currentIndex];
  const isMultipleChoice = question?.type === "MULTIPLE_CHOICE";
  const isLastQuestion = questions && currentIndex >= questions.length - 1;
  const isSessionComplete = questions && currentIndex >= questions.length;

  const answerMap = useMemo(
    () => new Set(submitted?.correctAnswerIds ?? []),
    [submitted]
  );

  const handleNextQuestion = () => {
    if (submitted) {
      setSessionResults((prev) => ({
        correct: prev.correct + (submitted.isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    }
    setSelectedAnswers([]);
    setSubmitted(null);
    setCurrentIndex((i) => i + 1);
  };

  const toggleAnswer = (answerId: string) => {
    if (!isMultipleChoice) {
      setSelectedAnswers([answerId]);
      return;
    }

    setSelectedAnswers((prev) =>
      prev.includes(answerId) ? prev.filter((id) => id !== answerId) : [...prev, answerId]
    );
  };

  const handleSubmit = async () => {
    if (!question || selectedAnswers.length === 0) return;
    setIsPending(true);
    try {
      const response = await submitAnswerMutation({
        questionId: question.id,
        selectedAnswerIds: selectedAnswers,
      });
      setSubmitted({
        isCorrect: response.isCorrect,
        correctAnswerIds: response.correctAnswerIds,
        explanation: response.explanation,
      });
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Loading questions…</p>
      </Card>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">No questions available for this topic.</p>
        <Button className="mt-4" onClick={() => router.push("/practice")}>
          Back to topics
        </Button>
      </Card>
    );
  }

  if (isSessionComplete) {
    const finalCorrect = sessionResults.correct + (submitted?.isCorrect ? 1 : 0);
    const finalTotal = sessionResults.total + (submitted ? 1 : 0);
    const percentage = Math.round((finalCorrect / finalTotal) * 100);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl">Session complete</h1>
          <p className="text-sm text-textSecondary">Great work on finishing this practice session.</p>
        </div>
        <Card>
          <div className="text-center">
            <div className="text-5xl font-semibold">{percentage}%</div>
            <p className="mt-2 text-textSecondary">
              {finalCorrect} of {finalTotal} correct
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push("/practice")}>
              Back to topics
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Practice again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Question not found.</p>
        <Button className="mt-4" onClick={() => router.push("/practice")}>
          Back to topics
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Practice session</h1>
          <p className="text-sm text-textSecondary">
            Topic: <span className="font-semibold">{question.topic?.name}</span>
          </p>
        </div>
        <Badge className="bg-accent-yellow">Question {currentIndex + 1} of {questions.length}</Badge>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <Badge className="bg-accent-green">
            {isMultipleChoice ? "Multiple choice" : "Single choice"}
          </Badge>
          <span className="text-sm text-textSecondary">{question.topic?.name}</span>
        </div>
        <h2 className="mt-4 text-xl font-serif">{question.content}</h2>
        <div className="mt-6 space-y-3 text-sm">
          {question.answers.map((answer) => {
            const isSelected = selectedAnswers.includes(answer.id);
            const isCorrect = submitted && answerMap.has(answer.id);
            const isIncorrect = submitted && isSelected && !answerMap.has(answer.id);

            return (
              <label
                key={answer.id}
                className={`neo-border flex cursor-pointer items-center gap-3 px-4 py-3 shadow-brutal ${
                  isCorrect
                    ? "bg-successBg"
                    : isIncorrect
                    ? "bg-errorBg"
                    : "bg-bgPrimary"
                }`}
              >
                <input
                  type={isMultipleChoice ? "checkbox" : "radio"}
                  name="answer"
                  checked={isSelected}
                  onChange={() => toggleAnswer(answer.id)}
                  disabled={Boolean(submitted)}
                />
                <span>{answer.content}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={handleSubmit} disabled={isPending || Boolean(submitted)}>
            {isPending ? "Submitting..." : "Submit answer"}
          </Button>
          <Button variant="ghost" onClick={handleNextQuestion} disabled={!submitted}>
            {isLastQuestion ? "Finish session" : "Next question"}
          </Button>
        </div>
      </Card>

      {submitted ? (
        <Card className="bg-warningBg">
          <h3 className="text-lg font-serif">
            {submitted.isCorrect ? "Correct" : "Review"}
          </h3>
          <p className="mt-3 text-sm text-textSecondary">{submitted.explanation}</p>
        </Card>
      ) : null}
    </div>
  );
}

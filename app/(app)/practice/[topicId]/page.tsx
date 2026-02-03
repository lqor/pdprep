"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

export default function PracticeSessionPage({
  params,
}: {
  params: { topicId: string };
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<{
    isCorrect: boolean;
    correctAnswerIds: string[];
    explanation: string;
  } | null>(null);

  const { data, isLoading, refetch } = trpc.practice.getQuestions.useQuery({
    examType: "PD1",
    topicId: params.topicId,
    count: 1,
  });

  const question = data?.[0];
  const isMultipleChoice = question?.type === "MULTIPLE_CHOICE";

  useEffect(() => {
    setSelectedAnswers([]);
    setSubmitted(null);
  }, [question?.id]);

  const answerMap = useMemo(
    () => new Set(submitted?.correctAnswerIds ?? []),
    [submitted]
  );

  const submitAnswer = trpc.practice.submitAnswer.useMutation({
    onSuccess: (response) => {
      setSubmitted({
        isCorrect: response.isCorrect,
        correctAnswerIds: response.correctAnswerIds,
        explanation: response.explanation,
      });
    },
  });

  const toggleAnswer = (answerId: string) => {
    if (!isMultipleChoice) {
      setSelectedAnswers([answerId]);
      return;
    }

    setSelectedAnswers((prev) =>
      prev.includes(answerId) ? prev.filter((id) => id !== answerId) : [...prev, answerId]
    );
  };

  const handleSubmit = () => {
    if (!question || selectedAnswers.length === 0) return;
    submitAnswer.mutate({
      questionId: question.id,
      selectedAnswerIds: selectedAnswers,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Loading question…</p>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">No questions available yet.</p>
        <Button className="mt-4" onClick={() => refetch()}>
          Try again
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
            Topic: <span className="font-semibold">{question.topic.name}</span>
          </p>
        </div>
        <Badge className="bg-accent-yellow">Question 1 of 1</Badge>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <Badge className="bg-accent-green">
            {isMultipleChoice ? "Multiple choice" : "Single choice"}
          </Badge>
          <span className="text-sm text-textSecondary">{question.topic.name}</span>
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
          <Button onClick={handleSubmit} disabled={submitAnswer.isPending || Boolean(submitted)}>
            {submitAnswer.isPending ? "Submitting..." : "Submit answer"}
          </Button>
          <Button variant="ghost" onClick={() => refetch()}>
            Next question
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

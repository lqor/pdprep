"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

export default function ExamAttemptPage({ params }: { params: { examId: string } }) {
  const examAttemptId = params.examId as Id<"examAttempts">;
  const data = useQuery(api.exam.getAttempt, { examAttemptId });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const submitAnswerMutation = useMutation(api.exam.submitAnswer);
  const flagQuestionMutation = useMutation(api.exam.flagQuestion);

  const isLoading = data === undefined;
  const questions = data?.questions ?? [];
  const current = questions[currentIndex];
  const answerSelections = current ? selections[current.questionId as string] ?? [] : [];

  const isMultipleChoice = current?.question.type === "MULTIPLE_CHOICE";

  const toggleAnswer = (answerId: string) => {
    if (!current) return;
    const qId = current.questionId as string;
    if (!isMultipleChoice) {
      setSelections((prev) => ({ ...prev, [qId]: [answerId] }));
      return;
    }

    setSelections((prev) => {
      const existing = prev[qId] ?? [];
      return {
        ...prev,
        [qId]: existing.includes(answerId)
          ? existing.filter((id) => id !== answerId)
          : [...existing, answerId],
      };
    });
  };

  const handleSubmit = async () => {
    if (!current || answerSelections.length === 0) return;
    const qId = current.questionId as string;
    setSubmittingId(qId);
    try {
      await submitAnswerMutation({
        examAttemptId,
        questionId: current.questionId,
        selectedAnswerIds: answerSelections,
      });
    } finally {
      setSubmittingId(null);
    }
  };

  const handleFlag = async () => {
    if (!current) return;
    await flagQuestionMutation({
      examAttemptId,
      questionId: current.questionId,
      isFlagged: !current.isFlagged,
    });
  };

  const timeRemaining = data ? `${data.timeRemainingMinutes} min` : "—";

  const answeredMap = useMemo(() => {
    const map = new Set<string>();
    questions.forEach((q) => {
      if (q.userAnswerId) {
        map.add(q.questionId as string);
      }
    });
    return map;
  }, [questions]);

  if (isLoading || !data) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Loading exam...</p>
      </Card>
    );
  }

  if (!current) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">No questions available.</p>
      </Card>
    );
  }

  const isAnswered = Boolean(current.userAnswerId);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Mock exam</h1>
          <p className="text-sm text-textSecondary">Time remaining: {timeRemaining}</p>
        </div>
        <Badge className="bg-accent-purple">
          Question {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="text-xl font-serif">{current.question.content}</h2>
          <div className="mt-6 space-y-3 text-sm">
            {current.question.answers.map((answer) => (
              <label
                key={answer.id}
                className="neo-border flex cursor-pointer items-center gap-3 bg-bgPrimary px-4 py-3 shadow-brutal"
              >
                <input
                  type={isMultipleChoice ? "checkbox" : "radio"}
                  name="exam-answer"
                  checked={answerSelections.includes(answer.id)}
                  onChange={() => toggleAnswer(answer.id)}
                  disabled={isAnswered}
                />
                <span>{answer.content}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleSubmit} disabled={isAnswered || submittingId === (current.questionId as string)}>
              {submittingId === (current.questionId as string) ? "Saving..." : "Save answer"}
            </Button>
            <Button variant="ghost" onClick={handleFlag}>
              {current.isFlagged ? "Unflag" : "Flag for review"}
            </Button>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-serif">Navigator</h3>
          <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
            {questions.map((question, index) => {
              const answered = answeredMap.has(question.questionId as string);
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`neo-border flex h-8 items-center justify-center shadow-brutal ${
                    answered ? "bg-successBg" : "bg-bgPrimary"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <Link
            href={`/exam/${params.examId}/results`}
            className="btn-primary mt-6 inline-block w-full text-center"
          >
            Submit exam
          </Link>
        </Card>
      </div>
    </div>
  );
}

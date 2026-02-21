"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

type QuestionStatus = "unanswered" | "answered" | "current" | "flagged";

export default function ExamAttemptPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const examAttemptId = params.examId as Id<"examAttempts">;
  const data = useQuery(api.exam.getAttempt, { examAttemptId });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const submitAnswerMutation = useMutation(api.exam.submitAnswer);
  const flagQuestionMutation = useMutation(api.exam.flagQuestion);
  const completeExamMutation = useMutation(api.exam.complete);

  const isLoading = data === undefined;
  const questions = data?.questions ?? [];
  const current = questions[currentIndex];
  const answerSelections = current ? selections[current.questionId as string] ?? [] : [];
  const isMultipleChoice = current?.question.type === "MULTIPLE_CHOICE";
  const isLastQuestion = currentIndex >= questions.length - 1;

  const answeredSet = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.userAnswerId) set.add(q.questionId as string);
    });
    return set;
  }, [questions]);

  const answeredCount = answeredSet.size;

  const getQuestionStatus = useCallback(
    (index: number): QuestionStatus => {
      if (index === currentIndex) return "current";
      const q = questions[index];
      if (!q) return "unanswered";
      if (q.isFlagged) return "flagged";
      if (answeredSet.has(q.questionId as string)) return "answered";
      return "unanswered";
    },
    [currentIndex, questions, answeredSet]
  );

  const statusColors: Record<QuestionStatus, string> = {
    current: "bg-accent-purple text-textInverse",
    answered: "bg-accent-green text-textPrimary",
    flagged: "bg-accent-yellow text-textPrimary",
    unanswered: "bg-bgSecondary text-textPrimary",
  };

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

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await completeExamMutation({ examAttemptId });
      router.push(`/exam/${params.examId}/results`);
    } finally {
      setIsFinishing(false);
    }
  };

  const timeRemaining = data ? `${data.timeRemainingMinutes} min` : "--";
  const isAnswered = Boolean(current?.userAnswerId);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Mock exam</h1>
          <p className="text-sm text-textSecondary">
            Time remaining: <span className="font-semibold text-textPrimary">{timeRemaining}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-accent-yellow">
            {answeredCount} / {questions.length} answered
          </Badge>
          <Badge className="bg-accent-purple">
            Q{currentIndex + 1}
          </Badge>
        </div>
      </div>

      {/* Horizontal pill navigator */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {questions.map((_, index) => {
            const status = getQuestionStatus(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`neo-border flex h-9 w-9 flex-shrink-0 items-center justify-center text-xs font-semibold shadow-brutal transition ${statusColors[status]}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question card */}
      <Card>
        <div className="flex items-center justify-between">
          <Badge className="bg-accent-green">
            {isMultipleChoice ? "Select all that apply" : "Single choice"}
          </Badge>
          <span className="text-sm text-textSecondary">{current.question.topic?.name}</span>
        </div>

        {current.question.codeSnippet && (
          <pre className="mt-4 overflow-x-auto rounded bg-bgDark p-4 text-sm text-textInverse font-mono">
            <code>{current.question.codeSnippet}</code>
          </pre>
        )}

        <h2 className="mt-4 text-xl font-serif">{current.question.content}</h2>

        <div className="mt-6 space-y-3 text-sm">
          {current.question.answers.map((answer) => {
            const isSelected = answerSelections.includes(answer.id);
            return (
              <label
                key={answer.id}
                className={`neo-border flex cursor-pointer items-center gap-3 px-4 py-3 shadow-brutal transition ${
                  isSelected ? "bg-accent-yellow/20" : "bg-bgPrimary"
                }`}
              >
                <input
                  type={isMultipleChoice ? "checkbox" : "radio"}
                  name="exam-answer"
                  checked={isSelected}
                  onChange={() => toggleAnswer(answer.id)}
                  disabled={isAnswered}
                />
                <span>{answer.content}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isAnswered || answerSelections.length === 0 || submittingId === (current.questionId as string)}
          >
            {submittingId === (current.questionId as string) ? "Saving..." : "Save answer"}
          </Button>
          <Button variant="ghost" onClick={handleFlag}>
            {current.isFlagged ? "Unflag" : "Flag for review"}
          </Button>
          {currentIndex > 0 && (
            <Button variant="ghost" onClick={() => setCurrentIndex((i) => i - 1)}>
              Previous
            </Button>
          )}
          {!isLastQuestion ? (
            <Button variant="ghost" onClick={() => setCurrentIndex((i) => i + 1)}>
              Next
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleFinish}
              disabled={isFinishing}
            >
              {isFinishing ? "Submitting..." : "Submit exam"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

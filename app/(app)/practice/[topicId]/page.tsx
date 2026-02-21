"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUESTIONS_PER_SESSION = 10;

type SubmissionResult = {
  isCorrect: boolean;
  correctAnswerIds: string[];
  explanation: string;
  referenceUrl?: string;
};

type QuestionStatus = "unanswered" | "correct" | "incorrect" | "current";

export default function PracticeSessionPage({
  params,
}: {
  params: { topicId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feedbackMode = searchParams.get("feedback") === "end" ? "end" : "instant";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({});
  const [submissions, setSubmissions] = useState<Record<number, SubmissionResult>>({});
  const [isPending, setIsPending] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const questions = useQuery(api.practice.getQuestions, {
    examType: "PD1",
    topicId: params.topicId,
    count: QUESTIONS_PER_SESSION,
  });
  const isLoading = questions === undefined;
  const submitAnswerMutation = useMutation(api.practice.submitAnswer);

  const question = questions?.[currentIndex];
  const isMultipleChoice = question?.type === "MULTIPLE_CHOICE";
  const currentSelections = selectedAnswers[currentIndex] ?? [];
  const currentSubmission = submissions[currentIndex];
  const isLastQuestion = questions ? currentIndex >= questions.length - 1 : false;

  const getQuestionStatus = useCallback(
    (index: number): QuestionStatus => {
      if (index === currentIndex && !sessionComplete) return "current";
      const sub = submissions[index];
      if (!sub) return "unanswered";
      return sub.isCorrect ? "correct" : "incorrect";
    },
    [currentIndex, submissions, sessionComplete]
  );

  const statusColors: Record<QuestionStatus, string> = {
    current: "bg-accent-purple text-textInverse",
    correct: "bg-accent-green text-textPrimary",
    incorrect: "bg-error text-textInverse",
    unanswered: "bg-bgSecondary text-textPrimary",
  };

  const toggleAnswer = (answerId: string) => {
    if (currentSubmission && feedbackMode === "instant") return;
    if (!isMultipleChoice) {
      setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: [answerId] }));
      return;
    }
    setSelectedAnswers((prev) => {
      const existing = prev[currentIndex] ?? [];
      return {
        ...prev,
        [currentIndex]: existing.includes(answerId)
          ? existing.filter((id) => id !== answerId)
          : [...existing, answerId],
      };
    });
  };

  const handleSubmit = async () => {
    if (!question || currentSelections.length === 0) return;
    setIsPending(true);
    try {
      const response = await submitAnswerMutation({
        questionId: question.id,
        selectedAnswerIds: currentSelections,
      });
      setSubmissions((prev) => ({
        ...prev,
        [currentIndex]: {
          isCorrect: response.isCorrect,
          correctAnswerIds: response.correctAnswerIds,
          explanation: response.explanation,
          referenceUrl: response.referenceUrl,
        },
      }));
    } finally {
      setIsPending(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleFinishEndMode = async () => {
    // Submit all unanswered questions in end mode
    if (!questions) return;
    setIsPending(true);
    try {
      for (let i = 0; i < questions.length; i++) {
        if (!submissions[i] && (selectedAnswers[i]?.length ?? 0) > 0) {
          const response = await submitAnswerMutation({
            questionId: questions[i].id,
            selectedAnswerIds: selectedAnswers[i],
          });
          setSubmissions((prev) => ({
            ...prev,
            [i]: {
              isCorrect: response.isCorrect,
              correctAnswerIds: response.correctAnswerIds,
              explanation: response.explanation,
              referenceUrl: response.referenceUrl,
            },
          }));
        }
      }
      setSessionComplete(true);
    } finally {
      setIsPending(false);
    }
  };

  const answeredCount = useMemo(
    () =>
      feedbackMode === "instant"
        ? Object.keys(submissions).length
        : Object.values(selectedAnswers).filter((a) => a.length > 0).length,
    [submissions, selectedAnswers, feedbackMode]
  );

  const correctCount = useMemo(
    () => Object.values(submissions).filter((s) => s.isCorrect).length,
    [submissions]
  );

  const totalSubmitted = Object.keys(submissions).length;

  // --- LOADING ---
  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Loading questions...</p>
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

  // --- SESSION COMPLETE ---
  if (sessionComplete) {
    const percentage = totalSubmitted > 0 ? Math.round((correctCount / totalSubmitted) * 100) : 0;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl">Session complete</h1>
          <p className="text-sm text-textSecondary">
            {feedbackMode === "end"
              ? "Review your answers below."
              : "Great work on finishing this practice session."}
          </p>
        </div>

        <Card>
          <div className="text-center">
            <div className="text-5xl font-semibold">{percentage}%</div>
            <p className="mt-2 text-textSecondary">
              {correctCount} of {totalSubmitted} correct
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push("/practice")}>Back to topics</Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Practice again
            </Button>
          </div>
        </Card>

        {/* Question-by-question review */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif">Question review</h2>
          {questions.map((q, index) => {
            const sub = submissions[index];
            const userSel = selectedAnswers[index] ?? [];
            const correctSet = new Set(sub?.correctAnswerIds ?? []);

            return (
              <Card key={q.id} className={sub?.isCorrect ? "border-l-4 !border-l-accent-green" : sub ? "border-l-4 !border-l-error" : ""}>
                <div className="flex items-center gap-3">
                  <Badge className={sub?.isCorrect ? "bg-accent-green" : sub ? "bg-errorBg" : "bg-accent-yellow"}>
                    Q{index + 1}
                  </Badge>
                  <span className="text-sm font-semibold">
                    {sub?.isCorrect ? "Correct" : sub ? "Incorrect" : "Unanswered"}
                  </span>
                </div>
                <p className="mt-3 font-serif">{q.content}</p>
                <div className="mt-4 space-y-2 text-sm">
                  {q.answers.map((answer) => {
                    const wasSelected = userSel.includes(answer.id);
                    const isCorrectAnswer = correctSet.has(answer.id);
                    return (
                      <div
                        key={answer.id}
                        className={`neo-border px-4 py-2 ${
                          isCorrectAnswer
                            ? "bg-successBg"
                            : wasSelected && !isCorrectAnswer
                            ? "bg-errorBg"
                            : "bg-bgPrimary"
                        }`}
                      >
                        <span>{answer.content}</span>
                        {wasSelected && (
                          <span className="ml-2 text-xs text-textMuted">(your answer)</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {sub && (
                  <div className="mt-4 rounded bg-warningBg p-4 text-sm">
                    <p className="text-textSecondary">{sub.explanation}</p>
                    {sub.referenceUrl && (
                      <a
                        href={sub.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-primary font-semibold underline"
                      >
                        Learn more
                      </a>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // --- ACTIVE SESSION ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Practice session</h1>
          <p className="text-sm text-textSecondary">
            {feedbackMode === "instant" ? "Instant feedback" : "Review at end"}
            {" · "}
            {question?.topic?.name}
          </p>
        </div>
        <Badge className="bg-accent-yellow">
          {answeredCount} / {questions.length} answered
        </Badge>
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
      {question && (
        <Card>
          <div className="flex items-center justify-between">
            <Badge className="bg-accent-green">
              {isMultipleChoice ? "Select all that apply" : "Single choice"}
            </Badge>
            <span className="text-sm text-textSecondary">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {question.codeSnippet && (
            <pre className="mt-4 overflow-x-auto rounded bg-bgDark p-4 text-sm text-textInverse font-mono">
              <code>{question.codeSnippet}</code>
            </pre>
          )}

          <h2 className="mt-4 text-xl font-serif">{question.content}</h2>

          <div className="mt-6 space-y-3 text-sm">
            {question.answers.map((answer) => {
              const isSelected = currentSelections.includes(answer.id);
              const showFeedback = feedbackMode === "instant" && currentSubmission;
              const isCorrectAnswer = showFeedback && currentSubmission.correctAnswerIds.includes(answer.id);
              const isIncorrectSelection = showFeedback && isSelected && !currentSubmission.correctAnswerIds.includes(answer.id);

              return (
                <label
                  key={answer.id}
                  className={`neo-border flex cursor-pointer items-center gap-3 px-4 py-3 shadow-brutal transition ${
                    isCorrectAnswer
                      ? "bg-successBg"
                      : isIncorrectSelection
                      ? "bg-errorBg"
                      : isSelected
                      ? "bg-accent-yellow/20"
                      : "bg-bgPrimary"
                  }`}
                >
                  <input
                    type={isMultipleChoice ? "checkbox" : "radio"}
                    name="answer"
                    checked={isSelected}
                    onChange={() => toggleAnswer(answer.id)}
                    disabled={Boolean(feedbackMode === "instant" && currentSubmission)}
                  />
                  <span>{answer.content}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {feedbackMode === "instant" ? (
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending || Boolean(currentSubmission) || currentSelections.length === 0}
                >
                  {isPending ? "Submitting..." : "Submit answer"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleNext}
                  disabled={!currentSubmission}
                >
                  {isLastQuestion ? "Finish session" : "Next question"}
                </Button>
              </>
            ) : (
              <>
                {currentIndex > 0 && (
                  <Button variant="ghost" onClick={() => setCurrentIndex((i) => i - 1)}>
                    Previous
                  </Button>
                )}
                {!isLastQuestion ? (
                  <Button onClick={() => setCurrentIndex((i) => i + 1)}>
                    Next question
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinishEndMode}
                    disabled={isPending}
                  >
                    {isPending ? "Submitting..." : "Finish and review"}
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {/* Explanation panel (instant feedback mode only) */}
      {feedbackMode === "instant" && currentSubmission && (
        <Card className="bg-warningBg">
          <h3 className="text-lg font-serif">
            {currentSubmission.isCorrect ? "Correct" : "Incorrect"}
          </h3>
          <p className="mt-3 text-sm text-textSecondary">{currentSubmission.explanation}</p>
          {currentSubmission.referenceUrl && (
            <a
              href={currentSubmission.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-primary font-semibold underline"
            >
              Learn more
            </a>
          )}
        </Card>
      )}
    </div>
  );
}

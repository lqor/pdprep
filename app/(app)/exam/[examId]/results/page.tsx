"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";

export default function ExamResultsPage({ params }: { params: { examId: string } }) {
  const examAttemptId = params.examId as Id<"examAttempts">;
  const [completionResult, setCompletionResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [completing, setCompleting] = useState(false);
  const completeExam = useMutation(api.exam.complete);
  const results = useQuery(api.exam.getAttemptResults, { examAttemptId });

  const isLoading = results === undefined;

  useEffect(() => {
    if (!completionResult && !completing && results?.status === "IN_PROGRESS") {
      setCompleting(true);
      completeExam({ examAttemptId })
        .then((result) => setCompletionResult(result))
        .catch(() => {})
        .finally(() => setCompleting(false));
    }
  }, [completionResult, completing, completeExam, examAttemptId, results?.status]);

  if (isLoading || completing) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Calculating results...</p>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Results not found.</p>
        <Link href="/exam" className="btn-secondary mt-4 inline-block">
          Back to exams
        </Link>
      </Card>
    );
  }

  const score = completionResult?.score ?? results.score;
  const passed = completionResult?.passed ?? results.passed ?? false;
  const questions = results.questions;
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const answeredCount = questions.filter((q) => q.selectedAnswerIds.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Exam results</h1>
          <p className="text-sm text-textSecondary">{results.examName}</p>
        </div>
        <Badge className={passed ? "bg-accent-green" : "bg-errorBg"}>
          {passed ? "Passed" : "Not passed"}
        </Badge>
      </div>

      {/* Score summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-serif">Score</h2>
          <div className="mt-3 text-4xl font-semibold">
            {score !== undefined && score !== null ? `${score}%` : "--"}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-serif">Correct</h2>
          <div className="mt-3 text-4xl font-semibold">
            {correctCount} / {questions.length}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-serif">Answered</h2>
          <div className="mt-3 text-4xl font-semibold">
            {answeredCount} / {questions.length}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/exam" className="btn-secondary">
          Retake exam
        </Link>
        <Link href="/practice" className="btn-primary">
          Practice weak areas
        </Link>
      </div>

      {/* Question-by-question review */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Question review</h2>

        {/* Pill navigator for quick jumping */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {questions.map((q, index) => {
              const isCorrect = q.isCorrect;
              const wasAnswered = q.selectedAnswerIds.length > 0;
              return (
                <a
                  key={q.id}
                  href={`#question-${index + 1}`}
                  className={`neo-border flex h-9 w-9 flex-shrink-0 items-center justify-center text-xs font-semibold shadow-brutal transition ${
                    isCorrect
                      ? "bg-accent-green text-textPrimary"
                      : wasAnswered
                      ? "bg-error text-textInverse"
                      : "bg-bgSecondary text-textPrimary"
                  }`}
                >
                  {index + 1}
                </a>
              );
            })}
          </div>
        </div>

        {questions.map((q, index) => {
          const correctSet = new Set(q.correctAnswerIds);
          const selectedSet = new Set(q.selectedAnswerIds);
          const wasAnswered = q.selectedAnswerIds.length > 0;

          return (
            <Card
              key={q.id}
              id={`question-${index + 1}`}
              className={
                q.isCorrect
                  ? "border-l-4 !border-l-accent-green"
                  : wasAnswered
                  ? "border-l-4 !border-l-error"
                  : ""
              }
            >
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    q.isCorrect
                      ? "bg-accent-green"
                      : wasAnswered
                      ? "bg-errorBg"
                      : "bg-accent-yellow"
                  }
                >
                  Q{index + 1}
                </Badge>
                <span className="text-sm font-semibold">
                  {q.isCorrect ? "Correct" : wasAnswered ? "Incorrect" : "Unanswered"}
                </span>
                {q.question.topic && (
                  <span className="ml-auto text-xs text-textMuted">{q.question.topic.name}</span>
                )}
              </div>

              {q.question.codeSnippet && (
                <pre className="mt-4 overflow-x-auto rounded bg-bgDark p-4 text-sm text-textInverse font-mono">
                  <code>{q.question.codeSnippet}</code>
                </pre>
              )}

              <p className="mt-3 font-serif">{q.question.content}</p>

              <div className="mt-4 space-y-2 text-sm">
                {q.question.answers.map((answer) => {
                  const wasSelected = selectedSet.has(answer.id);
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
                      {isCorrectAnswer && !wasSelected && (
                        <span className="ml-2 text-xs text-success">(correct)</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded bg-warningBg p-4 text-sm">
                <p className="text-textSecondary">{q.explanation}</p>
                {q.referenceUrl && (
                  <a
                    href={q.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-primary font-semibold underline"
                  >
                    Learn more
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

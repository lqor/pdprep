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
  const attempt = useQuery(api.exam.getAttempt, { examAttemptId });

  useEffect(() => {
    if (!completionResult && !completing) {
      setCompleting(true);
      completeExam({ examAttemptId })
        .then((result) => setCompletionResult(result))
        .catch(() => {})
        .finally(() => setCompleting(false));
    }
  }, [completionResult, completing, completeExam, examAttemptId]);

  const isLoading = attempt === undefined;

  if (isLoading || completing) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Calculating results...</p>
      </Card>
    );
  }

  const score = completionResult?.score;
  const passed = completionResult?.passed ?? false;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Exam results</h1>
          <p className="text-sm text-textSecondary">Attempt: {params.examId}</p>
        </div>
        <Badge className={passed ? "bg-accent-green" : "bg-errorBg"}>
          {completionResult ? (passed ? "Passed" : "Not passed") : "In review"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-serif">Score</h2>
          <div className="mt-3 text-4xl font-semibold">
            {score !== undefined ? `${score}%` : "—"}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-serif">Questions</h2>
          <div className="mt-3 text-4xl font-semibold">
            {attempt?.questions.length ?? "—"}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-serif">Status</h2>
          <div className="mt-3 text-4xl font-semibold">
            {attempt?.status ?? "—"}
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/exam" className="btn-secondary">
          Retake exam
        </Link>
        <Link href="/practice" className="btn-primary">
          Practice weak areas
        </Link>
      </div>
    </div>
  );
}

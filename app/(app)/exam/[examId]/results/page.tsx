"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";

export default function ExamResultsPage({ params }: { params: { examId: string } }) {
  const [completed, setCompleted] = useState(false);
  const completeExam = trpc.exam.complete.useMutation({
    onSuccess: () => setCompleted(true),
  });
  const attempt = trpc.exam.getAttempt.useQuery({ examAttemptId: params.examId });

  useEffect(() => {
    if (!completed) {
      completeExam.mutate({ examAttemptId: params.examId });
    }
  }, [completed, completeExam, params.examId]);

  if (attempt.isLoading || completeExam.isPending) {
    return (
      <Card>
        <p className="text-sm text-textSecondary">Calculating results...</p>
      </Card>
    );
  }

  const score = completeExam.data?.score;
  const passed = completeExam.data?.passed ?? false;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Exam results</h1>
          <p className="text-sm text-textSecondary">Attempt: {params.examId}</p>
        </div>
        <Badge className={passed ? "bg-accent-green" : "bg-errorBg"}>
          {completeExam.data ? (passed ? "Passed" : "Not passed") : "In review"}
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
            {attempt.data?.questions.length ?? "—"}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-serif">Status</h2>
          <div className="mt-3 text-4xl font-semibold">
            {attempt.data?.status ?? "—"}
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

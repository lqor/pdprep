"use client";

import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

export default function ExamHistoryPage() {
  const { data, isLoading } = trpc.exam.getHistory.useQuery({ limit: 10 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Exam history</h1>
        <p className="text-sm text-textSecondary">
          Review past mock exams and track improvement.
        </p>
      </div>
      <Card>
        <div className="space-y-3 text-sm">
          {isLoading ? (
            <p className="text-textSecondary">Loading attempts...</p>
          ) : data?.length ? (
            data.map((attempt) => (
              <div
                key={attempt.id}
                className="neo-border flex flex-wrap items-center justify-between bg-bgPrimary px-4 py-3 shadow-brutal"
              >
                <span className="font-semibold">Exam #{attempt.id.slice(0, 6)}</span>
                <span className="text-textSecondary">
                  {new Date(attempt.startedAt).toLocaleDateString()}
                </span>
                <span className="text-textSecondary">
                  {attempt.score !== null && attempt.score !== undefined ? `${attempt.score}%` : "—"}
                </span>
                <span className="text-textSecondary">{attempt.status}</span>
              </div>
            ))
          ) : (
            <p className="text-textSecondary">No exams taken yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

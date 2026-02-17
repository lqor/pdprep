"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PracticePage() {
  const router = useRouter();
  const data = useQuery(api.practice.getTopics, { examType: "PD1" });
  const isLoading = data === undefined;

  const practiceAllHref = data?.[0] ? `/practice/${data[0].slug}` : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Practice topics</h1>
          <p className="text-sm text-textSecondary">
            Drill by topic or practice the full PD1 spread.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => practiceAllHref && router.push(practiceAllHref as Route)}
          disabled={!practiceAllHref}
        >
          Practice all topics
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <Card>
            <p className="text-sm text-textSecondary">Loading topics...</p>
          </Card>
        ) : data?.length ? (
          data.map((topic) => (
            <Card key={topic.id}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif">{topic.name}</h2>
                <Badge className="bg-accent-yellow">{topic.weight}%</Badge>
              </div>
              <p className="mt-3 text-sm text-textSecondary">
                Accuracy: <span className="font-semibold text-textPrimary">{topic.accuracyPercentage}%</span>
              </p>
              <p className="mt-1 text-xs text-textMuted">
                Attempted: {topic.questionsAttempted} questions
              </p>
              <button
                type="button"
                className="btn-secondary mt-6 inline-block"
                onClick={() => router.push(`/practice/${topic.slug}` as Route)}
              >
                Practice topic
              </button>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm text-textSecondary">No topics available yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PracticePage() {
  const router = useRouter();
  const data = useQuery(api.practice.getTopics, { examType: "PD1" });
  const isLoading = data === undefined;

  const startSession = (topicSlug: string, mode: "instant" | "end") => {
    router.push(`/practice/${topicSlug}?feedback=${mode}` as Route);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Practice topics</h1>
        <p className="text-sm text-textSecondary">
          Choose a topic, then pick how you want feedback delivered.
        </p>
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
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => startSession(topic.slug, "instant")}
                >
                  Instant feedback
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => startSession(topic.slug, "end")}
                >
                  Review at end
                </Button>
              </div>
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

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";

export default function ProgressPage() {
  const { data, isLoading } = trpc.progress.getOverview.useQuery({ examType: "PD1" });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Progress</h1>
          <p className="text-sm text-textSecondary">
            Track accuracy and question coverage by topic.
          </p>
        </div>
        <Badge className="bg-accent-green">
          Overall accuracy {isLoading ? "—" : `${data?.accuracy ?? 0}%`}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <Card>
            <p className="text-sm text-textSecondary">Loading progress...</p>
          </Card>
        ) : data?.topics.length ? (
          data.topics.map((topic) => (
            <Card key={topic.topicId}>
              <h2 className="text-xl font-serif">{topic.topicName}</h2>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>Accuracy</span>
                <span className="font-semibold">{topic.accuracyPercentage}%</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span>Attempted</span>
                <span className="font-semibold">{topic.questionsAttempted}</span>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm text-textSecondary">No progress yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

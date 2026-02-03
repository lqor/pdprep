"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";

export default function DashboardPage() {
  const overview = trpc.progress.getOverview.useQuery({ examType: "PD1" });
  const readiness = trpc.progress.getReadinessScore.useQuery({ examType: "PD1" });

  const totalAttempted = overview.data?.totalAttempted ?? 0;
  const accuracy = overview.data?.accuracy ?? 0;
  const readinessScore = readiness.data?.readinessScore ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Welcome back, Developer</h1>
          <p className="text-sm text-textSecondary">
            {overview.isLoading ? "Loading progress..." : "Your PD1 readiness score is trending up."}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/practice" className="btn-secondary">
            Continue practice
          </Link>
          <Link href="/exam" className="btn-primary">
            Start mock exam
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <Badge className="bg-accent-green">Readiness</Badge>
          <div className="mt-4 text-4xl font-semibold">
            {readiness.isLoading ? "—" : `${readinessScore}%`}
          </div>
          <p className="mt-2 text-sm text-textSecondary">Estimated pass probability</p>
        </Card>
        <Card>
          <Badge className="bg-accent-yellow">Questions</Badge>
          <div className="mt-4 text-4xl font-semibold">
            {overview.isLoading ? "—" : totalAttempted}
          </div>
          <p className="mt-2 text-sm text-textSecondary">Questions answered</p>
        </Card>
        <Card>
          <Badge className="bg-accent-purple">Accuracy</Badge>
          <div className="mt-4 text-4xl font-semibold">
            {overview.isLoading ? "—" : `${accuracy}%`}
          </div>
          <p className="mt-2 text-sm text-textSecondary">Overall accuracy</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-serif">Topic breakdown</h2>
          {overview.isLoading ? (
            <p className="mt-3 text-sm text-textSecondary">Loading topic breakdown...</p>
          ) : overview.data?.topics.length ? (
            <ul className="mt-4 space-y-2 text-sm text-textSecondary">
              {overview.data.topics.map((topic) => (
                <li key={topic.topicId}>
                  {topic.topicName}: {topic.accuracyPercentage}%
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-textSecondary">No topic data yet.</p>
          )}
        </Card>
        <Card>
          <h2 className="text-xl font-serif">Recent activity</h2>
          <ul className="mt-4 space-y-2 text-sm text-textSecondary">
            <li>Practice a new topic to build your streak.</li>
            <li>Take a mock exam when you are ready.</li>
            <li>Review explanations after each question.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

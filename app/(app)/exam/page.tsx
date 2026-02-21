"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ExamPage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const startExam = useMutation(api.exam.start);

  const handleStart = async () => {
    setStarting(true);
    try {
      const data = await startExam({ examType: "PD1" });
      if (data.examAttemptId) {
        router.push(`/exam/${data.examAttemptId}`);
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Mock exam</h1>
        <p className="text-sm text-textSecondary">
          Simulate the real Salesforce PD1 exam under timed conditions.
        </p>
      </div>

      <Card>
        <h2 className="text-xl font-serif">Platform Developer 1</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge className="bg-accent-yellow">60 questions</Badge>
          <Badge className="bg-accent-green">105 minutes</Badge>
          <Badge className="bg-accent-purple">68% to pass</Badge>
        </div>
        <p className="mt-4 text-sm text-textSecondary">
          Questions are weighted by topic to match the real exam distribution.
          Answers are reviewed after you submit the entire exam.
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={handleStart}
          disabled={starting}
        >
          {starting ? "Starting..." : "Start mock exam"}
        </Button>
      </Card>

      <Button
        variant="secondary"
        onClick={() => router.push("/exam/history")}
      >
        View exam history
      </Button>
    </div>
  );
}

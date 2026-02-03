"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

const exams = [
  {
    id: "PD1",
    title: "Platform Developer 1",
    description: "60 questions • 105 minutes • 68% pass mark",
  },
] as const;

export default function ExamPage() {
  const router = useRouter();
  const [starting, setStarting] = useState<string | null>(null);
  const startExam = trpc.exam.start.useMutation({
    onSuccess: (data) => {
      if (data.examAttemptId) {
        router.push(`/exam/${data.examAttemptId}`);
      }
    },
    onSettled: () => setStarting(null),
  });

  const handleStart = (examType: "PD1") => {
    setStarting(examType);
    startExam.mutate({ examType });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Mock exams</h1>
        <p className="text-sm text-textSecondary">
          Simulate the real exam with a timed, weighted question set.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <h2 className="text-xl font-serif">{exam.title}</h2>
            <p className="mt-3 text-sm text-textSecondary">{exam.description}</p>
            <button
              type="button"
              className="btn-primary mt-6 inline-block"
              onClick={() => handleStart(exam.id)}
              disabled={starting === exam.id}
            >
              {starting === exam.id ? "Starting..." : "Start mock exam"}
            </button>
          </Card>
        ))}
      </div>
      <button
        type="button"
        className="btn-secondary inline-block"
        onClick={() => router.push("/exam/history")}
      >
        View exam history
      </button>
    </div>
  );
}

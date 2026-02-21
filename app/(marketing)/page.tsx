import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Practice questions", value: "93" },
  { label: "PD1 topics", value: "4" },
  { label: "Mock exam questions", value: "60" },
  { label: "Cost", value: "Free" },
];

const features = [
  {
    step: "01",
    title: "Pick a topic, start practicing",
    description:
      "Choose from 4 weighted PD1 topics and drill question sets with instant explanations after each answer.",
    accent: "bg-accent-yellow",
  },
  {
    step: "02",
    title: "Simulate the real exam",
    description:
      "Run timed 60-question mock exams under real conditions — no peeking at answers until you finish.",
    accent: "bg-accent-purple",
  },
  {
    step: "03",
    title: "Review and improve",
    description:
      "Get a full breakdown with explanations, reference links to official Salesforce docs, and topic scores.",
    accent: "bg-accent-green",
  },
];

const faqs = [
  {
    question: "How close are the questions to the real exam?",
    answer:
      "Questions mirror the official PD1 blueprint and cover the same topics and difficulty. Each explanation links back to official Salesforce documentation.",
  },
  {
    question: "Is PDPrep really free?",
    answer:
      "Yes. All questions, mock exams, and explanations are free with no paywalls or tiers.",
  },
];

export default function MarketingPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center">
        <Badge className="bg-accent-yellow">100% Free PD1 Prep</Badge>
        <h1 className="mt-6 text-4xl font-serif leading-tight md:text-6xl">
          Pass PD1 on the
          <span className="italic"> first try</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-textSecondary">
          93 exam-accurate questions, timed mock exams, and detailed
          explanations with links to official Salesforce docs. Free forever.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-4xl px-6">
        <div className="grid gap-4 border-2 border-border bg-bgSecondary px-6 py-6 shadow-brutal md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-sm text-textSecondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-4xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.step} className="relative overflow-hidden">
              <div
                className={`absolute right-6 top-6 border-2 border-border px-3 py-1 text-xs font-semibold ${feature.accent}`}
              >
                {feature.step}
              </div>
              <h3 className="text-xl font-serif">{feature.title}</h3>
              <p className="mt-4 text-sm text-textSecondary">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-4xl px-6 pb-20">
        <h2 className="text-3xl md:text-4xl">FAQ</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {faqs.map((item) => (
            <Card key={item.question}>
              <h3 className="text-lg font-serif">{item.question}</h3>
              <p className="mt-3 text-sm text-textSecondary">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

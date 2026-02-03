import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Practice questions", value: "1,200+" },
  { label: "Pass-focused", value: "92%" },
  { label: "Active learners", value: "4,800" },
  { label: "Avg. rating", value: "4.9/5" },
];

const steps = [
  {
    step: "01",
    title: "Pick your exam",
    description: "Choose PD1 or PD2 and see weighted topics mapped to the official blueprint.",
    accent: "bg-accent-yellow",
  },
  {
    step: "02",
    title: "Practice with intent",
    description: "Drill question sets by topic, difficulty, or weak areas and get instant explanations.",
    accent: "bg-accent-purple",
  },
  {
    step: "03",
    title: "Simulate the exam",
    description: "Run timed mock exams that feel like the real thing and track readiness.",
    accent: "bg-accent-green",
  },
];

const features = [
  {
    title: "Exam-accurate questions",
    description:
      "Curated by certified developers with explanations that connect every answer to core concepts.",
  },
  {
    title: "Weighted topic coverage",
    description:
      "Focus time where it matters based on official PD1/PD2 weighting and your personal accuracy.",
  },
  {
    title: "Readiness score",
    description:
      "A confidence meter that estimates your pass probability and highlights weak areas.",
  },
  {
    title: "Mock exam engine",
    description:
      "Timed, randomized, and strict. Train under the same conditions you will face on exam day.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    description: "Get a focused taste of PD1 or PD2 prep.",
    features: ["50 questions per exam", "Basic progress tracking", "Community updates"],
    cta: "Start free",
  },
  {
    name: "Monthly",
    price: "$19",
    description: "Unlimited prep with full analytics and mock exams.",
    features: [
      "Unlimited questions",
      "Mock exams",
      "Detailed explanations",
      "Readiness score",
    ],
    cta: "Go monthly",
  },
  {
    name: "Yearly",
    price: "$149",
    description: "All premium features with 2 months free.",
    features: ["Everything in Monthly", "Priority updates", "Early access releases"],
    cta: "Go yearly",
  },
];

const faqs = [
  {
    question: "How close are the questions to the real exam?",
    answer:
      "Questions mirror the official blueprint and emphasize the same topics and difficulty bands. Explanations map back to core platform concepts.",
  },
  {
    question: "Can I switch between PD1 and PD2?",
    answer:
      "Yes. Toggle exams any time and keep separate progress tracking for each certification.",
  },
  {
    question: "Do mock exams show the answers?",
    answer:
      "Not during the exam. You get a full review afterwards, including explanations and topic breakdowns.",
  },
  {
    question: "Is there a lifetime plan?",
    answer:
      "Yes. The lifetime plan includes all premium features and future content updates.",
  },
];

export default function MarketingPage() {
  return (
    <div className="pb-16">
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge className="bg-accent-yellow">Warm neo-brutalism</Badge>
          <h1 className="mt-6 text-4xl font-serif leading-tight md:text-6xl">
            Pass PD1 + PD2 on the
            <span className="italic"> first try</span>.
          </h1>
          <p className="mt-6 text-lg text-textSecondary">
            PDPrep delivers exam-accurate questions, detailed explanations, and mock
            exams that feel like the real thing. Practice with intent and track
            your readiness.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup" className="btn-primary">
              Start free
            </Link>
            <Link href="#pricing" className="btn-secondary">
              View pricing
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-textSecondary">
            <div className="neo-border bg-bgSecondary px-4 py-3 shadow-brutal">
              Built by certified devs
            </div>
            <div className="neo-border bg-bgSecondary px-4 py-3 shadow-brutal">
              PD1 + PD2 aligned
            </div>
          </div>
        </div>
        <Card className="self-start bg-bgSecondary">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Question Preview</span>
            <Badge className="bg-accent-purple">PD1</Badge>
          </div>
          <h3 className="mt-4 text-xl font-serif">
            Which interface should you use to expose an Apex method to Lightning Web
            Components?
          </h3>
          <div className="mt-6 space-y-3 text-sm">
            {[
              "@AuraEnabled",
              "@RemoteAction",
              "@InvocableMethod",
              "@TestVisible",
            ].map((answer, index) => (
              <div
                key={answer}
                className={`neo-border flex items-center gap-3 bg-bgPrimary px-4 py-3 shadow-brutal ${
                  index === 0 ? "bg-accent-green" : ""
                }`}
              >
                <span className="text-xs font-semibold">{String.fromCharCode(65 + index)}</span>
                <span>{answer}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-sm text-textSecondary">
            Correct: <span className="font-semibold text-textPrimary">@AuraEnabled</span>
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-4 border-2 border-border bg-bgSecondary px-6 py-6 shadow-brutal md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-sm text-textSecondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl">How it works</h2>
          <Badge className="bg-accent-yellow">3 steps</Badge>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.step} className="relative overflow-hidden">
              <div
                className={`absolute right-6 top-6 border-2 border-border px-3 py-1 text-xs font-semibold ${step.accent}`}
              >
                {step.step}
              </div>
              <h3 className="text-xl font-serif">{step.title}</h3>
              <p className="mt-4 text-sm text-textSecondary">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl">What you get</h2>
          <Badge className="bg-accent-green">Built for pass rates</Badge>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <h3 className="text-xl font-serif">{feature.title}</h3>
              <p className="mt-4 text-sm text-textSecondary">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl">Pricing</h2>
          <Badge className="bg-accent-purple">Cancel anytime</Badge>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pricing.map((plan) => (
            <Card key={plan.name} className="flex h-full flex-col">
              <h3 className="text-2xl font-serif">{plan.name}</h3>
              <div className="mt-4 text-3xl font-semibold">{plan.price}</div>
              <p className="mt-3 text-sm text-textSecondary">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-textSecondary">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 bg-accent-yellow" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button className="w-full">{plan.cta}</Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-sm text-textSecondary">
          Looking for lifetime access? Email us for the $299 lifetime plan.
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl">FAQ</h2>
          <Badge className="bg-accent-yellow">Quick answers</Badge>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {faqs.map((item) => (
            <Card key={item.question}>
              <h3 className="text-lg font-serif">{item.question}</h3>
              <p className="mt-3 text-sm text-textSecondary">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="border-2 border-border bg-bgDark px-8 py-12 text-textInverse shadow-brutal md:px-12">
          <h2 className="text-3xl font-serif md:text-4xl">
            Ready to pass with confidence?
          </h2>
          <p className="mt-4 text-sm text-textInverse opacity-80">
            Start with a free PD1 or PD2 question set and unlock the full library
            when you are ready.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/signup" className="btn-primary">
              Start free
            </Link>
            <Link href="/pricing" className="btn-secondary">
              See plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "$0",
    detail: "50 questions per exam",
  },
  {
    name: "Monthly",
    price: "$19",
    detail: "Unlimited questions + mock exams",
  },
  {
    name: "Yearly",
    price: "$149",
    detail: "All premium features, 2 months free",
  },
];

export default function PricingPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl md:text-5xl">Pricing plans</h1>
      <p className="mt-4 text-lg text-textSecondary">
        Pick the plan that matches your certification timeline.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <h2 className="text-2xl font-serif">{plan.name}</h2>
            <div className="mt-3 text-3xl font-semibold">{plan.price}</div>
            <p className="mt-3 text-sm text-textSecondary">{plan.detail}</p>
            <Button className="mt-6 w-full">Choose {plan.name}</Button>
          </Card>
        ))}
      </div>
      <div className="mt-10 border-2 border-border bg-bgSecondary px-6 py-6 shadow-brutal">
        <h3 className="text-xl font-serif">Looking for lifetime access?</h3>
        <p className="mt-2 text-sm text-textSecondary">
          Email us and we will set you up with the $299 lifetime plan.
        </p>
        <Link href="/signup" className="btn-primary mt-4 inline-block">
          Start free
        </Link>
      </div>
    </section>
  );
}

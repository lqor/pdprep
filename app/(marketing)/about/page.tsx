import { Card } from "@/components/ui/card";

const values = [
  {
    title: "Built by devs",
    description:
      "Every question is reviewed by certified Salesforce developers who have passed PD1.",
  },
  {
    title: "Exam-aligned",
    description:
      "Topic weighting and difficulty mirror the official blueprint so practice time translates to points.",
  },
  {
    title: "Actionable feedback",
    description:
      "Explanations are designed to teach, not just tell, with references to official docs.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl md:text-5xl">About pdprep</h1>
      <p className="mt-4 text-lg text-textSecondary">
        pdprep exists to help Salesforce developers pass PD1 on the first try with
        high-quality practice and honest feedback.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title}>
            <h2 className="text-xl font-serif">{value.title}</h2>
            <p className="mt-3 text-sm text-textSecondary">{value.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-border bg-bgSecondary">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8">
        <div>
          <h3 className="text-lg font-semibold">pdprep</h3>
          <p className="mt-1 text-sm text-textSecondary">
            Free Salesforce PD1 exam preparation.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/dashboard" className="text-textSecondary hover:text-textPrimary transition-colors">
            Dashboard
          </Link>
          <Link href="/practice" className="text-textSecondary hover:text-textPrimary transition-colors">
            Practice
          </Link>
          <Link href="/exam" className="text-textSecondary hover:text-textPrimary transition-colors">
            Mock Exams
          </Link>
        </div>
      </div>
      <div className="border-t-2 border-border bg-bgPrimary px-6 py-6 text-center text-xs text-textMuted">
        © 2026 pdprep. All rights reserved.
      </div>
    </footer>
  );
}

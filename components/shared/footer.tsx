import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-border bg-bgSecondary">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">pdprep</h3>
          <p className="mt-3 text-sm text-textSecondary">
            Focused, developer-built preparation for the Salesforce Platform Developer I exam.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-textSecondary">
            Product
          </h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/about" className="interactive">
              About
            </Link>
            <Link href="/dashboard" className="interactive">
              Dashboard
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-textSecondary">
            Contact
          </h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-textSecondary">
            <span>hello@pdprep.com</span>
            <span>Built for PD1 success.</span>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-border bg-bgPrimary px-6 py-6 text-center text-xs text-textMuted">
        © 2026 pdprep. All rights reserved.
      </div>
    </footer>
  );
}

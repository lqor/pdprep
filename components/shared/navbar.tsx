import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  return (
    <header className="border-b-2 border-border bg-bgSecondary">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            pdprep
          </Link>
          <Badge className="bg-accent-yellow">PD1</Badge>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-textSecondary md:flex">
          <Link href="#how-it-works" className="interactive">
            How it works
          </Link>
          <Link href="#faq" className="interactive">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

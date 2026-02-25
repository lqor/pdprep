"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="btn-secondary">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-textPrimary transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-textPrimary transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-textPrimary transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t-2 border-border px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-semibold text-textSecondary">
            <Link
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </Link>
            <Link href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/login" className="btn-secondary text-center">
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary text-center">
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

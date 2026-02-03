import type { Route } from "next";
import Link from "next/link";
import { SignOutButton } from "@/components/shared/sign-out-button";

const links: Array<{ href: Route; label: string }> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/practice", label: "Practice" },
  { href: "/exam", label: "Mock Exams" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-6 border-r-2 border-border bg-bgSecondary px-6 py-8 md:w-64">
      <div>
        <h2 className="text-xl font-semibold">pdprep</h2>
        <p className="text-sm text-textMuted">Your PD1/PD2 cockpit</p>
      </div>
      <nav className="flex flex-col gap-3 text-sm font-semibold">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="interactive border-2 border-border bg-bgPrimary px-3 py-2 shadow-brutal"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-2">
        <SignOutButton />
      </div>
      <div className="mt-auto border-2 border-border bg-accent-green px-3 py-4 text-sm shadow-brutal">
        <p className="font-semibold">Streak: 3 days</p>
        <p className="text-xs text-textSecondary">Keep the momentum going.</p>
      </div>
    </aside>
  );
}

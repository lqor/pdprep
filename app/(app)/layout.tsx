"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { AuthGuard } from "@/components/shared/auth-guard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-bgPrimary md:flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-12">{children}</main>
      </div>
    </AuthGuard>
  );
}

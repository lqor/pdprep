"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-16">
      <Card className="w-full">
        <h1 className="text-3xl">Reset password</h1>
        <p className="mt-2 text-sm text-textSecondary">
          Password reset is not yet available. Please create a new account or
          try logging in again.
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm text-textSecondary">
          <Link href="/login" className="interactive">
            Back to sign in
          </Link>
          <Link href="/signup" className="interactive">
            Create new account
          </Link>
        </div>
      </Card>
    </div>
  );
}

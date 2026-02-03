"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/callback`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setMessage("Check your email for a reset link.");
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-16">
      <Card className="w-full">
        <h1 className="text-3xl">Reset password</h1>
        <p className="mt-2 text-sm text-textSecondary">
          We will send you a reset link to continue.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input
              type="email"
              placeholder="you@company.com"
              className="mt-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {error ? (
            <div className="neo-border bg-errorBg px-3 py-2 text-sm text-textSecondary shadow-brutal">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="neo-border bg-successBg px-3 py-2 text-sm text-textSecondary shadow-brutal">
              {message}
            </div>
          ) : null}
          <Button className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-textSecondary">
          Remembered it?{" "}
          <Link href="/login" className="interactive">
            Back to sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}

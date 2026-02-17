"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn("password", { email, password, name: fullName, flow: "signUp" });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Could not create account.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-16">
      <Card className="w-full">
        <h1 className="text-3xl">Start practicing</h1>
        <p className="mt-2 text-sm text-textSecondary">
          Create your pdprep account in under a minute.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold">Full name</label>
            <Input
              type="text"
              placeholder="Avery James"
              className="mt-2"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
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
          <div>
            <label className="text-sm font-semibold">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="mt-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? (
            <div className="neo-border bg-errorBg px-3 py-2 text-sm text-textSecondary shadow-brutal">
              {error}
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-textSecondary">
          Already have an account?{" "}
          <Link href="/login" className="interactive">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}

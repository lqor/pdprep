"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const finish = async () => {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      router.replace("/dashboard");
    };

    finish();
  }, [router]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-16">
      <div className="neo-border bg-bgSecondary px-6 py-8 shadow-brutal">
        <h1 className="text-2xl">Signing you in...</h1>
        <p className="mt-2 text-sm text-textSecondary">
          Hang tight while we finish authentication.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/auth/supabase";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) {
      router.replace("/login");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      router.replace("/login");
      return;
    }
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <Button variant="ghost" onClick={handleSignOut} className="w-full">
      Sign out
    </Button>
  );
}

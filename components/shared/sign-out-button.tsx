"use client";

import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <Button variant="ghost" onClick={handleSignOut} className="w-full">
      Sign out
    </Button>
  );
}

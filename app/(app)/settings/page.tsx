"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/auth/supabase";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!isSupabaseConfigured()) {
        return;
      }

      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        return;
      }
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user) {
        setEmail(user.email ?? "");
        const fullName = (user.user_metadata?.full_name as string) ?? "";
        setName(fullName);
      }
    };

    loadUser();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Settings</h1>
        <p className="text-sm text-textSecondary">
          Manage your profile and preferences.
        </p>
      </div>

      <Card>
        <h2 className="text-xl font-serif">Profile</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Name</label>
            <Input className="mt-2" placeholder="Avery James" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input className="mt-2" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <Button className="mt-6" disabled>
          Save changes
        </Button>
        <p className="mt-2 text-xs text-textMuted">Profile updates coming soon.</p>
      </Card>

      <Card>
        <h2 className="text-xl font-serif">Free forever</h2>
        <p className="mt-3 text-sm text-textSecondary">
          PDPrep is 100% free for PD1 preparation. No subscriptions or billing required.
        </p>
      </Card>
    </div>
  );
}

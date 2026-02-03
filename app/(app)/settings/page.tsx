"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase";
import { trpc } from "@/lib/trpc/client";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const subscription = trpc.subscription.getStatus.useQuery();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createSupabaseBrowserClient();
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
          Manage your profile, preferences, and subscription.
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
        <h2 className="text-xl font-serif">Subscription</h2>
        <p className="mt-3 text-sm text-textSecondary">
          Current plan: {subscription.data?.plan ?? "FREE"}
        </p>
        {subscription.data?.currentPeriodEnd ? (
          <p className="text-xs text-textMuted">
            Renews {new Date(subscription.data.currentPeriodEnd).toLocaleDateString()}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" disabled>
            Manage billing
          </Button>
          <Button variant="ghost" disabled>
            Cancel plan
          </Button>
        </div>
      </Card>
    </div>
  );
}

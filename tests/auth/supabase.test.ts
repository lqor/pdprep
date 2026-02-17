import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...originalEnv };
});

describe("isSupabaseConfigured", () => {
  it("returns true when both env vars are set", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";

    const { isSupabaseConfigured } = await import("@/lib/auth/supabase");
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("returns false when URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";

    const { isSupabaseConfigured } = await import("@/lib/auth/supabase");
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("returns false when key is missing", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { isSupabaseConfigured } = await import("@/lib/auth/supabase");
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("returns false when both are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { isSupabaseConfigured } = await import("@/lib/auth/supabase");
    expect(isSupabaseConfigured()).toBe(false);
  });
});

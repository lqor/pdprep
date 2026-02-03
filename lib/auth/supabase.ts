import { cookies } from "next/headers";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClientComponentClient();
}

export function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createServerComponentClient({ cookies });
}

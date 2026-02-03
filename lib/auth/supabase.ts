import { cookies } from "next/headers";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";

export function createSupabaseBrowserClient() {
  return createClientComponentClient();
}

export function createSupabaseServerClient() {
  return createServerComponentClient({ cookies });
}

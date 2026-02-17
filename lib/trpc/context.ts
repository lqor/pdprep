import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(_opts: FetchCreateContextFnOptions) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { userId: undefined as string | undefined, userEmail: undefined as string | undefined, userName: undefined as string | undefined };
  }

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    userId: session?.user.id,
    userEmail: session?.user.email,
    userName: session?.user.user_metadata?.full_name as string | undefined,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

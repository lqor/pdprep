import { router, protectedProcedure } from "@/lib/trpc/trpc";

export const userRouter = router({
  getMe: protectedProcedure.query(() => ({ ok: true })),
});

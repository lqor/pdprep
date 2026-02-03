import { router, protectedProcedure } from "@/lib/trpc/trpc";
import { prisma } from "@/lib/db/prisma";

export const subscriptionRouter = router({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: ctx.userId },
    });

    return {
      status: subscription?.status ?? "FREE",
      plan: subscription?.plan ?? "FREE",
      currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    };
  }),
});

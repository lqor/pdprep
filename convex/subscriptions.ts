import { query } from "./_generated/server";
import { requireAuth } from "./helpers";

export const getStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return {
      status: subscription?.status ?? "FREE",
      plan: subscription?.plan ?? "FREE",
      currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    };
  },
});

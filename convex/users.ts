import { query } from "./_generated/server";
import { requireAuth } from "./helpers";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db.get(userId);
    return {
      ok: true,
      email: user?.email,
      name: user?.name,
    };
  },
});

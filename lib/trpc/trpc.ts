import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "@/lib/trpc/context";
import { prisma } from "@/lib/db/prisma";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Ensure user exists in our database (upsert on first access)
  await prisma.user.upsert({
    where: { id: ctx.userId },
    create: {
      id: ctx.userId,
      email: ctx.userEmail ?? "",
      name: ctx.userName,
    },
    update: {
      lastActiveAt: new Date(),
    },
  });

  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

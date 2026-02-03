import { router, protectedProcedure } from "@/lib/trpc/trpc";
import { prisma } from "@/lib/db/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const questionRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const question = await prisma.question.findUnique({
        where: { id: input.id },
        include: {
          topic: { select: { id: true, name: true, slug: true } },
          answers: { select: { id: true, content: true, sortOrder: true } },
        },
      });

      if (!question) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Question not found" });
      }

      return question;
    }),
});

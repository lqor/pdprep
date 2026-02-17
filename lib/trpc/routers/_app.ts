import { router } from "@/lib/trpc/trpc";
import { userRouter } from "@/lib/trpc/routers/user";
import { questionRouter } from "@/lib/trpc/routers/question";
import { practiceRouter } from "@/lib/trpc/routers/practice";
import { examRouter } from "@/lib/trpc/routers/exam";
import { progressRouter } from "@/lib/trpc/routers/progress";
import { subscriptionRouter } from "@/lib/trpc/routers/subscription";

export const appRouter = router({
  user: userRouter,
  question: questionRouter,
  practice: practiceRouter,
  exam: examRouter,
  progress: progressRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;

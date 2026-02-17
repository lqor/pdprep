import { prisma } from "@/lib/db/prisma";

export async function canAccessQuestion(userId: string, questionId: string) {
  const [user, question] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    }),
    prisma.question.findUnique({
      where: { id: questionId },
    }),
  ]);

  if (!question) return false;
  if (!question.isPremium) return true;
  if (!user?.subscription) return false;

  return user.subscription.status === "ACTIVE";
}

export async function canStartExam(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user?.subscription) return false;
  return user.subscription.status === "ACTIVE";
}

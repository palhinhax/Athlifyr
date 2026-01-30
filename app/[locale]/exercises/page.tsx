import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ExercisesPageClient } from "@/components/exercises-page-client";

export const dynamic = "force-dynamic";

export default async function ExercisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Check if user is admin (always has access) or has pro account
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isProAccount: true, role: true },
  });

  // Admins always have access, non-admins need pro account
  if (user?.role !== "ADMIN" && !user?.isProAccount) {
    redirect("/settings");
  }

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "exercises" });

  // Fetch user's custom exercises
  const exercises = await prisma.strengthExercise.findMany({
    where: {
      OR: [{ createdById: session.user.id }, { isGlobal: true }],
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </div>
        <ExercisesPageClient exercises={exercises} />
      </div>
    </div>
  );
}

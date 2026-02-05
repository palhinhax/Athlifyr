import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ExercisesPageClient } from "@/components/exercises-page-client";
import { Language } from "@prisma/client";

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

  // Only pro users and admins can create exercises
  const canCreate = user?.role === "ADMIN" || user?.isProAccount === true;

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "exercises" });

  // Validate and cast locale to Language enum
  const validLocales: Language[] = ["pt", "en", "es", "fr", "de", "it"];
  const currentLocale = validLocales.includes(locale as Language)
    ? (locale as Language)
    : "en";

  // Fetch user's custom exercises with translations
  const exercises = await prisma.exercise.findMany({
    where: {
      OR: [{ createdById: session.user.id }, { isGlobal: true }],
    },
    orderBy: { name: "asc" },
    include: {
      translations: {
        where: { language: currentLocale },
      },
    },
  });

  // Create initial pagination data
  const totalCount = exercises.length;
  const initialPagination = {
    page: 1,
    limit: 20,
    totalCount,
    totalPages: Math.ceil(totalCount / 20),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </div>
        <ExercisesPageClient
          initialExercises={exercises}
          initialPagination={initialPagination}
          canCreate={canCreate}
        />
      </div>
    </div>
  );
}

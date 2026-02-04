import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { TrainingPlansPageClient } from "@/components/training-plans";
import { redirect } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workouts.plans" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export const dynamic = "force-dynamic";

export default async function TrainingPlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect({ href: "/auth/signin", locale });
    return null;
  }

  // Only Pro users can access training plans page
  if (!session.user.isProAccount) {
    redirect({ href: "/workouts", locale });
    return null;
  }

  return <TrainingPlansPageClient userId={session.user.id} />;
}

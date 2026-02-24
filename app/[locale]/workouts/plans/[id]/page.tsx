import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { TrainingPlanDetailClient } from "@/components/training-plans";
import { redirect } from "@/i18n/routing";
import { isVenueStaff } from "@/lib/venues/authorization";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workouts.plans" });

  return {
    title: t("viewPlan"),
    description: t("subtitle"),
  };
}

export const dynamic = "force-dynamic";

export default async function TrainingPlanDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect({ href: "/auth/signin", locale });
    return null;
  }

  const isStaff = await isVenueStaff(session.user.id);

  return (
    <TrainingPlanDetailClient userId={session.user.id} isStaff={isStaff} />
  );
}

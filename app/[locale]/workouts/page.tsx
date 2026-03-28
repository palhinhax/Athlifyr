import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { WorkoutsPageClient } from "@/components/workouts-page-client";
import { isVenueStaff } from "@/lib/venues/authorization";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "workouts" });

  return {
    title: t("title"),
    description: t("subtitle"),
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function WorkoutsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            Please sign in to access workouts.
          </p>
        </div>
      </div>
    );
  }

  const isStaff = await isVenueStaff(session.user.id);

  return <WorkoutsPageClient userId={session.user.id} isStaff={isStaff} />;
}

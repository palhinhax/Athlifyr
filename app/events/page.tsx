import { EventsPageClient } from "@/components/events-page-client";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale });

  return {
    title: t("events.metaTitle"),
    description: t("events.metaDescription"),
  };
}

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const session = await auth();

  return <EventsPageClient userId={session?.user?.id} />;
}

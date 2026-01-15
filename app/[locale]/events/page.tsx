import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { EventsPageClient } from "@/components/events-page-client";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "events" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const session = await auth();

  return <EventsPageClient userId={session?.user?.id} />;
}

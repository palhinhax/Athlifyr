import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { EventsPageClient } from "@/components/events-page-client";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { locale } = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const t = await getTranslations({ locale, namespace: "events" });

  // NOINDEX: non-pt locales or pages with filter params (duplicate content)
  const hasFilters = Object.keys(resolvedSearchParams).length > 0;
  const shouldIndex = locale === "pt" && !hasFilters;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${baseUrl}/pt/events`,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const session = await auth();

  return <EventsPageClient userId={session?.user?.id} />;
}

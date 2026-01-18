import { getTranslations } from "next-intl/server";
import { VenuesPageClient } from "@/components/venues-page-client";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "venues" });

  return {
    title: `${t("title")} - Athlifyr`,
    description: t("description"),
  };
}

export const dynamic = "force-dynamic";

export default async function VenuesPage() {
  return <VenuesPageClient />;
}

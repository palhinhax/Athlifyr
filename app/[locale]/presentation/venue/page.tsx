import { Metadata } from "next";
import { VenuePresentationClient } from "@/components/presentations/venue-presentation-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "presentation.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
    robots: "noindex, nofollow",
  };
}

export default function VenuePresentation() {
  return <VenuePresentationClient />;
}

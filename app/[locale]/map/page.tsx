import { Metadata } from "next";
import { EventsMap } from "@/components/events-map";
import { MapFiltersWrapper } from "@/components/map-filters-wrapper";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  const session = await auth();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      {/* Map Container with Filters */}
      <div className="relative flex-1">
        <MapFiltersWrapper userId={session?.user?.id} locale={locale} />
        <EventsMap />
      </div>
    </div>
  );
}

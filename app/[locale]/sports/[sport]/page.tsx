import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Language, SportType } from "@prisma/client";
import { EventCard } from "@/components/event-card";
import { StructuredData } from "@/components/structured-data";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { sportTypeLabels } from "@/lib/event-utils";

export const dynamic = "force-dynamic";

// Map URL slugs to SportType enum
const sportSlugToType: Record<string, SportType> = {
  running: SportType.RUNNING,
  trail: SportType.TRAIL,
  walking: SportType.WALKING,
  hyrox: SportType.HYROX,
  crossfit: SportType.CROSSFIT,
  ocr: SportType.OCR,
  btt: SportType.BTT,
  cycling: SportType.CYCLING,
  surf: SportType.SURF,
  triathlon: SportType.TRIATHLON,
  swimming: SportType.SWIMMING,
};

// Valid sport slugs for static generation
export async function generateStaticParams() {
  return Object.keys(sportSlugToType).map((sport) => ({ sport }));
}

interface PageProps {
  params: {
    locale: string;
    sport: string;
  };
}

async function getSportEvents(sportType: SportType, locale: Language) {
  const events = await prisma.event.findMany({
    where: {
      sportTypes: {
        has: sportType,
      },
      startDate: {
        gte: new Date(),
      },
    },
    include: {
      translations: {
        where: {
          language: locale,
        },
      },
      variants: true,
      _count: {
        select: {
          comments: true,
          giveaways: {
            where: { status: "SCHEDULED" },
          },
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
    take: 50,
  });

  return events.map((event) => {
    const translation = event.translations[0];
    return {
      ...event,
      title: translation?.title || event.title,
      description: translation?.description || event.description,
      city: translation?.city || event.city,
    };
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam, sport } = await Promise.resolve(params);
  // Validate locale for type safety
  const _locale = (localeParam in Language ? localeParam : "pt") as Language;
  void _locale; // Used for validation
  const t = await getTranslations("sports");

  const sportType = sportSlugToType[sport];
  if (!sportType) {
    return {
      title: "Sport not found - Athlifyr",
    };
  }

  const sportName = sportTypeLabels[sportType];
  const title = t("metaTitle", { sport: sportName });
  const description = t("metaDescription", { sport: sportName });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function SportPage({ params }: PageProps) {
  const { locale: localeParam, sport } = await Promise.resolve(params);
  const locale = (localeParam in Language ? localeParam : "pt") as Language;
  const t = await getTranslations("sports");

  const sportType = sportSlugToType[sport];
  if (!sportType) {
    notFound();
  }

  const sportName = sportTypeLabels[sportType];
  const events = await getSportEvents(sportType, locale);

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: t("title"), url: `/${locale}/sports` },
    { name: sportName, url: `/${locale}/sports/${sport}` },
  ]);

  // Get stats
  const totalEvents = events.length;
  const countries = Array.from(new Set(events.map((e) => e.country)));
  const cities = Array.from(new Set(events.map((e) => e.city)));

  return (
    <div className="min-h-screen">
      <StructuredData data={breadcrumbSchema} />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container py-12">
          {/* Back button */}
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToEvents")}
          </Link>

          {/* Title and description */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("pageTitle", { sport: sportName })}
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            {t("pageDescription", { sport: sportName })}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {t("eventsCount", { count: totalEvents })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {t("locationsCount", {
                  cities: cities.length,
                  countries: countries.length,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container py-12">
        {events.length > 0 ? (
          <>
            <h2 className="mb-8 text-2xl font-semibold">
              {t("upcomingEvents", { sport: sportName })}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  trackingContext="sports_page"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              {t("noEvents", { sport: sportName })}
            </p>
            <Link
              href="/events"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            >
              {t("viewAllEvents")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { EventCard } from "@/components/event-card";
import { prisma } from "@/lib/prisma";
import { getUserCountry } from "@/lib/event-utils";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  HomeCtaSection,
  HomeSeeAllButton,
  HomeNoEventsCta,
} from "@/components/home-client-tracking";
import { AppDownloadSection } from "@/components/app-download-section";

async function getUpcomingEvents(country: string) {
  return await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
      country: country,
    },
    include: {
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
    take: 6,
  });
}

async function getEventImageUrls(): Promise<string[]> {
  const events = await prisma.event.findMany({
    where: {
      imageUrl: { not: null },
    },
    select: { imageUrl: true },
    orderBy: { startDate: "desc" },
    take: 50,
  });
  return events
    .map((e) => e.imageUrl)
    .filter(
      (url): url is string =>
        typeof url === "string" && url !== "null" && url.startsWith("http")
    );
}

export default async function Home({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Check if user is authenticated - redirect to feed
  const session = await auth();
  if (session?.user) {
    redirect(`/${locale}/feed`);
  }

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  // Get user's country from headers
  const headersList = await headers();
  const userCountry = getUserCountry(
    new Request("http://localhost", { headers: headersList })
  );

  const upcomingEvents = await getUpcomingEvents(userCountry);
  const eventImageUrls = await getEventImageUrls();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="to-accent/3 absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent" />
        <div className="container relative py-8 text-center md:py-20">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-6xl">
            {t("heroTitle")}
            <br />
            <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              {t("heroTitleHighlight")}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-lg md:mt-6 md:text-xl">
            {t("heroDescription")}
            <br />
            {t("heroDescriptionCountry", { country: userCountry })}
          </p>
        </div>
      </section>

      {/* App Download Section */}
      <AppDownloadSection />

      {/* Upcoming Events */}
      <section className="container py-6 md:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {t("upcomingEventsTitle", { country: userCountry })}
          </h2>
          <HomeSeeAllButton seeAll={t("seeAll")} eventsLabel={tNav("events")} />
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <h3 className="mb-2 text-xl font-semibold">
              {t("noUpcomingEventsTitle", { country: userCountry })}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {t("noUpcomingEventsDescription")}
            </p>
            <HomeNoEventsCta
              locale={locale}
              exploreAllEvents={t("exploreAllEvents")}
              eventsLabel={tNav("events")}
            />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                trackingContext="homepage"
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <HomeCtaSection
        locale={locale}
        ctaTitle={t("ctaTitle")}
        ctaDescription={t("ctaDescription")}
        exploreAllEvents={t("exploreAllEvents")}
        eventsLabel={tNav("events")}
        eventImageUrls={eventImageUrls}
      />
    </div>
  );
}

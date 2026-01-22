import { EventCard } from "@/components/event-card";
import { prisma } from "@/lib/prisma";
import { getUserCountry } from "@/lib/event-utils";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  HomeCtaSection,
  HomeSeeAllButton,
  HomeNoEventsCta,
} from "@/components/home-client-tracking";

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
    },
    orderBy: {
      startDate: "asc",
    },
    take: 6,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  // Get user's country from headers
  const headersList = await headers();
  const userCountry = getUserCountry(
    new Request("http://localhost", { headers: headersList })
  );

  const upcomingEvents = await getUpcomingEvents(userCountry);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center md:py-20">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          {t("heroTitle")}
          <br />
          <span className="text-primary">{t("heroTitleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {t("heroDescription")}
          <br />
          {t("heroDescriptionCountry", { country: userCountry })}
        </p>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            {t("upcomingEventsTitle", { country: userCountry })}
          </h2>
          <HomeSeeAllButton seeAll={t("seeAll")} />
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
      />
    </div>
  );
}

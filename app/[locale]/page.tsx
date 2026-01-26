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

  // Check if user is authenticated - redirect to feed
  const session = await auth();
  if (session?.user) {
    redirect(`/${locale}/feed`);
  }

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
      <section className="container mx-auto px-4 py-8 text-center md:py-20">
        <h1 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-6xl">
          {t("heroTitle")}
          <br />
          <span className="text-primary">{t("heroTitleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-lg md:mt-6 md:text-xl">
          {t("heroDescription")}
          <br />
          {t("heroDescriptionCountry", { country: userCountry })}
        </p>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-4 py-6 md:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
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

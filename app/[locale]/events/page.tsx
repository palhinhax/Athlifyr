import { Suspense } from "react";
import { EventCard } from "@/components/event-card";
import { prisma } from "@/lib/prisma";
import { SportType, Prisma } from "@prisma/client";
import { sportTypeLabels } from "@/lib/event-utils";
import { SportFilter } from "@/components/sport-filter";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

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

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getEvents(sportType?: string, userFavoriteSports?: SportType[]) {
  const where: Prisma.EventWhereInput = {
    startDate: {
      gte: new Date(),
    },
  };

  // If user has favorite sports and no specific filter is selected, filter by favorites
  if (userFavoriteSports && userFavoriteSports.length > 0 && !sportType) {
    where.sportTypes = {
      hasSome: userFavoriteSports,
    };
  } else if (sportType && sportType !== "ALL" && sportType in SportType) {
    where.sportTypes = {
      has: sportType as SportType,
    };
  }

  return await prisma.event.findMany({
    where,
    include: {
      variants: true,
    },
    orderBy: {
      startDate: "asc",
    },
  });
}

async function getUserParticipatingEventIds(
  userId: string
): Promise<Set<string>> {
  const participations = await prisma.participation.findMany({
    where: { userId },
    select: { eventId: true },
  });
  return new Set(participations.map((p) => p.eventId));
}

async function EventsList({
  sportType,
  locale,
}: {
  sportType?: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "events" });
  const session = await auth();

  // Get user's favorite sports if logged in
  let userFavoriteSports: SportType[] | undefined;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { favoriteSports: true },
    });
    userFavoriteSports = user?.favoriteSports || undefined;
  }

  const events = await getEvents(sportType, userFavoriteSports);

  // Get user's participating events if logged in
  const participatingEventIds = session?.user?.id
    ? await getUserParticipatingEventIds(session.user.id)
    : new Set<string>();

  if (events.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-lg">{t("noEvents")}</p>
        <p className="mt-2">{t("noEventsDescription")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          locale={locale}
          isParticipating={participatingEventIds.has(event.id)}
        />
      ))}
    </div>
  );
}

export default async function EventsPage({
  searchParams,
  params,
}: PageProps & { params: { locale: string } }) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "events" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const sportFilter = (searchParams.sport as string) || "ALL";
  const session = await auth();

  // Get user's favorite sports if logged in
  let userFavoriteSports: SportType[] | undefined;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { favoriteSports: true },
    });
    userFavoriteSports = user?.favoriteSports || undefined;
  }

  // Build sport types for filter
  const allSportTypes = [
    { value: SportType.RUNNING, label: sportTypeLabels[SportType.RUNNING] },
    { value: SportType.TRAIL, label: sportTypeLabels[SportType.TRAIL] },
    { value: SportType.HYROX, label: sportTypeLabels[SportType.HYROX] },
    { value: SportType.CROSSFIT, label: sportTypeLabels[SportType.CROSSFIT] },
    { value: SportType.OCR, label: sportTypeLabels[SportType.OCR] },
    { value: SportType.BTT, label: sportTypeLabels[SportType.BTT] },
    { value: SportType.CYCLING, label: sportTypeLabels[SportType.CYCLING] },
    { value: SportType.SURF, label: sportTypeLabels[SportType.SURF] },
    { value: SportType.TRIATHLON, label: sportTypeLabels[SportType.TRIATHLON] },
    { value: SportType.SWIMMING, label: sportTypeLabels[SportType.SWIMMING] },
    { value: SportType.OTHER, label: sportTypeLabels[SportType.OTHER] },
  ];

  // Filter sport types based on user's favorites
  const availableSportTypes =
    userFavoriteSports && userFavoriteSports.length > 0
      ? allSportTypes.filter((sport) =>
          userFavoriteSports.includes(sport.value as SportType)
        )
      : allSportTypes;

  const sportTypes = [
    { value: "ALL", label: tNav("all") },
    ...availableSportTypes,
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2 text-4xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Suspense fallback={null}>
          <SportFilter sportTypes={sportTypes} currentFilter={sportFilter} />
        </Suspense>

        {/* Events List */}
        <Suspense
          fallback={
            <div className="py-12 text-center">
              <p className="text-muted-foreground">{tCommon("loading")}</p>
            </div>
          }
        >
          <EventsList
            sportType={sportFilter === "ALL" ? undefined : sportFilter}
            locale={locale}
          />
        </Suspense>
      </section>
    </div>
  );
}

import { Suspense } from "react";
import { EventCard } from "@/components/event-card";
import { prisma } from "@/lib/prisma";
import { SportType, Prisma } from "@prisma/client";
import { sportTypeLabels } from "@/lib/event-utils";
import { SportFilter } from "@/components/sport-filter";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Todos os Eventos Desportivos",
  description:
    "Explore todos os eventos desportivos em Portugal. Encontre corridas, trails, HYROX, CrossFit, OCR, BTT, ciclismo, surf, triatlo e natação perto de si. Descubra competições e desafios para todos os níveis.",
  keywords:
    "eventos desportivos, corridas Portugal, trail running, HYROX, CrossFit, OCR, BTT, ciclismo, surf, triatlo, competições",
  openGraph: {
    title: "Todos os Eventos Desportivos - Athlifyr",
    description:
      "Explore todos os eventos desportivos em Portugal. Encontre corridas, competições e desafios perto de si.",
    url: "https://athlifyr.com/events",
    siteName: "Athlifyr",
    type: "website",
    images: [
      {
        url: "https://athlifyr.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Athlifyr - All Sports Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Todos os Eventos Desportivos - Athlifyr",
    description:
      "Explore todos os eventos desportivos em Portugal. Encontre corridas, competições e desafios perto de si.",
  },
  alternates: {
    canonical: "https://athlifyr.com/events",
  },
};

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

async function EventsList({ sportType }: { sportType?: string }) {
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
        <p className="text-lg">Nenhum evento encontrado.</p>
        <p className="mt-2">Tente ajustar os filtros ou volte mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isParticipating={participatingEventIds.has(event.id)}
        />
      ))}
    </div>
  );
}

export default async function EventsPage({ searchParams }: PageProps) {
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

  const sportTypes = [{ value: "ALL", label: "Todos" }, ...availableSportTypes];

  return (
    <div className="min-h-screen">
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2 text-4xl font-bold">Todos os Eventos</h1>
          <p className="text-muted-foreground">
            Descubra os melhores eventos desportivos em Portugal
          </p>
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
              <p className="text-muted-foreground">A carregar eventos...</p>
            </div>
          }
        >
          <EventsList
            sportType={sportFilter === "ALL" ? undefined : sportFilter}
          />
        </Suspense>
      </section>
    </div>
  );
}

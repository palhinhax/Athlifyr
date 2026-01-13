import { Suspense } from "react";
import { EventCard } from "@/components/event-card";
import { prisma } from "@/lib/prisma";
import { SportType, Prisma } from "@prisma/client";
import { sportTypeLabels } from "@/lib/event-utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Todos os Eventos - Athlifyr",
  description:
    "Explore todos os eventos desportivos em Portugal. Encontre corridas, competições e desafios perto de si.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getEvents(sportType?: string) {
  const where: Prisma.EventWhereInput = {
    startDate: {
      gte: new Date(),
    },
  };

  if (sportType && sportType !== "ALL" && sportType in SportType) {
    where.sportType = sportType as SportType;
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

async function EventsList({ sportType }: { sportType?: string }) {
  const events = await getEvents(sportType);

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
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default async function EventsPage({ searchParams }: PageProps) {
  const sportFilter = (searchParams.sport as string) || "ALL";

  const sportTypes = [
    { value: "ALL", label: "Todos" },
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
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium">Filtrar por modalidade:</h2>
          <div className="flex flex-wrap gap-2">
            {sportTypes.map((sport) => (
              <Link key={sport.value} href={`/events?sport=${sport.value}`}>
                <Button
                  variant={sportFilter === sport.value ? "default" : "outline"}
                  size="sm"
                >
                  {sport.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

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

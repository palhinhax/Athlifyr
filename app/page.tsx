import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import { prisma } from "@/lib/prisma";
import { SportType } from "@prisma/client";
import { sportTypeLabels } from "@/lib/event-utils";

export const dynamic = "force-dynamic";

async function getUpcomingEvents() {
  return await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: "asc",
    },
    take: 6,
  });
}

export default async function Home() {
  const upcomingEvents = await getUpcomingEvents();

  const sportTypes = [
    SportType.RUNNING,
    SportType.TRAIL,
    SportType.HYROX,
    SportType.CROSSFIT,
    SportType.OCR,
    SportType.BTT,
    SportType.CYCLING,
    SportType.SURF,
    SportType.TRIATHLON,
    SportType.OTHER,
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          All sports events.
          <br />
          <span className="text-primary">One place.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
          Find races, competitions and challenges near you.
          <br />
          Discover the best sports events in Portugal.
        </p>
      </section>

      {/* Quick Filters */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {sportTypes.map((sportType) => (
            <Link
              key={sportType}
              href={`/events?sport=${sportType}`}
            >
              <Button variant="outline" size="sm">
                {sportTypeLabels[sportType]}
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Upcoming Events in Portugal</h2>
          <Link href="/events">
            <Button variant="ghost">Ver Todos →</Button>
          </Link>
        </div>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum evento encontrado. Execute o seed da base de dados:</p>
            <code className="block mt-2 bg-muted px-4 py-2 rounded">npm run db:seed</code>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your next challenge?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse all available events and find the perfect race or competition for you.
          </p>
          <Link href="/events">
            <Button size="lg">
              Explore All Events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}


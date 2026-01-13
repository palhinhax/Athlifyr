import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import { prisma } from "@/lib/prisma";
import { SportType } from "@prisma/client";
import { sportTypeLabels, getUserCountry } from "@/lib/event-utils";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  // Get user's country from headers
  const headersList = await headers();
  const userCountry = getUserCountry(
    new Request("http://localhost", { headers: headersList })
  );

  const upcomingEvents = await getUpcomingEvents(userCountry);

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
      <section className="container mx-auto px-4 py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          All sports events.
          <br />
          <span className="text-primary">One place.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Find races, competitions and challenges near you.
          <br />
          Discover the best sports events in {userCountry}.
        </p>
      </section>

      {/* Quick Filters */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex flex-wrap justify-center gap-2">
          {sportTypes.map((sportType) => (
            <Link key={sportType} href={`/events?sport=${sportType}`}>
              <Button variant="outline" size="sm">
                {sportTypeLabels[sportType]}
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Upcoming Events in {userCountry}
          </h2>
          <Link href="/events">
            <Button variant="ghost">Ver Todos →</Button>
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>Nenhum evento encontrado. Execute o seed da base de dados:</p>
            <code className="mt-2 block rounded bg-muted px-4 py-2">
              npm run db:seed
            </code>
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
      <section className="mt-12 bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to find your next challenge?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Browse all available events and find the perfect race or competition
            for you.
          </p>
          <Link href="/events">
            <Button size="lg">Explore All Events</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { SportBadge } from "./sport-badge";
import { SportType } from "@prisma/client";

interface RelatedEvent {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  startDate: Date;
  imageUrl: string | null;
  sportTypes: SportType[];
}

interface RelatedEventsProps {
  events: RelatedEvent[];
  title?: string;
  locale: string;
}

export function RelatedEvents({
  events,
  title = "Eventos Relacionados",
  locale,
}: RelatedEventsProps) {
  if (events.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/${locale}/events/${event.slug}`}
            className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
          >
            {/* Event Image */}
            {event.imageUrl ? (
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex h-48 w-full items-center justify-center bg-muted">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {/* Event Info */}
            <div className="p-4">
              <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-primary">
                {event.title}
              </h3>

              {/* Location */}
              <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {event.city}, {event.country}
                </span>
              </div>

              {/* Date */}
              <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.startDate).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Sport Types */}
              <div className="flex flex-wrap gap-2">
                {event.sportTypes.slice(0, 2).map((sport) => (
                  <SportBadge key={sport} sportType={sport} />
                ))}
                {event.sportTypes.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{event.sportTypes.length - 2}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

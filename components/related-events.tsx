"use client";

import { Link } from "@/i18n/routing";
import { Calendar, MapPin } from "lucide-react";
import { SportBadge } from "./sport-badge";
import { SportType } from "@prisma/client";
import { useLocale } from "next-intl";
import Image from "next/image";

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
}

export function RelatedEvents({
  events,
  title = "Eventos Relacionados",
}: RelatedEventsProps) {
  const locale = useLocale();

  if (events.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      {/* Horizontal scrollable container */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 flex gap-4 overflow-x-auto pb-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group relative w-[280px] flex-shrink-0 overflow-hidden rounded-lg border bg-card transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Event Image - smaller */}
              {event.imageUrl ? (
                <div className="relative h-32 w-full overflow-hidden bg-muted">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-muted">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              {/* Event Info - more compact */}
              <div className="p-3">
                <h3 className="mb-2 line-clamp-2 text-sm font-semibold group-hover:text-primary">
                  {event.title}
                </h3>

                {/* Location */}
                <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {event.city}, {event.country}
                  </span>
                </div>

                {/* Date */}
                <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(event.startDate).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Sport Types */}
                <div className="flex flex-wrap gap-1.5">
                  {event.sportTypes.slice(0, 2).map((sport) => (
                    <div key={sport} className="origin-left scale-90">
                      <SportBadge sportType={sport} />
                    </div>
                  ))}
                  {event.sportTypes.length > 2 && (
                    <span className="self-center text-xs text-muted-foreground">
                      +{event.sportTypes.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

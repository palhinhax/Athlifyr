"use client";

import { Link } from "@/i18n/routing";
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CalendarHeart,
} from "lucide-react";
import { SportBadge } from "./sport-badge";
import { SportType } from "@prisma/client";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

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
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (paused || events.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next, events.length]);

  if (events.length === 0) return null;

  const event = events[current];

  return (
    <section
      className="overflow-hidden rounded-lg border bg-card shadow-sm"
      aria-label={title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="p-4 pb-2">
        <h3 className="flex items-center gap-2 font-semibold">
          <CalendarHeart className="h-5 w-5 text-primary" />
          {title}
        </h3>
      </div>

      {/* Slide */}
      <Link href={`/events/${event.slug}`} className="group block">
        {event.imageUrl && event.imageUrl !== "null" ? (
          <div className="relative h-36 w-full bg-muted">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-muted">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <div className="p-3">
          <h4 className="mb-1.5 line-clamp-2 text-sm font-semibold group-hover:text-primary">
            {event.title}
          </h4>

          <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {event.city}, {event.country}
            </span>
          </div>

          <div className="mb-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>
              {new Date(event.startDate).toLocaleDateString(locale, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {event.sportTypes.slice(0, 2).map((sport) => (
              <div key={sport} className="origin-left scale-[0.85]">
                <SportBadge sportType={sport} />
              </div>
            ))}
            {event.sportTypes.length > 2 && (
              <span className="self-center text-[10px] text-muted-foreground">
                +{event.sportTypes.length - 2}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Navigation */}
      {events.length > 1 && (
        <div className="flex items-center justify-between border-t px-3 py-2">
          <button
            type="button"
            onClick={prev}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Previous event"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="flex gap-1">
            {events.map((_, i) => (
              <button
                key={events[i].id}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
                aria-label={`Go to event ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Next event"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}

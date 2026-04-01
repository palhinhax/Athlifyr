"use client";

import { Link } from "@/i18n/routing";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { SportType } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
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
  readonly events: RelatedEvent[];
  readonly title?: string;
}

export function RelatedEvents({
  events,
  title = "Eventos Relacionados",
}: RelatedEventsProps) {
  const locale = useLocale();
  const tSports = useTranslations("sports");
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
    <div
      className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {title}
          </h4>
        </div>
        {events.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Previous event"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Next event"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Event Card */}
      <Link
        href={`/events/${event.slug}`}
        className="group cursor-pointer"
        aria-label={event.title}
      >
        {/* Image */}
        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
          {event.imageUrl && event.imageUrl !== "null" ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {event.sportTypes.length > 0 && (
            <div className="absolute left-3 top-3 flex gap-2">
              {event.sportTypes.slice(0, 3).map((sport) => (
                <span
                  key={sport}
                  className="glass-panel rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                >
                  {tSports(sport)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h5 className="mb-2 font-headline font-bold transition-colors group-hover:text-primary">
          {event.title}
        </h5>

        {/* Meta */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary-container" />
            <span>
              {event.city}, {event.country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-primary-container" />
            <span>
              {new Date(event.startDate).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

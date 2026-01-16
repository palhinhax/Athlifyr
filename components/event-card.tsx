"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Route, CheckCircle } from "lucide-react";
import { formatDateShort, sportTypeLabels } from "@/lib/event-utils";
import type { Event, EventVariant } from "@prisma/client";
import { useLocale } from "next-intl";

interface EventCardProps {
  event: Event & {
    variants?: EventVariant[];
  };
  isParticipating?: boolean;
}

export function EventCard({ event, isParticipating = false }: EventCardProps) {
  const locale = useLocale();

  return (
    <Link href={`/events/${event.slug}`} className="block">
      <Card
        className={`overflow-hidden transition-shadow hover:shadow-lg ${
          isParticipating ? "ring-2 ring-green-500" : ""
        }`}
      >
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl || "/placeholder-event.jpg"}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1">
            {Array.isArray(event.sportTypes) &&
              event.sportTypes.map((sportType) => (
                <div
                  key={sportType}
                  className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
                >
                  {sportTypeLabels[sportType]}
                </div>
              ))}
          </div>
          {isParticipating && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
              <CheckCircle className="h-4 w-4" />
              Vou
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold">{event.title}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDateShort(event.startDate, locale)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {event.city}, {event.country}
              </span>
            </div>
            {event.variants && event.variants.length > 0 && (
              <div className="mt-2 flex items-start gap-2">
                <Route className="mt-0.5 h-4 w-4" />
                <div className="flex flex-wrap gap-1">
                  {event.variants.slice(0, 3).map((variant) => (
                    <span
                      key={variant.id}
                      className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {variant.distanceKm
                        ? `${variant.distanceKm} km`
                        : variant.name}
                    </span>
                  ))}
                  {event.variants.length > 3 && (
                    <span className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      +{event.variants.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

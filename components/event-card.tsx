import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Route } from "lucide-react";
import { formatDateShort, sportTypeLabels } from "@/lib/event-utils";
import type { Event, EventVariant } from "@prisma/client";

interface EventCardProps {
  event: Event & {
    variants?: EventVariant[];
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
          {sportTypeLabels[event.sportType]}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold">{event.title}</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDateShort(event.startDate)}</span>
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
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/events/${event.slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver Evento
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

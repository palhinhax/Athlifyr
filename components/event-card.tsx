import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { formatDateShort, sportTypeLabels } from "@/lib/event-utils";
import type { Event } from "@prisma/client";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          {sportTypeLabels[event.sportType]}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
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
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
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

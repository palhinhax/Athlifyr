"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Calendar, MapPin, Ticket, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { EventTicketModal } from "@/components/event-ticket-modal";
import { formatDate } from "@/lib/event-utils";

interface Variant {
  name: string;
  distanceKm: number | null;
  startDate: Date | null;
  startTime: string | null;
}

interface UpcomingEvent {
  id: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: Date;
    city: string;
    country: string;
  };
  variant: Variant | null;
}

interface ProfileUpcomingEventsProps {
  events: UpcomingEvent[];
  confirmedTicketEventIds: string[];
  locale: string;
}

export function ProfileUpcomingEvents({
  events,
  confirmedTicketEventIds,
  locale,
}: ProfileUpcomingEventsProps) {
  const t = useTranslations("profile");
  const tEvents = useTranslations("events");
  const [ticketEventId, setTicketEventId] = useState<string | null>(null);
  const confirmedSet = useMemo(
    () => new Set(confirmedTicketEventIds),
    [confirmedTicketEventIds]
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((participation) => (
          <div key={participation.id} className="rounded-lg border p-4">
            <Link href={`/events/${participation.event.slug}`}>
              <div className="transition-colors hover:text-primary">
                <h3 className="mb-2 font-semibold">
                  {participation.event.title}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(participation.event.startDate, locale)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {participation.event.city}, {participation.event.country}
                  </div>
                  {participation.variant && (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 shrink-0" />
                        <span>
                          {participation.variant.name}
                          {participation.variant.distanceKm &&
                            ` - ${participation.variant.distanceKm} km`}
                        </span>
                      </div>
                      {participation.variant.startDate &&
                        participation.variant.startDate !==
                          participation.event.startDate && (
                          <span className="pl-6 text-xs">
                            (
                            {formatDate(
                              participation.variant.startDate,
                              locale
                            )}
                            {participation.variant.startTime &&
                              ` ${t("at")} ${participation.variant.startTime}`}
                            )
                          </span>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
            {confirmedSet.has(participation.event.id) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full gap-2"
                onClick={() => setTicketEventId(participation.event.id)}
              >
                <Ticket className="h-4 w-4" />
                {tEvents("registration.showTicket")}
              </Button>
            )}
          </div>
        ))}
      </div>

      {ticketEventId && (
        <EventTicketModal
          eventId={ticketEventId}
          open={!!ticketEventId}
          onOpenChange={(open) => {
            if (!open) setTicketEventId(null);
          }}
        />
      )}
    </>
  );
}

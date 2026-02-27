"use client";

import { useState } from "react";
import { Calendar, MapPin, Trophy, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { TicketDialog } from "@/components/ticket-dialog";
import { formatDate } from "@/lib/event-utils";

interface RegistrationInfo {
  id: string;
  bibNumber: string | null;
  variantName: string | null;
  participantName: string | null;
}

interface ProfileUpcomingEventCardProps {
  participation: {
    id: string;
    event: {
      slug: string;
      title: string;
      startDate: Date | string;
      city: string;
      country: string;
    };
    variant?: {
      name: string;
      distanceKm?: number | null;
      startDate?: Date | string | null;
      startTime?: string | null;
    } | null;
  };
  registration?: RegistrationInfo | null;
  locale: string;
}

export function ProfileUpcomingEventCard({
  participation,
  registration,
  locale,
}: ProfileUpcomingEventCardProps) {
  const t = useTranslations("events.registration");
  const tProfile = useTranslations("profile");
  const [showTicketDialog, setShowTicketDialog] = useState(false);

  return (
    <>
      <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
        <Link href={`/events/${participation.event.slug}`} className="block">
          <h3 className="mb-2 font-semibold">{participation.event.title}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(new Date(participation.event.startDate), locale)}
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
                        new Date(participation.variant.startDate),
                        locale
                      )}
                      {participation.variant.startTime &&
                        ` ${tProfile("at")} ${participation.variant.startTime}`}
                      )
                    </span>
                  )}
              </div>
            )}
          </div>
        </Link>

        {/* View Ticket button */}
        {registration && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => setShowTicketDialog(true)}
            >
              <Ticket className="h-4 w-4" />
              {t("viewTicket")}
            </Button>
          </div>
        )}
      </div>

      {/* Ticket Dialog */}
      {registration && (
        <TicketDialog
          open={showTicketDialog}
          onOpenChange={setShowTicketDialog}
          eventTitle={participation.event.title}
          eventDate={participation.event.startDate}
          eventCity={participation.event.city}
          variantName={registration.variantName}
          bibNumber={registration.bibNumber}
          registrationId={registration.id}
          participantName={registration.participantName}
        />
      )}
    </>
  );
}

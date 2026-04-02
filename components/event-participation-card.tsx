"use client";

import { EventPastParticipation } from "@/components/event-past-participation";
import { EventRegistration } from "@/components/event-registration/event-registration";
import type { EventRegistrationProps } from "@/components/event-registration/event-registration-types";

interface EventVariant {
  id: string;
  name: string;
  distanceKm: number | null;
  startDate?: Date | string | null;
  startTime?: string | null;
}

interface EventParticipationCardProps {
  readonly eventId: string;
  readonly eventSlug: string;
  readonly eventTitle: string;
  readonly hasRegistrations: boolean;
  readonly variants: EventVariant[];
  readonly registrationVariants: EventRegistrationProps["variants"];
  readonly cancelled: boolean;
  readonly isPastEvent: boolean;
  readonly registrationFieldSettings?: Record<string, string>;
}

export function EventParticipationCard({
  eventId,
  eventSlug,
  eventTitle,
  hasRegistrations,
  variants,
  registrationVariants,
  cancelled,
  isPastEvent,
  registrationFieldSettings,
}: EventParticipationCardProps) {
  if (cancelled || variants.length === 0) return null;

  // Past event: show participation tracking
  if (isPastEvent) {
    return (
      <div id="event-registration">
        <EventPastParticipation eventId={eventId} variants={variants} />
      </div>
    );
  }

  return (
    <div
      id="event-registration"
      className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
    >
      <EventRegistration
        eventId={eventId}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
        hasRegistrations={hasRegistrations}
        variants={registrationVariants}
        registrationFieldSettings={registrationFieldSettings}
      />
    </div>
  );
}

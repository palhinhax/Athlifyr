"use client";

import { useState } from "react";
import Image from "next/image";
import { EventInviteFriendsModal } from "@/components/event-invite-friends-modal";
import { EventLocationCard } from "./event-location-card";
import { StravaRouteEmbed } from "./strava-route-embed";
import { EventImageLightbox } from "@/components/event-image-lightbox";
import { EventWeather } from "@/components/event-weather";
import { EventFeaturedVenue } from "@/components/event-featured-venue";
import { EventParticipationCard } from "@/components/event-participation-card";
import { RelatedEvents } from "@/components/related-events";
import type { EventRegistrationProps } from "@/components/event-registration/event-registration-types";
import { SportType } from "@prisma/client";
import { useTranslations } from "next-intl";

interface FeaturedVenue {
  id: string;
  slug: string;
  name: string;
  type: string;
  logo: string | null;
  city: string | null;
  country: string;
  services?: string[];
  _count?: {
    recommendations: number;
    reviews: number;
  };
}

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

interface EventSidebarProps {
  readonly event: {
    readonly id: string;
    readonly title: string;
    readonly slug: string;
    readonly imageUrl: string | null;
    readonly startDate: Date;
    readonly endDate: Date | null;
    readonly city: string;
    readonly country: string;
    readonly latitude: number | null;
    readonly longitude: number | null;
    readonly googleMapsUrl: string | null;
    readonly stravaRouteEmbed: string | null;
    readonly sportTypes: string[];
    readonly cancelled: boolean;
    readonly featuredVenue?: FeaturedVenue | null;
  };
  readonly variants?: Array<{
    id: string;
    name: string;
    distanceKm: number | null;
    startDate?: Date | string | null;
    startTime?: string | null;
  }>;
  readonly weather?: Array<{
    date: Date;
    temperature: number;
    condition: string;
    humidity: number | null;
    windSpeed: number | null;
    icon: string | null;
  }>;
  readonly friendsGoing?: Array<{
    id: string;
    name: string | null;
    image: string | null;
  }>;
  readonly friendsGoingCount?: number;
  readonly hasRegistrations?: boolean;
  readonly registrationVariants?: EventRegistrationProps["variants"];
  readonly registrationFieldSettings?: Record<string, string>;
  readonly relatedEvents?: RelatedEvent[];
  readonly relatedEventsTitle?: string;
}

export function EventSidebar({
  event,
  variants = [],
  weather,
  friendsGoing = [],
  friendsGoingCount = 0,
  hasRegistrations = false,
  registrationVariants = [],
  registrationFieldSettings,
  relatedEvents = [],
  relatedEventsTitle,
}: EventSidebarProps) {
  const t = useTranslations("events");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const hasImage =
    event.imageUrl && event.imageUrl !== "/placeholder-event.jpg";

  // Check if event has already happened (end of event day must have passed)
  const eventEndDate = new Date(event.endDate || event.startDate);
  eventEndDate.setHours(23, 59, 59, 999);
  const isPastEvent = eventEndDate < new Date();

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-[7.5rem] space-y-8">
          {/* Weather Widget Card */}
          {weather && weather.length > 0 && (
            <EventWeather weather={weather} isPastEvent={isPastEvent} />
          )}

          {/* Location Card */}
          {event.latitude && event.longitude && (
            <EventLocationCard
              latitude={event.latitude}
              longitude={event.longitude}
              title={event.title}
              city={event.city}
              country={event.country}
              googleMapsUrl={event.googleMapsUrl}
              sportTypes={event.sportTypes}
            />
          )}

          {/* Featured Venue Card */}
          {event.featuredVenue && (
            <EventFeaturedVenue venue={event.featuredVenue} />
          )}

          {/* Participation Card */}
          <EventParticipationCard
            eventId={event.id}
            eventSlug={event.slug}
            eventTitle={event.title}
            hasRegistrations={hasRegistrations}
            variants={variants}
            registrationVariants={registrationVariants}
            cancelled={event.cancelled}
            isPastEvent={isPastEvent}
            registrationFieldSettings={registrationFieldSettings}
          />

          {/* Related Events Carousel */}
          {relatedEvents.length > 0 && (
            <RelatedEvents events={relatedEvents} title={relatedEventsTitle} />
          )}

          {/* Who's Going + Invite Friends */}
          <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <h4 className="text-on-surface-variant mb-6 text-xs font-bold uppercase tracking-widest">
              {t("sidebar.whoIsGoing")}
            </h4>

            {friendsGoingCount > 0 && (
              <>
                {/* Avatar stack */}
                <div className="mb-6 flex -space-x-3">
                  {friendsGoing.slice(0, 4).map((friend) => (
                    <div
                      key={friend.id}
                      className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-4 border-white"
                    >
                      {friend.image ? (
                        <Image
                          src={friend.image}
                          alt={friend.name || ""}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-on-primary-container flex h-full w-full items-center justify-center bg-primary-container text-xs font-bold">
                          {friend.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                  ))}
                  {friendsGoingCount > 4 && (
                    <div className="text-on-primary-container flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary-container text-xs font-bold">
                      +{friendsGoingCount - 4}
                    </div>
                  )}
                </div>

                {/* Friend mention text */}
                <p className="text-on-surface-variant mb-6 text-sm">
                  <strong>{friendsGoing[0]?.name}</strong>{" "}
                  {friendsGoingCount === 1
                    ? t("sidebar.friendSignedUpSuffix")
                    : t("sidebar.friendsSignedUpSuffix", {
                        count: friendsGoingCount - 1,
                      })}
                </p>
              </>
            )}

            {/* Invite Friends button */}
            <button
              onClick={() => setIsInviteOpen(true)}
              className="w-full rounded-xl border-2 border-primary py-4 font-bold text-primary transition-colors hover:bg-primary/5"
            >
              {t("sidebar.inviteFriends")}
            </button>
          </div>

          {/* Strava Route Embed */}
          {event.stravaRouteEmbed && (
            <div className="overflow-hidden rounded-2xl">
              <StravaRouteEmbed embedCode={event.stravaRouteEmbed} />
            </div>
          )}
        </div>
      </aside>

      {/* Lightbox */}
      {hasImage && isLightboxOpen && (
        <EventImageLightbox
          imageUrl={event.imageUrl!}
          title={event.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}

      {/* Invite Friends Modal */}
      <EventInviteFriendsModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        eventId={event.id}
        eventTitle={event.title}
        eventSlug={event.slug}
      />
    </>
  );
}

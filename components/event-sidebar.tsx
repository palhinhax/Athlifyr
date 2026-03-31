"use client";

import { useState } from "react";
import { ExternalLink, Bookmark } from "lucide-react";
import { EventLocationMap } from "./event-location-map";
import { StravaRouteEmbed } from "./strava-route-embed";
import { EventImageLightbox } from "@/components/event-image-lightbox";
import { EventWeather } from "@/components/event-weather";
import { EventFeaturedVenue } from "@/components/event-featured-venue";
import { RelatedEvents } from "@/components/related-events";
import { FriendsGoing } from "@/components/friends-going";
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
    readonly featuredVenue?: FeaturedVenue | null;
  };
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
  readonly relatedEvents?: RelatedEvent[];
  readonly relatedEventsTitle?: string;
}

export function EventSidebar({
  event,
  weather,
  friendsGoing = [],
  friendsGoingCount = 0,
  relatedEvents = [],
  relatedEventsTitle,
}: EventSidebarProps) {
  const t = useTranslations("events");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const hasImage =
    event.imageUrl && event.imageUrl !== "/placeholder-event.jpg";

  // Check if event has already happened (end of event day must have passed)
  const eventEndDate = new Date(event.endDate || event.startDate);
  eventEndDate.setHours(23, 59, 59, 999);
  const isPastEvent = eventEndDate < new Date();

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-6">
          {/* Weather Widget Card */}
          {weather && weather.length > 0 && (
            <div className="overflow-hidden rounded-2xl shadow-sm">
              <EventWeather weather={weather} isPastEvent={isPastEvent} />
            </div>
          )}

          {/* Location Card */}
          {event.latitude && event.longitude && (
            <div className="overflow-hidden rounded-2xl bg-card p-6 shadow-sm">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t("locationTitle")}
              </h4>
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl">
                <EventLocationMap
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                  sportTypes={event.sportTypes}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.city}, {event.country}
                  </p>
                </div>
                <a
                  href={
                    event.googleMapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border py-3 text-sm font-bold transition-colors hover:bg-muted"
                >
                  {t("openInGoogleMaps")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Featured Venue Card */}
          {event.featuredVenue && (
            <EventFeaturedVenue venue={event.featuredVenue} />
          )}

          {/* Who's Going / Friends Going */}
          {friendsGoingCount > 0 && (
            <div className="rounded-2xl bg-card p-6 shadow-sm sm:p-8">
              <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t("sidebar.whoIsGoing")}
              </h4>
              <FriendsGoing
                friends={friendsGoing}
                totalCount={friendsGoingCount}
              />
            </div>
          )}

          {/* Strava Route Embed */}
          {event.stravaRouteEmbed && (
            <div className="overflow-hidden rounded-2xl">
              <StravaRouteEmbed embedCode={event.stravaRouteEmbed} />
            </div>
          )}

          {/* Share & Save Buttons */}
          <div className="flex gap-4">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-card py-4 font-bold shadow-sm transition-all hover:bg-muted">
              <Bookmark className="h-5 w-5" />
              {t("sidebar.save")}
            </button>
          </div>

          {/* Related Events Carousel */}
          {relatedEvents.length > 0 && (
            <RelatedEvents events={relatedEvents} title={relatedEventsTitle} />
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
    </>
  );
}

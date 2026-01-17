"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/event-utils";
import { EventLocationMap } from "./event-location-map";
import { StravaRouteEmbed } from "./strava-route-embed";
import { EventImageLightbox } from "@/components/event-image-lightbox";
import { useTranslations, useLocale } from "next-intl";

interface EventSidebarProps {
  event: {
    title: string;
    imageUrl: string | null;
    startDate: Date;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    googleMapsUrl: string | null;
    stravaRouteEmbed: string | null;
    sportTypes: string[];
  };
}

export function EventSidebar({ event }: EventSidebarProps) {
  const t = useTranslations("events");
  const locale = useLocale();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const hasImage =
    event.imageUrl && event.imageUrl !== "/placeholder-event.jpg";

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-4 space-y-6">
          {/* Event Image Card */}
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10"
              onClick={() => hasImage && setIsLightboxOpen(true)}
              style={{ cursor: hasImage ? "pointer" : "default" }}
            >
              <Image
                src={event.imageUrl || "/placeholder-event.jpg"}
                alt={event.title}
                fill
                className="object-cover object-center transition-transform duration-300 hover:scale-105"
                sizes="400px"
              />
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-semibold">{event.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.startDate, locale)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {event.city}, {event.country}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Card */}
          {event.latitude && event.longitude && (
            <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
              <div className="p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t("locationTitle")}
                </h3>
              </div>
              <div className="relative aspect-[4/3] w-full">
                <EventLocationMap
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                  sportTypes={event.sportTypes}
                />
              </div>
              <div className="p-4">
                {event.googleMapsUrl ? (
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("openInGoogleMaps")}
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("openInGoogleMaps")}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Strava Route Embed */}
          {event.stravaRouteEmbed && (
            <div className="mb-6">
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
    </>
  );
}

"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { EventLocationMap } from "./event-location-map";
import { useTranslations } from "next-intl";

interface EventLocationMobileProps {
  latitude: number;
  longitude: number;
  title: string;
  city: string;
  country: string;
  googleMapsUrl: string | null;
}

export function EventLocationMobile({
  latitude,
  longitude,
  title,
  city,
  country,
  googleMapsUrl,
}: EventLocationMobileProps) {
  const t = useTranslations("events");

  return (
    <div className="mb-8 overflow-hidden rounded-lg border bg-card shadow-sm lg:hidden">
      <div className="p-4">
        <h3 className="mb-1 flex items-center gap-2 font-semibold">
          <MapPin className="h-5 w-5 text-primary" />
          {t("locationTitle")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {city}, {country}
        </p>
      </div>
      <div className="relative aspect-video w-full">
        <EventLocationMap
          latitude={latitude}
          longitude={longitude}
          title={title}
        />
      </div>
      <div className="p-4">
        {googleMapsUrl ? (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4" />
            {t("openInGoogleMaps")}
          </a>
        ) : (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
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
  );
}

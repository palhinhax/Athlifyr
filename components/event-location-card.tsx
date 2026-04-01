"use client";

import { ExternalLink } from "lucide-react";
import { EventLocationMap } from "./event-location-map";
import { useTranslations } from "next-intl";

interface EventLocationCardProps {
  readonly latitude: number;
  readonly longitude: number;
  readonly title: string;
  readonly city: string;
  readonly country: string;
  readonly googleMapsUrl: string | null;
  readonly sportTypes: string[];
  /** Tailwind height class for the map container. Defaults to "h-40". */
  readonly mapHeightClass?: string;
  /** Extra classes on the outer wrapper. */
  readonly className?: string;
}

export function EventLocationCard({
  latitude,
  longitude,
  title,
  city,
  country,
  googleMapsUrl,
  sportTypes,
  mapHeightClass = "h-40",
  className,
}: EventLocationCardProps) {
  const t = useTranslations("events");

  const mapsUrl =
    googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_8px_32px_rgba(0,0,0,0.04)] ${className ?? ""}`}
    >
      <div className="p-6">
        <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("locationTitle")}
        </h4>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">
          {city}, {country}
        </p>
      </div>
      <div
        className={`relative w-full overflow-hidden bg-surface-container ${mapHeightClass}`}
      >
        <EventLocationMap
          latitude={latitude}
          longitude={longitude}
          title={title}
          sportTypes={sportTypes}
        />
      </div>
      <div className="p-6">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-surface-container-high py-3 text-sm font-bold transition-colors hover:bg-surface-container-low"
        >
          {t("openInGoogleMaps")}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

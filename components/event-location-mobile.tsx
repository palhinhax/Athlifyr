"use client";

import { EventLocationCard } from "./event-location-card";

interface EventLocationMobileProps {
  latitude: number;
  longitude: number;
  title: string;
  city: string;
  country: string;
  googleMapsUrl: string | null;
  sportTypes: string[];
}

export function EventLocationMobile({
  latitude,
  longitude,
  title,
  city,
  country,
  googleMapsUrl,
  sportTypes,
}: EventLocationMobileProps) {
  return (
    <EventLocationCard
      latitude={latitude}
      longitude={longitude}
      title={title}
      city={city}
      country={country}
      googleMapsUrl={googleMapsUrl}
      sportTypes={sportTypes}
      mapHeightClass="aspect-video"
      className="lg:hidden"
    />
  );
}

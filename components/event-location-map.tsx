"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface EventLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  sportTypes?: string[];
  zoom?: number;
}

// Dynamic import to avoid SSR issues with Leaflet
const MapClient = dynamic(() => import("./event-location-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border bg-muted">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  ),
});

export function EventLocationMap(props: EventLocationMapProps) {
  return <MapClient {...props} />;
}

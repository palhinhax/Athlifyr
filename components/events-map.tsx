"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { SportType } from "@prisma/client";

export interface MapEvent {
  id: string;
  title: string;
  slug: string;
  sportTypes: SportType[];
  startDate: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
}

interface EventsMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
}

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./events-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[600px] items-center justify-center rounded-lg border bg-muted">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export function EventsMap(props: EventsMapProps) {
  return <MapComponent {...props} />;
}

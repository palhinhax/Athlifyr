"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { LatLngBounds } from "leaflet";
import { SportType } from "@prisma/client";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamic imports para evitar SSR issues com Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

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

// Componente para lidar com eventos do mapa
function MapEventsHandler({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
}) {
  const [map, setMap] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      const { useMapEvents } = await import("react-leaflet");

      const MapEvents = () => {
        const mapInstance = useMapEvents({
          moveend: () => {
            onBoundsChange(mapInstance.getBounds());
          },
          zoomend: () => {
            onBoundsChange(mapInstance.getBounds());
          },
        });

        useEffect(() => {
          // Trigger inicial
          onBoundsChange(mapInstance.getBounds());
        }, [mapInstance]);

        return null;
      };

      setMap(<MapEvents />);
    };

    loadMap();
  }, [onBoundsChange]);

  return map;
}

export function EventsMap({
  initialCenter = [39.5, -8.0], // Centro de Portugal
  initialZoom = 7,
}: EventsMapProps) {
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch events para o bounds atual
  const fetchEvents = useCallback(async (bounds: LatLngBounds) => {
    try {
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();

      const params = new URLSearchParams({
        north: north.toString(),
        south: south.toString(),
        east: east.toString(),
        west: west.toString(),
      });

      const response = await fetch(`/api/events/map?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle bounds change com debounce
  const handleBoundsChange = useCallback(
    (bounds: LatLngBounds) => {
      // Clear timer anterior
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set novo timer (debounce de 300ms)
      debounceTimerRef.current = setTimeout(() => {
        fetchEvents(bounds);
      }, 300);
    },
    [fetchEvents]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Fix Leaflet icon issue with Next.js
  useEffect(() => {
    (async function init() {
      const L = await import("leaflet");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground">
          {error}
        </div>
      )}

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventsHandler onBoundsChange={handleBoundsChange} />

        {events.map((event) => (
          <Marker key={event.id} position={[event.latitude, event.longitude]}>
            <Popup>
              <div className="min-w-[200px] space-y-2">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.startDate).toLocaleDateString("pt-PT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">{event.city}</p>
                <div className="flex flex-wrap gap-1">
                  {event.sportTypes.map((sport) => (
                    <span
                      key={sport}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                <a
                  href={`/events/${event.slug}`}
                  className="mt-2 inline-block w-full rounded-md bg-primary px-3 py-1.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Ver Evento
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Event count badge */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-background/90 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm">
        {events.length} {events.length === 1 ? "evento" : "eventos"}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L, { DivIcon } from "leaflet";
import { Loader2 } from "lucide-react";
import type { LatLngBounds } from "leaflet";
import type { MapEvent } from "./events-map";
import type { MapFilters } from "./map-filters";
import {
  getSportIcon,
  getSportColors,
  getPrimarySport,
} from "@/lib/sport-config";

// Create custom icon based on sport type
const createCustomIcon = (sportTypes: string[]): DivIcon => {
  const primarySport = getPrimarySport(sportTypes);
  const icon = getSportIcon(primarySport);
  const colors = getSportColors(primarySport);

  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${colors.solid};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 3px solid white;
      ">
        <span style="
          font-size: 20px;
          transform: rotate(45deg);
          display: block;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
        ">${icon}</span>
      </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface EventsMapClientProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  filters?: MapFilters;
}

// Component to handle map events
function MapEventsHandler({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    },
    load: () => {
      onBoundsChange(map.getBounds());
    },
  });

  // Initial bounds fetch
  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

export default function EventsMapClient({
  initialCenter = [39.5, -8.0], // Default fallback (will be overridden by server-detected center)
  initialZoom = 7,
  filters: initialFilters,
}: EventsMapClientProps) {
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters | undefined>(
    initialFilters
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mapBoundsRef = useRef<LatLngBounds | null>(null);

  // Listen for filter changes from MapFilters component
  useEffect(() => {
    const handleFiltersChange = (event: Event) => {
      const customEvent = event as CustomEvent<MapFilters>;
      setFilters(customEvent.detail);
    };

    window.addEventListener(
      "mapFiltersChange",
      handleFiltersChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "mapFiltersChange",
        handleFiltersChange as EventListener
      );
    };
  }, []);

  // Refetch events when filters change
  useEffect(() => {
    if (mapBoundsRef.current) {
      fetchEvents(mapBoundsRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Fetch events for the current bounds
  const fetchEvents = useCallback(
    async (bounds: LatLngBounds) => {
      try {
        // Store current bounds for filter changes
        mapBoundsRef.current = bounds;

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

        // Add filters to params
        if (filters) {
          if (filters.sports && filters.sports.length > 0) {
            params.append("sportTypes", filters.sports.join(","));
          }
          if (filters.dateRange) {
            params.append("dateRange", filters.dateRange);
          }
        }

        const response = await fetch(`/api/events/map?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data: { events: MapEvent[]; count: number } =
          await response.json();
        setEvents(data.events);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Erro ao carregar eventos");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Handle bounds change with debounce
  const handleBoundsChange = useCallback(
    (bounds: LatLngBounds) => {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer (debounce of 300ms)
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventsHandler onBoundsChange={handleBoundsChange} />

        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={createCustomIcon(event.sportTypes)}
          >
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
                  className="mt-2 inline-block w-full rounded-md bg-primary px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-primary/90"
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

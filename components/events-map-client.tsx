"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Loader2 } from "lucide-react";
import type { LatLngBounds } from "leaflet";
import type { MapEvent } from "./events-map";
import { useMapFilters } from "@/lib/hooks/use-map-filters";
import { MapFiltersPanel } from "./map-filters-panel";

// Fix Leaflet default icon issue
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface EventsMapClientProps {
  initialCenter?: [number, number];
  initialZoom?: number;
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
  initialCenter = [39.5, -8.0], // Portugal center
  initialZoom = 7,
}: EventsMapClientProps) {
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get filters from hook
  const {
    filters,
    updateFilters,
    resetFilters,
    isLoading: filtersLoading,
    isSaving,
  } = useMapFilters();

  // Fetch events for the current bounds with filters
  const fetchEvents = useCallback(
    async (bounds: LatLngBounds) => {
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

        // Add filter params
        if (filters.sportIds.length > 0) {
          filters.sportIds.forEach((sport) => {
            params.append("sportType", sport);
          });
        }

        if (filters.textSearch) {
          params.set("search", filters.textSearch);
        }

        if (filters.showPastEvents) {
          params.set("showPast", "true");
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
      {(loading || filtersLoading) && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground">
          {error}
        </div>
      )}

      {/* Filters Panel */}
      <MapFiltersPanel
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
        isSaving={isSaving}
      />

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
            icon={customIcon}
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
      <div className="absolute bottom-4 right-4 z-[1000] rounded-lg bg-background/90 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm">
        {events.length} {events.length === 1 ? "evento" : "eventos"}
      </div>
    </div>
  );
}

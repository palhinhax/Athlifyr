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
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LatLngBounds } from "leaflet";
import { Link } from "@/i18n/routing";

// Create custom icon for venues
const createVenueIcon = (): DivIcon => {
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: hsl(var(--primary));
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 3px solid white;
      ">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          style="transform: rotate(45deg);"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface MapVenue {
  id: string;
  slug: string;
  name: string;
  type: string;
  city: string | null;
  country: string;
  latitude: number;
  longitude: number;
}

interface VenuesMapClientProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  filters?: {
    types: string[];
  };
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

  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

export default function VenuesMapClient({
  initialCenter = [39.5, -8.0],
  initialZoom = 7,
  filters: initialFilters,
}: VenuesMapClientProps) {
  const [venues, setVenues] = useState<MapVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ types: string[] } | undefined>(
    initialFilters
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mapBoundsRef = useRef<LatLngBounds | null>(null);

  useEffect(() => {
    const handleFiltersChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ types: string[] }>;
      setFilters(customEvent.detail);
    };

    window.addEventListener(
      "venueMapFiltersChange",
      handleFiltersChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "venueMapFiltersChange",
        handleFiltersChange as EventListener
      );
    };
  }, []);

  const fetchVenues = useCallback(
    async (bounds: LatLngBounds) => {
      try {
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

        if (filters?.types && filters.types.length > 0) {
          filters.types.forEach((type) => params.append("types", type));
        }

        const response = await fetch(`/api/venues/map?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();
        setVenues(data.venues || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError(err instanceof Error ? err.message : "Failed to load venues");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    if (mapBoundsRef.current) {
      fetchVenues(mapBoundsRef.current);
    }
  }, [filters, fetchVenues]);

  const handleBoundsChange = useCallback(
    (bounds: LatLngBounds) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchVenues(bounds);
      }, 500);
    },
    [fetchVenues]
  );

  if (typeof window === "undefined") {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
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

        {venues.map((venue) => {
          const position: [number, number] = [venue.latitude, venue.longitude];
          return (
            <Marker key={venue.id} position={position} icon={createVenueIcon()}>
              <Popup>
                <div className="min-w-[200px] p-2">
                  <h3 className="mb-2 font-semibold">{venue.name}</h3>
                  {venue.city && (
                    <p className="mb-2 text-sm text-muted-foreground">
                      <MapPin className="mr-1 inline h-3 w-3" />
                      {venue.city}, {venue.country}
                    </p>
                  )}
                  <Link href={`/venues/${venue.slug}`}>
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm">Loading venues...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 z-10 rounded-lg bg-destructive/90 p-4 text-sm text-destructive-foreground">
          {error}
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-10 rounded-lg bg-background/90 p-2 text-xs text-muted-foreground shadow-md">
        {venues.length} venue{venues.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}

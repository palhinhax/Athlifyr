"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import type { LatLngBounds } from "leaflet";

// Create custom icon for venues
const createVenueIcon = (): L.DivIcon => {
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
    services: string[];
  };
}

export default function VenuesMapClient({
  initialCenter = [39.5, -8.0],
  initialZoom = 7,
  filters: initialFilters,
}: VenuesMapClientProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const mapInitializedRef = useRef(false);

  const [venues, setVenues] = useState<MapVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ services: string[] } | undefined>(
    initialFilters
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapBoundsRef = useRef<LatLngBounds | null>(null);
  const filtersRef = useRef(filters);

  // Keep filtersRef in sync
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Mount gate to avoid double initialization
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for filter changes
  useEffect(() => {
    const handleFiltersChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ services: string[] }>;
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

  // Fetch venues for the current bounds (stable function using ref for filters)
  const fetchVenues = useCallback(
    async (bounds: LatLngBounds) => {
      try {
        mapBoundsRef.current = bounds;
        const currentFilters = filtersRef.current;

        const params = new URLSearchParams({
          north: bounds.getNorth().toString(),
          south: bounds.getSouth().toString(),
          east: bounds.getEast().toString(),
          west: bounds.getWest().toString(),
        });

        if (currentFilters?.services?.length) {
          currentFilters.services.forEach((service) =>
            params.append("services", service)
          );
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
    [] // No dependencies - uses refs
  );

  // Refetch when filters change
  useEffect(() => {
    if (mapBoundsRef.current) {
      fetchVenues(mapBoundsRef.current);
    }
  }, [filters, fetchVenues]);

  // Handle bounds change with debounce (stable function)
  const handleBoundsChange = useCallback(
    (bounds: LatLngBounds) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        fetchVenues(bounds);
      }, 300);
    },
    [fetchVenues]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Initialize map ONCE
  useEffect(() => {
    if (!mounted || !mapContainerRef.current || mapInitializedRef.current) {
      return;
    }

    // Mark as initialized to prevent re-initialization
    mapInitializedRef.current = true;

    // Clean up any existing map instance first
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
    });

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Create a layer group for markers
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Set up event handlers for bounds changes
    const onMoveEnd = () => handleBoundsChange(map.getBounds());
    map.on("moveend", onMoveEnd);
    map.on("zoomend", onMoveEnd);

    // Initial fetch
    handleBoundsChange(map.getBounds());

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersLayerRef.current = null;
      mapInitializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]); // Only depend on mounted - map should initialize once

  // Update markers when venues change
  useEffect(() => {
    if (!markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Get locale from pathname
    const locale = pathname.split("/")[1] || "pt";

    // Add new markers
    venues.forEach((venue) => {
      const marker = L.marker([venue.latitude, venue.longitude], {
        icon: createVenueIcon(),
      });

      marker.bindPopup(`
        <div style="min-width: 200px; padding: 8px;">
          <h3 style="font-weight: 600; margin-bottom: 8px;">${venue.name}</h3>
          ${venue.city ? `<p style="color: #666; font-size: 14px; margin-bottom: 8px;">📍 ${venue.city}, ${venue.country}</p>` : ""}
          <a href="/${locale}/venues/${venue.slug}" 
             style="display: inline-block; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; text-align: center; width: 100%;">
            View Details
          </a>
        </div>
      `);

      marker.addTo(markersLayerRef.current!);
    });
  }, [venues, pathname]);

  // Prevent rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/50">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm">Loading venues...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] rounded-lg bg-destructive/90 p-4 text-sm text-destructive-foreground">
          {error}
        </div>
      )}

      <div
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      />

      {/* Venue count badge */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-background/90 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm">
        {venues.length} venue{venues.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}

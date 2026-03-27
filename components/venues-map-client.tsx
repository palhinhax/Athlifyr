"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2 } from "lucide-react";
import { createVenueMarkerHtml } from "@/lib/venue-icons";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

/** Mapbox bounds as a simple object for our fetch logic */
interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Get marker size based on zoom level
 * - Zoom <= 6: Small markers (24px)
 * - Zoom 7-9: Medium markers (32px)
 * - Zoom 10-12: Normal markers (40px)
 * - Zoom >= 13: Large markers (48px)
 */
function getMarkerSizeForZoom(zoom: number): number {
  if (zoom <= 6) return 24;
  if (zoom <= 9) return 32;
  if (zoom <= 12) return 40;
  return 48;
}

interface MapVenue {
  id: string;
  slug: string;
  name: string;
  type: string;
  city: string | null;
  country: string;
  latitude: number;
  longitude: number;
  services?: string[];
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
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapInitializedRef = useRef(false);

  const [venues, setVenues] = useState<MapVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ services: string[] } | undefined>(
    initialFilters
  );
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapBoundsRef = useRef<MapBounds | null>(null);
  const filtersRef = useRef(filters);

  // Sync filters state when props change
  useEffect(() => {
    const newServicesStr = JSON.stringify(initialFilters?.services || []);
    const currentServicesStr = JSON.stringify(filters?.services || []);

    if (newServicesStr !== currentServicesStr) {
      setFilters(initialFilters);
    }
  }, [initialFilters, filters?.services]);

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

  /** Extract bounds from the Mapbox map */
  const getMapBounds = useCallback((): MapBounds | null => {
    const map = mapInstanceRef.current;
    if (!map) return null;
    const bounds = map.getBounds();
    if (!bounds) return null;
    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };
  }, []);

  // Fetch venues for the current bounds (stable function using ref for filters)
  const fetchVenues = useCallback(
    async (bounds: MapBounds) => {
      try {
        mapBoundsRef.current = bounds;
        const currentFilters = filtersRef.current;

        const params = new URLSearchParams({
          north: bounds.north.toString(),
          south: bounds.south.toString(),
          east: bounds.east.toString(),
          west: bounds.west.toString(),
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
  const handleBoundsChange = useCallback(() => {
    const bounds = getMapBounds();
    if (!bounds) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchVenues(bounds);
    }, 300);
  }, [fetchVenues, getMapBounds]);

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

    mapInitializedRef.current = true;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-8.0, 39.5], // Mapbox uses [lng, lat]
      zoom: initialZoom,
      accessToken: MAPBOX_TOKEN,
    });

    // Use provided initialCenter (which is [lat, lng]) converted to [lng, lat]
    if (initialCenter[0] !== 39.5 || initialCenter[1] !== -8.0) {
      map.setCenter([initialCenter[1], initialCenter[0]]);
    }

    mapInstanceRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocation control: centers on user location + blue dot
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      fitBoundsOptions: { maxZoom: 10 },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.addControl(geolocateControl, "bottom-right");

    const onMoveEnd = () => handleBoundsChange();
    const onZoomEnd = () => {
      handleBoundsChange();
      const zoom = map.getZoom();
      setCurrentZoom(zoom);
    };
    map.on("moveend", onMoveEnd);
    map.on("zoomend", onZoomEnd);

    // Initial fetch after map loads, then trigger geolocation
    map.on("load", () => {
      handleBoundsChange();
      geolocateControl.trigger();
    });

    return () => {
      // Clear all markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      mapInitializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]); // Only depend on mounted - map should initialize once

  // Update markers when venues or zoom change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Get locale from pathname
    const locale = pathname.split("/")[1] || "pt";

    // Get marker size based on current zoom
    const markerSize = getMarkerSizeForZoom(currentZoom);

    // Add new markers
    venues.forEach((venue) => {
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      markerEl.innerHTML = createVenueMarkerHtml(venue.services, markerSize);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="min-width: 200px; padding: 8px;">
          <h3 style="font-weight: 600; margin-bottom: 8px;">${venue.name}</h3>
          ${venue.city ? `<p style="color: #666; font-size: 14px; margin-bottom: 8px;">📍 ${venue.city}, ${venue.country}</p>` : ""}
          <a href="/${locale}/venues/${venue.slug}" 
             style="display: inline-block; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; text-align: center; width: 100%;">
            View Details
          </a>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([venue.longitude, venue.latitude])
        .setPopup(popup)
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });
  }, [venues, pathname, currentZoom]);

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

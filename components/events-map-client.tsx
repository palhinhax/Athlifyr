"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2 } from "lucide-react";
import type { SportType } from "@prisma/client";
import type { MapFilters } from "./map-filters";
import {
  getSportIcon,
  getSportColors,
  getPrimarySport,
} from "@/lib/sport-config";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

/** Mapbox bounds as a simple object for our fetch logic */
interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

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

interface EventsMapClientProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  filters?: MapFilters;
}

export default function EventsMapClient({
  initialCenter = [39.5, -8.0],
  initialZoom = 7,
  filters: initialFilters,
}: EventsMapClientProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapInitializedRef = useRef(false);

  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters | undefined>(
    initialFilters
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapBoundsRef = useRef<MapBounds | null>(null);
  const filtersRef = useRef(filters);

  // Keep refs in sync
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Sync prop filters to state (for when parent changes dates/sports)
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Mount gate to avoid double initialization
  useEffect(() => {
    setMounted(true);
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

  // Fetch events for the current bounds (stable function using ref for filters)
  const fetchEvents = useCallback(
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

        if (currentFilters?.sports?.length) {
          params.append("sportTypes", currentFilters.sports.join(","));
        }

        if (currentFilters?.startDate) {
          params.append("startDate", currentFilters.startDate);
        }
        if (currentFilters?.endDate) {
          params.append("endDate", currentFilters.endDate);
        }
        if (currentFilters?.dateRange) {
          params.append("dateRange", currentFilters.dateRange);
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
    [] // No dependencies - uses refs
  );

  // Refetch events when filters change
  useEffect(() => {
    if (mapBoundsRef.current) {
      fetchEvents(mapBoundsRef.current);
    }
  }, [filters, fetchEvents]);

  // Handle bounds change with debounce (stable function)
  const handleBoundsChange = useCallback(() => {
    const bounds = getMapBounds();
    if (!bounds) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchEvents(bounds);
    }, 300);
  }, [fetchEvents, getMapBounds]);

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

    map.on("moveend", handleBoundsChange);
    map.on("zoomend", handleBoundsChange);

    // Initial fetch after map loads
    map.on("load", handleBoundsChange);

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

  // Update markers when events change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Get locale from pathname
    const locale = pathname.split("/")[1] || "pt";

    // Add new markers
    events.forEach((event) => {
      const primarySport = getPrimarySport(event.sportTypes);
      const icon = getSportIcon(primarySport);
      const colors = getSportColors(primarySport);

      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      markerEl.innerHTML = `
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
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="min-width: 200px; padding: 8px;">
          <h3 style="font-weight: 600; margin-bottom: 8px;">${event.title}</h3>
          <p style="color: #666; font-size: 14px; margin-bottom: 4px;">
            ${new Date(event.startDate).toLocaleDateString("pt-PT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p style="color: #666; font-size: 14px; margin-bottom: 8px;">${event.city}</p>
          <a href="/${locale}/events/${event.slug}" 
             style="display: inline-block; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; text-align: center; width: 100%;">
            Ver Evento
          </a>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });
  }, [events, pathname]);

  // Prevent rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {error && (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground">
          {error}
        </div>
      )}

      <div
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      />

      {/* Event count badge */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-background/90 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm">
        {events.length} {events.length === 1 ? "evento" : "eventos"}
      </div>
    </div>
  );
}

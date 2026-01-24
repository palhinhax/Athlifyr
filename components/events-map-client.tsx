"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import type { LatLngBounds } from "leaflet";
import type { MapEvent } from "./events-map";
import type { MapFilters } from "./map-filters";
import {
  getSportIcon,
  getSportColors,
  getPrimarySport,
} from "@/lib/sport-config";

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
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const mapInitializedRef = useRef(false);

  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters | undefined>(
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

  // Fetch events for the current bounds (stable function using ref for filters)
  const fetchEvents = useCallback(
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

        if (currentFilters?.sports?.length) {
          params.append("sportTypes", currentFilters.sports.join(","));
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
  const handleBoundsChange = useCallback(
    (bounds: LatLngBounds) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
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

  // Initialize map ONCE (following event-location-map-client.tsx pattern)
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

  // Update markers when events change
  useEffect(() => {
    if (!markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add new markers
    events.forEach((event) => {
      const primarySport = getPrimarySport(event.sportTypes);
      const icon = getSportIcon(primarySport);
      const colors = getSportColors(primarySport);

      const customIcon = L.divIcon({
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

      // Get locale from pathname
      const locale = pathname.split("/")[1] || "pt";

      const marker = L.marker([event.latitude, event.longitude], {
        icon: customIcon,
      });

      marker.bindPopup(`
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

      marker.addTo(markersLayerRef.current!);
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

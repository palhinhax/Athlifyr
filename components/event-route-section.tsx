"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { StravaRouteEmbed } from "./strava-route-embed";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteVariant {
  id: string;
  name: string;
  distanceKm: number | null;
  elevationGainM: number | null;
}

interface RouteData {
  gpxData: string | null;
  routePoints: [number, number][];
  distanceKm: number | null;
  elevationGainM: number | null;
  elevationLossM: number | null;
}

interface EventRouteSectionProps {
  readonly eventId: string;
  readonly variants: RouteVariant[];
  readonly stravaRouteEmbed: string | null;
}

export function EventRouteSection({
  eventId,
  variants,
  stravaRouteEmbed,
}: EventRouteSectionProps) {
  const t = useTranslations("events.route");
  const [activeVariantId, setActiveVariantId] = useState(variants[0]?.id ?? "");
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeVariant = variants.find((v) => v.id === activeVariantId);

  const fetchRoute = useCallback(
    async (variantId: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/events/${eventId}/variants/${variantId}/route`
        );
        if (res.ok) {
          const data = await res.json();
          setRouteData(data.route);
        } else {
          setRouteData(null);
        }
      } catch {
        setRouteData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  useEffect(() => {
    if (activeVariantId) {
      fetchRoute(activeVariantId);
    }
  }, [activeVariantId, fetchRoute]);

  const handleDownloadGpx = () => {
    if (!routeData?.gpxData) return;
    const blob = new Blob([routeData.gpxData], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeVariant?.name ?? "route"}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const elevationGain =
    routeData?.elevationGainM ?? activeVariant?.elevationGainM;

  // Build a simple elevation profile clip-path from route points
  const elevationClipPath = useElevationClipPath(routeData);

  const hasRouteContent =
    stravaRouteEmbed || routeData?.routePoints?.length || isLoading;

  if (!hasRouteContent && !isLoading) return null;

  return (
    <section id="percurso">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <h2 className="font-headline text-3xl font-extrabold">{t("title")}</h2>
        {variants.length > 1 && (
          <div className="w-full overflow-x-auto">
            <div className="inline-flex w-max rounded-xl bg-surface-container-high p-1">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setActiveVariantId(variant.id)}
                  className={`flex-shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all sm:px-6 sm:py-2.5 ${
                    variant.id === activeVariantId
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {routeData?.gpxData && (
          <button
            onClick={handleDownloadGpx}
            className="flex items-center justify-center gap-2 rounded-xl border border-surface-container-highest bg-white px-6 py-3 font-bold text-primary shadow-sm transition-all hover:shadow-md"
          >
            <Download className="h-5 w-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Download GPX</span>
            <span className="whitespace-nowrap text-xs font-normal text-muted-foreground">
              ({activeVariant?.name})
            </span>
          </button>
        )}
      </div>

      {/* Map / Embed Area */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-[32px] border-4 border-white bg-surface-container shadow-inner">
        {isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {!isLoading && stravaRouteEmbed && (
          <div className="h-full w-full">
            <StravaRouteEmbed embedCode={stravaRouteEmbed} />
          </div>
        )}

        {!isLoading &&
          !stravaRouteEmbed &&
          routeData?.routePoints &&
          routeData.routePoints.length > 0 && (
            <RouteMap routePoints={routeData.routePoints} />
          )}

        {/* Elevation overlay */}
        {elevationGain && (
          <div className="absolute bottom-8 left-8 right-8 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
            <div className="glass-panel w-full max-w-sm rounded-2xl border border-white/40 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest">
                  {t("elevation")}
                </h4>
                <span className="text-[10px] font-bold text-primary">
                  Max: {elevationGain}m
                </span>
              </div>
              <div className="relative h-16 w-full overflow-hidden rounded-lg bg-primary/10">
                <div
                  className="absolute inset-0 bg-primary/30"
                  style={{ clipPath: elevationClipPath }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="glass-panel flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs font-bold">{t("finish")}</span>
              </div>
              <div className="glass-panel flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-xs font-bold">{t("start")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Mapbox GL route map showing the route polyline with start/finish markers.
 * Uses outdoors-v12 style for terrain context.
 */
function RouteMap({
  routePoints,
}: {
  readonly routePoints: [number, number][];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || routePoints.length < 2) return;

    // Clean up previous map instance
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch {
        // Ignore removal errors (Strict Mode double-invoke)
      }
      mapRef.current = null;
    }

    // routePoints are [lat, lng] — Mapbox uses [lng, lat]
    const coordinates: [number, number][] = routePoints.map((p) => [
      p[1],
      p[0],
    ]);

    const bounds = coordinates.reduce(
      (b, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    );

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      bounds,
      fitBoundsOptions: { padding: 60 },
      accessToken: MAPBOX_TOKEN,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Force resize after tiles load so canvas fills the container
      map.resize();

      // Route line
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#E85D04",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      // Start marker (red)
      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(coordinates[0])
        .addTo(map);

      // Finish marker (green)
      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat(coordinates[coordinates.length - 1])
        .addTo(map);

      // Re-fit bounds after resize
      map.fitBounds(bounds, { padding: 60 });
    });

    // Also observe container resize
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      try {
        map.remove();
      } catch {
        // Ignore removal errors (Strict Mode double-invoke)
      }
      mapRef.current = null;
    };
  }, [mounted, routePoints]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

/**
 * Generate a clip-path polygon for a simple elevation profile
 * from the raw route points (using latitude changes as a proxy for elevation).
 * If no route data, returns a generic mountain-like profile.
 */
function useElevationClipPath(routeData: RouteData | null): string {
  if (!routeData?.routePoints || routeData.routePoints.length < 3) {
    // Fallback decorative profile
    return "polygon(0 100%, 10% 80%, 20% 90%, 30% 60%, 40% 75%, 50% 40%, 60% 55%, 70% 20%, 80% 45%, 90% 10%, 100% 100%)";
  }

  // Sample ~20 points from the route for the elevation profile
  const points = routeData.routePoints;
  const sampleCount = Math.min(20, points.length);
  const step = Math.max(1, Math.floor(points.length / sampleCount));

  // Use latitude as a proxy for elevation variation (visual effect only)
  const sampled: number[] = [];
  for (let i = 0; i < points.length; i += step) {
    sampled.push(points[i][0]);
  }

  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;

  const polygonPoints = sampled
    .map((val, i) => {
      const x = ((i / (sampled.length - 1)) * 100).toFixed(1);
      const y = (100 - ((val - min) / range) * 80).toFixed(1);
      return `${x}% ${y}%`;
    })
    .join(", ");

  return `polygon(0 100%, ${polygonPoints}, 100% 100%)`;
}

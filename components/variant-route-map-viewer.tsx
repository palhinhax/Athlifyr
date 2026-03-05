"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";
import type { RouteCheckpoint } from "@/components/route-map-editor";

const RouteMapEditor = dynamic(() => import("@/components/route-map-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[250px] items-center justify-center rounded-lg bg-muted">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface VariantRouteData {
  routePoints: [number, number][];
  distanceKm: number | null;
  elevationGainM: number | null;
  elevationLossM: number | null;
  checkpoints: RouteCheckpoint[];
}

interface VariantRouteMapViewerProps {
  variantId: string;
  eventId: string;
}

/**
 * A lightweight read-only map that fetches and displays a variant's route
 * (polyline + checkpoints) on the public event page.
 * Only renders when the component scrolls into view (lazy).
 */
export function VariantRouteMapViewer({
  variantId,
  eventId,
}: VariantRouteMapViewerProps) {
  const [route, setRoute] = useState<VariantRouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRoute, setHasRoute] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRoute() {
      try {
        const res = await fetch(
          `/api/events/${eventId}/variants/${variantId}/route`
        );
        if (!res.ok) {
          setHasRoute(false);
          return;
        }
        const data = (await res.json()) as { route: VariantRouteData | null };

        if (cancelled) return;

        if (
          !data.route ||
          ((data.route.routePoints?.length ?? 0) === 0 &&
            (data.route.checkpoints?.length ?? 0) === 0)
        ) {
          setHasRoute(false);
          return;
        }

        setRoute(data.route);
        setHasRoute(true);
      } catch {
        setHasRoute(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [eventId, variantId]);

  // Don't render anything if there's no route
  if (hasRoute === false) return null;

  if (loading) {
    return (
      <div className="mt-3 flex h-[200px] items-center justify-center rounded-lg bg-muted">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!route) return null;

  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        <span>Percurso</span>
        {route.checkpoints.length > 0 && (
          <span>· {route.checkpoints.length} postos</span>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border">
        <RouteMapEditor
          routePoints={route.routePoints}
          checkpoints={route.checkpoints}
          editable={false}
          height={220}
        />
      </div>
    </div>
  );
}

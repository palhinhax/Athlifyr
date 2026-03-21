"use client";

import { useState, useEffect, useCallback } from "react";
import { Mountain, Clock, ChevronDown, Route, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import type { RouteCheckpoint } from "@/components/route-map-editor";

const RouteMapEditor = dynamic(() => import("@/components/route-map-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[250px] items-center justify-center rounded-lg bg-muted">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
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

interface VariantData {
  id: string;
  name: string;
  distanceKm: number | null;
  description: string | null;
  elevationGainM: number | null;
  elevationLossM: number | null;
  cutoffTimeHours: number | null;
  itraPoints: number | null;
  atrpGrade: number | null;
  startTime: string | null;
}

interface VariantLabels {
  elevationGain: string;
  cutoffTime: string;
  soldOut?: string;
  showRoute?: string;
  hideRoute?: string;
}

interface VariantCardWithMapProps {
  variant: VariantData;
  isSoldOut: boolean;
  labels: VariantLabels;
  eventId?: string;
}

export function VariantCardWithMap({
  variant,
  isSoldOut,
  labels,
  eventId,
}: VariantCardWithMapProps) {
  const [hasRoute, setHasRoute] = useState<boolean | null>(null);
  const [route, setRoute] = useState<VariantRouteData | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  // Check if route data exists (lightweight check)
  useEffect(() => {
    if (!eventId) {
      setHasRoute(false);
      return;
    }

    let cancelled = false;

    async function checkRoute() {
      try {
        const res = await fetch(
          `/api/events/${eventId}/variants/${variant.id}/route`
        );
        if (!res.ok) {
          if (!cancelled) {
            setHasRoute(false);
          }
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
        } else {
          setHasRoute(true);
          setRoute(data.route);
        }
      } catch {
        if (!cancelled) {
          setHasRoute(false);
        }
      }
    }

    void checkRoute();
    return () => {
      cancelled = true;
    };
  }, [eventId, variant.id]);

  const toggleMap = useCallback(() => {
    setMapExpanded((prev) => !prev);
  }, []);

  // If card has route → full row (col-span-full)
  const cardClassName = hasRoute === true ? "col-span-full" : "";

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${isSoldOut ? "opacity-60" : ""} ${cardClassName}`}
    >
      {/* Header row: name + key stats + price */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {/* Variant name */}
        <h3 className="text-sm font-semibold sm:text-base">{variant.name}</h3>

        {/* Sold out badge */}
        {isSoldOut && (
          <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
            {labels.soldOut}
          </span>
        )}

        {/* Inline stats */}
        <div className="flex flex-wrap items-center gap-1.5">
          {variant.distanceKm && (
            <span className="inline-flex items-center gap-1 rounded-full bg-p-brand/5 px-2 py-0.5 text-[11px] font-medium text-p-brand">
              <Route className="h-3 w-3" />
              {variant.distanceKm} km
            </span>
          )}
          {variant.elevationGainM && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Mountain className="h-3 w-3" />
              {labels.elevationGain} {variant.elevationGainM}m
            </span>
          )}
          {variant.cutoffTimeHours && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              {variant.cutoffTimeHours}h
            </span>
          )}
          {variant.startTime && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              🕐 {variant.startTime}
            </span>
          )}
          {variant.itraPoints && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              ITRA {variant.itraPoints}
            </span>
          )}
          {variant.atrpGrade && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              ATRP {variant.atrpGrade}
            </span>
          )}
        </div>
      </div>

      {/* Collapsible map toggle */}
      {hasRoute && route && (
        <div className="mt-2">
          <button
            type="button"
            onClick={toggleMap}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {mapExpanded
                ? (labels.hideRoute ?? "Ocultar percurso")
                : (labels.showRoute ?? "Ver percurso")}
            </span>
            {route.checkpoints.length > 0 && (
              <span className="text-muted-foreground/60">
                · {route.checkpoints.length} postos
              </span>
            )}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${mapExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {mapExpanded && (
            <div className="mt-2 overflow-hidden rounded-lg border">
              <RouteMapEditor
                routePoints={route.routePoints}
                checkpoints={route.checkpoints}
                editable={false}
                height={280}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

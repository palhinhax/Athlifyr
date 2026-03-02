"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE" | "TRANSITION";

export interface RouteCheckpoint {
  id?: string;
  name: string;
  type: CheckpointType;
  order: number;
  latitude: number;
  longitude: number;
  radiusM: number;
  cutoffMin: number | null;
}

interface RouteMapEditorProps {
  routePoints: [number, number][];
  checkpoints: RouteCheckpoint[];
  /** Called when user clicks the map to place a new checkpoint */
  onMapClick?: (lat: number, lng: number) => void;
  /** Called when user drags a checkpoint marker */
  onCheckpointMove?: (index: number, lat: number, lng: number) => void;
  /** Height of the map container (default: 400px) */
  height?: number;
  /** If true, clicking/dragging is enabled */
  editable?: boolean;
  /** When true, the cursor changes to crosshair to indicate click mode */
  clickMode?: boolean;
}

const CHECKPOINT_COLORS: Record<CheckpointType, string> = {
  START: "#22c55e",
  FINISH: "#ef4444",
  INTERMEDIATE: "#f59e0b",
  TRANSITION: "#8b5cf6",
};

const CHECKPOINT_LABELS: Record<CheckpointType, string> = {
  START: "P",
  FINISH: "C",
  INTERMEDIATE: "B",
  TRANSITION: "T",
};

/**
 * Creates a gate-style marker element:
 * A vertical pole with a flag/banner on top showing the type letter and name.
 */
function makeMarkerEl(
  type: CheckpointType,
  label: string,
  order: number,
  poleHeight = 14
): HTMLElement {
  const color = CHECKPOINT_COLORS[type];
  const letter = CHECKPOINT_LABELS[type];

  const el = document.createElement("div");
  el.className = "checkpoint-gate";
  el.title = label;
  el.style.cssText = `cursor: ${label ? "move" : "pointer"}; user-select: none;`;

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;position:relative;">
      <!-- Banner / flag -->
      <div style="
        background: ${color};
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        border: 2px solid white;
        display: flex;
        align-items: center;
        gap: 4px;
        line-height: 1.3;
        min-width: 32px;
        justify-content: center;
      ">
        <span style="
          display:inline-flex;
          align-items:center;
          justify-content:center;
          background:rgba(255,255,255,0.25);
          border-radius:3px;
          width:18px;
          height:18px;
          font-size:11px;
          font-weight:800;
          flex-shrink:0;
        ">${letter}${order + 1}</span>
        <span style="font-size:11px;font-weight:600;">${label}</span>
      </div>
      <!-- Pole -->
      <div style="
        width: 2px;
        height: ${poleHeight}px;
        background: ${color};
        border-radius: 0 0 1px 1px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      "></div>
      <!-- Ground pin -->
      <div style="
        width: 8px;
        height: 8px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      "></div>
    </div>
  `;
  return el;
}

/**
 * Generates a GeoJSON circle polygon (64 vertices) for a given centre and radius.
 * Used to render the geofencing zone on the map.
 */
function geoCircle(
  lng: number,
  lat: number,
  radiusM: number,
  steps = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const distRadians = radiusM / 6371000; // Earth radius in metres
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  for (let i = 0; i <= steps; i++) {
    const bearing = (2 * Math.PI * i) / steps;
    const pLat = Math.asin(
      Math.sin(latRad) * Math.cos(distRadians) +
        Math.cos(latRad) * Math.sin(distRadians) * Math.cos(bearing)
    );
    const pLng =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distRadians) * Math.cos(latRad),
        Math.cos(distRadians) - Math.sin(latRad) * Math.sin(pLat)
      );
    coords.push([(pLng * 180) / Math.PI, (pLat * 180) / Math.PI]);
  }

  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coords] },
  };
}

export default function RouteMapEditor({
  routePoints,
  checkpoints,
  onMapClick,
  onCheckpointMove,
  height = 400,
  editable = false,
  clickMode = false,
}: RouteMapEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // ─── Stable ref for onMapClick — avoids stale closure in map event listener
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    if (mapRef.current) return; // already initialised

    const center: [number, number] =
      routePoints.length > 0
        ? [routePoints[0][1], routePoints[0][0]]
        : [-8.5, 39.5]; // Portugal centre fallback

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center,
      zoom: routePoints.length > 0 ? 12 : 6,
      accessToken: MAPBOX_TOKEN,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Add route polyline source + layer
      map.addSource("route", {
        type: "geojson",
        data: buildGeoJson(routePoints),
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
          "line-opacity": 0.85,
        },
      });

      // Fit bounds to route if available
      if (routePoints.length > 1) {
        fitToRoute(map, routePoints);
      }

      // Signal that the map is fully ready for layers/sources
      setMapReady(true);
    });

    // Click to add checkpoint — uses ref to always call the latest handler
    if (editable) {
      map.on("click", (e) => {
        onMapClickRef.current?.(e.lngLat.lat, e.lngLat.lng);
      });
    }

    return () => {
      markerRefs.current.forEach((m) => m.remove());
      markerRefs.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ─── Update route polyline when routePoints changes ───────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("route") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(buildGeoJson(routePoints));
      if (routePoints.length > 1) {
        fitToRoute(map, routePoints);
      }
    }
  }, [routePoints]);

  // ─── Update cursor when clickMode changes ─────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = clickMode ? "crosshair" : "";
  }, [clickMode]);

  // ─── Sync checkpoint markers + geofence zones ─────────────────────────────
  const syncMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markerRefs.current.forEach((m) => m.remove());
    markerRefs.current = [];

    // Remove old geofence layers and sources
    checkpoints.forEach((_, idx) => {
      const layerFill = `gate-zone-fill-${idx}`;
      const layerLine = `gate-zone-line-${idx}`;
      const src = `gate-zone-${idx}`;
      if (map.getLayer(layerFill)) map.removeLayer(layerFill);
      if (map.getLayer(layerLine)) map.removeLayer(layerLine);
      if (map.getSource(src)) map.removeSource(src);
    });
    // Also clean up any leftover sources from previous renders with more checkpoints
    for (let i = checkpoints.length; i < checkpoints.length + 50; i++) {
      const layerFill = `gate-zone-fill-${i}`;
      const layerLine = `gate-zone-line-${i}`;
      const src = `gate-zone-${i}`;
      if (map.getLayer(layerFill)) map.removeLayer(layerFill);
      if (map.getLayer(layerLine)) map.removeLayer(layerLine);
      if (map.getSource(src)) map.removeSource(src);
      else break;
    }

    // ── Compute pole heights to stagger overlapping banners ─────────────
    // Checkpoints that are geographically very close get progressively taller
    // poles so the banners cascade instead of stacking on top of each other.
    const CLOSE_THRESHOLD_DEG = 0.0005; // ~55 metres
    const BASE_POLE = 14;
    const POLE_STEP = 28;
    const poleHeights: number[] = checkpoints.map(() => BASE_POLE);

    for (let i = 0; i < checkpoints.length; i++) {
      for (let j = i + 1; j < checkpoints.length; j++) {
        const dlat = Math.abs(
          checkpoints[j].latitude - checkpoints[i].latitude
        );
        const dlng = Math.abs(
          checkpoints[j].longitude - checkpoints[i].longitude
        );
        if (dlat < CLOSE_THRESHOLD_DEG && dlng < CLOSE_THRESHOLD_DEG) {
          // The later checkpoint gets a taller pole
          poleHeights[j] = Math.max(poleHeights[j], poleHeights[i] + POLE_STEP);
        }
      }
    }

    checkpoints.forEach((cp, idx) => {
      const color = CHECKPOINT_COLORS[cp.type];

      // ── Geofence circle (zone where runner must pass) ──────────────────
      const circleFeature = geoCircle(cp.longitude, cp.latitude, cp.radiusM);
      const srcId = `gate-zone-${idx}`;

      map.addSource(srcId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [circleFeature],
        },
      });

      // Fill — semi-transparent
      map.addLayer({
        id: `gate-zone-fill-${idx}`,
        type: "fill",
        source: srcId,
        paint: {
          "fill-color": color,
          "fill-opacity": 0.12,
        },
      });

      // Outline — dashed border
      map.addLayer({
        id: `gate-zone-line-${idx}`,
        type: "line",
        source: srcId,
        paint: {
          "line-color": color,
          "line-width": 2,
          "line-dasharray": [3, 2],
          "line-opacity": 0.6,
        },
      });

      // ── Gate marker (banner + pole) ────────────────────────────────────
      const el = makeMarkerEl(cp.type, cp.name, cp.order, poleHeights[idx]);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="padding:4px;">
          <div style="font-weight:600;font-size:13px;">${cp.name}</div>
          <div style="font-size:11px;color:#666;margin-top:2px;">
            Raio: ${cp.radiusM}m${cp.cutoffMin ? ` · Corte: ${cp.cutoffMin} min` : ""}
          </div>
        </div>`
      );

      // anchor: "bottom" → the bottom of the element (ground pin) sits at the coordinate
      const marker = new mapboxgl.Marker({
        element: el,
        draggable: editable,
        anchor: "bottom",
      })
        .setLngLat([cp.longitude, cp.latitude])
        .setPopup(popup)
        .addTo(map);

      if (editable && onCheckpointMove) {
        marker.on("dragend", () => {
          const { lat, lng } = marker.getLngLat();
          onCheckpointMove(idx, lat, lng);
        });
      }

      markerRefs.current.push(marker);
    });
  }, [checkpoints, editable, onCheckpointMove]);

  // ─── Run syncMarkers whenever checkpoints change AND map is ready ────────
  useEffect(() => {
    if (!mapReady) return;
    syncMarkers();
  }, [mapReady, syncMarkers]);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-lg bg-muted"
      >
        <span className="text-sm text-muted-foreground">A carregar mapa…</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%" }}
      className="overflow-hidden rounded-lg"
    />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildGeoJson(
  points: [number, number][]
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  return {
    type: "FeatureCollection",
    features:
      points.length > 1
        ? [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                // Mapbox expects [lng, lat]
                coordinates: points.map(([lat, lng]) => [lng, lat]),
              },
            },
          ]
        : [],
  };
}

function fitToRoute(map: mapboxgl.Map, points: [number, number][]) {
  const lngs = points.map(([, lng]) => lng);
  const lats = points.map(([lat]) => lat);
  map.fitBounds(
    [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ],
    { padding: 40, maxZoom: 16 }
  );
}

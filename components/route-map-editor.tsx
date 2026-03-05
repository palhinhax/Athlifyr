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

/**
 * Generates a GeoJSON LineString perpendicular to the route at a checkpoint.
 * Creates a "finish line" / "start line" effect across the route.
 *
 * @param cpLng - checkpoint longitude
 * @param cpLat - checkpoint latitude
 * @param routePoints - the full route [[lat, lng], ...]
 * @param widthM - half-width of the line in metres (extends each side)
 */
function geoGateLine(
  cpLng: number,
  cpLat: number,
  routePoints: [number, number][],
  widthM = 30
): GeoJSON.Feature<GeoJSON.LineString> {
  // Find the closest route segment to the checkpoint
  let bearing = 0;

  if (routePoints.length >= 2) {
    let minDist = Infinity;
    let closestIdx = 0;

    for (let i = 0; i < routePoints.length; i++) {
      const dlat = routePoints[i][0] - cpLat;
      const dlng = routePoints[i][1] - cpLng;
      const dist = dlat * dlat + dlng * dlng;
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }

    // Determine the bearing of the route at that point
    const prevIdx = Math.max(0, closestIdx - 1);
    const nextIdx = Math.min(routePoints.length - 1, closestIdx + 1);
    const dLat = routePoints[nextIdx][0] - routePoints[prevIdx][0];
    const dLng = routePoints[nextIdx][1] - routePoints[prevIdx][1];
    bearing = Math.atan2(dLng, dLat); // bearing of route direction
  }

  // Perpendicular bearing (90° rotated)
  const perpBearing = bearing + Math.PI / 2;

  // Calculate offset in degrees (approximate at this latitude)
  const metresToDegLat = 1 / 111320;
  const metresToDegLng = 1 / (111320 * Math.cos((cpLat * Math.PI) / 180));

  const dLat = Math.cos(perpBearing) * widthM * metresToDegLat;
  const dLng = Math.sin(perpBearing) * widthM * metresToDegLng;

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [cpLng - dLng, cpLat - dLat],
        [cpLng + dLng, cpLat + dLat],
      ],
    },
  };
}

/** Remove geofence layers and source for a given index. */
function cleanupGateZone(map: mapboxgl.Map, idx: number): boolean {
  const layerFill = `gate-zone-fill-${idx}`;
  const layerLine = `gate-zone-line-${idx}`;
  const src = `gate-zone-${idx}`;
  if (map.getLayer(layerFill)) map.removeLayer(layerFill);
  if (map.getLayer(layerLine)) map.removeLayer(layerLine);
  if (map.getSource(src)) {
    map.removeSource(src);
    return true;
  }
  return false;
}

/** Compute staggered pole heights so overlapping checkpoint banners cascade. */
function computePoleHeights(checkpoints: RouteCheckpoint[]): number[] {
  const CLOSE_THRESHOLD_DEG = 0.0005; // ~55 metres
  const BASE_POLE = 14;
  const POLE_STEP = 28;
  const heights: number[] = checkpoints.map(() => BASE_POLE);

  for (let i = 0; i < checkpoints.length; i++) {
    for (let j = i + 1; j < checkpoints.length; j++) {
      const dlat = Math.abs(checkpoints[j].latitude - checkpoints[i].latitude);
      const dlng = Math.abs(
        checkpoints[j].longitude - checkpoints[i].longitude
      );
      if (dlat < CLOSE_THRESHOLD_DEG && dlng < CLOSE_THRESHOLD_DEG) {
        heights[j] = Math.max(heights[j], heights[i] + POLE_STEP);
      }
    }
  }
  return heights;
}

/** Add the geofence zone (gate line or circle) for a checkpoint. */
function addCheckpointZone(
  map: mapboxgl.Map,
  cp: RouteCheckpoint,
  idx: number,
  routePoints: [number, number][]
): void {
  const color = CHECKPOINT_COLORS[cp.type];
  const isGateLine = cp.type === "START" || cp.type === "FINISH";
  const srcId = `gate-zone-${idx}`;

  if (isGateLine && routePoints.length >= 2) {
    const lineFeature = geoGateLine(
      cp.longitude,
      cp.latitude,
      routePoints,
      cp.radiusM
    );
    map.addSource(srcId, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [lineFeature] },
    });
    map.addLayer({
      id: `gate-zone-line-${idx}`,
      type: "line",
      source: srcId,
      paint: { "line-color": color, "line-width": 4, "line-opacity": 0.85 },
    });
  } else {
    const circleFeature = geoCircle(cp.longitude, cp.latitude, cp.radiusM);
    map.addSource(srcId, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [circleFeature] },
    });
    map.addLayer({
      id: `gate-zone-fill-${idx}`,
      type: "fill",
      source: srcId,
      paint: { "fill-color": color, "fill-opacity": 0.12 },
    });
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
  }
}

/** Create and add a checkpoint marker to the map. */
function addCheckpointMarker(
  map: mapboxgl.Map,
  cp: RouteCheckpoint,
  idx: number,
  poleHeight: number,
  editable: boolean,
  onCheckpointMove?: (index: number, lat: number, lng: number) => void
): mapboxgl.Marker {
  const el = makeMarkerEl(cp.type, cp.name, cp.order, poleHeight);

  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<div style="padding:4px;">
      <div style="font-weight:600;font-size:13px;">${cp.name}</div>
      <div style="font-size:11px;color:#666;margin-top:2px;">
        Raio: ${cp.radiusM}m${cp.cutoffMin ? ` · Corte: ${cp.cutoffMin} min` : ""}
      </div>
    </div>`
  );

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

  return marker;
}

export default function RouteMapEditor({
  routePoints,
  checkpoints,
  onMapClick,
  onCheckpointMove,
  height = 400,
  editable = false,
  clickMode = false,
}: Readonly<RouteMapEditorProps>) {
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
    if (!map?.isStyleLoaded()) return;

    const source = map.getSource("route");
    (source as mapboxgl.GeoJSONSource)?.setData(buildGeoJson(routePoints));
    if (routePoints.length > 1) {
      fitToRoute(map, routePoints);
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
    checkpoints.forEach((_, idx) => cleanupGateZone(map, idx));
    for (let i = checkpoints.length; i < checkpoints.length + 50; i++) {
      if (!cleanupGateZone(map, i)) break;
    }

    const poleHeights = computePoleHeights(checkpoints);

    checkpoints.forEach((cp, idx) => {
      addCheckpointZone(map, cp, idx, routePoints);
      const marker = addCheckpointMarker(
        map,
        cp,
        idx,
        poleHeights[idx],
        editable,
        onCheckpointMove
      );
      markerRefs.current.push(marker);
    });
  }, [checkpoints, editable, onCheckpointMove, routePoints]);

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

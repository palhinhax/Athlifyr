"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: number;
  altitude?: number;
  speed?: number;
}

interface ActivityMapProps {
  track: GpsPoint[];
  className?: string;
}

export function ActivityMapClient({ track, className }: ActivityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || track.length < 2) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const coordinates: [number, number][] = track.map((pt) => [pt.lng, pt.lat]);

    // Calculate bounds
    const bounds = coordinates.reduce(
      (b, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    );

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      bounds,
      fitBoundsOptions: { padding: 50 },
      accessToken: MAPBOX_TOKEN,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Track line
      map.addSource("track", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });

      map.addLayer({
        id: "track-line",
        type: "line",
        source: "track",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
          "line-opacity": 0.85,
        },
      });

      // Start marker
      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat(coordinates[0])
        .setPopup(new mapboxgl.Popup().setText("Start"))
        .addTo(map);

      // Finish marker
      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(coordinates[coordinates.length - 1])
        .setPopup(new mapboxgl.Popup().setText("Finish"))
        .addTo(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mounted, track]);

  if (!mounted) return null;

  return (
    <div className={className}>
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-lg"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getSportIcon,
  getSportColors,
  getPrimarySport,
} from "@/lib/sport-config";
import { createVenueMarkerHtml } from "@/lib/venue-icons";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface EventLocationMapClientProps {
  latitude: number;
  longitude: number;
  title: string;
  sportTypes?: string[];
  venueServices?: string[];
  zoom?: number;
}

export default function EventLocationMapClient({
  latitude,
  longitude,
  title,
  sportTypes = ["OTHER"],
  venueServices,
  zoom = 10,
}: EventLocationMapClientProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  // Generate stable unique key for this map instance (changes with pathname to force remount)
  const mapKey = useMemo(
    () => `event-map-${pathname}-${latitude}-${longitude}-${Date.now()}`,
    [pathname, latitude, longitude]
  );

  // Mount gate to avoid double initialization
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) {
      return;
    }

    // Clean up any existing map instance first
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: zoom,
      scrollZoom: false,
      accessToken: MAPBOX_TOKEN,
    });

    mapInstanceRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Create marker element
    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";

    if (venueServices && venueServices.length > 0) {
      markerEl.innerHTML = createVenueMarkerHtml(venueServices);
    } else {
      const primarySport = getPrimarySport(sportTypes);
      const icon = getSportIcon(primarySport);
      const colors = getSportColors(primarySport);

      markerEl.innerHTML = `<div style="width:40px;height:40px;background:${colors.gradient};border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px ${colors.shadow};border:3px solid white;"><span style="font-size:20px;transform:rotate(45deg);display:block;">${icon}</span></div>`;
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div class="text-center"><h3 class="font-semibold">${title}</h3></div>`
    );

    new mapboxgl.Marker({ element: markerEl })
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted, latitude, longitude, title, sportTypes, venueServices, zoom]);

  // Prevent rendering until mounted (avoids SSR/hydration issues and HMR double-init)
  if (!mounted) {
    return null;
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-lg">
      <div
        key={mapKey}
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      />
    </div>
  );
}

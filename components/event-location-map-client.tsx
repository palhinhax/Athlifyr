"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getSportIcon,
  getSportColors,
  getPrimarySport,
} from "@/lib/sport-config";
import { createVenueMarkerHtml } from "@/lib/venue-icons";

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
  const mapInstanceRef = useRef<L.Map | null>(null);

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

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: zoom,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Use venue services icon if provided, otherwise use sport types
    let customIcon: L.DivIcon;

    if (venueServices && venueServices.length > 0) {
      // Use venue-specific icon based on services
      customIcon = L.divIcon({
        html: createVenueMarkerHtml(venueServices),
        className: "custom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    } else {
      // Use sport-based icon for events
      const primarySport = getPrimarySport(sportTypes);
      const icon = getSportIcon(primarySport);
      const colors = getSportColors(primarySport);

      customIcon = L.divIcon({
        html: `<div style="width:40px;height:40px;background:${colors.gradient};border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px ${colors.shadow};border:3px solid white;"><span style="font-size:20px;transform:rotate(45deg);display:block;">${icon}</span></div>`,
        className: "custom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    }

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<div class="text-center"><h3 class="font-semibold">${title}</h3></div>`
      );

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

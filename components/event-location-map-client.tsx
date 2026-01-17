"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import {
  getSportIcon,
  getSportColors,
  getPrimarySport,
} from "@/lib/sport-config";

// Create custom icon based on sport type
const createCustomIcon = (sportTypes: string[]): DivIcon => {
  const primarySport = getPrimarySport(sportTypes);
  const icon = getSportIcon(primarySport);
  const colors = getSportColors(primarySport);

  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${colors.gradient};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${colors.shadow};
        border: 3px solid white;
      ">
        <span style="
          font-size: 20px;
          transform: rotate(45deg);
          display: block;
        ">${icon}</span>
      </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface EventLocationMapClientProps {
  latitude: number;
  longitude: number;
  title: string;
  sportTypes?: string[];
  zoom?: number;
}

export default function EventLocationMapClient({
  latitude,
  longitude,
  title,
  sportTypes = ["OTHER"],
  zoom = 10,
}: EventLocationMapClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Create custom icon based on event sport types
  const markerIcon = createCustomIcon(sportTypes);

  return (
    <div className="h-full w-full overflow-hidden rounded-lg">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">{title}</h3>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

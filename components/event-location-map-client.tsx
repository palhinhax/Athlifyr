"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default icon issue
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface EventLocationMapClientProps {
  latitude: number;
  longitude: number;
  title: string;
  zoom?: number;
}

export default function EventLocationMapClient({
  latitude,
  longitude,
  title,
  zoom = 10,
}: EventLocationMapClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

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
        <Marker position={[latitude, longitude]} icon={customIcon}>
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

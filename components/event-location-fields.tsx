"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventLocationFieldsProps {
  latitude: string;
  longitude: string;
  googleMapsUrl: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  onGoogleMapsUrlChange: (value: string) => void;
}

export function EventLocationFields({
  latitude,
  longitude,
  googleMapsUrl,
  onLatitudeChange,
  onLongitudeChange,
  onGoogleMapsUrlChange,
}: EventLocationFieldsProps) {
  return (
    <div className="grid gap-4 rounded-lg border p-4">
      <h4 className="font-medium">Localização no Mapa</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => onLatitudeChange(e.target.value)}
            placeholder="Ex: 41.5518"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => onLongitudeChange(e.target.value)}
            placeholder="Ex: -8.4229"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="googleMapsUrl">URL do Google Maps (opcional)</Label>
        <Input
          id="googleMapsUrl"
          name="googleMapsUrl"
          value={googleMapsUrl}
          onChange={(e) => onGoogleMapsUrlChange(e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Dica: Pesquisa o local no Google Maps, clica com o botão direito e copia
        as coordenadas.
      </p>
    </div>
  );
}

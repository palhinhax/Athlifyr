"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("admin.events");

  return (
    <div className="grid gap-4 rounded-lg border p-4">
      <h4 className="font-medium">{t("locationTitle")}</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="latitude">{t("latitudeLabel")}</Label>
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
          <Label htmlFor="longitude">{t("longitudeLabel")}</Label>
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
        <Label htmlFor="googleMapsUrl">{t("googleMapsUrlLabel")}</Label>
        <Input
          id="googleMapsUrl"
          name="googleMapsUrl"
          value={googleMapsUrl}
          onChange={(e) => onGoogleMapsUrlChange(e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </div>
      <p className="text-xs text-muted-foreground">{t("locationTip")}</p>
    </div>
  );
}

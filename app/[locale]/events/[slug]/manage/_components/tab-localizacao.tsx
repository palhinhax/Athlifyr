"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { EventLocationFields } from "@/components/event-location-fields";
import { useTranslations } from "next-intl";
import type { EventDetails } from "./types";

interface TabLocalizacaoProps {
  event: EventDetails;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}

export function TabLocalizacao({ event, onSave }: TabLocalizacaoProps) {
  const t = useTranslations("manage.location");
  const tErr = useTranslations("manage.errors");

  const [city, setCity] = useState(event.city);
  const [country, setCountry] = useState(event.country);
  const [latitude, setLatitude] = useState(event.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(event.longitude?.toString() ?? "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(event.googleMapsUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        city,
        country,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        googleMapsUrl: googleMapsUrl || null,
      });
      toast({ title: t("locationSaved") });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TabsContent value="localizacao" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("cityAndCountry")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("cityPlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">{t("country")}</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t("countryPlaceholder")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <EventLocationFields
        latitude={latitude}
        longitude={longitude}
        googleMapsUrl={googleMapsUrl}
        onLatitudeChange={setLatitude}
        onLongitudeChange={setLongitude}
        onGoogleMapsUrlChange={setGoogleMapsUrl}
      />

      <div className="flex justify-end">
        <Button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("saveLocation")}
        </Button>
      </div>
    </TabsContent>
  );
}

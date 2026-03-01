"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { SportType } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { EventDetails } from "./types";

interface TabEventoProps {
  event: EventDetails;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}

const SPORT_TYPES = Object.values(SportType);

export function TabEvento({ event, onSave }: TabEventoProps) {
  const t = useTranslations("manage.event");
  const tErr = useTranslations("manage.errors");
  const tSports = useTranslations("sports");

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description ?? "");
  const [sportTypes, setSportTypes] = useState<string[]>(event.sportTypes);
  const [startDate, setStartDate] = useState(event.startDate.slice(0, 10));
  const [endDate, setEndDate] = useState(event.endDate?.slice(0, 10) ?? "");
  const [externalUrl, setExternalUrl] = useState(event.externalUrl ?? "");
  const [stravaRouteEmbed, setStravaRouteEmbed] = useState(
    event.stravaRouteEmbed ?? ""
  );
  const [imageUrl, setImageUrl] = useState(event.imageUrl ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSportType = (type: string) => {
    setSportTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "events");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { file: { url: string } };
      setImageUrl(data.file.url);
      toast({ title: t("imageUploaded") });
    } catch {
      toast({
        title: tErr("saveError"),
        description: t("imageUploadError"),
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        description,
        sportTypes,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        externalUrl: externalUrl || null,
        stravaRouteEmbed: stravaRouteEmbed || null,
        imageUrl: imageUrl || null,
      });
      toast({ title: t("eventSaved") });
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
    <TabsContent value="evento" className="space-y-6">
      {/* Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4" />
            {t("eventImage")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={t("eventImageAlt")}
              className="h-40 w-full rounded-lg object-cover"
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImageUpload(file);
            }}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="gap-2"
            >
              {isUploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {imageUrl ? t("changeImage") : t("uploadImage")}
            </Button>
            {imageUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setImageUrl("")}
              >
                {t("removeImage")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("generalInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t("eventName")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("eventNamePlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">{t("startDate")}</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">{t("endDate")}</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="externalUrl">{t("externalUrl")}</Label>
            <Input
              id="externalUrl"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder={t("externalUrlPlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stravaRouteEmbed">{t("stravaEmbed")}</Label>
            <Input
              id="stravaRouteEmbed"
              value={stravaRouteEmbed}
              onChange={(e) => setStravaRouteEmbed(e.target.value)}
              placeholder={t("stravaEmbedPlaceholder")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sport types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("sportTypes")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SPORT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleSportType(type)}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                  sportTypes.includes(type)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {tSports(type)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("saveEvent")}
        </Button>
      </div>
    </TabsContent>
  );
}

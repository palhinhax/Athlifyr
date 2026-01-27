"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { parseTimeToSeconds, formatTime } from "@/lib/performance/scoring";
import { type PerformanceEntry } from "./types";

interface EditRunDialogProps {
  entry: PerformanceEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditRunDialog({
  entry,
  open,
  onOpenChange,
  onSuccess,
}: EditRunDialogProps) {
  const t = useTranslations("performance");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [elevation, setElevation] = useState("");

  // Initialize form with entry data
  useEffect(() => {
    if (entry && open) {
      setDistance(entry.distanceKm?.toString() || "");
      setTime(entry.timeSeconds ? formatTime(entry.timeSeconds) : "");
      setDate(new Date(entry.performedAt).toISOString().split("T")[0]);
      setElevation(entry.elevationGainM?.toString() || "");
    }
  }, [entry, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const distanceKm = parseFloat(distance);
    const timeSeconds = parseTimeToSeconds(time);
    const elevationGainM = elevation ? parseInt(elevation, 10) : undefined;

    if (!distanceKm || distanceKm <= 0) {
      toast({
        title: t("error"),
        description: t("run.invalidDistance"),
        variant: "destructive",
      });
      return;
    }

    if (!timeSeconds || timeSeconds <= 0) {
      toast({
        title: t("error"),
        description: t("run.invalidTime"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/profile/performance/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "RUN",
          distanceKm,
          timeSeconds,
          performedAt: new Date(date).toISOString(),
          elevationGainM: elevationGainM || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast({
        title: t("success"),
        description: t("entries.editedSuccess"),
      });

      onSuccess();
    } catch {
      toast({
        title: t("error"),
        description: t("entries.editFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("entries.editRun")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Distance */}
          <div className="space-y-2">
            <Label htmlFor="edit-distance">{t("run.distance")} (km) *</Label>
            <Input
              id="edit-distance"
              type="number"
              step="0.01"
              min="0.1"
              placeholder="10.0"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="edit-time">{t("run.time")} *</Label>
            <Input
              id="edit-time"
              type="text"
              placeholder="45:30 ou 1:45:30"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("run.timeFormat")}
            </p>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="edit-date">{t("run.date")}</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Elevation */}
          <div className="space-y-2">
            <Label htmlFor="edit-elevation">{t("run.elevation")} (m)</Label>
            <Input
              id="edit-elevation"
              type="number"
              step="1"
              min="0"
              placeholder="150"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("entries.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("entries.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

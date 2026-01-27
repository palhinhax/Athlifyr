"use client";

import { useState } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ChevronDown } from "lucide-react";
import { parseTimeToSeconds } from "@/lib/performance/scoring";

interface AddRunDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddRunDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddRunDialogProps) {
  const t = useTranslations("performance");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [elevation, setElevation] = useState("");

  const resetForm = () => {
    setDistance("");
    setTime("");
    setDate(new Date().toISOString().split("T")[0]);
    setElevation("");
    setShowOptions(false);
  };

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
      const response = await fetch("/api/profile/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "RUN",
          distanceKm,
          timeSeconds,
          performedAt: new Date(date).toISOString(),
          ...(elevationGainM && { elevationGainM }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast({
        title: t("success"),
        description: t("run.savedSuccess"),
      });

      resetForm();
      onSuccess();
    } catch {
      toast({
        title: t("error"),
        description: t("run.saveFailed"),
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
          <DialogTitle>{t("run.addTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance">{t("run.distance")} (km) *</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="10.0"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">{t("run.time")} *</Label>
            <Input
              id="time"
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
            <Label htmlFor="date">{t("run.date")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Optional fields */}
          <Collapsible open={showOptions} onOpenChange={setShowOptions}>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="gap-1">
                {t("moreOptions")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              {/* Elevation */}
              <div className="space-y-2">
                <Label htmlFor="elevation">{t("run.elevation")} (m)</Label>
                <Input
                  id="elevation"
                  type="number"
                  min="0"
                  placeholder="500"
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

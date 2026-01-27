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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { parseTimeToSeconds, formatTime } from "@/lib/performance/scoring";
import type { HyroxEntry, HyroxCategory } from "./types";

interface EditHyroxDialogProps {
  entry: HyroxEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditHyroxDialog({
  entry,
  open,
  onOpenChange,
  onSuccess,
}: EditHyroxDialogProps) {
  const t = useTranslations("performance");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [category, setCategory] = useState<HyroxCategory>(entry.hyroxCategory);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");

  // Initialize form with entry data
  useEffect(() => {
    if (entry && open) {
      setCategory(entry.hyroxCategory);
      setTime(formatTime(entry.timeSeconds));
      setDate(new Date(entry.performedAt).toISOString().split("T")[0]);
      setEventName(entry.eventName || "");
      setLocation(entry.location || "");
    }
  }, [entry, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const timeSeconds = parseTimeToSeconds(time);
    if (timeSeconds === null || timeSeconds <= 0) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("hyrox.invalidTime"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/profile/performance/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "HYROX",
          hyroxCategory: category,
          timeSeconds,
          performedAt: new Date(date).toISOString(),
          eventName: eventName.trim() || null,
          location: location.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast({
        title: t("success"),
        description: t("entries.editedSuccess"),
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating HYROX entry:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("entries.editFailed"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("hyrox.editTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>{t("hyrox.category")}</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as HyroxCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {/* Individual */}
                <SelectItem value="OPEN_MEN">
                  {t("hyrox.categories.openMen")}
                </SelectItem>
                <SelectItem value="OPEN_WOMEN">
                  {t("hyrox.categories.openWomen")}
                </SelectItem>
                <SelectItem value="PRO_MEN">
                  {t("hyrox.categories.proMen")}
                </SelectItem>
                <SelectItem value="PRO_WOMEN">
                  {t("hyrox.categories.proWomen")}
                </SelectItem>
                <SelectItem value="ELITE_15_MEN">
                  {t("hyrox.categories.elite15Men")}
                </SelectItem>
                <SelectItem value="ELITE_15_WOMEN">
                  {t("hyrox.categories.elite15Women")}
                </SelectItem>

                {/* Doubles */}
                <SelectItem value="DOUBLES_MEN">
                  {t("hyrox.categories.doublesMen")}
                </SelectItem>
                <SelectItem value="DOUBLES_WOMEN">
                  {t("hyrox.categories.doublesWomen")}
                </SelectItem>
                <SelectItem value="DOUBLES_MIXED">
                  {t("hyrox.categories.doublesMixed")}
                </SelectItem>

                {/* Relay */}
                <SelectItem value="RELAY_MEN">
                  {t("hyrox.categories.relayMen")}
                </SelectItem>
                <SelectItem value="RELAY_WOMEN">
                  {t("hyrox.categories.relayWomen")}
                </SelectItem>
                <SelectItem value="RELAY_MIXED">
                  {t("hyrox.categories.relayMixed")}
                </SelectItem>

                {/* Age Groups */}
                <SelectItem value="AGE_GROUP_16_29_MEN">
                  {t("hyrox.categories.ageGroup1629Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_16_29_WOMEN">
                  {t("hyrox.categories.ageGroup1629Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_30_34_MEN">
                  {t("hyrox.categories.ageGroup3034Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_30_34_WOMEN">
                  {t("hyrox.categories.ageGroup3034Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_35_39_MEN">
                  {t("hyrox.categories.ageGroup3539Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_35_39_WOMEN">
                  {t("hyrox.categories.ageGroup3539Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_40_44_MEN">
                  {t("hyrox.categories.ageGroup4044Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_40_44_WOMEN">
                  {t("hyrox.categories.ageGroup4044Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_45_49_MEN">
                  {t("hyrox.categories.ageGroup4549Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_45_49_WOMEN">
                  {t("hyrox.categories.ageGroup4549Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_50_54_MEN">
                  {t("hyrox.categories.ageGroup5054Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_50_54_WOMEN">
                  {t("hyrox.categories.ageGroup5054Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_55_59_MEN">
                  {t("hyrox.categories.ageGroup5559Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_55_59_WOMEN">
                  {t("hyrox.categories.ageGroup5559Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_60_64_MEN">
                  {t("hyrox.categories.ageGroup6064Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_60_64_WOMEN">
                  {t("hyrox.categories.ageGroup6064Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_65_69_MEN">
                  {t("hyrox.categories.ageGroup6569Men")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_65_69_WOMEN">
                  {t("hyrox.categories.ageGroup6569Women")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_70_PLUS_MEN">
                  {t("hyrox.categories.ageGroup70PlusMen")}
                </SelectItem>
                <SelectItem value="AGE_GROUP_70_PLUS_WOMEN">
                  {t("hyrox.categories.ageGroup70PlusWomen")}
                </SelectItem>

                {/* Adaptive */}
                <SelectItem value="ADAPTIVE">
                  {t("hyrox.categories.adaptive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">{t("hyrox.time")}</Label>
            <Input
              id="time"
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="1:15:30"
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("hyrox.timeFormat")}
            </p>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">{t("hyrox.date")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Event Name (optional) */}
          <div className="space-y-2">
            <Label htmlFor="eventName">{t("hyrox.eventName")}</Label>
            <Input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder={t("hyrox.eventNamePlaceholder")}
            />
          </div>

          {/* Location (optional) */}
          <div className="space-y-2">
            <Label htmlFor="location">{t("hyrox.location")}</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("hyrox.locationPlaceholder")}
            />
          </div>

          {/* Submit */}
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
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("entries.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

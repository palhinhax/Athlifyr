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
import { type PerformanceEntry } from "./types";

interface EditStrengthDialogProps {
  entry: PerformanceEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditStrengthDialog({
  entry,
  open,
  onOpenChange,
  onSuccess,
}: EditStrengthDialogProps) {
  const t = useTranslations("performance");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState("");

  // Initialize form with entry data
  useEffect(() => {
    if (entry && open) {
      setWeight(entry.weightKg?.toString() || "");
      setReps(entry.reps?.toString() || "");
      setDate(new Date(entry.performedAt).toISOString().split("T")[0]);
    }
  }, [entry, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightKg = parseFloat(weight);
    const repsNum = parseInt(reps, 10);

    if (!weightKg || weightKg < 0) {
      toast({
        title: t("error"),
        description: t("strength.invalidWeight"),
        variant: "destructive",
      });
      return;
    }

    if (!repsNum || repsNum <= 0) {
      toast({
        title: t("error"),
        description: t("strength.invalidReps"),
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
          type: "STRENGTH",
          exerciseId: entry.exerciseId,
          weightKg,
          reps: repsNum,
          performedAt: new Date(date).toISOString(),
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

  // Calculate estimated 1RM
  const weightKg = parseFloat(weight) || 0;
  const repsNum = parseInt(reps, 10) || 0;
  const estimatedE1rm =
    weightKg > 0 && repsNum > 0
      ? repsNum === 1
        ? weightKg
        : weightKg * (1 + repsNum / 30)
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("entries.editStrength")}: {entry.exerciseName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="edit-weight">{t("strength.weight")} (kg) *</Label>
            <Input
              id="edit-weight"
              type="number"
              step="0.5"
              min="0"
              placeholder="80"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>

          {/* Reps */}
          <div className="space-y-2">
            <Label htmlFor="edit-reps">{t("strength.reps")} *</Label>
            <Input
              id="edit-reps"
              type="number"
              step="1"
              min="1"
              max="100"
              placeholder="5"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="edit-str-date">{t("strength.date")}</Label>
            <Input
              id="edit-str-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* E1RM Preview */}
          {estimatedE1rm > 0 && (
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm text-muted-foreground">
                {t("strength.estimatedE1rm")}
              </div>
              <div className="text-lg font-semibold">
                {estimatedE1rm.toFixed(1)} kg
              </div>
            </div>
          )}

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

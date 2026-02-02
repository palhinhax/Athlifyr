"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";
import type { TrainingPlanWithDetails } from "@/types/training-plan";

export interface TrainingPlanFormData {
  name: string;
  description?: string;
  duration?: number;
  difficulty?: number;
  isPublic: boolean;
  isTemplate: boolean;
}

interface TrainingPlanFormProps {
  plan?: TrainingPlanWithDetails;
  onSubmit: (data: TrainingPlanFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function TrainingPlanForm({
  plan,
  onSubmit,
  onCancel,
  isLoading = false,
}: TrainingPlanFormProps) {
  const t = useTranslations("workouts.plans");

  // Form state
  const [name, setName] = useState(plan?.name ?? "");
  const [description, setDescription] = useState(plan?.description ?? "");
  const [duration, setDuration] = useState<number>(plan?.duration ?? 4);
  const [difficulty, setDifficulty] = useState<number>(plan?.difficulty ?? 2);
  const [isPublic, setIsPublic] = useState(plan?.isPublic ?? false);
  const [isTemplate, setIsTemplate] = useState(plan?.isTemplate ?? false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError("Name is required");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        duration,
        difficulty,
        isPublic,
        isTemplate,
      });
    } catch {
      setSubmitError(t("errors.saveFailed"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">{t("form.name")}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("form.namePlaceholder")}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t("form.description")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("form.descriptionPlaceholder")}
          className="min-h-[100px] resize-y"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">{t("form.duration")}</Label>
          <Input
            id="duration"
            type="number"
            min={1}
            max={52}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label htmlFor="difficulty">{t("form.difficulty")}</Label>
          <Select
            value={String(difficulty)}
            onValueChange={(value) => setDifficulty(Number(value))}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder={t("form.difficulty")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t("difficulty.1")}</SelectItem>
              <SelectItem value="2">{t("difficulty.2")}</SelectItem>
              <SelectItem value="3">{t("difficulty.3")}</SelectItem>
              <SelectItem value="4">{t("difficulty.4")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="isPublic"
            checked={isPublic}
            onCheckedChange={(checked) => setIsPublic(checked === true)}
          />
          <Label htmlFor="isPublic" className="text-sm font-normal">
            {t("form.isPublic")}
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="isTemplate"
            checked={isTemplate}
            onCheckedChange={(checked) => setIsTemplate(checked === true)}
          />
          <Label htmlFor="isTemplate" className="text-sm font-normal">
            {t("form.isTemplate")}
          </Label>
        </div>
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("form.cancel")}
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          {t("form.save")}
        </Button>
      </div>
    </form>
  );
}

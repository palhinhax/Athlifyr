"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { Loader2, Plus, Search } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  category: string;
  isGlobal: boolean;
}

interface AddStrengthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddStrengthDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddStrengthDialogProps) {
  const t = useTranslations("performance");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exercise search state
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Debounced search
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const searchExercises = useCallback(async (query: string) => {
    if (query.length < 1) {
      setExercises([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/profile/performance/exercises?q=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      }
    } catch (error) {
      console.error("Error searching exercises:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (exerciseQuery && !selectedExercise) {
      searchTimeoutRef.current = setTimeout(() => {
        searchExercises(exerciseQuery);
      }, 300);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [exerciseQuery, selectedExercise, searchExercises]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setExerciseQuery("");
    setSelectedExercise(null);
    setReps("");
    setWeight("");
    setDate(new Date().toISOString().split("T")[0]);
    setExercises([]);
    setShowDropdown(false);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseQuery(exercise.name);
    setShowDropdown(false);
  };

  const handleCreateExercise = async () => {
    if (!exerciseQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/profile/performance/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: exerciseQuery.trim() }),
      });

      if (response.ok) {
        const newExercise = await response.json();
        setSelectedExercise(newExercise);
        setExerciseQuery(newExercise.name);
        setShowDropdown(false);
        toast({
          title: t("success"),
          description: t("strength.exerciseCreated"),
        });
      }
    } catch {
      toast({
        title: t("error"),
        description: t("strength.exerciseCreateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExercise) {
      toast({
        title: t("error"),
        description: t("strength.selectExercise"),
        variant: "destructive",
      });
      return;
    }

    const repsNum = parseInt(reps, 10);
    const weightNum = parseFloat(weight);

    if (!repsNum || repsNum <= 0) {
      toast({
        title: t("error"),
        description: t("strength.invalidReps"),
        variant: "destructive",
      });
      return;
    }

    if (weightNum < 0) {
      toast({
        title: t("error"),
        description: t("strength.invalidWeight"),
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
          type: "STRENGTH",
          exerciseId: selectedExercise.id,
          reps: repsNum,
          weightKg: weightNum || 0,
          performedAt: new Date(date).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast({
        title: t("success"),
        description: t("strength.savedSuccess"),
      });

      resetForm();
      onSuccess();
    } catch {
      toast({
        title: t("error"),
        description: t("strength.saveFailed"),
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
          <DialogTitle>{t("strength.addTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exercise Search */}
          <div className="space-y-2">
            <Label htmlFor="exercise">{t("strength.exercise")} *</Label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="exercise"
                  type="text"
                  placeholder={t("strength.searchExercise")}
                  value={exerciseQuery}
                  onChange={(e) => {
                    setExerciseQuery(e.target.value);
                    setSelectedExercise(null);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="pl-10"
                  autoComplete="off"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                )}
              </div>

              {/* Dropdown */}
              {showDropdown && exerciseQuery && !selectedExercise && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
                  {exercises.length > 0 ? (
                    <ul className="max-h-60 overflow-auto py-1">
                      {exercises.map((exercise) => (
                        <li
                          key={exercise.id}
                          className="cursor-pointer px-3 py-2 hover:bg-accent"
                          onClick={() => handleExerciseSelect(exercise)}
                        >
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {exercise.category}
                            {exercise.isGlobal && " • Global"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : !isSearching ? (
                    <div className="p-3">
                      <p className="mb-2 text-sm text-muted-foreground">
                        {t("strength.noExerciseFound")}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCreateExercise}
                        className="w-full gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        {t("strength.createExercise", { name: exerciseQuery })}
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            {selectedExercise && (
              <p className="text-xs text-green-600">
                ✓ {selectedExercise.name}
              </p>
            )}
          </div>

          {/* Reps */}
          <div className="space-y-2">
            <Label htmlFor="reps">{t("strength.reps")} *</Label>
            <Input
              id="reps"
              type="number"
              min="1"
              placeholder="8"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">{t("strength.weight")} (kg) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.5"
              min="0"
              placeholder="60"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("strength.weightHint")}
            </p>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">{t("strength.date")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
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

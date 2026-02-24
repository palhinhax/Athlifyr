"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Search,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { ExerciseCategory } from "@prisma/client";
import { useDebounce } from "@/hooks/use-debounce";

interface ExerciseTranslation {
  id: string;
  language: string;
  name: string;
  aliases: string[];
  description?: string | null;
}

interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  category: ExerciseCategory;
  isGlobal: boolean;
  createdById: string | null;
  translations?: ExerciseTranslation[];
  // Measurement fields
  hasReps: boolean;
  hasWeight: boolean;
  hasDistance: boolean;
  hasTime: boolean;
  hasCalories: boolean;
  hasHeight: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface AdminExercisesClientProps {
  initialExercises: Exercise[];
  initialPagination: PaginationData;
}

const categoryColors: Record<ExerciseCategory, string> = {
  CROSSFIT: "bg-p-brand/10 text-p-brand border-p-brand/20",
  GYM: "bg-p-info/10 text-p-info border-p-info/20",
  WEIGHTLIFTING: "bg-primary/10 text-primary border-primary/20",
  BODYWEIGHT: "bg-p-golden/10 text-p-golden border-p-golden/20",
  CARDIO: "bg-destructive/10 text-destructive border-destructive/20",
  OTHER: "bg-muted text-muted-foreground border-muted",
};

export function AdminExercisesClient({
  initialExercises,
  initialPagination,
}: AdminExercisesClientProps) {
  const t = useTranslations("exercises");
  const locale = useLocale();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [pagination, setPagination] =
    useState<PaginationData>(initialPagination);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | "ALL"
  >("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Measurement fields for editing
  const [editHasReps, setEditHasReps] = useState(false);
  const [editHasWeight, setEditHasWeight] = useState(false);
  const [editHasDistance, setEditHasDistance] = useState(false);
  const [editHasTime, setEditHasTime] = useState(false);
  const [editHasCalories, setEditHasCalories] = useState(false);
  const [editHasHeight, setEditHasHeight] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchExercises = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          locale: locale,
          includeMetrics: "true", // Request metrics fields
        });

        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        if (selectedCategory !== "ALL") {
          params.append("category", selectedCategory);
        }

        const response = await fetch(`/api/exercises?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to fetch exercises (${response.status})`
          );
        }

        const data = await response.json();
        setExercises(data.exercises);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar exercícios",
          description:
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os exercícios.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, selectedCategory, locale, toast]
  );

  useEffect(() => {
    fetchExercises(1);
  }, [fetchExercises]);

  const handlePageChange = (newPage: number) => {
    fetchExercises(newPage);
  };

  // Helper function to get translated name or fallback to default (English)
  const getExerciseName = (exercise: Exercise): string => {
    if (exercise.translations && exercise.translations.length > 0) {
      return exercise.translations[0].name;
    }
    return exercise.name;
  };

  // Open edit dialog
  const handleEditClick = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditHasReps(exercise.hasReps);
    setEditHasWeight(exercise.hasWeight);
    setEditHasDistance(exercise.hasDistance);
    setEditHasTime(exercise.hasTime);
    setEditHasCalories(exercise.hasCalories);
    setEditHasHeight(exercise.hasHeight);
    setEditDialogOpen(true);
  };

  // Save measurement fields
  const handleSaveMetrics = async () => {
    if (!editingExercise) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/exercises/${editingExercise.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasReps: editHasReps,
          hasWeight: editHasWeight,
          hasDistance: editHasDistance,
          hasTime: editHasTime,
          hasCalories: editHasCalories,
          hasHeight: editHasHeight,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update exercise");
      }

      // Update local state
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === editingExercise.id
            ? {
                ...ex,
                hasReps: editHasReps,
                hasWeight: editHasWeight,
                hasDistance: editHasDistance,
                hasTime: editHasTime,
                hasCalories: editHasCalories,
                hasHeight: editHasHeight,
              }
            : ex
        )
      );

      toast({
        title: t("measurementsSaved"),
        description: t("measurementsSavedDesc"),
      });

      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving metrics:", error);
      toast({
        title: t("errors.saveFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const categories: (ExerciseCategory | "ALL")[] = [
    "ALL",
    "CROSSFIT",
    "GYM",
    "WEIGHTLIFTING",
    "BODYWEIGHT",
    "CARDIO",
    "OTHER",
  ];

  // Render measurement badges for an exercise
  const renderMeasurementBadges = (exercise: Exercise) => {
    const measurements = [];
    if (exercise.hasReps) measurements.push("Reps");
    if (exercise.hasWeight) measurements.push("Weight");
    if (exercise.hasDistance) measurements.push("Distance");
    if (exercise.hasTime) measurements.push("Time");
    if (exercise.hasCalories) measurements.push("Calories");
    if (exercise.hasHeight) measurements.push("Height");

    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {measurements.map((m) => (
          <Badge key={m} variant="secondary" className="text-xs">
            {m}
          </Badge>
        ))}
        {measurements.length === 0 && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {t("noMeasurements")}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            disabled={isLoading}
          >
            {t(`categories.${category}`)}
          </Button>
        ))}
      </div>

      {/* Exercises Grid */}
      {exercises.length === 0 && !isLoading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">{t("noExercises")}</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t("noExercisesDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exercises.map((exercise) => {
                const displayName = getExerciseName(exercise);

                return (
                  <Card
                    key={exercise.id}
                    className="group transition-colors hover:border-primary/50"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{displayName}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={categoryColors[exercise.category]}
                          >
                            {t(`categories.${exercise.category}`)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => handleEditClick(exercise)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {exercise.isGlobal && (
                        <Badge variant="secondary" className="mb-2">
                          {t("global")}
                        </Badge>
                      )}
                      {renderMeasurementBadges(exercise)}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("previous")}
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.page - 2 && page <= pagination.page + 2)
              )
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={pagination.page === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            {t("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results count */}
      <p className="text-center text-sm text-muted-foreground">
        {t("showingResults", {
          start: (pagination.page - 1) * pagination.limit + 1,
          end: Math.min(
            pagination.page * pagination.limit,
            pagination.totalCount
          ),
          total: pagination.totalCount,
        })}
      </p>

      {/* Edit Measurements Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("editMeasurements")} - {editingExercise?.name}
            </DialogTitle>
            <DialogDescription>{t("editMeasurementsDesc")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* hasReps */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasReps"
                  checked={editHasReps}
                  onCheckedChange={(checked) =>
                    setEditHasReps(checked as boolean)
                  }
                />
                <Label htmlFor="hasReps" className="cursor-pointer">
                  {t("measurements.hasReps")}
                </Label>
              </div>

              {/* hasWeight */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasWeight"
                  checked={editHasWeight}
                  onCheckedChange={(checked) =>
                    setEditHasWeight(checked as boolean)
                  }
                />
                <Label htmlFor="hasWeight" className="cursor-pointer">
                  {t("measurements.hasWeight")}
                </Label>
              </div>

              {/* hasDistance */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDistance"
                  checked={editHasDistance}
                  onCheckedChange={(checked) =>
                    setEditHasDistance(checked as boolean)
                  }
                />
                <Label htmlFor="hasDistance" className="cursor-pointer">
                  {t("measurements.hasDistance")}
                </Label>
              </div>

              {/* hasTime */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasTime"
                  checked={editHasTime}
                  onCheckedChange={(checked) =>
                    setEditHasTime(checked as boolean)
                  }
                />
                <Label htmlFor="hasTime" className="cursor-pointer">
                  {t("measurements.hasTime")}
                </Label>
              </div>

              {/* hasCalories */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCalories"
                  checked={editHasCalories}
                  onCheckedChange={(checked) =>
                    setEditHasCalories(checked as boolean)
                  }
                />
                <Label htmlFor="hasCalories" className="cursor-pointer">
                  {t("measurements.hasCalories")}
                </Label>
              </div>

              {/* hasHeight */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasHeight"
                  checked={editHasHeight}
                  onCheckedChange={(checked) =>
                    setEditHasHeight(checked as boolean)
                  }
                />
                <Label htmlFor="hasHeight" className="cursor-pointer">
                  {t("measurements.hasHeight")}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSaving}
            >
              <X className="mr-2 h-4 w-4" />
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveMetrics} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Plus,
  Search,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface ExercisesPageClientProps {
  initialExercises: Exercise[];
  initialPagination: PaginationData;
  canCreate?: boolean; // Only pro users can create exercises
}

const categoryColors: Record<ExerciseCategory, string> = {
  CROSSFIT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  GYM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  WEIGHTLIFTING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  BODYWEIGHT: "bg-green-500/10 text-green-500 border-green-500/20",
  CARDIO: "bg-red-500/10 text-red-500 border-red-500/20",
  OTHER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function ExercisesPageClient({
  initialExercises,
  initialPagination,
  canCreate = false,
}: ExercisesPageClientProps) {
  const t = useTranslations("exercises");
  const locale = useLocale();
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [pagination, setPagination] =
    useState<PaginationData>(initialPagination);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | "ALL"
  >("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchExercises = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          locale: locale,
        });

        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        if (selectedCategory !== "ALL") {
          params.append("category", selectedCategory);
        }

        const response = await fetch(`/api/exercises?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data = await response.json();
        setExercises(data.exercises);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, selectedCategory, locale]
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
    return exercise.name; // Fallback to default English name
  };

  // Helper function to get translated aliases or fallback to default
  const getExerciseAliases = (exercise: Exercise): string[] => {
    if (
      exercise.translations &&
      exercise.translations.length > 0 &&
      exercise.translations[0].aliases.length > 0
    ) {
      return exercise.translations[0].aliases;
    }
    return exercise.aliases; // Fallback to default English aliases
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
        {canCreate && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("createExercise")}
          </Button>
        )}
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
            {canCreate && (
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                {t("createFirst")}
              </Button>
            )}
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
                const displayAliases = getExerciseAliases(exercise);

                return (
                  <Card
                    key={exercise.id}
                    className="cursor-pointer transition-colors hover:border-primary/50"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{displayName}</CardTitle>
                        <Badge
                          variant="outline"
                          className={categoryColors[exercise.category]}
                        >
                          {t(`categories.${exercise.category}`)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {displayAliases.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {t("aliases")}: {displayAliases.join(", ")}
                        </p>
                      )}
                      {exercise.isGlobal && (
                        <Badge variant="secondary" className="mt-2">
                          {t("global")}
                        </Badge>
                      )}
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
    </div>
  );
}

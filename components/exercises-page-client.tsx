"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExerciseCategory } from "@prisma/client";

interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  category: ExerciseCategory;
  isGlobal: boolean;
  createdById: string | null;
}

interface ExercisesPageClientProps {
  exercises: Exercise[];
}

const categoryColors: Record<ExerciseCategory, string> = {
  CROSSFIT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  GYM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  WEIGHTLIFTING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  BODYWEIGHT: "bg-green-500/10 text-green-500 border-green-500/20",
  CARDIO: "bg-red-500/10 text-red-500 border-red-500/20",
  OTHER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function ExercisesPageClient({ exercises }: ExercisesPageClientProps) {
  const t = useTranslations("exercises.exercises");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | "ALL"
  >("ALL");

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.aliases.some((alias) =>
        alias.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "ALL" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("createExercise")}
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {t(`categories.${category}`)}
          </Button>
        ))}
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">{t("noExercises")}</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t("noExercisesDescription")}
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              {t("createFirst")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className={categoryColors[exercise.category]}
                  >
                    {t(`categories.${exercise.category}`)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {exercise.aliases.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {t("aliases")}: {exercise.aliases.join(", ")}
                  </p>
                )}
                {exercise.isGlobal && (
                  <Badge variant="secondary" className="mt-2">
                    {t("global")}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-center text-sm text-muted-foreground">
        {t("showingResults", { count: filteredExercises.length })}
      </p>
    </div>
  );
}

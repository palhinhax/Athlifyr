"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dumbbell, Target } from "lucide-react";
import { PerformanceStrengthChart } from "@/components/performance/performance-strength-chart";
import {
  PerformanceEntriesList,
  type PerformanceEntry,
} from "@/components/performance/performance-entries-list";

interface ChartPoint {
  date: string;
  e1rm: number;
}

interface E1rmPrediction {
  exerciseId: string;
  exerciseName: string;
  currentE1rmKg: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  inputsUsedCount: number;
}

interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  chartPoints: ChartPoint[];
  e1rmPrediction: E1rmPrediction | null;
  totalEntries: number;
}

interface PerformanceStrengthTabProps {
  exercises: ExerciseSummary[];
  totalEntries: number;
  entries: PerformanceEntry[];
  onRefresh: () => void;
}

export function PerformanceStrengthTab({
  exercises,
  totalEntries,
  entries,
  onRefresh,
}: PerformanceStrengthTabProps) {
  const t = useTranslations("performance");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    exercises[0]?.exerciseId || ""
  );

  const confidenceColors = {
    LOW: "text-orange-500",
    MEDIUM: "text-yellow-500",
    HIGH: "text-green-500",
  };

  const confidenceBgColors = {
    LOW: "bg-orange-500/10",
    MEDIUM: "bg-yellow-500/10",
    HIGH: "bg-green-500/10",
  };

  if (totalEntries === 0) {
    return (
      <div className="py-12 text-center">
        <Dumbbell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">{t("strength.noData")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("strength.noDataDesc")}
        </p>
      </div>
    );
  }

  const selectedExercise = exercises.find(
    (e) => e.exerciseId === selectedExerciseId
  );

  return (
    <div className="space-y-6">
      {/* Exercise Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          {t("strength.selectExercise")}
        </label>
        <Select
          value={selectedExerciseId}
          onValueChange={setSelectedExerciseId}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder={t("strength.selectExercise")} />
          </SelectTrigger>
          <SelectContent>
            {exercises.map((exercise) => (
              <SelectItem key={exercise.exerciseId} value={exercise.exerciseId}>
                {exercise.exerciseName} ({exercise.totalEntries})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Exercise Details */}
      {selectedExercise && (
        <>
          {/* e1RM Prediction Card */}
          {selectedExercise.e1rmPrediction && (
            <Card
              className={`p-4 ${confidenceBgColors[selectedExercise.e1rmPrediction.confidence]}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    {t("strength.estimatedE1rm")}
                  </div>
                  <div className="text-3xl font-bold">
                    {selectedExercise.e1rmPrediction.currentE1rmKg.toFixed(1)}{" "}
                    kg
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {selectedExercise.exerciseName}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${confidenceColors[selectedExercise.e1rmPrediction.confidence]}`}
                  >
                    {t(
                      `confidence.${selectedExercise.e1rmPrediction.confidence.toLowerCase()}`
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("strength.basedOn", {
                      count: selectedExercise.e1rmPrediction.inputsUsedCount,
                    })}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* e1RM Chart */}
          {selectedExercise.chartPoints.length > 1 && (
            <Card className="p-4">
              <h3 className="mb-4 font-medium">
                {t("strength.e1rmEvolution")}
              </h3>
              <PerformanceStrengthChart data={selectedExercise.chartPoints} />
            </Card>
          )}
        </>
      )}

      {/* Entries List - filtered by selected exercise */}
      <PerformanceEntriesList
        entries={entries.filter((e) => e.exerciseId === selectedExerciseId)}
        type="STRENGTH"
        onRefresh={onRefresh}
      />

      {/* Global Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalEntries}</div>
          <div className="text-sm text-muted-foreground">
            {t("strength.totalSets")}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {exercises.length}
          </div>
          <div className="text-sm text-muted-foreground">
            {t("strength.exercisesTracked")}
          </div>
        </Card>
      </div>
    </div>
  );
}

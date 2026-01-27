"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Target } from "lucide-react";
import { formatTime, formatPace } from "@/lib/performance/scoring";
import { PerformanceRunChart } from "@/components/performance/performance-run-chart";
import {
  PerformanceEntriesList,
  type PerformanceEntry,
} from "@/components/performance/performance-entries-list";

interface ChartPoint {
  date: string;
  pace: number;
  distanceKm: number;
}

interface HalfPrediction {
  predictedTimeSeconds: number;
  rangeLowSeconds: number;
  rangeHighSeconds: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  inputsUsedCount: number;
  averagePace: number;
}

interface PerformanceRunTabProps {
  chartPoints: ChartPoint[];
  halfPrediction: HalfPrediction | null;
  totalEntries: number;
  entries: PerformanceEntry[];
  onRefresh: () => void;
}

export function PerformanceRunTab({
  chartPoints,
  halfPrediction,
  totalEntries,
  entries,
  onRefresh,
}: PerformanceRunTabProps) {
  const t = useTranslations("performance");

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
        <TrendingUp className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">{t("run.noData")}</h3>
        <p className="text-sm text-muted-foreground">{t("run.noDataDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Half Marathon Prediction Card */}
      {halfPrediction && (
        <Card
          className={`p-4 ${confidenceBgColors[halfPrediction.confidence]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                {t("run.halfMarathonPrediction")}
              </div>
              <div className="text-3xl font-bold">
                {formatTime(halfPrediction.predictedTimeSeconds)}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {formatTime(halfPrediction.rangeLowSeconds)} -{" "}
                {formatTime(halfPrediction.rangeHighSeconds)}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-medium ${confidenceColors[halfPrediction.confidence]}`}
              >
                {t(`confidence.${halfPrediction.confidence.toLowerCase()}`)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t("run.basedOn", { count: halfPrediction.inputsUsedCount })}
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3" />
                {formatPace(halfPrediction.averagePace)}/km
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Pace Chart */}
      {chartPoints.length > 1 && (
        <Card className="p-4">
          <h3 className="mb-4 font-medium">{t("run.paceEvolution")}</h3>
          <PerformanceRunChart data={chartPoints} />
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalEntries}</div>
          <div className="text-sm text-muted-foreground">
            {t("run.totalRuns")}
          </div>
        </Card>
        {chartPoints.length > 0 && (
          <>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {formatPace(chartPoints[chartPoints.length - 1].pace)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("run.lastPace")}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {chartPoints[chartPoints.length - 1].distanceKm.toFixed(1)} km
              </div>
              <div className="text-sm text-muted-foreground">
                {t("run.lastDistance")}
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Entries List */}
      <PerformanceEntriesList
        entries={entries}
        type="RUN"
        onRefresh={onRefresh}
      />
    </div>
  );
}

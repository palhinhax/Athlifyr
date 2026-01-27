"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Mountain } from "lucide-react";
import { formatPace } from "@/lib/performance/scoring";
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

interface PerformanceTrailTabProps {
  chartPoints: ChartPoint[];
  totalEntries: number;
  entries: PerformanceEntry[];
  onRefresh: () => void;
}

export function PerformanceTrailTab({
  chartPoints,
  totalEntries,
  entries,
  onRefresh,
}: PerformanceTrailTabProps) {
  const t = useTranslations("performance");

  if (totalEntries === 0) {
    return (
      <div className="py-12 text-center">
        <Mountain className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">{t("trail.noData")}</h3>
        <p className="text-sm text-muted-foreground">{t("trail.noDataDesc")}</p>
      </div>
    );
  }

  // Calculate total elevation gain from entries
  const totalElevation = entries.reduce((acc, entry) => {
    return acc + (entry.elevationGainM || 0);
  }, 0);

  // Calculate total distance
  const totalDistance = entries.reduce((acc, entry) => {
    return acc + (entry.distanceKm || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Pace Chart */}
      {chartPoints.length > 1 && (
        <Card className="p-4">
          <h3 className="mb-4 font-medium">{t("trail.paceEvolution")}</h3>
          <PerformanceRunChart data={chartPoints} />
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalEntries}</div>
          <div className="text-sm text-muted-foreground">
            {t("trail.totalTrails")}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {totalDistance.toFixed(1)} km
          </div>
          <div className="text-sm text-muted-foreground">
            {t("trail.totalDistance")}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {totalElevation.toLocaleString()} m
          </div>
          <div className="text-sm text-muted-foreground">
            {t("trail.totalElevation")}
          </div>
        </Card>
        {chartPoints.length > 0 && (
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {formatPace(chartPoints[chartPoints.length - 1].pace)}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("trail.lastPace")}
            </div>
          </Card>
        )}
      </div>

      {/* Entries List */}
      <PerformanceEntriesList
        entries={entries}
        type="TRAIL"
        onRefresh={onRefresh}
      />
    </div>
  );
}

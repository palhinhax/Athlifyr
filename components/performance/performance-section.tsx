"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Footprints,
  Dumbbell,
  Plus,
  Loader2,
  Flame,
  Mountain,
} from "lucide-react";
import { PerformanceRunTab } from "@/components/performance/performance-run-tab";
import { PerformanceTrailTab } from "@/components/performance/performance-trail-tab";
import { PerformanceStrengthTab } from "@/components/performance/performance-strength-tab";
import { PerformanceHyroxTab } from "@/components/performance/performance-hyrox-tab";
import { AddRunDialog } from "@/components/performance/add-run-dialog";
import { AddStrengthDialog } from "@/components/performance/add-strength-dialog";
import { AddHyroxDialog } from "@/components/performance/add-hyrox-dialog";
import type { PerformanceEntry, HyroxEntry } from "./types";

interface PerformanceSummary {
  run: {
    chartPoints: Array<{
      date: string;
      pace: number;
      distanceKm: number;
    }>;
    halfPrediction: {
      predictedTimeSeconds: number;
      rangeLowSeconds: number;
      rangeHighSeconds: number;
      confidence: "LOW" | "MEDIUM" | "HIGH";
      inputsUsedCount: number;
      averagePace: number;
    } | null;
    totalEntries: number;
  };
  trail: {
    chartPoints: Array<{
      date: string;
      pace: number;
      distanceKm: number;
    }>;
    totalEntries: number;
  };
  strength: {
    exercises: Array<{
      exerciseId: string;
      exerciseName: string;
      chartPoints: Array<{
        date: string;
        e1rm: number;
      }>;
      e1rmPrediction: {
        exerciseId: string;
        exerciseName: string;
        currentE1rmKg: number;
        confidence: "LOW" | "MEDIUM" | "HIGH";
        inputsUsedCount: number;
      } | null;
      totalEntries: number;
    }>;
    totalEntries: number;
  };
  hyrox: {
    entries: HyroxEntry[];
    totalEntries: number;
    bestTimeByCategory: Record<
      string,
      { timeSeconds: number; performedAt: string }
    >;
  };
  entries: PerformanceEntry[];
}

export function PerformanceSection() {
  const t = useTranslations("performance");
  const [activeTab, setActiveTab] = useState<
    "run" | "trail" | "strength" | "hyrox"
  >("run");
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [showAddRun, setShowAddRun] = useState(false);
  const [showAddStrength, setShowAddStrength] = useState(false);
  const [showAddHyrox, setShowAddHyrox] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch("/api/profile/performance/summary");
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error("Error fetching performance summary:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleAddSuccess = () => {
    fetchSummary();
    setShowAddRun(false);
    setShowAddStrength(false);
    setShowAddHyrox(false);
  };

  const handleAddClick = () => {
    if (activeTab === "run" || activeTab === "trail") {
      setShowAddRun(true);
    } else if (activeTab === "strength") {
      setShowAddStrength(true);
    } else {
      setShowAddHyrox(true);
    }
  };

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Footprints className="h-6 w-6 text-primary" />
          {t("title")}
        </h2>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("add")}
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "run" | "trail" | "strength" | "hyrox")
          }
        >
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger
              value="run"
              className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Footprints className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.run")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="trail"
              className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Mountain className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.trail")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="strength"
              className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Dumbbell className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.strength")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="hyrox"
              className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Flame className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{t("tabs.hyrox")}</span>
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="run">
                <PerformanceRunTab
                  chartPoints={summary?.run.chartPoints || []}
                  halfPrediction={summary?.run.halfPrediction || null}
                  totalEntries={summary?.run.totalEntries || 0}
                  entries={summary?.entries || []}
                  onRefresh={fetchSummary}
                />
              </TabsContent>

              <TabsContent value="trail">
                <PerformanceTrailTab
                  chartPoints={summary?.trail?.chartPoints || []}
                  totalEntries={summary?.trail?.totalEntries || 0}
                  entries={summary?.entries || []}
                  onRefresh={fetchSummary}
                />
              </TabsContent>

              <TabsContent value="strength">
                <PerformanceStrengthTab
                  exercises={summary?.strength.exercises || []}
                  totalEntries={summary?.strength.totalEntries || 0}
                  entries={summary?.entries || []}
                  onRefresh={fetchSummary}
                />
              </TabsContent>

              <TabsContent value="hyrox">
                <PerformanceHyroxTab
                  entries={summary?.hyrox?.entries || []}
                  totalEntries={summary?.hyrox?.totalEntries || 0}
                  bestTimeByCategory={summary?.hyrox?.bestTimeByCategory || {}}
                  onRefresh={fetchSummary}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddRunDialog
        open={showAddRun}
        onOpenChange={setShowAddRun}
        onSuccess={handleAddSuccess}
      />

      <AddStrengthDialog
        open={showAddStrength}
        onOpenChange={setShowAddStrength}
        onSuccess={handleAddSuccess}
      />

      <AddHyroxDialog
        open={showAddHyrox}
        onOpenChange={setShowAddHyrox}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Activity } from "lucide-react";
import { ScorePillarBar } from "./workout-score-card";
import { cn } from "@/lib/utils";

interface HybridScoreData {
  totalScore: number;
  breakdown: {
    strength: number;
    endurance: number;
    engine: number;
  };
  confidence: "LOW" | "MEDIUM" | "HIGH";
  calculatedAt: string;
}

interface HybridScoreCardProps {
  className?: string;
}

/**
 * Displays the user's Hybrid Score card on the profile page.
 * Fetches data from the hybrid-score API endpoint.
 */
export function HybridScoreCard({ className }: HybridScoreCardProps) {
  const t = useTranslations("scoring");
  const [data, setData] = useState<HybridScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScore = useCallback(async () => {
    try {
      const response = await fetch("/api/profile/hybrid-score");
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (error) {
      console.error("Error fetching hybrid score:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-lg border bg-card p-6 shadow-sm",
          className
        )}
      >
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="mt-4 h-10 w-20 rounded bg-muted" />
        <div className="mt-4 space-y-3">
          <div className="h-4 rounded bg-muted" />
          <div className="h-4 rounded bg-muted" />
          <div className="h-4 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!data || data.totalScore === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">{t("hybridScore")}</h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{t("noDataYet")}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">{t("hybridScore")}</h3>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            data.confidence === "HIGH" &&
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            data.confidence === "MEDIUM" &&
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            data.confidence === "LOW" &&
              "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          )}
        >
          {t(`confidence.${data.confidence}`)}
        </span>
      </div>

      {/* Total score */}
      <div className="mb-4">
        <span className="text-3xl font-bold tabular-nums">
          {data.totalScore}
        </span>
        <span className="text-sm text-muted-foreground"> / 1000</span>
      </div>

      {/* Pillar bars */}
      <div className="space-y-3">
        <ScorePillarBar
          label={t("pillars.strength")}
          value={data.breakdown.strength}
          colorClass="bg-red-500"
        />
        <ScorePillarBar
          label={t("pillars.endurance")}
          value={data.breakdown.endurance}
          colorClass="bg-blue-500"
        />
        <ScorePillarBar
          label={t("pillars.engine")}
          value={data.breakdown.engine}
          colorClass="bg-amber-500"
        />
      </div>
    </div>
  );
}

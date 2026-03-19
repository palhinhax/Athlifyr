"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ScorePillarBarProps {
  label: string;
  value: number;
  maxValue?: number;
  colorClass?: string;
}

/**
 * A horizontal bar that visualises a single score pillar (0-1000).
 */
export function ScorePillarBar({
  label,
  value,
  maxValue = 1000,
  colorClass = "bg-primary",
}: ScorePillarBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colorClass
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─── Workout Score Card ─────────────────────────────────────────────────────

interface WorkoutScoreBreakdown {
  strength: number;
  endurance: number;
  engine: number;
  volumeBonus: number;
  prBonus: number;
}

interface WorkoutScoreCardProps {
  totalScore: number;
  breakdown: WorkoutScoreBreakdown;
  highlights?: string[];
  className?: string;
}

/**
 * Displays the Workout Score breakdown for a single workout log.
 */
export function WorkoutScoreCard({
  totalScore,
  breakdown,
  highlights,
  className,
}: WorkoutScoreCardProps) {
  const t = useTranslations("scoring");

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
    >
      {/* Total score */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("workoutScore")}</h3>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums">{totalScore}</span>
          <span className="text-xs text-muted-foreground"> / 1000</span>
        </div>
      </div>

      {/* Pillar bars */}
      <div className="space-y-3">
        <ScorePillarBar
          label={t("pillars.strength")}
          value={breakdown.strength}
          colorClass="bg-red-500"
        />
        <ScorePillarBar
          label={t("pillars.endurance")}
          value={breakdown.endurance}
          colorClass="bg-blue-500"
        />
        <ScorePillarBar
          label={t("pillars.engine")}
          value={breakdown.engine}
          colorClass="bg-amber-500"
        />
      </div>

      {/* Bonuses */}
      {(breakdown.volumeBonus > 0 || breakdown.prBonus > 0) && (
        <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
          {breakdown.volumeBonus > 0 && (
            <span>
              {t("bonuses.volume")}: +{breakdown.volumeBonus}
            </span>
          )}
          {breakdown.prBonus > 0 && (
            <span>
              {t("bonuses.pr")}: +{breakdown.prBonus}
            </span>
          )}
        </div>
      )}

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {highlights.map((h) => (
            <span
              key={h}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

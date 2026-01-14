"use client";

import { TrendingUp, TrendingDown, Clock, Award, Mountain } from "lucide-react";

interface EventVariantTechnicalDataProps {
  distanceKm: number | null;
  elevationGainM: number | null;
  elevationLossM: number | null;
  cutoffTimeHours: number | null;
  itraPoints: number | null;
  atrpGrade: number | null;
  mountainLevel: number | null;
}

export function EventVariantTechnicalData({
  distanceKm,
  elevationGainM,
  elevationLossM,
  cutoffTimeHours,
  itraPoints,
  atrpGrade,
  mountainLevel,
}: EventVariantTechnicalDataProps) {
  const hasAnyData =
    distanceKm ||
    elevationGainM ||
    elevationLossM ||
    cutoffTimeHours ||
    itraPoints ||
    atrpGrade ||
    mountainLevel;

  if (!hasAnyData) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Dados Técnicos</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {distanceKm && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Mountain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Distância</div>
              <div className="text-lg font-semibold">{distanceKm} km</div>
            </div>
          </div>
        )}

        {elevationGainM && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-3">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">D+</div>
              <div className="text-lg font-semibold">{elevationGainM} m</div>
            </div>
          </div>
        )}

        {elevationLossM && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-3">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">D-</div>
              <div className="text-lg font-semibold">{elevationLossM} m</div>
            </div>
          </div>
        )}

        {cutoffTimeHours && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tempo Limite</div>
              <div className="text-lg font-semibold">{cutoffTimeHours}h</div>
            </div>
          </div>
        )}

        {itraPoints && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ITRA Points</div>
              <div className="text-lg font-semibold">{itraPoints}</div>
            </div>
          </div>
        )}

        {atrpGrade && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-500/10 p-3">
              <Award className="h-5 w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ATRP Grau</div>
              <div className="text-lg font-semibold">{atrpGrade}/5</div>
            </div>
          </div>
        )}

        {mountainLevel && (
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-3">
              <Mountain className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Mountain Level
              </div>
              <div className="text-lg font-semibold">{mountainLevel}/3</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/event-utils";
import { formatPrice, type Currency } from "@/lib/currency";
import { useLocale } from "next-intl";

interface PricingPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  currency?: Currency;
  discountPercent: number | null;
  note: string | null;
}

interface EventPricingPhasesProps {
  phases: PricingPhase[];
  variantName?: string;
}

export function EventPricingPhases({
  phases,
  variantName,
}: EventPricingPhasesProps) {
  const locale = useLocale();

  if (!phases || phases.length === 0) {
    return null;
  }

  // Find current active phase
  const now = new Date();
  const currentPhase = phases.find(
    (phase) =>
      new Date(phase.startDate) <= now && new Date(phase.endDate) >= now
  );

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-base font-semibold">
        {variantName ? `Preços - ${variantName}` : "Preços de Inscrição"}
      </h3>

      <div className="space-y-2">
        {phases.map((phase) => {
          const isActive = currentPhase?.id === phase.id;
          const isPast = new Date(phase.endDate) < now;

          return (
            <div
              key={phase.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-all ${
                isActive
                  ? "border-primary bg-primary/5"
                  : isPast
                    ? "opacity-40"
                    : "border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{phase.name}</span>
                {isActive && (
                  <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                    Atual
                  </span>
                )}
                {phase.discountPercent && phase.discountPercent > 0 && (
                  <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    -{phase.discountPercent}%
                  </span>
                )}
              </div>

              <span className="text-lg font-bold">
                {formatPrice(phase.price, phase.currency)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Show current phase dates */}
      {currentPhase && (
        <div className="mt-3 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Até {formatDate(new Date(currentPhase.endDate), locale)}</span>
        </div>
      )}
    </div>
  );
}

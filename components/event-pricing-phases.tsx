"use client";

import { Calendar, DollarSign, Tag } from "lucide-react";
import { formatDate } from "@/lib/event-utils";

interface PricingPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
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
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">
        {variantName ? `Preços - ${variantName}` : "Preços de Inscrição"}
      </h3>

      <div className="space-y-3">
        {phases.map((phase) => {
          const isActive = currentPhase?.id === phase.id;
          const isPast = new Date(phase.endDate) < now;

          return (
            <div
              key={phase.id}
              className={`rounded-lg border p-4 transition-all ${
                isActive
                  ? "border-primary bg-primary/5"
                  : isPast
                    ? "opacity-50"
                    : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="font-semibold">{phase.name}</h4>
                    {isActive && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        Atual
                      </span>
                    )}
                    {isPast && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Terminado
                      </span>
                    )}
                  </div>

                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(new Date(phase.startDate))} -{" "}
                      {formatDate(new Date(phase.endDate))}
                    </span>
                  </div>

                  {phase.note && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Tag className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{phase.note}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-2xl font-bold">
                    <span>{phase.price.toFixed(2)}€</span>
                  </div>
                  {phase.discountPercent && phase.discountPercent > 0 && (
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span>{phase.discountPercent}% desconto</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

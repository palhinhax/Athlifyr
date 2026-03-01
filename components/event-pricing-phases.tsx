"use client";

import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/event-utils";
import { formatPrice, type Currency } from "@/lib/currency";
import { useLocale, useTranslations } from "next-intl";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface PricingPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  currency?: Currency;
  discountPercent: number | null;
  note: string | null;
  variantId?: string | null;
}

interface EventPricingPhasesProps {
  phases: PricingPhase[];
  variantName?: string;
  variants?: { id: string; name: string }[];
}

export function EventPricingPhases({
  phases,
  variantName,
  variants = [],
}: EventPricingPhasesProps) {
  const locale = useLocale();
  const t = useTranslations("events.pricing");
  const [isOpen, setIsOpen] = useState(false);

  const getVariantLabel = (phase: PricingPhase) => {
    if (!phase.variantId) return null;
    return variants.find((v) => v.id === phase.variantId)?.name ?? null;
  };

  if (!phases || phases.length === 0) {
    return null;
  }

  // Find all current active phases (can be multiple if different variants)
  const now = new Date();
  const currentPhases = phases.filter(
    (phase) =>
      new Date(phase.startDate) <= now && new Date(phase.endDate) >= now
  );
  const currentPhaseIds = new Set(currentPhases.map((p) => p.id));

  // If there are 3 or fewer phases, show them all without collapse
  const shouldCollapse = phases.length > 3;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">
          {variantName
            ? t("titleWithVariant", { variant: variantName })
            : t("title")}
        </h3>
        {shouldCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 gap-1"
          >
            {isOpen ? (
              <>
                <span className="text-xs">{t("showLess")}</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="text-xs">{t("showAll")}</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      {shouldCollapse ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-2">
            {/* Always show all current phases if they exist */}
            {currentPhases.map((phase) => (
              <div
                key={phase.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-primary bg-primary/5 p-3 text-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{phase.name}</span>
                  {getVariantLabel(phase) && (
                    <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                      {getVariantLabel(phase)}
                    </span>
                  )}
                  <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                    {t("current")}
                  </span>
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
            ))}

            {/* Show first 2 upcoming phases or past phases if no current */}
            {phases
              .filter((phase) => !currentPhaseIds.has(phase.id))
              .slice(0, 2)
              .map((phase) => {
                const isPast = new Date(phase.endDate) < now;

                return (
                  <div
                    key={phase.id}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-all ${
                      isPast ? "border-border opacity-40" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{phase.name}</span>
                      {getVariantLabel(phase) && (
                        <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                          {getVariantLabel(phase)}
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

          <CollapsibleContent className="space-y-2 pt-2">
            {phases
              .filter((phase) => !currentPhaseIds.has(phase.id))
              .slice(2)
              .map((phase) => {
                const isPast = new Date(phase.endDate) < now;

                return (
                  <div
                    key={phase.id}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-all ${
                      isPast ? "border-border opacity-40" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{phase.name}</span>
                      {getVariantLabel(phase) && (
                        <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                          {getVariantLabel(phase)}
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
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="space-y-2">
          {phases.map((phase) => {
            const isActive = currentPhaseIds.has(phase.id);
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
                  {getVariantLabel(phase) && (
                    <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                      {getVariantLabel(phase)}
                    </span>
                  )}
                  {isActive && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                      {t("current")}
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
      )}

      {/* Show current phases dates */}
      {currentPhases.length > 0 && (
        <div className="mt-3 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {t("until")}{" "}
            {formatDate(
              new Date(
                Math.max(
                  ...currentPhases.map((p) => new Date(p.endDate).getTime())
                )
              ),
              locale
            )}
          </span>
        </div>
      )}
    </div>
  );
}

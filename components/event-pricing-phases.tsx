"use client";

import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/event-utils";
import { formatPrice, type Currency } from "@/lib/currency";
import { useLocale, useTranslations } from "next-intl";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

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

  const now = new Date();
  const currentPhases = phases.filter(
    (phase) =>
      new Date(phase.startDate) <= now && new Date(phase.endDate) >= now
  );
  const currentPhaseIds = new Set(currentPhases.map((p) => p.id));
  const otherPhases = phases.filter((p) => !currentPhaseIds.has(p.id));
  const shouldCollapse = otherPhases.length > 2;

  return (
    <div className="rounded-lg border bg-card px-3 py-2.5">
      {/* Header — compact row with title + collapse toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-semibold">
          {variantName
            ? t("titleWithVariant", { variant: variantName })
            : t("title")}
        </h3>
        {shouldCollapse && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {isOpen ? t("showLess") : t("showAll")}
            {isOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </span>
        )}
      </button>

      {/* Current phases — always visible, highlighted inline */}
      {currentPhases.length > 0 && (
        <div className="mt-2 space-y-1">
          {currentPhases.map((phase) => (
            <div
              key={phase.id}
              className="flex items-center justify-between gap-2 rounded-md bg-primary/5 px-2.5 py-1.5 text-xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-medium">{phase.name}</span>
                {getVariantLabel(phase) && (
                  <span className="rounded bg-blue-500/10 px-1 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
                    {getVariantLabel(phase)}
                  </span>
                )}
                <span className="rounded bg-primary px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
                  {t("current")}
                </span>
                {phase.discountPercent && phase.discountPercent > 0 && (
                  <span className="rounded bg-green-500/10 px-1 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400">
                    -{phase.discountPercent}%
                  </span>
                )}
              </div>
              <span className="shrink-0 text-sm font-bold">
                {formatPrice(phase.price, phase.currency)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Other phases — compact rows */}
      {shouldCollapse ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* First 2 always visible */}
          <div className="mt-1.5 space-y-1">
            {otherPhases.slice(0, 2).map((phase) => {
              const isPast = new Date(phase.endDate) < now;
              return (
                <PricingRow
                  key={phase.id}
                  phase={phase}
                  isPast={isPast}
                  variantLabel={getVariantLabel(phase)}
                />
              );
            })}
          </div>
          <CollapsibleContent className="mt-1 space-y-1">
            {otherPhases.slice(2).map((phase) => {
              const isPast = new Date(phase.endDate) < now;
              return (
                <PricingRow
                  key={phase.id}
                  phase={phase}
                  isPast={isPast}
                  variantLabel={getVariantLabel(phase)}
                />
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="mt-1.5 space-y-1">
          {otherPhases.map((phase) => {
            const isPast = new Date(phase.endDate) < now;
            return (
              <PricingRow
                key={phase.id}
                phase={phase}
                isPast={isPast}
                variantLabel={getVariantLabel(phase)}
              />
            );
          })}
        </div>
      )}

      {/* Deadline hint */}
      {currentPhases.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 border-t pt-2 text-[11px] text-muted-foreground">
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

/* ── Compact row for a single pricing phase ────────────────────────── */

function PricingRow({
  phase,
  isPast,
  variantLabel,
}: {
  phase: PricingPhase;
  isPast: boolean;
  variantLabel: string | null;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-1 text-xs ${
        isPast ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 truncate">
        <span className={`font-medium ${isPast ? "line-through" : ""}`}>
          {phase.name}
        </span>
        {variantLabel && (
          <span className="rounded bg-blue-500/10 px-1 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
            {variantLabel}
          </span>
        )}
        {phase.discountPercent && phase.discountPercent > 0 && (
          <span className="rounded bg-green-500/10 px-1 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400">
            -{phase.discountPercent}%
          </span>
        )}
      </div>
      <span className="shrink-0 text-xs font-semibold">
        {formatPrice(phase.price, phase.currency)}
      </span>
    </div>
  );
}

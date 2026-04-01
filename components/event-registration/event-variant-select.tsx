"use client";

import { useTranslations } from "next-intl";
import type { EventVariant } from "./event-registration-types";

interface EventVariantSelectProps {
  variants: EventVariant[];
  selectedVariantId: string;
  onVariantChange: (variantId: string) => void;
  isLoading: boolean;
  hasRegistrations: boolean;
  isVariantSoldOut: (variant: EventVariant) => boolean;
  variantHasActivePrice: (variant: EventVariant) => boolean;
}

export function EventVariantSelect({
  variants,
  selectedVariantId,
  onVariantChange,
  isLoading,
  hasRegistrations,
  isVariantSoldOut,
  variantHasActivePrice,
}: EventVariantSelectProps) {
  const t = useTranslations("events.registration");

  return (
    <div>
      <label className="text-on-surface-variant mb-2 block text-xs font-bold uppercase tracking-tight">
        {t("chooseVariant")}
      </label>
      <select
        value={selectedVariantId}
        onChange={(e) => onVariantChange(e.target.value)}
        className="text-on-surface w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-4 py-3 text-sm font-bold focus:border-primary focus:outline-none focus:ring-0 disabled:opacity-50"
        disabled={isLoading}
      >
        <option value="">{t("selectVariantPlaceholder")}</option>
        {variants.map((variant) => {
          const variantDate = variant.startDate
            ? new Date(variant.startDate).toLocaleDateString("pt-PT", {
                day: "numeric",
                month: "short",
              })
            : null;
          const soldOut = isVariantSoldOut(variant);
          const noPrice = hasRegistrations && !variantHasActivePrice(variant);
          const unavailable = soldOut || noPrice;
          return (
            <option key={variant.id} value={variant.id} disabled={unavailable}>
              {variant.name}
              {variant.distanceKm && ` - ${variant.distanceKm}km`}
              {(variant.teamSize ?? 1) > 1 && ` 👥 ${variant.teamSize}p`}
              {variantDate && ` (${variantDate})`}
              {variant.startTime && ` ${variant.startTime}`}
              {soldOut && ` — ${t("soldOut")}`}
              {!soldOut && noPrice && ` — ${t("registrationClosed")}`}
            </option>
          );
        })}
      </select>
    </div>
  );
}

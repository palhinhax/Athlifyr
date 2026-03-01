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
      <label className="mb-2 block text-sm font-medium">
        {t("chooseVariant")}
      </label>
      <select
        value={selectedVariantId}
        onChange={(e) => onVariantChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

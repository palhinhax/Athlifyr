import type { EventVariant, PricingPhase } from "@/src/types";

/* ── Shared interfaces ── */

export interface Participation {
  id: string;
  status: string;
  variantId?: string | null;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
  } | null;
}

export interface PaidRegistration {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
  variantId: string;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
  } | null;
  amountCents: number;
  currency: string;
}

/* ── Utility helpers ── */

export function getActivePrice(variant: EventVariant): PricingPhase | null {
  const now = new Date();
  const phases = variant.pricingPhases ?? [];
  return (
    phases.find(
      (p) =>
        (!p.startDate || new Date(p.startDate) <= now) &&
        (!p.endDate || new Date(p.endDate) >= now)
    ) ?? null
  );
}

export function isVariantSoldOut(variant: EventVariant): boolean {
  if (!variant.maxParticipants) return false;
  return (variant._count?.registrations ?? 0) >= variant.maxParticipants;
}

export function allVariantsSoldOut(variants: EventVariant[]): boolean {
  return variants.length > 0 && variants.every(isVariantSoldOut);
}

export function allVariantsNoPrice(variants: EventVariant[]): boolean {
  return (
    variants.length > 0 &&
    !allVariantsSoldOut(variants) &&
    variants.every((v) => !getActivePrice(v))
  );
}

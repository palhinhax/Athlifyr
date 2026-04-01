"use client";

import { Check, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { EventVariantSelect } from "./event-variant-select";
import type { EventVariant, Participation } from "./event-registration-types";

interface EventRegistrationFreeProps {
  readonly isAuthenticated: boolean;
  readonly userParticipation: Participation | null;
  readonly variants: EventVariant[];
  readonly selectedVariantId: string;
  readonly onVariantChange: (id: string) => void;
  readonly isLoading: boolean;
  readonly selectedVariantSoldOut: boolean;
  readonly allVariantsSoldOut: boolean;
  readonly onRegister: () => void;
  readonly onUnregister: () => void;
  readonly onMarkInterested: () => void;
}

// Helper function for variant status
function isVariantSoldOut(variant: EventVariant): boolean {
  if (!variant.maxParticipants) return false;
  return (variant.registrationCount ?? 0) >= variant.maxParticipants;
}

// Stub for free mode — all variants are "available" price-wise
function variantHasActivePrice(): boolean {
  return true;
}

export function EventRegistrationFree({
  isAuthenticated,
  userParticipation,
  variants,
  selectedVariantId,
  onVariantChange,
  isLoading,
  selectedVariantSoldOut,
  allVariantsSoldOut,
  onRegister,
  onUnregister,
  onMarkInterested,
}: EventRegistrationFreeProps) {
  const t = useTranslations("events.registration");

  const renderActionButtons = () => {
    if (!userParticipation) {
      return (
        <>
          <button
            onClick={onRegister}
            disabled={isLoading || selectedVariantSoldOut}
            className="w-full rounded-xl bg-[#E85D04] py-4 font-headline text-base font-bold text-white shadow-[0_8px_24px_rgba(232,93,4,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {t("markAsGoing")}
          </button>
          <button
            onClick={onMarkInterested}
            disabled={isLoading}
            className="text-on-surface flex w-full items-center justify-center gap-2 rounded-xl border-2 border-surface-container-high py-4 text-sm font-bold transition-colors hover:bg-surface-container-low disabled:opacity-50"
          >
            <Star className="h-5 w-5" />
            {t("markAsInterested")}
          </button>
        </>
      );
    }

    if (userParticipation.status === "interested") {
      return (
        <>
          <button
            onClick={onRegister}
            disabled={isLoading}
            className="w-full rounded-xl bg-[#E85D04] py-4 font-headline text-base font-bold text-white shadow-[0_8px_24px_rgba(232,93,4,0.2)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {t("markAsGoing")}
          </button>
          <button
            onClick={onUnregister}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-500 py-4 text-sm font-bold text-amber-600 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-amber-950"
          >
            <X className="h-5 w-5" />
            {t("removeInterest")}
          </button>
        </>
      );
    }

    return (
      <button
        onClick={onUnregister}
        disabled={isLoading}
        className="text-on-surface flex w-full items-center justify-center gap-2 rounded-xl border-2 border-surface-container-high py-4 text-sm font-bold transition-colors hover:bg-surface-container-low disabled:opacity-50"
      >
        <X className="h-5 w-5" />
        {t("cancelParticipation")}
      </button>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center">
        <p className="mb-3 text-sm text-muted-foreground">
          {t("loginToParticipate")}
        </p>
        <Button asChild size="sm">
          <Link href="/auth/signin">{t("signIn")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* All variants sold out message */}
      {allVariantsSoldOut && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm">
          <div className="flex items-center gap-2 font-medium text-destructive">
            <X className="h-5 w-5" />
            {t("allSoldOut")}
          </div>
          <p className="mt-1 text-muted-foreground">{t("allSoldOutDesc")}</p>
        </div>
      )}

      {/* Variant Selection */}
      {variants.length > 0 && !userParticipation && !allVariantsSoldOut && (
        <EventVariantSelect
          variants={variants}
          selectedVariantId={selectedVariantId}
          onVariantChange={onVariantChange}
          isLoading={isLoading}
          hasRegistrations={false}
          isVariantSoldOut={isVariantSoldOut}
          variantHasActivePrice={variantHasActivePrice}
        />
      )}

      {/* Sold Out indicator for selected variant (free mode) */}
      {selectedVariantSoldOut && !userParticipation && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <span className="font-semibold text-destructive">{t("soldOut")}</span>
          <span className="ml-1 text-muted-foreground">
            — {t("variantSoldOutDesc")}
          </span>
        </div>
      )}

      {/* Current Participation Status */}
      {userParticipation?.status === "going" && (
        <div className="rounded-md bg-p-brand/10 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-medium text-p-brand">
            <Check className="h-4 w-4" />
            {t("registered")}
          </div>
          {userParticipation.variant && (
            <p className="text-muted-foreground">
              {t("variant")}: {userParticipation.variant.name}
              {userParticipation.variant.distanceKm &&
                ` - ${userParticipation.variant.distanceKm}km`}
              {userParticipation.variant.startDate && (
                <span className="ml-1">
                  (
                  {new Date(
                    userParticipation.variant.startDate
                  ).toLocaleDateString("pt-PT", {
                    day: "numeric",
                    month: "short",
                  })}
                  {userParticipation.variant.startTime &&
                    ` ${userParticipation.variant.startTime}`}
                  )
                </span>
              )}
            </p>
          )}
        </div>
      )}

      {userParticipation?.status === "interested" && (
        <div className="rounded-md bg-amber-500/10 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
            <Star className="h-4 w-4" />
            {t("markedAsInterested")}
          </div>
          <p className="text-muted-foreground">{t("interestedDesc")}</p>
        </div>
      )}

      {/* Action Buttons */}
      {!allVariantsSoldOut && renderActionButtons()}
    </div>
  );
}

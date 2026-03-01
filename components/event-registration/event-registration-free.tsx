"use client";

import { Check, X, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { EventVariantSelect } from "./event-variant-select";
import type { EventVariant, Participation } from "./event-registration-types";

interface EventRegistrationFreeProps {
  isAuthenticated: boolean;
  userParticipation: Participation | null;
  variants: EventVariant[];
  selectedVariantId: string;
  onVariantChange: (id: string) => void;
  isLoading: boolean;
  selectedVariantSoldOut: boolean;
  allVariantsSoldOut: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  onMarkInterested: () => void;
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
      {userParticipation && userParticipation.status === "going" && (
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

      {userParticipation && userParticipation.status === "interested" && (
        <div className="rounded-md bg-amber-500/10 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
            <Target className="h-4 w-4" />
            {t("markedAsInterested")}
          </div>
          <p className="text-muted-foreground">{t("interestedDesc")}</p>
        </div>
      )}

      {/* Action Buttons */}
      {!allVariantsSoldOut && (
        <div className="flex gap-3">
          {!userParticipation ? (
            <>
              <Button
                onClick={onRegister}
                disabled={isLoading || selectedVariantSoldOut}
                className="flex-1"
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                {t("markAsGoing")}
              </Button>
              <Button
                onClick={onMarkInterested}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Target className="mr-2 h-4 w-4" />
                {t("markAsInterested")}
              </Button>
            </>
          ) : userParticipation.status === "interested" ? (
            <>
              <Button
                onClick={onRegister}
                disabled={isLoading}
                className="flex-1"
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                {t("markAsGoing")}
              </Button>
              <Button
                onClick={onUnregister}
                disabled={isLoading}
                variant="outline"
                className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                {t("removeInterest")}
              </Button>
            </>
          ) : (
            <Button
              onClick={onUnregister}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <X className="mr-2 h-4 w-4" />
              {t("cancelParticipation")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

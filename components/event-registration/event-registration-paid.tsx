"use client";

import { Check, X, Loader2, CreditCard, Ticket, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { EventTicketModal } from "@/components/event-ticket-modal";
import { EventVariantSelect } from "./event-variant-select";
import type {
  EventVariant,
  PaidRegistration,
  PricingPhase,
} from "./event-registration-types";

interface EventRegistrationPaidProps {
  eventId: string;
  isAuthenticated: boolean;
  registrationChecked: boolean;
  paidRegistration: PaidRegistration | null;
  variants: EventVariant[];
  selectedVariantId: string;
  onVariantChange: (id: string) => void;
  isLoading: boolean;
  activePrice: PricingPhase | null;
  selectedVariantSoldOut: boolean;
  selectedVariantNoPrice: boolean;
  allVariantsSoldOut: boolean;
  showTicketModal: boolean;
  onShowTicketModal: (show: boolean) => void;
  isCancellingPending: boolean;
  isRetryingPayment: boolean;
  onCheckout: () => void;
  onRetryPayment: () => void;
  onCancelPending: () => void;
}

// Helper functions for variant status
function variantHasActivePrice(variant: EventVariant): boolean {
  const now = new Date();
  const phases = variant.pricingPhases ?? [];
  if (phases.length === 0) return false;
  return phases.some(
    (p) =>
      (!p.startDate || new Date(p.startDate) <= now) &&
      (!p.endDate || new Date(p.endDate) >= now)
  );
}

function isVariantSoldOut(variant: EventVariant): boolean {
  if (!variant.maxParticipants) return false;
  return (variant.registrationCount ?? 0) >= variant.maxParticipants;
}

export function EventRegistrationPaid({
  eventId,
  isAuthenticated,
  registrationChecked,
  paidRegistration,
  variants,
  selectedVariantId,
  onVariantChange,
  isLoading,
  activePrice,
  selectedVariantSoldOut,
  selectedVariantNoPrice,
  allVariantsSoldOut,
  showTicketModal,
  onShowTicketModal,
  isCancellingPending,
  isRetryingPayment,
  onCheckout,
  onRetryPayment,
  onCancelPending,
}: EventRegistrationPaidProps) {
  const t = useTranslations("events.registration");

  // Not authenticated
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

  // Loading registration status
  if (!registrationChecked) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Confirmed registration
  if (paidRegistration?.status === "CONFIRMED") {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-p-brand/10 p-4 text-sm">
          <div className="mb-1 flex items-center gap-2 font-medium text-p-brand">
            <Check className="h-5 w-5" />
            {t("registrationConfirmed")}
          </div>
          {paidRegistration.variant && (
            <p className="text-muted-foreground">
              {t("variant")}: {paidRegistration.variant.name}
              {paidRegistration.variant.distanceKm &&
                ` - ${paidRegistration.variant.distanceKm}km`}
              {paidRegistration.variant.startDate && (
                <span className="ml-1">
                  (
                  {new Date(
                    paidRegistration.variant.startDate
                  ).toLocaleDateString("pt-PT", {
                    day: "numeric",
                    month: "short",
                  })}
                  {paidRegistration.variant.startTime &&
                    ` ${paidRegistration.variant.startTime}`}
                  )
                </span>
              )}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            <CreditCard className="mr-1 inline-block h-3 w-3" />
            {t("paymentConfirmed")} •{" "}
            {(paidRegistration.amountCents / 100).toLocaleString("pt-PT", {
              style: "currency",
              currency: paidRegistration.currency,
            })}
          </p>
        </div>
        <Button
          onClick={() => onShowTicketModal(true)}
          variant="outline"
          className="w-full gap-2"
        >
          <Ticket className="h-4 w-4" />
          {t("showTicket")}
        </Button>
        <EventTicketModal
          eventId={eventId}
          open={showTicketModal}
          onOpenChange={onShowTicketModal}
        />
      </div>
    );
  }

  // Pending registration
  if (paidRegistration?.status === "PENDING") {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-amber-500/10 p-4 text-sm">
          <div className="mb-1 flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
            {t("registrationPending")}
          </div>
          <p className="text-muted-foreground">
            {t("registrationPendingDesc")}
          </p>
          {paidRegistration.variant && (
            <p className="mt-1 text-xs text-muted-foreground">
              {paidRegistration.variant.name}
              {paidRegistration.variant.distanceKm
                ? ` (${paidRegistration.variant.distanceKm}km)`
                : ""}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onRetryPayment}
            disabled={isRetryingPayment || isCancellingPending}
            className="flex-1 gap-2"
          >
            {isRetryingPayment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {t("retryPayment")}
          </Button>
          <Button
            variant="outline"
            onClick={onCancelPending}
            disabled={isRetryingPayment || isCancellingPending}
            className="gap-2"
          >
            {isCancellingPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {t("cancelPending")}
          </Button>
        </div>
      </div>
    );
  }

  // New registration flow (no existing registration)
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
      {variants.length > 0 && !allVariantsSoldOut && (
        <EventVariantSelect
          variants={variants}
          selectedVariantId={selectedVariantId}
          onVariantChange={onVariantChange}
          isLoading={isLoading}
          hasRegistrations={true}
          isVariantSoldOut={isVariantSoldOut}
          variantHasActivePrice={variantHasActivePrice}
        />
      )}

      {/* Sold Out indicator for selected variant */}
      {selectedVariantSoldOut && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <span className="font-semibold text-destructive">{t("soldOut")}</span>
          <span className="ml-1 text-muted-foreground">
            — {t("variantSoldOutDesc")}
          </span>
        </div>
      )}

      {/* No active pricing phase indicator */}
      {selectedVariantNoPrice && !selectedVariantSoldOut && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="mr-1 inline-block h-4 w-4" />
            {t("registrationClosed")}
          </span>
          <span className="ml-1 text-muted-foreground">
            — {t("registrationClosedDesc")}
          </span>
        </div>
      )}

      {/* Active Price Display */}
      {activePrice && !selectedVariantSoldOut && (
        <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            {activePrice.name ?? t("currentPrice")}:{" "}
          </span>
          <span className="text-lg font-bold">
            {activePrice.price.toLocaleString("pt-PT", {
              style: "currency",
              currency: activePrice.currency,
            })}
          </span>
        </div>
      )}

      {!allVariantsSoldOut && (
        <>
          <Button
            onClick={onCheckout}
            disabled={
              isLoading ||
              selectedVariantSoldOut ||
              selectedVariantNoPrice ||
              (variants.length > 0 && !selectedVariantId)
            }
            className="w-full"
            size="lg"
          >
            <Check className="mr-2 h-4 w-4" />
            {isLoading ? t("redirectingToPayment") : t("registerAndPay")}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {t("securePaymentInfo")}
          </p>
        </>
      )}
    </div>
  );
}

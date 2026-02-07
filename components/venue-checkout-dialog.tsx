"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StripeCheckout } from "@/components/stripe-checkout";

interface VenueCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  venueName: string;
  paymentMode: string;
  selectedPlan: {
    id: string;
    name: string;
    price: number;
    currency: string;
  } | null;
  selectedPaymentMethod: "IN_APP" | "EXTERNAL" | null;
  onPaymentMethodSelect: (method: "IN_APP" | "EXTERNAL" | null) => void;
  onSuccess: () => void;
  onCancel: () => void;
  onOnSiteRequest: () => void;
}

export function VenueCheckoutDialog({
  open,
  onOpenChange,
  venueId,
  venueName,
  paymentMode,
  selectedPlan,
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onSuccess,
  onCancel,
  onOnSiteRequest,
}: VenueCheckoutDialogProps) {
  const t = useTranslations("venues");
  const tPlans = useTranslations("venues.plans");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tPlans("subscribe")}</DialogTitle>
          <DialogDescription>
            {selectedPlan && (
              <>
                {tPlans("subscribeTo")} {selectedPlan.name} -{" "}
                {selectedPlan.price} {selectedPlan.currency} /{" "}
                {tPlans("perMonth")}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        {selectedPlan && (
          <>
            {/* EXTERNAL: On-site payment only */}
            {paymentMode === "EXTERNAL" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-muted bg-muted/50 p-6">
                  <h3 className="mb-3 text-lg font-semibold">
                    {t("payment.onSiteTitle")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("payment.onSiteInstructions")}
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm font-medium">
                      {t("payment.onSiteSteps")}
                    </p>
                    <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                      <li>{t("payment.onSiteStep1")}</li>
                      <li>{t("payment.onSiteStep2")}</li>
                      <li>{t("payment.onSiteStep3")}</li>
                    </ol>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {t("payment.onSiteNote")}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onCancel}>
                    {t("payment.goBack")}
                  </Button>
                  <Button onClick={onCancel}>
                    {t("payment.confirmOnSite")}
                  </Button>
                </div>
              </div>
            )}

            {/* IN_APP: Stripe checkout only */}
            {paymentMode === "IN_APP" && (
              <StripeCheckout
                venueId={venueId}
                venueName={venueName}
                planId={selectedPlan.id}
                planName={selectedPlan.name}
                price={selectedPlan.price}
                currency={selectedPlan.currency}
                onSuccess={onSuccess}
                onCancel={onCancel}
              />
            )}

            {/* MIXED: Choice between in-app and on-site */}
            {paymentMode === "MIXED" && (
              <div className="space-y-4">
                {!selectedPaymentMethod ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {t("payment.chooseMethod")}
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* In-App Payment Option - Coming Soon */}
                      <div className="relative flex cursor-not-allowed flex-col items-center justify-center rounded-lg border-2 border-muted bg-muted/30 p-6 opacity-60">
                        <span className="absolute right-2 top-2 rounded-full bg-p-golden/10 px-2 py-0.5 text-xs font-medium text-p-golden">
                          {t("payment.comingSoon")}
                        </span>
                        <svg
                          className="mb-3 h-12 w-12 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <h3 className="mb-2 font-semibold text-muted-foreground">
                          {t("payment.inApp")}
                        </h3>
                        <p className="text-center text-xs text-muted-foreground">
                          {t("payment.inAppDescription")}
                        </p>
                      </div>

                      {/* On-Site Payment Option */}
                      <button
                        onClick={() => onPaymentMethodSelect("EXTERNAL")}
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-6 transition-colors hover:border-primary hover:bg-muted/50"
                      >
                        <svg
                          className="mb-3 h-12 w-12 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <h3 className="mb-2 font-semibold">
                          {t("payment.external")}
                        </h3>
                        <p className="text-center text-xs text-muted-foreground">
                          {t("payment.externalDescription")}
                        </p>
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={onCancel}>
                        {t("payment.cancel")}
                      </Button>
                    </div>
                  </>
                ) : selectedPaymentMethod === "IN_APP" ? (
                  <StripeCheckout
                    venueId={venueId}
                    venueName={venueName}
                    planId={selectedPlan.id}
                    planName={selectedPlan.name}
                    price={selectedPlan.price}
                    currency={selectedPlan.currency}
                    onSuccess={onSuccess}
                    onCancel={() => {
                      onPaymentMethodSelect(null);
                      onCancel();
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-muted bg-muted/50 p-6">
                      <h3 className="mb-3 text-lg font-semibold">
                        {t("payment.onSiteTitle")}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {t("payment.onSiteInstructions")}
                      </p>
                      <div className="space-y-3">
                        <p className="text-sm font-medium">
                          {t("payment.onSiteSteps")}
                        </p>
                        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                          <li>{t("payment.onSiteStep1")}</li>
                          <li>{t("payment.onSiteStep2")}</li>
                          <li>{t("payment.onSiteStep3")}</li>
                        </ol>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => onPaymentMethodSelect(null)}
                      >
                        {t("payment.back")}
                      </Button>
                      <Button onClick={onOnSiteRequest}>
                        {t("payment.submitRequest")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

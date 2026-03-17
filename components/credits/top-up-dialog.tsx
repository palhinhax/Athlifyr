"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";
import { TOPUP_FEE_PERCENTAGE } from "@/lib/credits/constants";

interface TopUpOption {
  amountCents: number;
  feeCents: number;
  netCreditsCents: number;
}

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topUpOptions: TopUpOption[];
  onSuccess: () => void;
}

type TopUpStep = "select" | "payment" | "success" | "error";

export function TopUpDialog({
  open,
  onOpenChange,
  topUpOptions,
  onSuccess,
}: Readonly<TopUpDialogProps>) {
  const t = useTranslations("credits");
  const [step, setStep] = useState<TopUpStep>("select");
  const [selectedAmount, setSelectedAmount] = useState<TopUpOption | null>(
    null
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectAmount = useCallback(
    async (option: TopUpOption) => {
      setSelectedAmount(option);
      setIsCreating(true);
      setErrorMessage(null);

      try {
        const res = await fetch("/api/credits/top-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amountCents: option.amountCents }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create top-up");
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
        setStep("payment");
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : t("topUpFailed"));
        setStep("error");
      } finally {
        setIsCreating(false);
      }
    },
    [t]
  );

  const handlePaymentSuccess = useCallback(() => {
    setStep("success");
    // Auto-close after 2 seconds, then refresh wallet data
    // onSuccess (refresh) must run AFTER the dialog closes to avoid
    // isLoading=true unmounting the dialog before the user sees "success"
    setTimeout(() => {
      onOpenChange(false);
      setStep("select");
      setClientSecret(null);
      setSelectedAmount(null);
      onSuccess();
    }, 2000);
  }, [onSuccess, onOpenChange]);

  const handleClose = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        setStep("select");
        setClientSecret(null);
        setSelectedAmount(null);
        setErrorMessage(null);
      }
      onOpenChange(newOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("topUpTitle")}</DialogTitle>
          <DialogDescription>{t("topUpDescription")}</DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("selectAmount")}</p>
            <div className="grid grid-cols-2 gap-3">
              {topUpOptions.map((option) => (
                <button
                  key={option.amountCents}
                  className="rounded-lg border-2 p-4 text-center transition-colors hover:border-primary hover:bg-accent"
                  onClick={() => handleSelectAmount(option)}
                  disabled={isCreating}
                >
                  <p className="text-lg font-bold">
                    {(option.amountCents / 100).toFixed(2)}€
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("youReceive")}{" "}
                    <span className="font-medium text-green-600">
                      {(option.netCreditsCents / 100).toFixed(2)}
                    </span>{" "}
                    {t("credits")}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {t("processingFeeNote", { percentage: TOPUP_FEE_PERCENTAGE })}
            </p>
            {isCreating && (
              <div className="flex justify-center py-4">
                <Spinner className="h-6 w-6" />
              </div>
            )}
          </div>
        )}

        {step === "payment" && clientSecret && selectedAmount && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm">
                {t("youPay")}:{" "}
                <span className="font-bold">
                  {(selectedAmount.amountCents / 100).toFixed(2)}€
                </span>
              </p>
              <p className="text-sm">
                {t("youReceive")}:{" "}
                <span className="font-bold text-green-600">
                  {(selectedAmount.netCreditsCents / 100).toFixed(2)}{" "}
                  {t("credits")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {t("processingFee")}
              </p>
            </div>

            <Elements
              stripe={getStripe()}
              options={{
                clientSecret,
                appearance: { theme: "stripe" },
              }}
            >
              <TopUpPaymentForm onSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-medium text-green-600">
              {t("topUpSuccess")}
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4 py-4 text-center">
            <p className="text-destructive">
              {errorMessage || t("topUpFailed")}
            </p>
            <Button onClick={() => setStep("select")} variant="outline">
              {t("topUp")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TopUpPaymentForm({ onSuccess }: Readonly<{ onSuccess: () => void }>) {
  const t = useTranslations("credits");
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setIsProcessing(true);
      setError(null);

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message ?? t("topUpFailed"));
        setIsProcessing(false);
      } else {
        // Confirm server-side so the wallet is credited immediately
        // (webhook is the backup, this is the primary confirmation)
        try {
          const piId = result.paymentIntent?.id;
          if (piId) {
            await fetch("/api/credits/top-up/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentIntentId: piId }),
            });
          }
        } catch {
          // Non-critical — webhook will handle it as fallback
        }
        onSuccess();
      }
    },
    [stripe, elements, onSuccess, t]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? <Spinner className="mr-2 h-4 w-4" /> : null}
        {isProcessing ? t("topUpPending") : t("confirmTopUp")}
      </Button>
    </form>
  );
}

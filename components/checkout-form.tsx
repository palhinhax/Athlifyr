"use client";

import { useCallback, FormEvent } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { useStripePaymentForm } from "@/hooks/use-stripe-payment-form";

interface CheckoutFormProps {
  venueId?: string;
  paymentIntentId?: string;
  stripeSubscriptionId?: string;
  isRecurring?: boolean;
  /** Custom confirmation endpoint (overrides default logic). POST is called after payment succeeds. */
  confirmEndpoint?: string;
  /** JSON body to send to confirmEndpoint (defaults to empty) */
  confirmBody?: Record<string, unknown>;
  /** If true, confirmation failure is silently ignored (webhook fallback) */
  silentConfirm?: boolean;
  /** i18n namespace override (default: "venues.payment") */
  translationNamespace?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutForm({
  venueId,
  paymentIntentId,
  stripeSubscriptionId,
  isRecurring,
  confirmEndpoint,
  confirmBody,
  silentConfirm,
  translationNamespace = "venues.payment",
  onSuccess,
  onCancel,
}: Readonly<CheckoutFormProps>) {
  const t = useTranslations(translationNamespace);
  const {
    stripe,
    elements,
    isProcessing,
    errorMessage,
    elementReady,
    elementError,
    setIsProcessing,
    setErrorMessage,
    handleElementReady,
    handleElementLoadError,
    handleElementChange,
  } = useStripePaymentForm();

  const handlePaymentElementLoadError = useCallback(() => {
    handleElementLoadError(t("paymentFailed"));
  }, [handleElementLoadError, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !elementReady || elementError) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (paymentError) {
        setErrorMessage(paymentError.message || t("paymentFailed"));
        setIsProcessing(false);
        return;
      }

      // Determine which confirmation endpoint to call
      const endpoint =
        confirmEndpoint ??
        (isRecurring && venueId && stripeSubscriptionId
          ? `/api/venues/${venueId}/stripe-subscriptions/confirm`
          : !isRecurring && paymentIntentId
            ? `/api/payment-intents/${paymentIntentId}/confirm`
            : null);

      const body =
        confirmBody ??
        (isRecurring && stripeSubscriptionId
          ? { stripeSubscriptionId }
          : undefined);

      if (endpoint) {
        try {
          const confirmResponse = await fetch(endpoint, {
            method: "POST",
            ...(body
              ? {
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                }
              : {}),
          });

          if (!confirmResponse.ok && !silentConfirm) {
            throw new Error(t("activationFailed"));
          }
        } catch (confirmError) {
          if (silentConfirm) {
            // Webhook will handle activation as fallback
            console.warn("Confirm failed, webhook will handle:", confirmError);
          } else if (isRecurring) {
            console.warn(
              "Subscription confirm failed, webhook will handle activation:",
              confirmError
            );
          } else {
            console.error("Error confirming payment:", confirmError);
            setErrorMessage(
              confirmError instanceof Error
                ? confirmError.message
                : t("activationFailed")
            );
            setIsProcessing(false);
            return;
          }
        }
      }

      setIsProcessing(false);
      onSuccess?.();
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(t("unexpectedError"));
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        onReady={handleElementReady}
        onLoadError={handlePaymentElementLoadError}
        onChange={handleElementChange}
      />

      {errorMessage && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
        )}
        <Button
          type="submit"
          disabled={!stripe || !elementReady || elementError || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              {t("processing")}
            </>
          ) : (
            t("pay")
          )}
        </Button>
      </div>
    </form>
  );
}

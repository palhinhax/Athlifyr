"use client";

import { useCallback, FormEvent } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { useStripePaymentForm } from "@/hooks/use-stripe-payment-form";

interface CheckoutFormProps {
  venueId?: string;
  paymentIntentId: string;
  stripeSubscriptionId?: string;
  isRecurring?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutForm({
  venueId,
  paymentIntentId,
  stripeSubscriptionId,
  isRecurring,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const t = useTranslations("venues.payment");
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
      } else {
        if (isRecurring && venueId && stripeSubscriptionId) {
          // Recurring subscription: confirm and activate immediately
          try {
            const confirmResponse = await fetch(
              `/api/venues/${venueId}/stripe-subscriptions/confirm`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stripeSubscriptionId }),
              }
            );

            if (!confirmResponse.ok) {
              console.warn(
                "Subscription confirm failed, webhook will handle activation"
              );
            }
          } catch (confirmError) {
            console.warn(
              "Subscription confirm error, webhook will handle activation:",
              confirmError
            );
          }

          setIsProcessing(false);
          if (onSuccess) {
            onSuccess();
          }
        } else if (!isRecurring) {
          // One-time payment: confirm subscription manually
          try {
            const confirmResponse = await fetch(
              `/api/payment-intents/${paymentIntentId}/confirm`,
              {
                method: "POST",
              }
            );

            if (!confirmResponse.ok) {
              throw new Error(t("activationFailed"));
            }

            setIsProcessing(false);
            if (onSuccess) {
              onSuccess();
            }
          } catch (confirmError) {
            console.error("Error confirming subscription:", confirmError);
            setErrorMessage(
              confirmError instanceof Error
                ? confirmError.message
                : t("activationFailed")
            );
            setIsProcessing(false);
          }
        }
      }
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

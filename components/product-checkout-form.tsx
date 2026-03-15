"use client";

import { useState, useCallback, FormEvent } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import type { StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

interface ProductCheckoutFormProps {
  venueId: string;
  purchaseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductCheckoutForm({
  venueId,
  purchaseId,
  onSuccess,
  onCancel,
}: ProductCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("venues.shop.checkout");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elementReady, setElementReady] = useState(false);
  const [elementError, setElementError] = useState(false);

  const handleElementReady = useCallback(() => {
    setElementReady(true);
    setElementError(false);
  }, []);

  const handleElementLoadError = useCallback(() => {
    setElementError(true);
    setErrorMessage(t("failedCreatePayment"));
  }, [t]);

  const handleElementChange = useCallback(
    (event: StripePaymentElementChangeEvent) => {
      if (event.complete) {
        setErrorMessage(null);
      }
    },
    []
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !elementReady || elementError) return;

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
        // Confirm the purchase on our backend
        try {
          await fetch(
            `/api/venues/${venueId}/purchases/${purchaseId}/confirm`,
            { method: "POST" }
          );
        } catch {
          // Webhook will handle it as fallback
        }
        setIsProcessing(false);
        onSuccess?.();
      }
    } catch (err) {
      console.error("Product payment error:", err);
      setErrorMessage(t("unexpectedError"));
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        onReady={handleElementReady}
        onLoadError={handleElementLoadError}
        onChange={handleElementChange}
      />

      {errorMessage && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          disabled={
            !stripe ||
            !elements ||
            !elementReady ||
            elementError ||
            isProcessing
          }
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

"use client";

import { useState, FormEvent } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

interface CheckoutFormProps {
  paymentIntentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutForm({
  paymentIntentId,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("venues.payment");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
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
        setErrorMessage(paymentError.message || "Payment failed");
        setIsProcessing(false);
      } else {
        // Pagamento bem-sucedido - criar subscrição
        try {
          const confirmResponse = await fetch(
            `/api/payment-intents/${paymentIntentId}/confirm`,
            {
              method: "POST",
            }
          );

          if (!confirmResponse.ok) {
            throw new Error("Failed to activate subscription");
          }

          // Tudo correu bem
          if (onSuccess) {
            onSuccess();
          }
        } catch (confirmError) {
          console.error("Error confirming subscription:", confirmError);
          setErrorMessage(
            "Payment successful but subscription activation failed. Please contact support."
          );
          setIsProcessing(false);
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

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
          disabled={!stripe || isProcessing}
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

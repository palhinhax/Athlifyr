"use client";

import { useCallback } from "react";
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

/**
 * Resolve the confirmation endpoint URL based on the payment type.
 */
function resolveConfirmEndpoint(
  props: Pick<
    CheckoutFormProps,
    | "confirmEndpoint"
    | "isRecurring"
    | "venueId"
    | "stripeSubscriptionId"
    | "paymentIntentId"
  >
): string | null {
  if (props.confirmEndpoint) return props.confirmEndpoint;

  if (props.isRecurring && props.venueId && props.stripeSubscriptionId) {
    return `/api/venues/${props.venueId}/stripe-subscriptions/confirm`;
  }

  if (!props.isRecurring && props.paymentIntentId) {
    return `/api/payment-intents/${props.paymentIntentId}/confirm`;
  }

  return null;
}

/**
 * Build the JSON body to send to the confirmation endpoint.
 */
function resolveConfirmBody(
  props: Pick<
    CheckoutFormProps,
    "confirmBody" | "isRecurring" | "stripeSubscriptionId"
  >
): Record<string, unknown> | undefined {
  if (props.confirmBody) return props.confirmBody;

  if (props.isRecurring && props.stripeSubscriptionId) {
    return { stripeSubscriptionId: props.stripeSubscriptionId };
  }

  return undefined;
}

/**
 * Call the server-side confirmation endpoint after Stripe payment succeeds.
 * Returns an error message string on failure, or null on success / silent handling.
 */
async function callConfirmEndpoint(
  endpoint: string,
  body: Record<string, unknown> | undefined,
  opts: { silentConfirm?: boolean; isRecurring?: boolean },
  t: (key: string) => string
): Promise<string | null> {
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

    if (!confirmResponse.ok && !opts.silentConfirm) {
      throw new Error(t("activationFailed"));
    }

    return null;
  } catch (confirmError) {
    if (opts.silentConfirm) {
      console.warn("Confirm failed, webhook will handle:", confirmError);
      return null;
    }

    if (opts.isRecurring) {
      console.warn(
        "Subscription confirm failed, webhook will handle activation:",
        confirmError
      );
      return null;
    }

    console.error("Error confirming payment:", confirmError);
    return confirmError instanceof Error
      ? confirmError.message
      : t("activationFailed");
  }
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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
          return_url: `${globalThis.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (paymentError) {
        setErrorMessage(paymentError.message || t("paymentFailed"));
        setIsProcessing(false);
        return;
      }

      const endpoint = resolveConfirmEndpoint({
        confirmEndpoint,
        isRecurring,
        venueId,
        stripeSubscriptionId,
        paymentIntentId,
      });

      const body = resolveConfirmBody({
        confirmBody,
        isRecurring,
        stripeSubscriptionId,
      });

      if (endpoint) {
        const errorMsg = await callConfirmEndpoint(
          endpoint,
          body,
          { silentConfirm, isRecurring },
          t
        );

        if (errorMsg) {
          setErrorMessage(errorMsg);
          setIsProcessing(false);
          return;
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

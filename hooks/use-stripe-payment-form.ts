import { useState, useCallback } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripePaymentElementChangeEvent } from "@stripe/stripe-js";

export interface StripePaymentFormState {
  stripe: ReturnType<typeof useStripe>;
  elements: ReturnType<typeof useElements>;
  isProcessing: boolean;
  errorMessage: string | null;
  elementReady: boolean;
  elementError: boolean;
  setIsProcessing: (v: boolean) => void;
  setErrorMessage: (v: string | null) => void;
  handleElementReady: () => void;
  handleElementLoadError: (loadErrorMessage: string) => void;
  handleElementChange: (event: StripePaymentElementChangeEvent) => void;
}

/**
 * Shared hook for Stripe PaymentElement form state management.
 * Encapsulates the common isProcessing / errorMessage / elementReady / elementError
 * state and the three PaymentElement event handlers used by all checkout forms.
 *
 * Usage: call this hook inside a component wrapped with <Elements> from @stripe/react-stripe-js.
 * Pass `handleElementLoadError` a locale-aware error message string when wiring up the
 * PaymentElement's `onLoadError` callback.
 *
 * @returns Stripe context refs, shared state, setters, and stable event handler callbacks.
 */
export function useStripePaymentForm(): StripePaymentFormState {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elementReady, setElementReady] = useState(false);
  const [elementError, setElementError] = useState(false);

  const handleElementReady = useCallback(() => {
    setElementReady(true);
    setElementError(false);
  }, []);

  const handlePaymentElementLoadError = useCallback(
    (loadErrorMessage: string) => {
      setElementError(true);
      setErrorMessage(loadErrorMessage);
    },
    []
  );

  const handleElementChange = useCallback(
    (event: StripePaymentElementChangeEvent) => {
      if (event.complete) {
        setErrorMessage(null);
      }
    },
    []
  );

  return {
    stripe,
    elements,
    isProcessing,
    errorMessage,
    elementReady,
    elementError,
    setIsProcessing,
    setErrorMessage,
    handleElementReady,
    handleElementLoadError: handlePaymentElementLoadError,
    handleElementChange,
  };
}

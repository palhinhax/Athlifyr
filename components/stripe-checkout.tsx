"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";
import { CheckoutForm } from "@/components/checkout-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { PlanDuration } from "@/types/venue-plan";

const RECURRING_DURATIONS: PlanDuration[] = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
];

interface StripeCheckoutProps {
  venueId: string;
  venueName: string;
  planId: string;
  planName: string;
  price: number;
  currency: string;
  duration?: PlanDuration;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripeCheckout({
  venueId,
  venueName,
  planId,
  planName,
  price,
  currency,
  duration,
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const t = useTranslations("venues.plans.checkout");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double-fire from React Strict Mode re-mounting.
    // The first call creates a Stripe subscription; a second call would create
    // a duplicate whose subscriptionId overwrites the state while <Elements>
    // still holds the first clientSecret — causing a mismatch.
    if (initializedRef.current) return;
    initializedRef.current = true;

    const recurring = !!duration && RECURRING_DURATIONS.includes(duration);
    setIsRecurring(recurring);

    const initializePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        if (recurring) {
          // Recurring plan → Stripe Billing subscription
          const response = await fetch(
            `/api/venues/${venueId}/stripe-subscriptions`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ planId }),
            }
          );

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || t("failedCreateSubscription"));
          }

          const data = await response.json();
          setClientSecret(data.clientSecret);
          setStripeSubscriptionId(data.subscriptionId);
          // No paymentIntentId needed — webhook handles activation
        } else {
          // One-time plan → PaymentIntent
          const response = await fetch(
            `/api/venues/${venueId}/payment-intents`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ planId }),
            }
          );

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || t("failedCreatePayment"));
          }

          const data = await response.json();
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntent.id);
        }
      } catch (err) {
        console.error("Error initializing payment:", err);
        setError(err instanceof Error ? err.message : t("failedInitPayment"));
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [venueId, planId, duration]);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#0070f3",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
            {t("paymentError")}
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("goBack")}
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">{t("initializingPayment")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t("completePayment")}</CardTitle>
          <CardDescription>
            {venueName} - {planName}
          </CardDescription>
          <div className="text-2xl font-bold">
            {price} {currency}
          </div>
        </CardHeader>
        <CardContent>
          <CheckoutForm
            venueId={venueId}
            paymentIntentId={paymentIntentId}
            stripeSubscriptionId={stripeSubscriptionId}
            isRecurring={isRecurring}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </Elements>
  );
}

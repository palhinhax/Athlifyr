"use client";

import { useState, useEffect } from "react";
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

interface StripeCheckoutProps {
  venueId: string;
  venueName: string;
  planId: string;
  planName: string;
  price: number;
  currency: string;
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
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Criar Payment Intent
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/venues/${venueId}/payment-intents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize payment"
        );
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [venueId, planId]);

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
          <CardTitle className="text-destructive">Payment Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Go back
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Initializing payment...</p>
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
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>
            {venueName} - {planName}
          </CardDescription>
          <div className="text-2xl font-bold">
            {price} {currency}
          </div>
        </CardHeader>
        <CardContent>
          <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
        </CardContent>
      </Card>
    </Elements>
  );
}

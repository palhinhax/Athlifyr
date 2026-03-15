"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ProductCheckoutForm } from "@/components/product-checkout-form";

interface ProductCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  venueName: string;
  product: {
    id: string;
    name: string;
    price: number;
    currency: string;
  } | null;
  quantity: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductCheckoutDialog({
  open,
  onOpenChange,
  venueId,
  venueName,
  product,
  quantity,
  onSuccess,
  onCancel,
}: ProductCheckoutDialogProps) {
  const t = useTranslations("venues.shop.checkout");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [purchaseId, setPurchaseId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const totalAmount = product ? product.price * quantity : 0;

  const initializePayment = async () => {
    if (!product || initialized) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/venues/${venueId}/products/${product.id}/purchase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("failedCreatePayment"));
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPurchaseId(data.purchase.id);
      setInitialized(true);
    } catch (err) {
      console.error("Error initializing product payment:", err);
      setError(err instanceof Error ? err.message : t("failedCreatePayment"));
    } finally {
      setLoading(false);
    }
  };

  // Initialize payment when dialog opens
  if (open && product && !initialized && !loading && !error) {
    initializePayment();
  }

  // Reset state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setClientSecret("");
      setPurchaseId("");
      setInitialized(false);
      setError(null);
      setLoading(false);
    }
    onOpenChange(isOpen);
  };

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

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {product && (
              <>
                {venueName} - {product.name}
                {quantity > 1 && ` x${quantity}`}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Spinner className="h-8 w-8" />
            </CardContent>
          </Card>
        )}

        {error && (
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
        )}

        {clientSecret && product && (
          <Elements stripe={getStripe()} options={{ clientSecret, appearance }}>
            <Card>
              <CardHeader>
                <CardTitle>{t("completePayment")}</CardTitle>
                <CardDescription>
                  {product.name}
                  {quantity > 1 && ` x${quantity}`}
                </CardDescription>
                <div className="text-2xl font-bold">
                  {totalAmount.toFixed(2)} {product.currency}
                </div>
              </CardHeader>
              <CardContent>
                <ProductCheckoutForm
                  venueId={venueId}
                  purchaseId={purchaseId}
                  onSuccess={onSuccess}
                  onCancel={onCancel}
                />
              </CardContent>
            </Card>
          </Elements>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

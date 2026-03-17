"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ProductCheckoutForm } from "@/components/product-checkout-form";
import { requiresCreditsOnly } from "@/lib/credits/purchase-service";
import { Coins, CreditCard, AlertCircle } from "lucide-react";

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

type PaymentMethod = "credits" | "stripe" | null;

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
  const tc = useTranslations("credits.purchase");
  const tcBase = useTranslations("credits");

  // Stripe payment state
  const [clientSecret, setClientSecret] = useState<string>("");
  const [purchaseId, setPurchaseId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Credits state
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [creditsPurchasing, setCreditsPurchasing] = useState(false);
  const [creditsSuccess, setCreditsSuccess] = useState(false);

  const totalAmount = product ? product.price * quantity : 0;
  const totalAmountCents = Math.round(totalAmount * 100);
  const isCreditsOnly = requiresCreditsOnly(totalAmountCents);
  const hasEnoughCredits =
    walletBalance !== null && walletBalance >= totalAmountCents;

  // Fetch wallet balance when dialog opens
  useEffect(() => {
    if (open && product && walletBalance === null && !walletLoading) {
      setWalletLoading(true);
      fetch("/api/credits/wallet")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.wallet) {
            setWalletBalance(data.wallet.balanceCents);
          } else {
            setWalletBalance(0);
          }
        })
        .catch(() => setWalletBalance(0))
        .finally(() => setWalletLoading(false));
    }
  }, [open, product, walletBalance, walletLoading]);

  // Auto-select credits if credits-only and has balance
  useEffect(() => {
    if (isCreditsOnly && hasEnoughCredits && selectedMethod === null) {
      setSelectedMethod("credits");
    }
  }, [isCreditsOnly, hasEnoughCredits, selectedMethod]);

  const initializeStripePayment = useCallback(async () => {
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
  }, [product, initialized, venueId, quantity, t]);

  const handleCreditsPurchase = useCallback(async () => {
    if (!product) return;

    setCreditsPurchasing(true);
    setError(null);

    try {
      const response = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId,
          productId: product.id,
          quantity,
        }),
      });

      if (response.status === 402) {
        const data = await response.json();
        setError(
          tc("insufficientCreditsDescription", {
            required: (data.requiredAmountCents / 100).toFixed(2),
            current: (data.currentBalanceCents / 100).toFixed(2),
          })
        );
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || tc("purchaseFailed"));
      }

      setCreditsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : tc("purchaseFailed"));
    } finally {
      setCreditsPurchasing(false);
    }
  }, [product, venueId, quantity, tc, onSuccess]);

  // When user selects Stripe method, initialize payment
  useEffect(() => {
    if (selectedMethod === "stripe" && !initialized && !loading && !error) {
      initializeStripePayment();
    }
  }, [selectedMethod, initialized, loading, error, initializeStripePayment]);

  // Reset state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setClientSecret("");
      setPurchaseId("");
      setInitialized(false);
      setError(null);
      setLoading(false);
      setWalletBalance(null);
      setWalletLoading(false);
      setSelectedMethod(null);
      setCreditsPurchasing(false);
      setCreditsSuccess(false);
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

        {/* Credits success */}
        {creditsSuccess && (
          <div className="py-8 text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-medium text-green-600">
              {tc("purchaseSuccess")}
            </p>
          </div>
        )}

        {/* Loading wallet */}
        {!creditsSuccess && walletLoading && (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <Spinner className="h-8 w-8" />
            </CardContent>
          </Card>
        )}

        {/* Payment method selection - shown when wallet loaded and no method selected yet */}
        {!creditsSuccess &&
          !walletLoading &&
          walletBalance !== null &&
          selectedMethod === null && (
            <div className="space-y-4">
              {/* Product summary */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {totalAmount.toFixed(2)} {product?.currency ?? "EUR"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product?.name}
                      {quantity > 1 && ` x${quantity}`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Credits option */}
              {hasEnoughCredits && (
                <Button
                  className="w-full justify-start gap-3 py-6"
                  variant="outline"
                  onClick={() => setSelectedMethod("credits")}
                >
                  <Coins className="h-5 w-5 text-amber-500" />
                  <div className="text-left">
                    <p className="font-medium">{tc("payWithCredits")}</p>
                    <p className="text-xs text-muted-foreground">
                      {tcBase("balance")}: {(walletBalance / 100).toFixed(2)}{" "}
                      {tcBase("credits")}
                    </p>
                  </div>
                </Button>
              )}

              {/* Insufficient credits for credits-only items */}
              {!hasEnoughCredits && isCreditsOnly && (
                <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                  <CardContent className="flex items-start gap-3 pt-6">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">{tc("creditsOnly")}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {tc("insufficientCreditsDescription", {
                          required: (totalAmountCents / 100).toFixed(2),
                          current: ((walletBalance ?? 0) / 100).toFixed(2),
                        })}
                      </p>
                      <Button
                        size="sm"
                        variant="link"
                        className="mt-1 h-auto p-0 text-amber-600"
                        onClick={() => {
                          handleOpenChange(false);
                          globalThis.location.href = "/credits";
                        }}
                      >
                        {tc("topUpFirst")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stripe option (only for items above threshold or if no credits) */}
              {!isCreditsOnly && (
                <Button
                  className="w-full justify-start gap-3 py-6"
                  variant="outline"
                  onClick={() => setSelectedMethod("stripe")}
                >
                  <CreditCard className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">{t("pay")}</p>
                    <p className="text-xs text-muted-foreground">
                      {totalAmount.toFixed(2)} {product?.currency ?? "EUR"}
                    </p>
                  </div>
                </Button>
              )}

              {/* Cancel button */}
              <Button variant="ghost" className="w-full" onClick={onCancel}>
                {t("cancel")}
              </Button>
            </div>
          )}

        {/* Credits payment flow */}
        {!creditsSuccess && selectedMethod === "credits" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Coins className="mx-auto mb-2 h-8 w-8 text-amber-500" />
                  <div className="text-2xl font-bold">
                    {totalAmount.toFixed(2)} {tcBase("credits")}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product?.name}
                    {quantity > 1 && ` x${quantity}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tcBase("balance")}:{" "}
                    {((walletBalance ?? 0) / 100).toFixed(2)}{" "}
                    {tcBase("credits")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedMethod(null);
                  setError(null);
                }}
                disabled={creditsPurchasing}
              >
                {t("cancel")}
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreditsPurchase}
                disabled={creditsPurchasing}
              >
                {creditsPurchasing && <Spinner className="mr-2 h-4 w-4" />}
                {tc("payWithCredits")}
              </Button>
            </div>
          </div>
        )}

        {/* Stripe payment flow */}
        {!creditsSuccess && selectedMethod === "stripe" && (
          <>
            {loading && (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <Spinner className="h-8 w-8" />
                </CardContent>
              </Card>
            )}

            {error && !loading && (
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
              <Elements
                stripe={getStripe()}
                options={{ clientSecret, appearance }}
              >
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
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

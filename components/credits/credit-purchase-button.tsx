"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CREDITS_ONLY_THRESHOLD_CENTS } from "@/lib/credits/constants";

interface CreditPurchaseButtonProps {
  itemId: string;
  itemType: string;
  amountCents: number;
  venueId: string;
  description: string;
  userBalanceCents: number;
  onSuccess?: () => void;
  onInsufficientCredits?: () => void;
  className?: string;
}

export function CreditPurchaseButton({
  itemId,
  itemType,
  amountCents,
  venueId,
  description,
  userBalanceCents,
  onSuccess,
  onInsufficientCredits,
  className,
}: CreditPurchaseButtonProps) {
  const t = useTranslations("credits");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCreditsOnly = amountCents <= CREDITS_ONLY_THRESHOLD_CENTS;
  const hasEnoughCredits = userBalanceCents >= amountCents;

  const handleClick = useCallback(() => {
    if (!hasEnoughCredits) {
      onInsufficientCredits?.();
      return;
    }
    setShowConfirm(true);
  }, [hasEnoughCredits, onInsufficientCredits]);

  const handleConfirm = useCallback(async () => {
    setIsProcessing(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          itemType,
          amountCents,
          venueId,
          description,
        }),
      });

      if (res.status === 402) {
        setShowConfirm(false);
        onInsufficientCredits?.();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("purchase.purchaseFailed"));
      }

      setResult("success");
      onSuccess?.();
      setTimeout(() => {
        setShowConfirm(false);
        setResult(null);
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : t("purchase.purchaseFailed")
      );
      setResult("error");
    } finally {
      setIsProcessing(false);
    }
  }, [
    itemId,
    itemType,
    amountCents,
    venueId,
    description,
    t,
    onSuccess,
    onInsufficientCredits,
  ]);

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={!hasEnoughCredits && isCreditsOnly}
        className={className}
        variant={hasEnoughCredits ? "default" : "outline"}
      >
        {hasEnoughCredits
          ? t("purchase.payWithCredits")
          : t("purchase.insufficientCredits")}
        <span className="ml-1.5 text-sm opacity-80">
          ({(amountCents / 100).toFixed(2)} {t("credits")})
        </span>
      </Button>

      {!hasEnoughCredits && (
        <p className="mt-1 text-xs text-muted-foreground">
          {isCreditsOnly
            ? t("purchase.creditsOnly")
            : t("purchase.creditsOrCard")}
        </p>
      )}

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("purchase.payWithCredits")}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {result === "success" ? (
            <div className="py-6 text-center">
              <p className="text-2xl">✅</p>
              <p className="mt-2 font-medium text-green-600">
                {t("purchase.purchaseSuccess")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-2xl font-bold">
                  {(amountCents / 100).toFixed(2)} {t("credits")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("balance")}: {(userBalanceCents / 100).toFixed(2)}{" "}
                  {t("credits")}
                </p>
              </div>

              {result === "error" && errorMessage && (
                <p className="text-center text-sm text-destructive">
                  {errorMessage}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {t("purchase.cancel") ?? "Cancel"}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? <Spinner className="mr-2 h-4 w-4" /> : null}
                  {t("purchase.payWithCredits")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

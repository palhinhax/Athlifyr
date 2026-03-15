"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";

interface PurchaseSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueName: string;
  venueLogo?: string | null;
  productName: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  purchasedAt: Date | null;
}

export function PurchaseSuccessDialog({
  open,
  onOpenChange,
  venueName,
  venueLogo,
  productName,
  quantity,
  totalAmount,
  currency,
  purchasedAt,
}: PurchaseSuccessDialogProps) {
  const t = useTranslations("venues.shop.success");
  const [elapsed, setElapsed] = useState("00:00");

  const formatElapsed = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!open || !purchasedAt) {
      setElapsed("00:00");
      return;
    }

    const tick = () => {
      const diff = Date.now() - purchasedAt.getTime();
      setElapsed(formatElapsed(diff));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [open, purchasedAt, formatElapsed]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm text-center">
        <AlertDialogHeader className="flex flex-col items-center gap-4">
          {/* Animated checkmark */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-12 w-12 text-green-600 duration-300 animate-in zoom-in-50 dark:text-green-400" />
          </div>

          <AlertDialogTitle className="text-xl">{t("title")}</AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {/* Venue info */}
              <div className="flex items-center justify-center gap-3">
                {venueLogo ? (
                  <Image
                    src={venueLogo}
                    alt={venueName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                    {venueName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground">
                  {venueName}
                </span>
              </div>

              {/* Product details */}
              <div className="rounded-lg border bg-muted/50 p-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{productName}</p>
                    {quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        x{quantity}
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {totalAmount.toFixed(2)} {currency}
                  </p>
                </div>
              </div>

              {/* Live timer */}
              <div className="flex items-center justify-center gap-2 rounded-md bg-muted/30 px-3 py-2">
                <Clock className="h-4 w-4 animate-pulse text-green-600 dark:text-green-400" />
                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  {t("elapsed")} {elapsed}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {t("description")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            {t("close")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

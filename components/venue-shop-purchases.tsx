"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Receipt, RotateCcw, RefreshCw } from "lucide-react";
import { formatDistanceToNow, type Locale } from "date-fns";
import { enUS, pt, es, fr, de, it } from "date-fns/locale";
import { useLocale } from "next-intl";

const DATE_LOCALES: Record<string, Locale> = {
  en: enUS,
  pt: pt,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface Purchase {
  id: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: "CREATED" | "CONFIRMED" | "FAILED" | "CANCELLED" | "REFUNDED";
  createdAt: string;
  confirmedAt: string | null;
  product: { name: string };
  user: { name: string | null; email: string | null; image: string | null };
}

interface VenueShopPurchasesProps {
  venueId: string;
}

export function VenueShopPurchases({ venueId }: VenueShopPurchasesProps) {
  const t = useTranslations("venues.shop.purchases");
  const locale = useLocale();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [confirmRefundId, setConfirmRefundId] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/venues/${venueId}/purchases`);
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases);
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPurchases, 30000);
    return () => clearInterval(interval);
  }, [fetchPurchases]);

  const handleRefund = async (purchaseId: string) => {
    setRefundingId(purchaseId);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/purchases/${purchaseId}/refund`,
        { method: "POST" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("refundFailed"));
      }

      toast({ title: t("refundSuccess") });
      fetchPurchases();
    } catch (error) {
      toast({
        title: t("refundFailed"),
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setRefundingId(null);
      setConfirmRefundId(null);
    }
  };

  const statusBadge = (status: Purchase["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge variant="default" className="bg-green-600">
            {t("statusConfirmed")}
          </Badge>
        );
      case "CREATED":
        return <Badge variant="secondary">{t("statusPending")}</Badge>;
      case "REFUNDED":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            {t("statusRefunded")}
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">{t("statusFailed")}</Badge>;
      case "CANCELLED":
        return <Badge variant="outline">{t("statusCancelled")}</Badge>;
    }
  };

  const dateLocale = DATE_LOCALES[locale] || enUS;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          {purchases.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {purchases.length}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchPurchases}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Receipt className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={purchase.user.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {(purchase.user.name || purchase.user.email || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-sm">
                        {purchase.user.name || purchase.user.email}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {formatDistanceToNow(new Date(purchase.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  {statusBadge(purchase.status)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {purchase.product.name}
                      {purchase.quantity > 1 && (
                        <span className="text-muted-foreground">
                          {" "}
                          x{purchase.quantity}
                        </span>
                      )}
                    </p>
                    <p className="text-base font-bold">
                      {purchase.totalAmount.toFixed(2)} {purchase.currency}
                    </p>
                  </div>
                  {purchase.status === "CONFIRMED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmRefundId(purchase.id)}
                      disabled={refundingId === purchase.id}
                    >
                      {refundingId === purchase.id ? (
                        <Spinner className="h-3 w-3" />
                      ) : (
                        <>
                          <RotateCcw className="mr-1 h-3 w-3" />
                          {t("refund")}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Refund Confirmation Dialog */}
      <AlertDialog
        open={!!confirmRefundId}
        onOpenChange={(open) => !open && setConfirmRefundId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("refundConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("refundConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmRefundId && handleRefund(confirmRefundId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("confirmRefund")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

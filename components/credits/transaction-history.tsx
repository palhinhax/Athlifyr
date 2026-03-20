"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowUpRight, ArrowDownLeft, Gift, Settings2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: string;
  source: string;
  amountCents: number;
  balanceAfterCents: number;
  description: string | null;
  createdAt: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

function formatCredits(cents: number): string {
  const value = cents / 100;
  return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
}

function getTransactionIcon(type: string) {
  switch (type) {
    case "TOP_UP":
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    case "PURCHASE":
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    case "REFUND":
      return <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
    case "REWARD":
      return <Gift className="h-4 w-4 text-amber-500" />;
    case "MANUAL_ADJUSTMENT":
      return <Settings2 className="h-4 w-4 text-gray-500" />;
    default:
      return <ArrowDownLeft className="h-4 w-4 text-gray-400" />;
  }
}

export function TransactionHistory({
  transactions,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: Readonly<TransactionHistoryProps>) {
  const t = useTranslations("credits");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("history")}</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("historyEmpty")}
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b py-2 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <p className="text-sm font-medium">
                      {t(`transactionTypes.${tx.type}`)}
                    </p>
                    {tx.description && (
                      <p className="text-xs text-muted-foreground">
                        {tx.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      tx.amountCents >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCredits(tx.amountCents)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(tx.balanceAfterCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    t("noMoreTransactions")
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

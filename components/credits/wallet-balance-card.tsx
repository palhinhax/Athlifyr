"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WalletBalanceCardProps {
  balanceCents: number;
  totalTopUpCents: number;
  totalSpentCents: number;
  totalRewardedCents: number;
  onTopUp: () => void;
}

function formatCredits(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function WalletBalanceCard({
  balanceCents,
  totalTopUpCents,
  totalSpentCents,
  totalRewardedCents,
  onTopUp,
}: Readonly<WalletBalanceCardProps>) {
  const t = useTranslations("credits");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{t("wallet")}</CardTitle>
        <Button onClick={onTopUp} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          {t("addCredits")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-4xl font-bold">{formatCredits(balanceCents)}</p>
          <p className="text-sm text-muted-foreground">{t("credits")}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-muted-foreground">
              {t("transactionTypes.TOP_UP")}
            </p>
            <p className="font-medium">{formatCredits(totalTopUpCents)}€</p>
          </div>
          <div>
            <p className="text-muted-foreground">
              {t("transactionTypes.PURCHASE")}
            </p>
            <p className="font-medium">{formatCredits(totalSpentCents)}€</p>
          </div>
          <div>
            <p className="text-muted-foreground">
              {t("transactionTypes.REWARD")}
            </p>
            <p className="font-medium">{formatCredits(totalRewardedCents)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

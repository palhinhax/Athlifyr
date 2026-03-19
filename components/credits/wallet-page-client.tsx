"use client";

import { useTranslations } from "next-intl";
import { useCreditsWallet } from "@/hooks/use-credits-wallet";
import { WalletBalanceCard } from "./wallet-balance-card";
import { TransactionHistory } from "./transaction-history";
import { TopUpDialog } from "./top-up-dialog";
import { CreditLegalDisclaimer } from "./credit-legal-disclaimer";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export function WalletPageClient() {
  const t = useTranslations("credits");
  const {
    wallet,
    transactions,
    topUpOptions,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  } = useCreditsWallet();
  const [topUpOpen, setTopUpOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={refresh}
          className="text-primary underline hover:no-underline"
        >
          {t("topUpFailed")}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <WalletBalanceCard
        balanceCents={wallet?.balanceCents ?? 0}
        totalTopUpCents={wallet?.totalTopUpCents ?? 0}
        totalSpentCents={wallet?.totalSpentCents ?? 0}
        totalRewardedCents={wallet?.totalRewardedCents ?? 0}
        onTopUp={() => setTopUpOpen(true)}
      />

      <TransactionHistory
        transactions={transactions}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />

      <CreditLegalDisclaimer />

      <TopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        topUpOptions={topUpOptions}
        onSuccess={refresh}
      />
    </div>
  );
}

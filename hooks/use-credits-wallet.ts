"use client";

import { useState, useEffect, useCallback } from "react";

interface WalletData {
  balanceCents: number;
  totalTopUpCents: number;
  totalSpentCents: number;
  totalRewardedCents: number;
}

interface Transaction {
  id: string;
  type: string;
  source: string;
  amountCents: number;
  balanceAfterCents: number;
  description: string | null;
  grossAmountCents: number | null;
  platformFeeCents: number | null;
  netCreditedCents: number | null;
  venueId: string | null;
  createdAt: string;
  expiresAt: string | null;
}

interface TopUpOption {
  amountCents: number;
  feeCents: number;
  netCreditsCents: number;
}

export function useCreditsWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [topUpOptions, setTopUpOptions] = useState<TopUpOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch("/api/credits/wallet");
      if (!res.ok) throw new Error("Failed to fetch wallet");
      const data = await res.json();
      setWallet(data.wallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wallet");
    }
  }, []);

  const fetchTransactions = useCallback(async (cursor?: string) => {
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      params.set("limit", "20");

      const res = await fetch(`/api/credits/transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();

      if (cursor) {
        setTransactions((prev) => [...prev, ...data.items]);
      } else {
        setTransactions(data.items);
      }
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    }
  }, []);

  const fetchTopUpOptions = useCallback(async () => {
    try {
      const res = await fetch("/api/credits/top-up");
      if (!res.ok) throw new Error("Failed to fetch top-up options");
      const data = await res.json();
      setTopUpOptions(data.topUpOptions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load top-up options"
      );
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || !nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchTransactions(nextCursor);
    setIsLoadingMore(false);
  }, [hasMore, nextCursor, isLoadingMore, fetchTransactions]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await Promise.all([
      fetchWallet(),
      fetchTransactions(),
      fetchTopUpOptions(),
    ]);
    setIsLoading(false);
  }, [fetchWallet, fetchTransactions, fetchTopUpOptions]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    wallet,
    transactions,
    topUpOptions,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}

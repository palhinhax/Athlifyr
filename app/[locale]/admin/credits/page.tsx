"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Search,
  Coins,
  ArrowUpDown,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface UserWalletData {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  wallet: {
    balanceCents: number;
    createdAt: string;
  } | null;
  transactions: Array<{
    id: string;
    type: string;
    source: string;
    amountCents: number;
    balanceAfterCents: number;
    description: string | null;
    createdAt: string;
  }>;
  topUps: Array<{
    id: string;
    grossAmountCents: number;
    feeAmountCents: number;
    netCreditsCents: number;
    status: string;
    createdAt: string;
  }>;
}

interface VenueOverviewItem {
  venueId: string;
  venue: {
    id: string;
    name: string;
    slug: string;
    stripeAccountId: string | null;
    stripePayoutsEnabled: boolean;
  } | null;
  pendingAmountCents: number;
  pendingEntriesCount: number;
}

interface SettlementBatch {
  id: string;
  venueId: string;
  totalAmountCents: number;
  currency: string;
  status: string;
  entriesCount: number;
  periodStart: string;
  periodEnd: string;
  processedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  stripeTransferId: string | null;
  createdAt: string;
  venue: { id: string; name: string; slug: string } | null;
}

interface SettlementData {
  overview: VenueOverviewItem[];
  recentSettlements: SettlementBatch[];
}

export default function AdminCreditsPage() {
  const t = useTranslations("credits.admin");
  const [activeView, setActiveView] = useState<"users" | "settlements">(
    "users"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeView === "users" ? "default" : "outline"}
          onClick={() => setActiveView("users")}
          size="sm"
        >
          <Coins className="mr-2 h-4 w-4" />
          {t("userCredits")}
        </Button>
        <Button
          variant={activeView === "settlements" ? "default" : "outline"}
          onClick={() => setActiveView("settlements")}
          size="sm"
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {t("settlements")}
        </Button>
      </div>

      {activeView === "users" && <AdminCreditsUserView />}
      {activeView === "settlements" && <AdminCreditsSettlementsView />}
    </div>
  );
}

function AdminCreditsUserView() {
  const t = useTranslations("credits.admin");
  const tc = useTranslations("credits");
  const [userId, setUserId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userData, setUserData] = useState<UserWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Search failed");
      const users = await res.json();
      setSearchResults(users);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInput = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => searchUsers(value), 300);
    },
    [searchUsers]
  );

  const fetchUser = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/credits/${encodeURIComponent(id)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "User not found");
      }
      const data = await res.json();
      setUserData({
        user: data.user,
        wallet: data.wallet?.createdAt ? data.wallet : null,
        transactions: data.recentTransactions ?? [],
        topUps: data.topUps ?? [],
      });
      setUserId(data.user?.id ?? id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectUser = useCallback(
    (id: string) => {
      setSearchInput("");
      setSearchResults([]);
      fetchUser(id);
    },
    [fetchUser]
  );

  const handleAdjust = useCallback(async () => {
    const cents = Math.round(parseFloat(adjustAmount) * 100);
    if (isNaN(cents) || cents === 0) return;

    setIsAdjusting(true);
    try {
      const res = await fetch(
        `/api/admin/credits/${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amountCents: cents, note: adjustNote }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Adjustment failed");
      }
      setAdjustOpen(false);
      setAdjustAmount("");
      setAdjustNote("");
      fetchUser(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Adjustment failed");
    } finally {
      setIsAdjusting(false);
    }
  }, [userId, adjustAmount, adjustNote, fetchUser]);

  return (
    <div className="space-y-4">
      {/* User search */}
      <div className="relative max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchUser")}
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {isSearching && (
          <div className="flex items-center justify-center py-4">
            <Spinner className="h-5 w-5" />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-[300px] w-full space-y-1 overflow-y-auto rounded-md border bg-popover p-2 shadow-md">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => selectUser(user.id)}
                className="flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors hover:bg-muted"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {user.name?.[0] || user.email?.[0] || "?"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.name || "Sem nome"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {searchInput.length >= 2 &&
          !isSearching &&
          searchResults.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("noResults")}
            </p>
          )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {userData && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">
                  {userData.user.name ?? userData.user.email ?? userId}
                </CardTitle>
                {userData.user.email && (
                  <p className="text-sm text-muted-foreground">
                    {userData.user.email}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAdjustOpen(true)}
              >
                {t("adjustCredits")}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {((userData.wallet?.balanceCents ?? 0) / 100).toFixed(2)}{" "}
                {tc("credits")}
              </p>
              {userData.wallet?.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Wallet created:{" "}
                  {new Date(userData.wallet.createdAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{tc("history")}</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {tc("historyEmpty")}
                </p>
              ) : (
                <div className="space-y-2">
                  {userData.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {tc(`transactionTypes.${tx.type}`)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${tx.amountCents >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {tx.amountCents >= 0 ? "+" : ""}
                          {(tx.amountCents / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          → {(tx.balanceAfterCents / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top-Ups</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.topUps.length === 0 ? (
                <p className="text-sm text-muted-foreground">No top-ups yet</p>
              ) : (
                <div className="space-y-2">
                  {userData.topUps.map((topUp) => (
                    <div
                      key={topUp.id}
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm">
                          {(topUp.grossAmountCents / 100).toFixed(2)}€ →{" "}
                          {(topUp.netCreditsCents / 100).toFixed(2)}{" "}
                          {tc("credits")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Fee: {(topUp.feeAmountCents / 100).toFixed(2)}€
                        </p>
                      </div>
                      <Badge
                        variant={
                          topUp.status === "COMPLETED"
                            ? "default"
                            : topUp.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {topUp.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("adjustCredits")}</DialogTitle>
            <DialogDescription>{t("addAmount")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {t("addAmount")} (€)
              </label>
              <Input
                type="number"
                step="0.01"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="e.g. 5.00 or -2.50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("note")}</label>
              <Input
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                placeholder="Reason for adjustment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAdjust}
              disabled={isAdjusting || !adjustAmount}
            >
              {isAdjusting ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {t("adjustCredits")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminCreditsSettlementsView() {
  const t = useTranslations("credits.admin");
  const tCommon = useTranslations("common");
  const [data, setData] = useState<SettlementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState<string | null>(null);
  const [settleTarget, setSettleTarget] = useState<{
    venueId: string;
    venueName: string;
    amountCents: number;
  } | null>(null);

  const fetchSettlements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/credits/settlements");
      if (!res.ok) throw new Error("Failed to fetch settlements");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleRetry = useCallback(
    async (batchId: string) => {
      setIsRetrying(batchId);
      try {
        const res = await fetch("/api/admin/credits/settlements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchId }),
        });
        if (!res.ok) throw new Error("Retry failed");
        fetchSettlements();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Retry failed");
      } finally {
        setIsRetrying(null);
      }
    },
    [fetchSettlements]
  );

  const handleSettleConfirm = useCallback(async () => {
    if (!settleTarget) return;
    const { venueId } = settleTarget;
    setSettleTarget(null);
    setIsSettling(venueId);
    try {
      const res = await fetch("/api/admin/credits/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "settle", venueId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? t("settleFailed"));
      }
      fetchSettlements();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("settleFailed"));
    } finally {
      setIsSettling(null);
    }
  }, [settleTarget, fetchSettlements, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{error}</p>
        <Button onClick={fetchSettlements} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("refresh")}
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const totalPendingCents = data.overview.reduce(
    (sum, v) => sum + v.pendingAmountCents,
    0
  );

  return (
    <div className="space-y-4">
      {/* Total pending summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{t("pendingSettlements")}</CardTitle>
          <Button onClick={fetchSettlements} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {(totalPendingCents / 100).toFixed(2)}€
          </p>
          <p className="text-sm text-muted-foreground">
            {t("totalPending")} — {data.overview.length}{" "}
            {data.overview.length === 1 ? "venue" : "venues"}
          </p>
        </CardContent>
      </Card>

      {/* Per-venue breakdown */}
      {data.overview.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">{t("noPending")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.overview.map((item) => (
            <Card key={item.venueId}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {item.venue?.name ?? item.venueId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.pendingEntriesCount} {t("transactions")}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.venue?.stripeAccountId ? (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600"
                        >
                          {t("stripeConnected")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs text-red-600"
                        >
                          {t("stripeNotConnected")}
                        </Badge>
                      )}
                      {item.venue?.stripePayoutsEnabled ? (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600"
                        >
                          {t("payoutsEnabled")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs text-amber-600"
                        >
                          {t("payoutsDisabled")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xl font-bold">
                      {(item.pendingAmountCents / 100).toFixed(2)}€
                    </p>
                    {item.venue?.stripeAccountId &&
                      item.venue.stripePayoutsEnabled &&
                      item.pendingAmountCents > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSettleTarget({
                              venueId: item.venueId,
                              venueName: item.venue?.name ?? item.venueId,
                              amountCents: item.pendingAmountCents,
                            })
                          }
                          disabled={isSettling === item.venueId}
                        >
                          {isSettling === item.venueId ? (
                            <Spinner className="h-3 w-3" />
                          ) : (
                            t("settleNow")
                          )}
                        </Button>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Settlement history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("settlementHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentSettlements.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noBatches")}</p>
          ) : (
            <div className="space-y-3">
              {data.recentSettlements.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {batch.venue?.name ?? batch.venueId}
                    </p>
                    <p className="text-lg font-bold">
                      {(batch.totalAmountCents / 100).toFixed(2)}€
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("period")}:{" "}
                      {new Date(batch.periodStart).toLocaleDateString()} –{" "}
                      {new Date(batch.periodEnd).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {batch.entriesCount} {t("transactions")} ·{" "}
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </p>
                    {batch.stripeTransferId && (
                      <p className="font-mono text-xs text-muted-foreground">
                        {batch.stripeTransferId}
                      </p>
                    )}
                    {batch.failureReason && (
                      <p className="text-xs text-destructive">
                        {batch.failureReason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        batch.status === "COMPLETED"
                          ? "default"
                          : batch.status === "FAILED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {batch.status}
                    </Badge>
                    {batch.status === "FAILED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetry(batch.id)}
                        disabled={isRetrying === batch.id}
                      >
                        {isRetrying === batch.id ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          <>
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {t("retry")}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settlement confirmation dialog */}
      <AlertDialog
        open={!!settleTarget}
        onOpenChange={(open) => !open && setSettleTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settleVenue")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("settleConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {settleTarget && (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-semibold">{settleTarget.venueName}</p>
              <p className="mt-1 text-2xl font-bold">
                {(settleTarget.amountCents / 100).toFixed(2)}€
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSettleTarget(null)}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSettleConfirm}>
              {t("settleNow")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

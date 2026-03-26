"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ScanSearch,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  CalendarDays,
  MapPin,
  Shield,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";

interface DedupEventSummary {
  id: string;
  title: string;
  source_name: string;
  city: string | null;
  country: string;
  start_date: string | null;
  sport_types: string | null;
  image_url: string | null;
  review_status: string;
  external_url: string | null;
  created_at: string;
}

interface DedupPairItem {
  id: string;
  event_a: DedupEventSummary;
  event_b: DedupEventSummary;
  primary_event_id: string | null;
  status: "pending" | "confirmed" | "rejected";
  similarity_score: number;
  reasons: string[];
  created_at: string;
}

interface PaginatedDedupPairs {
  items: DedupPairItem[];
  total: number;
  page: number;
  page_size: number;
  pending_count: number;
}

interface ScrapingDedupProps {
  apiUrl: string;
  onPendingCountChange?: (count: number) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ScoreBar({ score }: Readonly<{ score: number }>) {
  const pct = Math.round(score * 100);
  let color = "bg-yellow-400";
  if (pct >= 80) color = "bg-red-500";
  else if (pct >= 60) color = "bg-orange-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-muted">
        <div
          className={`h-1.5 rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{pct}%</span>
    </div>
  );
}

function EventCard({
  event,
  isPrimary,
  t,
}: Readonly<{
  event: DedupEventSummary;
  isPrimary: boolean | null;
  t: ReturnType<typeof useTranslations>;
}>) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-lg border p-3 text-sm">
      {/* Source + primary badge */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {event.source_name}
        </Badge>
        {isPrimary === true && (
          <Badge className="gap-1 bg-emerald-600 text-xs text-white">
            <Shield className="h-3 w-3" />
            {t("primary")}
          </Badge>
        )}
        {isPrimary === false && (
          <Badge
            variant="outline"
            className="gap-1 text-xs text-muted-foreground"
          >
            {t("secondary")}
          </Badge>
        )}
      </div>

      {/* Title */}
      <p className="font-medium leading-snug">{event.title}</p>

      {/* Date + City */}
      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
        {event.start_date && (
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3 shrink-0" />
            {formatDate(event.start_date)}
          </span>
        )}
        {event.city && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {event.city}, {event.country}
          </span>
        )}
      </div>

      {/* Review status */}
      <Badge
        variant={event.review_status === "approved" ? "default" : "outline"}
        className="w-fit text-xs"
      >
        {event.review_status}
      </Badge>

      {/* External link */}
      {event.external_url && (
        <a
          href={event.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          {t("viewEvent")}
        </a>
      )}

      {/* Created at */}
      <p className="text-xs text-muted-foreground">
        {t("createdAt")}: {formatDate(event.created_at)}
      </p>
    </div>
  );
}

function PairCard({
  pair,
  onConfirm,
  onReject,
  rejectingId,
  t,
}: Readonly<{
  pair: DedupPairItem;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  rejectingId: string | null;
  t: ReturnType<typeof useTranslations>;
}>) {
  const primaryA = pair.primary_event_id
    ? pair.primary_event_id === pair.event_a.id
    : null;
  const primaryB = pair.primary_event_id
    ? pair.primary_event_id === pair.event_b.id
    : null;

  const reasonLabel = (r: string) => {
    const map: Record<string, string> = {
      near_identical_name: t("reasons.nearIdenticalName"),
      similar_name: t("reasons.similarName"),
      close_dates: t("reasons.closeDates"),
      same_location: t("reasons.sameLocation"),
    };
    return map[r] ?? r;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-4">
        {/* Header: score + reasons + status */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t("similarity")}
            </span>
            <ScoreBar score={pair.similarity_score} />
          </div>
          <div className="flex flex-wrap gap-1">
            {pair.reasons.map((r) => (
              <Badge key={r} variant="secondary" className="text-xs">
                {reasonLabel(r)}
              </Badge>
            ))}
          </div>
          <div className="ml-auto">
            {pair.status === "confirmed" && (
              <Badge className="bg-emerald-600 text-xs text-white">
                {t("statusConfirmed")}
              </Badge>
            )}
            {pair.status === "rejected" && (
              <Badge variant="destructive" className="text-xs">
                {t("statusRejected")}
              </Badge>
            )}
            {pair.status === "pending" && (
              <Badge variant="outline" className="text-xs">
                {t("statusPending")}
              </Badge>
            )}
          </div>
        </div>

        {/* Two event cards */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <EventCard event={pair.event_a} isPrimary={primaryA} t={t} />
          <div className="hidden shrink-0 items-center justify-center text-xs font-bold text-muted-foreground sm:flex">
            ≈
          </div>
          <EventCard event={pair.event_b} isPrimary={primaryB ?? null} t={t} />
        </div>

        {/* Merge info & actions (only for pending) */}
        {pair.status === "pending" && (
          <>
            <p className="rounded bg-muted/40 p-2 text-xs text-muted-foreground">
              {t("mergeInfo")}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={() => onConfirm(pair.id)}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("confirmDuplicate")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => onReject(pair.id)}
                disabled={rejectingId === pair.id}
              >
                {rejectingId === pair.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {t("rejectDuplicate")}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ScrapingDedup({
  apiUrl,
  onPendingCountChange,
}: Readonly<ScrapingDedupProps>) {
  const t = useTranslations("admin.scraping.duplicates");

  const [statusFilter, setStatusFilter] = useState<
    "pending" | "confirmed" | "rejected" | "all"
  >("pending");
  const [data, setData] = useState<PaginatedDedupPairs | null>(null);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [actionId, setActionId] = useState<{
    id: string;
    type: "confirm" | "reject";
  } | null>(null);
  const [actioning, setActioning] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchPairs = useCallback(
    async (filter: typeof statusFilter, pg = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pg),
          page_size: "20",
        });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${apiUrl}/dedup/pairs?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as PaginatedDedupPairs;
        setData(json);
        setPage(pg);
        onPendingCountChange?.(json.pending_count);
      } catch (err) {
        toast({
          title: t("loadError"),
          variant: "destructive",
          description: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, t, onPendingCountChange]
  );

  // Auto-load on mount
  useEffect(() => {
    void fetchPairs("pending", 1);
  }, [fetchPairs]);

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const res = await fetch(`${apiUrl}/dedup/detect`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = (await res.json()) as {
        created: number;
        already_existed: number;
        total_events_scanned: number;
      };
      toast({
        title: t("detectionResult", {
          created: result.created,
          scanned: result.total_events_scanned,
        }),
      });
      await fetchPairs(statusFilter, 1);
    } catch (err) {
      toast({
        title: t("detectError"),
        variant: "destructive",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setDetecting(false);
    }
  };

  const handleAction = async () => {
    if (!actionId) return;
    setActioning(true);
    try {
      const res = await fetch(
        `${apiUrl}/dedup/pairs/${actionId.id}/${actionId.type}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ detail: `HTTP ${res.status}` }));
        throw new Error(err.detail ?? String(err));
      }
      toast({
        title: actionId.type === "confirm" ? t("confirmed") : t("rejected"),
      });
      await fetchPairs(statusFilter, page);
    } catch (err) {
      toast({
        title:
          actionId.type === "confirm" ? t("confirmError") : t("rejectError"),
        variant: "destructive",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setActioning(false);
      setActionId(null);
    }
  };

  const handleRejectDirect = async (id: string) => {
    setRejectingId(id);
    try {
      const res = await fetch(`${apiUrl}/dedup/pairs/${id}/reject`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ detail: `HTTP ${res.status}` }));
        throw new Error(err.detail ?? String(err));
      }
      toast({ title: t("rejected") });
      await fetchPairs(statusFilter, page);
    } catch (err) {
      toast({
        title: t("rejectError"),
        variant: "destructive",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRejectingId(null);
    }
  };

  const handleCleanup = async () => {
    setCleaning(true);
    try {
      const res = await fetch(`${apiUrl}/dedup/cleanup`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = (await res.json()) as {
        rejected: number;
        checked: number;
      };
      toast({
        title: t("cleanupResult", {
          rejected: result.rejected,
          checked: result.checked,
        }),
      });
      await fetchPairs(statusFilter, 1);
    } catch (err) {
      toast({
        title: t("cleanupError"),
        variant: "destructive",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setCleaning(false);
    }
  };

  const handleFilterChange = (val: string) => {
    const f = val as typeof statusFilter;
    setStatusFilter(f);
    fetchPairs(f, 1);
  };

  const pendingCount = data?.pending_count ?? 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fetchPairs(statusFilter, page)}
            disabled={loading}
            className="gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("refresh")}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCleanup}
            disabled={cleaning}
            className="gap-2 text-muted-foreground"
            title={t("cleanupTitle")}
          >
            {cleaning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {t("cleanup")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDetect}
            disabled={detecting}
            className="gap-2"
          >
            {detecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ScanSearch className="h-4 w-4" />
            )}
            {detecting ? t("detecting") : t("rescan")}
          </Button>
        </div>
      </div>

      {/* Status filter tabs */}
      <Tabs value={statusFilter} onValueChange={handleFilterChange}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            {t("filterPending")}
            {pendingCount > 0 && (
              <Badge className="h-4 min-w-[1.1rem] px-1 text-[10px]">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">{t("filterConfirmed")}</TabsTrigger>
          <TabsTrigger value="rejected">{t("filterRejected")}</TabsTrigger>
          <TabsTrigger value="all">{t("filterAll")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {data && !loading && (
        <>
          {data.items.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <p className="text-sm">{t("noPairs")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.items.map((pair) => (
                <PairCard
                  key={pair.id}
                  pair={pair}
                  onConfirm={(id) => setActionId({ id, type: "confirm" })}
                  onReject={handleRejectDirect}
                  rejectingId={rejectingId}
                  t={t}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.total > data.page_size && (
            <div className="flex justify-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => fetchPairs(statusFilter, page - 1)}
              >
                ←
              </Button>
              <span className="flex items-center text-sm text-muted-foreground">
                {page} / {Math.ceil(data.total / data.page_size)}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page * data.page_size >= data.total}
                onClick={() => fetchPairs(statusFilter, page + 1)}
              >
                →
              </Button>
            </div>
          )}
        </>
      )}

      {/* Confirm dialog */}
      <AlertDialog
        open={actionId?.type === "confirm"}
        onOpenChange={(open) => !open && setActionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actioning}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={actioning}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actioning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {actioning ? t("confirming") : t("confirmDuplicate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

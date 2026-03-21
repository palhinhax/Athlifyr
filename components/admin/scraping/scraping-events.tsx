"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  FileText,
  Trash2,
  RefreshCw,
  Sparkles,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ScrapedEventListItem {
  id: string;
  source_name: string;
  source_url: string;
  title: string;
  city: string | null;
  country: string;
  sport_types: string | null;
  start_date: string | null;
  end_date: string | null;
  organizer_name: string | null;
  image_url: string | null;
  has_image: boolean;
  documents_count: number;
  review_status: string;
  is_hidden: boolean;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  items: ScrapedEventListItem[];
  total: number;
  page: number;
  page_size: number;
  pending_with_image_total: number;
}

interface SourceOption {
  source_name: string;
  display_name: string;
}

interface ScrapingEventsProps {
  sources: SourceOption[];
  apiUrl: string;
  onEventSelect: (eventId: string) => void;
  onEventsChanged: () => void | Promise<void>;
}

type SortField =
  | "start_date"
  | "title"
  | "source_name"
  | "created_at"
  | "review_status";
type SortDir = "asc" | "desc";

function getReviewVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
}

function getReviewLabel(status: string, t: (key: string) => string): string {
  switch (status) {
    case "pending":
      return t("events.statusPending");
    case "approved":
      return t("events.statusApproved");
    case "rejected":
      return t("events.statusRejected");
    default:
      return status;
  }
}

interface SortIconProps {
  readonly field: SortField;
  readonly sortBy: SortField;
  readonly sortDir: SortDir;
}

function SortIcon({ field, sortBy, sortDir }: SortIconProps) {
  if (sortBy !== field)
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
  return sortDir === "asc" ? (
    <ArrowUp className="ml-1 h-3 w-3" />
  ) : (
    <ArrowDown className="ml-1 h-3 w-3" />
  );
}

export function ScrapingEvents({
  sources,
  apiUrl,
  onEventSelect,
  onEventsChanged,
}: Readonly<ScrapingEventsProps>) {
  const t = useTranslations("admin.scraping");

  // ── Filters ──
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // ── Pagination ──
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // ── Sorting ──
  const [sortBy, setSortBy] = useState<SortField>("start_date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // ── Data ──
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Action states ──
  const [actionLoading, setActionLoading] = useState<Record<string, string>>(
    {}
  );
  const [showGenerateAll, setShowGenerateAll] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    current: number;
    total: number;
    running: boolean;
  } | null>(null);

  // ── Debounce search ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Fetch events ──
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("page_size", pageSize.toString());
      params.set("sort_by", sortBy);
      params.set("sort_dir", sortDir);
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filterSource !== "all") params.set("source_name", filterSource);
      if (filterStatus !== "all") params.set("review_status", filterStatus);

      const res = await fetch(`${apiUrl}/events?${params.toString()}`);
      if (res.ok) {
        const json: PaginatedResponse = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, [
    apiUrl,
    page,
    pageSize,
    sortBy,
    sortDir,
    debouncedSearch,
    filterSource,
    filterStatus,
  ]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ── Helpers ──
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;
  const events = data?.items ?? [];
  const pendingWithImageTotal = data?.pending_with_image_total ?? 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  // ── Actions ──
  const handleAction = async (
    eventId: string,
    action: "delete" | "rescrape" | "generate"
  ) => {
    setActionLoading((prev) => ({ ...prev, [eventId]: action }));
    try {
      const url =
        action === "delete"
          ? `${apiUrl}/events/${eventId}`
          : `${apiUrl}/events/${eventId}/${action}`;
      const method = action === "delete" ? "DELETE" : "POST";
      const res = await fetch(url, { method });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed" }));
        console.error(`${action} failed:`, err.detail);
        return;
      }
      fetchEvents();
      onEventsChanged();
    } catch (error) {
      console.error(`Error ${action}:`, error);
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    }
  };

  const handleGenerateAll = async () => {
    setShowGenerateAll(false);

    // Fetch all pending events with images
    const params = new URLSearchParams();
    params.set("review_status", "pending");
    params.set("has_image", "true");
    params.set("page_size", "100");
    params.set("page", "1");
    params.set("sort_by", "start_date");
    params.set("sort_dir", "asc");

    let eligible: ScrapedEventListItem[] = [];
    try {
      const res = await fetch(`${apiUrl}/events?${params.toString()}`);
      if (res.ok) {
        const json: PaginatedResponse = await res.json();
        eligible = json.items;
      }
    } catch {
      console.error("Failed to fetch eligible events for bulk generate");
      return;
    }

    if (eligible.length === 0) return;

    setBulkProgress({ current: 0, total: eligible.length, running: true });

    for (let i = 0; i < eligible.length; i++) {
      setBulkProgress({ current: i, total: eligible.length, running: true });
      try {
        const res = await fetch(`${apiUrl}/events/${eligible[i].id}/generate`, {
          method: "POST",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: "Failed" }));
          console.error(
            `Generate failed for ${eligible[i].title}:`,
            err.detail
          );
        }
      } catch (error) {
        console.error(`Error generating ${eligible[i].title}:`, error);
      }
    }

    setBulkProgress({
      current: eligible.length,
      total: eligible.length,
      running: false,
    });
    fetchEvents();
    onEventsChanged();
    setTimeout(() => setBulkProgress(null), 3000);
  };

  return (
    <>
      <Card>
        {/* ── Header ── */}
        <div className="border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{t("events.title")}</h3>
              {data && (
                <p className="text-sm text-muted-foreground">
                  {t("events.totalCount", { count: data.total })}
                </p>
              )}
            </div>
            {pendingWithImageTotal > 0 && (
              <Button
                size="sm"
                onClick={() => setShowGenerateAll(true)}
                disabled={bulkProgress?.running}
              >
                {bulkProgress?.running ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {t("events.generateAll", { count: pendingWithImageTotal })}
              </Button>
            )}
          </div>

          {/* Bulk progress */}
          {bulkProgress && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {bulkProgress.running
                    ? t("events.generatingProgress", {
                        current: bulkProgress.current + 1,
                        total: bulkProgress.total,
                      })
                    : t("events.generatingDone", {
                        total: bulkProgress.total,
                      })}
                </span>
                <span>
                  {Math.round(
                    (bulkProgress.current / bulkProgress.total) * 100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={(bulkProgress.current / bulkProgress.total) * 100}
              />
            </div>
          )}

          {/* ── Filters ── */}
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("events.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filterSource}
              onValueChange={(v) => handleFilterChange(setFilterSource, v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("events.allSources")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("events.allSources")}</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s.source_name} value={s.source_name}>
                    {s.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(v) => handleFilterChange(setFilterStatus, v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("events.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("events.allStatuses")}</SelectItem>
                <SelectItem value="pending">
                  {t("events.statusPending")}
                </SelectItem>
                <SelectItem value="approved">
                  {t("events.statusApproved")}
                </SelectItem>
                <SelectItem value="rejected">
                  {t("events.statusRejected")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    className="flex items-center font-medium"
                    onClick={() => handleSort("title")}
                  >
                    {t("events.name")}
                    <SortIcon field="title" sortBy={sortBy} sortDir={sortDir} />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-medium"
                    onClick={() => handleSort("source_name")}
                  >
                    {t("events.source")}
                    <SortIcon
                      field="source_name"
                      sortBy={sortBy}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead>{t("events.media")}</TableHead>
                <TableHead>{t("events.location")}</TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-medium"
                    onClick={() => handleSort("start_date")}
                  >
                    {t("events.date")}
                    <SortIcon
                      field="start_date"
                      sortBy={sortBy}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-medium"
                    onClick={() => handleSort("review_status")}
                  >
                    {t("events.status")}
                    <SortIcon
                      field="review_status"
                      sortBy={sortBy}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead>{t("events.visibility")}</TableHead>
                <TableHead>{t("events.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    {t("events.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="max-w-[250px]">
                        <div className="truncate font-medium">
                          {event.title}
                        </div>
                        {event.organizer_name && (
                          <div className="text-xs text-muted-foreground">
                            {event.organizer_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.source_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <ImageIcon
                          className={`h-4 w-4 ${event.has_image ? "text-green-500" : "text-muted-foreground/30"}`}
                          aria-label={
                            event.has_image
                              ? t("events.hasImage")
                              : t("events.noImage")
                          }
                        />
                        <div className="flex items-center gap-0.5">
                          <FileText
                            className={`h-4 w-4 ${event.documents_count > 0 ? "text-blue-500" : "text-muted-foreground/30"}`}
                            aria-label={
                              event.documents_count > 0
                                ? t("events.documentsCount", {
                                    count: event.documents_count,
                                  })
                                : t("events.noDocs")
                            }
                          />
                          {event.documents_count > 0 && (
                            <span className="text-xs text-blue-500">
                              {event.documents_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {event.city || "—"}, {event.country}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(event.start_date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getReviewVariant(event.review_status)}>
                        {getReviewLabel(event.review_status, t)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.is_hidden ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEventSelect(event.id)}
                        >
                          {t("events.view")}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title={t("events.generate")}
                          disabled={
                            !event.has_image || !!actionLoading[event.id]
                          }
                          onClick={() => handleAction(event.id, "generate")}
                        >
                          {actionLoading[event.id] === "generate" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title={t("events.rescrape")}
                          disabled={!!actionLoading[event.id]}
                          onClick={() => handleAction(event.id, "rescrape")}
                        >
                          {actionLoading[event.id] === "rescrape" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title={t("events.delete")}
                          disabled={!!actionLoading[event.id]}
                          onClick={() => handleAction(event.id, "delete")}
                        >
                          {actionLoading[event.id] === "delete" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                        <a
                          href={event.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title={t("events.openSource")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {data && data.total > 0
              ? t("events.pagination", {
                  from: (page - 1) * pageSize + 1,
                  to: Math.min(page * pageSize, data.total),
                  total: data.total,
                })
              : t("events.empty")}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setPage(1)}
              disabled={page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              {t("events.pageOf", { page, totalPages })}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showGenerateAll} onOpenChange={setShowGenerateAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("events.generateAllTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("events.generateAllDescription", {
                count: pendingWithImageTotal,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("events.generateAllCancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerateAll}>
              <Sparkles className="mr-2 h-4 w-4" />
              {t("events.generateAllConfirm", {
                count: pendingWithImageTotal,
              })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

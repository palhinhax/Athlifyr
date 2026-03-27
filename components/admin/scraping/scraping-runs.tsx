"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  RefreshCw,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ScrapingRun {
  id: string;
  source_name: string;
  status: string;
  started_at: string | null;
  finished_at: string | null;
  events_found: number;
  events_created: number;
  events_updated: number;
  events_failed: number;
  error_message: string | null;
  created_at: string;
}

interface PaginatedRunsResponse {
  items: ScrapingRun[];
  total: number;
  page: number;
  page_size: number;
}

interface SourceOption {
  source_name: string;
  display_name: string;
}

interface ScrapingRunsProps {
  readonly sources: SourceOption[];
  readonly apiUrl: string;
}

interface DateGroup {
  label: string;
  dateKey: string;
  runs: ScrapingRun[];
  totals: {
    completed: number;
    failed: number;
    running: number;
    found: number;
    created: number;
    updated: number;
    eventsFailed: number;
  };
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "running":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

function getStatusLabel(status: string, t: (key: string) => string): string {
  switch (status) {
    case "completed":
      return t("runs.statusCompleted");
    case "running":
      return t("runs.statusRunning");
    case "failed":
      return t("runs.statusFailed");
    default:
      return status;
  }
}

function getDateKey(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

function getDateLabel(
  dateKey: string,
  t: (key: string) => string,
  runCount: number
): string {
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  const date = new Date(dateKey + "T12:00:00");
  const formatted = date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  let label: string;
  if (dateKey === todayKey) {
    label = t("runs.today");
  } else if (dateKey === yesterdayKey) {
    label = t("runs.yesterday");
  } else {
    label = formatted;
  }

  return `${label} (${runCount})`;
}

function computeGroupTotals(runs: ScrapingRun[]): DateGroup["totals"] {
  return runs.reduce(
    (acc, run) => ({
      completed: acc.completed + (run.status === "completed" ? 1 : 0),
      failed: acc.failed + (run.status === "failed" ? 1 : 0),
      running: acc.running + (run.status === "running" ? 1 : 0),
      found: acc.found + run.events_found,
      created: acc.created + run.events_created,
      updated: acc.updated + run.events_updated,
      eventsFailed: acc.eventsFailed + run.events_failed,
    }),
    {
      completed: 0,
      failed: 0,
      running: 0,
      found: 0,
      created: 0,
      updated: 0,
      eventsFailed: 0,
    }
  );
}

export function ScrapingRuns({ sources, apiUrl }: ScrapingRunsProps) {
  const t = useTranslations("admin.scraping");

  // ── Filters ──
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // ── Data (fetch all runs at once for grouping) ──
  const [allRuns, setAllRuns] = useState<ScrapingRun[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Clear history ──
  const [clearDays, setClearDays] = useState("7");
  const [clearing, setClearing] = useState(false);

  // ── Collapsed state per date group ──
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  // ── Fetch all runs (paginated in larger batches) ──
  const fetchRuns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("page_size", "100");
      if (filterSource !== "all") params.set("source_name", filterSource);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`${apiUrl}/runs?${params.toString()}`);
      if (res.ok) {
        const json: PaginatedRunsResponse = await res.json();
        setAllRuns(json.items);
        setTotal(json.total);
      }
    } catch (error) {
      console.error("Failed to fetch runs:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, filterSource, filterStatus]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  // ── Group runs by date ──
  const dateGroups: DateGroup[] = useMemo(() => {
    const groupMap = new Map<string, ScrapingRun[]>();

    for (const run of allRuns) {
      const key = getDateKey(run.started_at ?? run.created_at);
      const existing = groupMap.get(key);
      if (existing) {
        existing.push(run);
      } else {
        groupMap.set(key, [run]);
      }
    }

    // Sort date keys descending (newest first)
    const sortedKeys = [...groupMap.keys()].sort((a, b) => b.localeCompare(a));

    return sortedKeys.map((dateKey) => {
      const runs = groupMap.get(dateKey)!;
      return {
        label: getDateLabel(dateKey, t, runs.length),
        dateKey,
        runs,
        totals: computeGroupTotals(runs),
      };
    });
  }, [allRuns, t]);

  // Auto-open today's group
  useEffect(() => {
    if (dateGroups.length > 0 && openGroups.size === 0) {
      setOpenGroups(new Set([dateGroups[0].dateKey]));
    }
  }, [dateGroups, openGroups.size]);

  const toggleGroup = (dateKey: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
      } else {
        next.add(dateKey);
      }
      return next;
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
  };

  const handleClearRuns = async () => {
    setClearing(true);
    try {
      const params = new URLSearchParams();
      params.set("older_than_days", clearDays);
      const res = await fetch(`${apiUrl}/runs?${params.toString()}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchRuns();
      }
    } catch (error) {
      console.error("Failed to clear runs:", error);
    } finally {
      setClearing(false);
    }
  };

  return (
    <Card>
      {/* ── Header ── */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t("runs.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("runs.totalCount", { count: total })}
              {" · "}
              {t("runs.daysShown", { count: dateGroups.length })}
            </p>
          </div>

          {/* ── Clear history ── */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={total === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("runs.clearHistory")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("runs.clearConfirmTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("runs.clearConfirmDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Select value={clearDays} onValueChange={setClearDays}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      {t("runs.olderThan", { days: 1 })}
                    </SelectItem>
                    <SelectItem value="3">
                      {t("runs.olderThan", { days: 3 })}
                    </SelectItem>
                    <SelectItem value="7">
                      {t("runs.olderThan", { days: 7 })}
                    </SelectItem>
                    <SelectItem value="14">
                      {t("runs.olderThan", { days: 14 })}
                    </SelectItem>
                    <SelectItem value="30">
                      {t("runs.olderThan", { days: 30 })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("runs.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearRuns}
                  disabled={clearing}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {clearing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("runs.confirmClear")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-3">
          <Select
            value={filterSource}
            onValueChange={(v) => handleFilterChange(setFilterSource, v)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("runs.allSources")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("runs.allSources")}</SelectItem>
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
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder={t("runs.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("runs.allStatuses")}</SelectItem>
              <SelectItem value="completed">
                {t("runs.statusCompleted")}
              </SelectItem>
              <SelectItem value="running">{t("runs.statusRunning")}</SelectItem>
              <SelectItem value="failed">{t("runs.statusFailed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Date-grouped runs ── */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {dateGroups.length === 0 && !loading ? (
          <div className="py-12 text-center text-muted-foreground">
            {t("runs.empty")}
          </div>
        ) : (
          <div className="divide-y">
            {dateGroups.map((group) => {
              const isOpen = openGroups.has(group.dateKey);
              return (
                <Collapsible
                  key={group.dateKey}
                  open={isOpen}
                  onOpenChange={() => toggleGroup(group.dateKey)}
                >
                  {/* ── Date header with summary ── */}
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}

                      <span className="text-sm font-medium">{group.label}</span>

                      {/* ── Summary badges ── */}
                      <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                        {group.totals.completed > 0 && (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {group.totals.completed}
                          </span>
                        )}
                        {group.totals.failed > 0 && (
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="h-3.5 w-3.5" />
                            {group.totals.failed}
                          </span>
                        )}
                        {group.totals.running > 0 && (
                          <span className="flex items-center gap-1 text-blue-500">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {group.totals.running}
                          </span>
                        )}
                        <span
                          className="hidden items-center gap-1 sm:flex"
                          title={t("runs.found")}
                        >
                          <Search className="h-3.5 w-3.5" />
                          {group.totals.found}
                        </span>
                        <span
                          className="hidden items-center gap-1 sm:flex"
                          title={t("runs.created")}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          {group.totals.created}
                        </span>
                        <span
                          className="hidden items-center gap-1 sm:flex"
                          title={t("runs.updated")}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          {group.totals.updated}
                        </span>
                        {group.totals.eventsFailed > 0 && (
                          <span
                            className="hidden items-center gap-1 text-red-500 sm:flex"
                            title={t("runs.failed")}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {group.totals.eventsFailed}
                          </span>
                        )}
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  {/* ── Runs table for this date ── */}
                  <CollapsibleContent>
                    <div className="overflow-x-auto border-t bg-muted/20">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("runs.source")}</TableHead>
                            <TableHead>{t("runs.status")}</TableHead>
                            <TableHead>{t("runs.found")}</TableHead>
                            <TableHead>{t("runs.created")}</TableHead>
                            <TableHead>{t("runs.updated")}</TableHead>
                            <TableHead>{t("runs.failed")}</TableHead>
                            <TableHead className="whitespace-nowrap">
                              {t("runs.startedAt")}
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              {t("runs.finishedAt")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.runs.map((run) => (
                            <TableRow key={run.id}>
                              <TableCell className="font-medium">
                                {run.source_name}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusVariant(run.status)}>
                                  {getStatusLabel(run.status, t)}
                                </Badge>
                              </TableCell>
                              <TableCell>{run.events_found}</TableCell>
                              <TableCell>{run.events_created}</TableCell>
                              <TableCell>{run.events_updated}</TableCell>
                              <TableCell>
                                {run.events_failed > 0 ? (
                                  <span className="text-red-500">
                                    {run.events_failed}
                                  </span>
                                ) : (
                                  run.events_failed
                                )}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatTime(run.started_at)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatTime(run.finished_at)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

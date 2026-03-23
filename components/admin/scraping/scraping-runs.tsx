"use client";

import { useState, useEffect, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
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

export function ScrapingRuns({ sources, apiUrl }: ScrapingRunsProps) {
  const t = useTranslations("admin.scraping");

  // ── Filters ──
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // ── Pagination ──
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // ── Data ──
  const [data, setData] = useState<PaginatedRunsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch ──
  const fetchRuns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("page_size", pageSize.toString());
      if (filterSource !== "all") params.set("source_name", filterSource);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`${apiUrl}/runs?${params.toString()}`);
      if (res.ok) {
        const json: PaginatedRunsResponse = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch runs:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, pageSize, filterSource, filterStatus]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  // ── Helpers ──
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;
  const runs = data?.items ?? [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
  };

  return (
    <Card>
      {/* ── Header ── */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t("runs.title")}</h3>
            {data && (
              <p className="text-sm text-muted-foreground">
                {t("runs.totalCount", { count: data.total })}
              </p>
            )}
          </div>
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
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-full sm:w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
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
        <div className="overflow-x-auto">
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
              {runs.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-muted-foreground"
                  >
                    {t("runs.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                runs.map((run) => (
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
                      {formatDate(run.started_at)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(run.finished_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex flex-col items-center gap-2 border-t px-4 py-3 sm:flex-row sm:justify-between">
        <span className="text-sm text-muted-foreground">
          {data && data.total > 0
            ? t("runs.pagination", {
                from: (page - 1) * pageSize + 1,
                to: Math.min(page * pageSize, data.total),
                total: data.total,
              })
            : t("runs.empty")}
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
            {t("runs.pageOf", { page, totalPages })}
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
  );
}

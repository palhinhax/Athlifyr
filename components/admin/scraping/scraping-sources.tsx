"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, RefreshCw, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SourceConfig {
  source_name: string;
  display_name: string;
  base_url: string;
  description: string;
  enabled: boolean;
  interval_hours: number;
  last_run_at: string | null;
  last_success_at: string | null;
  last_error: string | null;
  events_total: number;
}

interface ScrapingSourcesProps {
  sources: SourceConfig[];
  apiUrl: string;
  onSourceToggle: (sourceName: string, enabled: boolean) => void;
  onRunSource: (sourceName: string) => void;
  onRunAll: () => void;
  runningSource: string | null;
}

export function ScrapingSources({
  sources,
  apiUrl,
  onSourceToggle,
  onRunSource,
  onRunAll,
  runningSource,
}: Readonly<ScrapingSourcesProps>) {
  const t = useTranslations("admin.scraping");
  const [togglingSource, setTogglingSource] = useState<string | null>(null);

  const handleToggle = async (sourceName: string, enabled: boolean) => {
    setTogglingSource(sourceName);
    try {
      const res = await fetch(`${apiUrl}/sources/${sourceName}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error("Failed to toggle source");
      onSourceToggle(sourceName, enabled);
    } catch (error) {
      console.error("Error toggling source:", error);
    } finally {
      setTogglingSource(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Card>
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">{t("sources.title")}</h3>
        <Button size="sm" onClick={onRunAll} disabled={!!runningSource}>
          {runningSource ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {t("sources.runAll")}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("sources.name")}</TableHead>
            <TableHead>{t("sources.status")}</TableHead>
            <TableHead>{t("sources.events")}</TableHead>
            <TableHead>{t("sources.lastRun")}</TableHead>
            <TableHead>{t("sources.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.source_name}>
              <TableCell>
                <div>
                  <div className="font-medium">{source.display_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {source.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={source.enabled}
                    onCheckedChange={(checked) =>
                      handleToggle(source.source_name, checked)
                    }
                    disabled={togglingSource === source.source_name}
                  />
                  <Badge variant={source.enabled ? "default" : "secondary"}>
                    {source.enabled
                      ? t("sources.enabled")
                      : t("sources.disabled")}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{source.events_total}</TableCell>
              <TableCell>
                <div className="text-sm">{formatDate(source.last_run_at)}</div>
                {source.last_error && (
                  <div className="mt-1 text-xs text-red-500">
                    {source.last_error}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRunSource(source.source_name)}
                  disabled={!!runningSource}
                >
                  {runningSource === source.source_name ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrapingStats } from "@/components/admin/scraping/scraping-stats";
import { ScrapingSources } from "@/components/admin/scraping/scraping-sources";
import { ScrapingRuns } from "@/components/admin/scraping/scraping-runs";
import { ScrapingEvents } from "@/components/admin/scraping/scraping-events";
import { ScrapingEventDetail } from "@/components/admin/scraping/scraping-event-detail";
import { ScrapeUrlForm } from "@/components/admin/scraping/scrape-url-form";

const API_URL = "/api/admin/scraping";

interface StatsData {
  total_events: number;
  pending_review: number;
  approved: number;
  rejected: number;
  hidden: number;
  with_documents: number;
  sources_active: number;
  sources_total: number;
}

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

export default function AdminScrapingPage() {
  const t = useTranslations("admin.scraping");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [sources, setSources] = useState<SourceConfig[]>([]);
  const [runningSource, setRunningSource] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setApiError(null);
      const [statsRes, sourcesRes] = await Promise.all([
        fetch(`${API_URL}/stats`),
        fetch(`${API_URL}/sources`),
      ]);

      if (!statsRes.ok || !sourcesRes.ok) {
        throw new Error("Failed to fetch scraping data");
      }

      const [statsData, sourcesData] = await Promise.all([
        statsRes.json() as Promise<StatsData>,
        sourcesRes.json() as Promise<SourceConfig[]>,
      ]);

      setStats(statsData);
      setSources(sourcesData);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      }
      console.error("Error fetching scraping data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSourceToggle = (sourceName: string, enabled: boolean) => {
    setSources((prev) =>
      prev.map((s) => (s.source_name === sourceName ? { ...s, enabled } : s))
    );
  };

  const handleRunSource = async (sourceName: string) => {
    setRunningSource(sourceName);
    setRunError(null);
    try {
      const res = await fetch(`${API_URL}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_name: sourceName }),
      });
      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(
          errData.detail || errData.error || "Failed to run source"
        );
      }
      await fetchAll();
    } catch (error) {
      if (error instanceof Error) {
        setRunError(error.message);
      }
      console.error("Error running source:", error);
    } finally {
      setRunningSource(null);
    }
  };

  const handleRunAll = async () => {
    setRunningSource("__all__");
    setRunError(null);
    try {
      const res = await fetch(`${API_URL}/runs/all`, { method: "POST" });
      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(
          errData.detail || errData.error || "Failed to run all sources"
        );
      }
      await fetchAll();
    } catch (error) {
      if (error instanceof Error) {
        setRunError(error.message);
      }
      console.error("Error running all sources:", error);
    } finally {
      setRunningSource(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950">
          <p className="text-red-600 dark:text-red-400">
            {t("apiUnavailable")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{apiError}</p>
        </div>
      </div>
    );
  }

  const sourceOptions = sources.map((s) => ({
    source_name: s.source_name,
    display_name: s.display_name,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <ScrapingStats stats={stats} />

      {runError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{runError}</p>
        </div>
      )}

      <ScrapeUrlForm
        sources={sourceOptions}
        apiUrl={API_URL}
        onScraped={fetchAll}
      />

      <ScrapingSources
        sources={sources}
        apiUrl={API_URL}
        onSourceToggle={handleSourceToggle}
        onRunSource={handleRunSource}
        onRunAll={handleRunAll}
        runningSource={runningSource}
      />

      <ScrapingRuns sources={sourceOptions} apiUrl={API_URL} />

      <ScrapingEvents
        sources={sourceOptions}
        apiUrl={API_URL}
        onEventSelect={setSelectedEventId}
        onEventsChanged={fetchAll}
      />

      <ScrapingEventDetail
        eventId={selectedEventId}
        apiUrl={API_URL}
        open={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
        onUpdated={fetchAll}
      />
    </div>
  );
}

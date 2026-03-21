"use client";

import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface ScrapingStatsData {
  total_events: number;
  pending_review: number;
  approved: number;
  rejected: number;
  hidden: number;
  with_documents: number;
  sources_active: number;
  sources_total: number;
}

interface ScrapingStatsProps {
  stats: ScrapingStatsData | null;
}

export function ScrapingStats({ stats }: Readonly<ScrapingStatsProps>) {
  const t = useTranslations("admin.scraping");

  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="text-2xl font-bold">{stats.total_events}</div>
        <div className="text-sm text-muted-foreground">
          {t("stats.totalEvents")}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-yellow-500">
          {stats.pending_review}
        </div>
        <div className="text-sm text-muted-foreground">
          {t("stats.pendingReview")}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-green-500">
          {stats.approved}
        </div>
        <div className="text-sm text-muted-foreground">
          {t("stats.approved")}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
        <div className="text-sm text-muted-foreground">
          {t("stats.rejected")}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-gray-400">{stats.hidden}</div>
        <div className="text-sm text-muted-foreground">{t("stats.hidden")}</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-blue-500">
          {stats.with_documents}
        </div>
        <div className="text-sm text-muted-foreground">
          {t("stats.withDocuments")}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-emerald-500">
          {stats.sources_active}
        </div>
        <div className="text-sm text-muted-foreground">
          {t("stats.sourcesActive", {
            total: stats.sources_total,
          })}
        </div>
      </Card>
    </div>
  );
}

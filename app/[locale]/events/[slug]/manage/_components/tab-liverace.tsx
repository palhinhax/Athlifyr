"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Radio,
  Play,
  Pause,
  Square,
  RefreshCw,
  Loader2,
  Users,
  Activity,
  Clock,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import type { EventDetails } from "./types";
import { Link } from "@/i18n/routing";

interface TabLiveraceProps {
  event: EventDetails;
}

interface LiveStatusData {
  liveStatus: string;
  connectedCount: number;
  participantCount: number;
  lastUpdate: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED:
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  CHECK_IN_OPEN:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  WARMUP: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  LIVE: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  PAUSED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  FINISHED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function TabLiverace({ event }: TabLiveraceProps) {
  const t = useTranslations("manage.liverace");
  const tErr = useTranslations("manage.errors");

  const [liveData, setLiveData] = useState<LiveStatusData>({
    liveStatus: event.liveStatus ?? "SCHEDULED",
    connectedCount: 0,
    participantCount: 0,
    lastUpdate: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [serverReachable, setServerReachable] = useState<boolean | null>(null);

  // ─── Fetch live status from Live server ──────────────────────────────────

  const fetchLiveStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${event.id}/live-status`);
      if (!res.ok) {
        setServerReachable(false);
        return;
      }
      const data = (await res.json()) as LiveStatusData;
      setLiveData(data);
      setServerReachable(true);
    } catch {
      setServerReachable(false);
    }
  }, [event.id]);

  // ─── Poll every 10s when tab is active ───────────────────────────────────

  useEffect(() => {
    void fetchLiveStatus();
    const interval = setInterval(() => void fetchLiveStatus(), 10_000);
    setIsPolling(true);
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [fetchLiveStatus]);

  // ─── Send control command to Live server ─────────────────────────────────

  const sendCommand = async (
    command: "start" | "pause" | "resume" | "finish" | "checkin"
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/live-control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Error");
      }
      const data = (await res.json()) as {
        liveStatus: string;
      };
      setLiveData((prev) => ({ ...prev, liveStatus: data.liveStatus }));
      toast({ title: t(`commandSuccess.${command}`) });
      await fetchLiveStatus();
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const status = liveData.liveStatus;

  return (
    <TabsContent value="liverace" className="space-y-6">
      {/* Header card */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Radio className="h-4 w-4 text-green-600" />
              {t("title")}
            </CardTitle>
            <div className="flex items-center gap-2">
              {serverReachable === true && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Wifi className="h-3 w-3" />
                  {t("serverOnline")}
                </span>
              )}
              {serverReachable === false && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <WifiOff className="h-3 w-3" />
                  {t("serverOffline")}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => void fetchLiveStatus()}
                disabled={isLoading}
                title={t("refresh")}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isPolling ? "text-muted-foreground" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* Current status */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {t("currentStatus")}
              </span>
              <Badge
                className={STATUS_COLORS[status] ?? STATUS_COLORS.SCHEDULED}
              >
                {t(`status.${status}`)}
              </Badge>
            </div>

            {/* Connected spectators */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {t("spectators")}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {liveData.connectedCount}
              </span>
            </div>

            {/* Participants tracked */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {t("participants")}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                {liveData.participantCount}
              </span>
            </div>

            {/* Last GPS update */}
            {liveData.lastUpdate && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  {t("lastUpdate")}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {new Date(liveData.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Not enabled warning */}
      {!event.hasLiveRace && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {t("notEnabled")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      {event.hasLiveRace && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("controls")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Open Check-in */}
            {status === "SCHEDULED" && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">{t("actions.checkin")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("actions.checkinHelp")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => void sendCommand("checkin")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {t("actions.checkinBtn")}
                </Button>
              </div>
            )}

            {/* Warm up */}
            {status === "CHECK_IN_OPEN" && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">{t("actions.warmup")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("actions.warmupHelp")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => void sendCommand("start")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Radio className="h-4 w-4" />
                  )}
                  {t("actions.warmupBtn")}
                </Button>
              </div>
            )}

            {/* Start race */}
            {status === "WARMUP" && (
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
                <div>
                  <p className="text-sm font-medium">{t("actions.start")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("actions.startHelp")}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => void sendCommand("start")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {t("actions.startBtn")}
                </Button>
              </div>
            )}

            {/* Pause */}
            {status === "LIVE" && (
              <div className="flex items-center justify-between rounded-lg border border-orange-200 p-4 dark:border-orange-800">
                <div>
                  <p className="text-sm font-medium">{t("actions.pause")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("actions.pauseHelp")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400"
                  onClick={() => void sendCommand("pause")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  {t("actions.pauseBtn")}
                </Button>
              </div>
            )}

            {/* Resume */}
            {status === "PAUSED" && (
              <div className="flex items-center justify-between rounded-lg border border-blue-200 p-4 dark:border-blue-800">
                <div>
                  <p className="text-sm font-medium">{t("actions.resume")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("actions.resumeHelp")}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => void sendCommand("resume")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {t("actions.resumeBtn")}
                </Button>
              </div>
            )}

            {/* Finish */}
            {(status === "LIVE" || status === "PAUSED") && (
              <div className="flex items-center justify-between rounded-lg border border-purple-200 p-4 dark:border-purple-800">
                <div>
                  <p className="text-sm font-medium">{t("actions.finish")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("actions.finishHelp")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400"
                  onClick={() => void sendCommand("finish")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  {t("actions.finishBtn")}
                </Button>
              </div>
            )}

            {/* Finished state */}
            {(status === "FINISHED" || status === "CANCELLED") && (
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {status === "FINISHED"
                    ? t("raceFinished")
                    : t("raceCancelled")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick link to public live page */}
      {event.hasLiveRace && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("publicPage")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("publicPageHelp")}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link href={`/events/${event.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  {t("viewPublic")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}

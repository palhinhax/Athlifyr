"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Radio,
  RefreshCw,
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
import {
  LiveRaceReadiness,
  type LiveReadinessData,
} from "./liverace-readiness";
import { LiveRaceControls } from "./liverace-controls";

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

export function TabLiverace({ event }: Readonly<TabLiveraceProps>) {
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
  const [readiness, setReadiness] = useState<LiveReadinessData | null>(null);

  // ─── Fetch readiness data ────────────────────────────────────────────────

  const fetchReadiness = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${event.id}/live-readiness`);
      if (res.ok) {
        const data = (await res.json()) as LiveReadinessData;
        setReadiness(data);
      }
    } catch {
      // Non-critical — readiness is informational
    }
  }, [event.id]);

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
    void fetchReadiness();
    const interval = setInterval(() => void fetchLiveStatus(), 10_000);
    setIsPolling(true);
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [fetchLiveStatus, fetchReadiness]);

  // ─── Send control command to Live server ─────────────────────────────────

  const sendCommand = async (
    command:
      | "start"
      | "pause"
      | "resume"
      | "finish"
      | "checkin"
      | "warmup"
      | "cancel"
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
  const raceNotReady = readiness !== null && !readiness.ready;

  return (
    <TabsContent value="liverace" className="space-y-6">
      {/* Header card */}
      <LiveRaceHeader
        status={status}
        liveData={liveData}
        serverReachable={serverReachable}
        isPolling={isPolling}
        isLoading={isLoading}
        onRefresh={() => void fetchLiveStatus()}
      />

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

      {/* Readiness Check */}
      {event.hasLiveRace && readiness && (
        <LiveRaceReadiness readiness={readiness} />
      )}

      {/* Controls */}
      {event.hasLiveRace && (
        <LiveRaceControls
          status={status}
          isLoading={isLoading}
          raceNotReady={raceNotReady}
          onCommand={(cmd) => void sendCommand(cmd)}
        />
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

// ─── Sub-component: Header card ─────────────────────────────────────────────

interface LiveRaceHeaderProps {
  status: string;
  liveData: LiveStatusData;
  serverReachable: boolean | null;
  isPolling: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

function LiveRaceHeader({
  status,
  liveData,
  serverReachable,
  isPolling,
  isLoading,
  onRefresh,
}: Readonly<LiveRaceHeaderProps>) {
  const t = useTranslations("manage.liverace");

  return (
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
              onClick={onRefresh}
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
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t("currentStatus")}
            </span>
            <Badge className={STATUS_COLORS[status] ?? STATUS_COLORS.SCHEDULED}>
              {t(`status.${status}`)}
            </Badge>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t("spectators")}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              {liveData.connectedCount}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t("participants")}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              {liveData.participantCount}
            </span>
          </div>

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
  );
}

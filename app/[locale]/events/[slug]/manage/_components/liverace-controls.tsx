"use client";

import {
  Radio,
  Play,
  Pause,
  Square,
  Loader2,
  Clock,
  Ban,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type LiveCommand =
  | "start"
  | "pause"
  | "resume"
  | "finish"
  | "checkin"
  | "warmup"
  | "cancel";

interface LiveRaceControlsProps {
  status: string;
  isLoading: boolean;
  raceNotReady: boolean;
  onCommand: (command: LiveCommand) => void;
}

interface ControlActionProps {
  label: string;
  help: string;
  buttonLabel: string;
  icon: React.ReactNode;
  onClick: () => void;
  isLoading: boolean;
  borderClass?: string;
  buttonVariant?: "default" | "outline";
  buttonClass?: string;
  containerClass?: string;
}

function ControlAction({
  label,
  help,
  buttonLabel,
  icon,
  onClick,
  isLoading,
  borderClass = "",
  buttonVariant = "outline",
  buttonClass = "",
  containerClass = "",
}: Readonly<ControlActionProps>) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 ${borderClass} ${containerClass}`}
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{help}</p>
      </div>
      <Button
        size="sm"
        variant={buttonVariant}
        className={`gap-2 ${buttonClass}`}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {buttonLabel}
      </Button>
    </div>
  );
}

function StartRaceAction({
  isLoading,
  raceNotReady,
  onCommand,
}: Readonly<{
  isLoading: boolean;
  raceNotReady: boolean;
  onCommand: (cmd: LiveCommand) => void;
}>) {
  const t = useTranslations("manage.liverace");

  const icon = raceNotReady ? (
    <XCircle className="h-4 w-4" />
  ) : (
    <Play className="h-4 w-4" />
  );

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 ${
        raceNotReady
          ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
          : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
      }`}
    >
      <div>
        <p className="text-sm font-medium">{t("actions.start")}</p>
        <p className="text-xs text-muted-foreground">
          {raceNotReady ? t("readiness.cannotStart") : t("actions.startHelp")}
        </p>
      </div>
      <Button
        size="sm"
        className={`gap-2 ${
          raceNotReady
            ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
            : "bg-green-600 hover:bg-green-700"
        }`}
        onClick={() => onCommand("start")}
        disabled={isLoading || raceNotReady}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {t("actions.startBtn")}
      </Button>
    </div>
  );
}

export function LiveRaceControls({
  status,
  isLoading,
  raceNotReady,
  onCommand,
}: Readonly<LiveRaceControlsProps>) {
  const t = useTranslations("manage.liverace");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("controls")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === "SCHEDULED" && (
          <ControlAction
            label={t("actions.checkin")}
            help={t("actions.checkinHelp")}
            buttonLabel={t("actions.checkinBtn")}
            icon={<Clock className="h-4 w-4" />}
            onClick={() => onCommand("checkin")}
            isLoading={isLoading}
          />
        )}

        {status === "CHECK_IN_OPEN" && (
          <ControlAction
            label={t("actions.warmup")}
            help={t("actions.warmupHelp")}
            buttonLabel={t("actions.warmupBtn")}
            icon={<Radio className="h-4 w-4" />}
            onClick={() => onCommand("warmup")}
            isLoading={isLoading}
          />
        )}

        {status === "WARMUP" && (
          <StartRaceAction
            isLoading={isLoading}
            raceNotReady={raceNotReady}
            onCommand={onCommand}
          />
        )}

        {status === "LIVE" && (
          <ControlAction
            label={t("actions.pause")}
            help={t("actions.pauseHelp")}
            buttonLabel={t("actions.pauseBtn")}
            icon={<Pause className="h-4 w-4" />}
            onClick={() => onCommand("pause")}
            isLoading={isLoading}
            borderClass="border-orange-200 dark:border-orange-800"
            buttonClass="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400"
          />
        )}

        {status === "PAUSED" && (
          <ControlAction
            label={t("actions.resume")}
            help={t("actions.resumeHelp")}
            buttonLabel={t("actions.resumeBtn")}
            icon={<Play className="h-4 w-4" />}
            onClick={() => onCommand("resume")}
            isLoading={isLoading}
            buttonVariant="default"
            borderClass="border-blue-200 dark:border-blue-800"
          />
        )}

        {(status === "LIVE" || status === "PAUSED") && (
          <ControlAction
            label={t("actions.finish")}
            help={t("actions.finishHelp")}
            buttonLabel={t("actions.finishBtn")}
            icon={<Square className="h-4 w-4" />}
            onClick={() => onCommand("finish")}
            isLoading={isLoading}
            borderClass="border-purple-200 dark:border-purple-800"
            buttonClass="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400"
          />
        )}

        {(status === "LIVE" || status === "PAUSED") && (
          <ControlAction
            label={t("actions.cancel")}
            help={t("actions.cancelHelp")}
            buttonLabel={t("actions.cancelBtn")}
            icon={<Ban className="h-4 w-4" />}
            onClick={() => onCommand("cancel")}
            isLoading={isLoading}
            borderClass="border-red-200 dark:border-red-800"
            buttonClass="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
          />
        )}

        {(status === "FINISHED" || status === "CANCELLED") && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              {status === "FINISHED" ? t("raceFinished") : t("raceCancelled")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

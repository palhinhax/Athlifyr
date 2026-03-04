"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Radio, Clock, Pause, CheckCircle, Ban } from "lucide-react";

interface EventLiveStatusBadgeProps {
  liveStatus: string;
  hasLiveRace: boolean;
  checkInOpensAt: Date | string | null;
  checkInClosesAt: Date | string | null;
}

/**
 * Derives the effective live status, including the virtual CHECK_IN_OPEN state
 * (Option B from the validation doc — no DB migration needed).
 */
function getEffectiveLiveStatus(
  liveStatus: string,
  checkInOpensAt: Date | string | null,
  checkInClosesAt: Date | string | null
): string {
  const now = new Date();
  if (liveStatus === "SCHEDULED") {
    const opensAt = checkInOpensAt ? new Date(checkInOpensAt) : null;
    const closesAt = checkInClosesAt ? new Date(checkInClosesAt) : null;
    if (opensAt && now >= opensAt) {
      if (!closesAt || now <= closesAt) {
        return "CHECK_IN_OPEN";
      }
    }
  }
  return liveStatus;
}

const STATUS_CONFIG: Record<
  string,
  {
    icon: typeof Radio;
    className: string;
    pulse?: boolean;
  }
> = {
  SCHEDULED: {
    icon: Clock,
    className:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  CHECK_IN_OPEN: {
    icon: CheckCircle,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    pulse: true,
  },
  LIVE: {
    icon: Radio,
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    pulse: true,
  },
  PAUSED: {
    icon: Pause,
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  FINISHED: {
    icon: CheckCircle,
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  CANCELLED: {
    icon: Ban,
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
};

export function EventLiveStatusBadge({
  liveStatus,
  hasLiveRace,
  checkInOpensAt,
  checkInClosesAt,
}: EventLiveStatusBadgeProps) {
  const t = useTranslations("events.liveStatus");

  // Only show badge if LiveRace is enabled and status is not default SCHEDULED
  const effectiveStatus = getEffectiveLiveStatus(
    liveStatus,
    checkInOpensAt,
    checkInClosesAt
  );

  // Don't show badge if event doesn't have LiveRace or is just scheduled
  if (!hasLiveRace || effectiveStatus === "SCHEDULED") {
    return null;
  }

  const config = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.SCHEDULED;
  const Icon = config.icon;
  const label = t(effectiveStatus as "CHECK_IN_OPEN" | "LIVE" | "PAUSED" | "FINISHED" | "CANCELLED");

  return (
    <Badge className={`gap-1.5 ${config.className}`}>
      <Icon className={`h-3 w-3 ${config.pulse ? "animate-pulse" : ""}`} />
      {label}
    </Badge>
  );
}

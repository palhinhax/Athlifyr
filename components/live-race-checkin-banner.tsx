"use client";

import { useTranslations } from "next-intl";
import { ClipboardCheck } from "lucide-react";

interface LiveRaceCheckinBannerProps {
  className?: string;
}

/**
 * Banner shown on the public event page when liveStatus === "CHECK_IN_OPEN".
 * Informs spectators that check-in is open and the race is coming soon.
 */
export function LiveRaceCheckinBanner({
  className,
}: LiveRaceCheckinBannerProps) {
  const t = useTranslations("liveRace");

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-800 dark:bg-yellow-950/30 ${className ?? ""}`}
    >
      <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
          {t("checkinOpenTitle")}
        </p>
        <p className="text-xs text-yellow-700 dark:text-yellow-400">
          {t("checkinOpenDescription")}
        </p>
      </div>
    </div>
  );
}

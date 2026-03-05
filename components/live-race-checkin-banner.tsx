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
      className={`relative overflow-hidden rounded-xl border border-emerald-300/50 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 px-4 py-3 dark:border-emerald-500/30 dark:from-emerald-500/15 dark:via-teal-500/15 dark:to-cyan-500/15 ${className ?? ""}`}
    >
      {/* Subtle animated pulse dot */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Live
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20">
          <ClipboardCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            {t("checkinOpenTitle")}
          </p>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-300/70">
            {t("checkinOpenDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}

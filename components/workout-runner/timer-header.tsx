"use client";

/**
 * TimerHeader Component
 *
 * Header section with back button, title, mute toggle, clock toggle, settings and fullscreen toggle.
 */

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  ArrowLeftIcon,
  ExpandIcon,
  ShrinkIcon,
  SettingsIcon,
  Volume2Icon,
  VolumeXIcon,
  ClockIcon,
  EyeOffIcon,
} from "lucide-react";

interface TimerHeaderProps {
  workoutName: string;
  isFullscreen: boolean;
  hasStarted: boolean;
  isMuted: boolean;
  isClockVisible: boolean;
  returnTo?: string;
  onToggleMute: () => void;
  onToggleClockVisibility: () => void;
  onToggleSettings: () => void;
  onToggleFullscreen: () => void;
}

export function TimerHeader({
  workoutName,
  isFullscreen,
  hasStarted,
  isMuted,
  isClockVisible,
  returnTo,
  onToggleMute,
  onToggleClockVisibility,
  onToggleSettings,
  onToggleFullscreen,
}: TimerHeaderProps) {
  const t = useTranslations("workouts");

  // Fullscreen header - simplified, no back button or settings
  if (isFullscreen) {
    return (
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-semibold">{workoutName}</h1>
            <p className="text-sm text-muted-foreground">
              {t("runner.inProgress")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            title={isMuted ? t("runner.unmute") : t("runner.mute")}
          >
            {isMuted ? (
              <VolumeXIcon className="h-5 w-5" />
            ) : (
              <Volume2Icon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleClockVisibility}
            title={
              isClockVisible ? t("runner.hideClock") : t("runner.showClock")
            }
          >
            {isClockVisible ? (
              <ClockIcon className="h-5 w-5" />
            ) : (
              <EyeOffIcon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
            <ShrinkIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Normal header
  return (
    <div className="flex flex-col border-b px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Row 1 (mobile) / Left side (desktop): back + title */}
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href={returnTo || "/workouts"}>
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{workoutName}</h1>
          <p className="text-sm text-muted-foreground">
            {t("runner.inProgress")}
          </p>
        </div>
      </div>
      {/* Row 2 (mobile) / Right side (desktop): action icons */}
      <div className="flex items-center gap-1 self-end sm:gap-2 sm:self-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          title={isMuted ? t("runner.unmute") : t("runner.mute")}
        >
          {isMuted ? (
            <VolumeXIcon className="h-5 w-5" />
          ) : (
            <Volume2Icon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleClockVisibility}
          title={isClockVisible ? t("runner.hideClock") : t("runner.showClock")}
        >
          {isClockVisible ? (
            <ClockIcon className="h-5 w-5" />
          ) : (
            <EyeOffIcon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSettings}
          disabled={hasStarted}
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
          {isFullscreen ? (
            <ShrinkIcon className="h-5 w-5" />
          ) : (
            <ExpandIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

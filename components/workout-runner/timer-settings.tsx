"use client";

/**
 * TimerSettings Component
 *
 * Mode selection and configuration panel for the timer.
 * Allows changing between STOPWATCH, COUNTDOWN, FOR_TIME, AMRAP, EMOM, TABATA
 * and configuring mode-specific settings.
 */

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkoutTimerMode, TimerModeConfig } from "./types";

interface TimerSettingsProps {
  config: TimerModeConfig;
  onConfigChange: (config: TimerModeConfig) => void;
  disabled?: boolean;
}

export function TimerSettings({
  config,
  onConfigChange,
  disabled = false,
}: TimerSettingsProps) {
  const t = useTranslations("workouts");

  const handleModeChange = (mode: WorkoutTimerMode) => {
    onConfigChange({ ...config, mode });
  };

  const updateConfig = (updates: Partial<TimerModeConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className="border-b bg-muted/50 p-4">
      <div className="mx-auto max-w-md space-y-4">
        <div>
          <Label className="text-muted-foreground">
            {t("runner.timerMode")}
          </Label>
          <Select
            value={config.mode}
            onValueChange={(value: WorkoutTimerMode) => handleModeChange(value)}
            disabled={disabled}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STOPWATCH">Stopwatch</SelectItem>
              <SelectItem value="COUNTDOWN">Countdown</SelectItem>
              <SelectItem value="FOR_TIME">For Time</SelectItem>
              <SelectItem value="AMRAP">AMRAP</SelectItem>
              <SelectItem value="EMOM">EMOM</SelectItem>
              <SelectItem value="TABATA">Tabata</SelectItem>
              <SelectItem value="INTERVALS">Intervals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* COUNTDOWN / AMRAP settings */}
        {(config.mode === "COUNTDOWN" || config.mode === "AMRAP") && (
          <div>
            <Label className="text-muted-foreground">
              {t("runner.duration")} ({t("runner.minutes")})
            </Label>
            <Input
              type="number"
              min={1}
              max={120}
              value={Math.floor((config.duration || 600) / 60)}
              onChange={(e) =>
                updateConfig({ duration: parseInt(e.target.value) * 60 })
              }
              className="mt-1"
              disabled={disabled}
            />
          </div>
        )}

        {/* FOR_TIME settings - CAP is optional */}
        {config.mode === "FOR_TIME" && (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">
                {t("runner.capTime")} ({t("runner.minutes")}) -{" "}
                {t("runner.optional")}
              </Label>
              <Input
                type="number"
                min={0}
                max={120}
                placeholder="0"
                value={
                  config.forTimeCap ? Math.floor(config.forTimeCap / 60) : ""
                }
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : 0;
                  updateConfig({ forTimeCap: value * 60 });
                }}
                className="mt-1"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("runner.capTimeHint")}
              </p>
            </div>
            {(config.forTimeCap || 0) > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="continueAfterCap"
                  checked={config.forTimeContinueAfterCap ?? true}
                  onChange={(e) =>
                    updateConfig({ forTimeContinueAfterCap: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border bg-background text-primary"
                  disabled={disabled}
                />
                <Label
                  htmlFor="continueAfterCap"
                  className="text-sm text-muted-foreground"
                >
                  {t("runner.continueAfterCap")}
                </Label>
              </div>
            )}
          </div>
        )}

        {/* EMOM settings */}
        {config.mode === "EMOM" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">
                {t("runner.minutes")}
              </Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={config.emomMinutes || 10}
                onChange={(e) =>
                  updateConfig({ emomMinutes: parseInt(e.target.value) })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("runner.intervalDuration")} (s)
              </Label>
              <Input
                type="number"
                min={30}
                max={180}
                value={config.emomIntervalSeconds || 60}
                onChange={(e) =>
                  updateConfig({
                    emomIntervalSeconds: parseInt(e.target.value),
                  })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {/* TABATA settings */}
        {config.mode === "TABATA" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">
                {t("runner.work")} (s)
              </Label>
              <Input
                type="number"
                min={5}
                max={60}
                value={config.tabataWork || 20}
                onChange={(e) =>
                  updateConfig({ tabataWork: parseInt(e.target.value) })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("runner.rest")} (s)
              </Label>
              <Input
                type="number"
                min={5}
                max={60}
                value={config.tabataRest || 10}
                onChange={(e) =>
                  updateConfig({ tabataRest: parseInt(e.target.value) })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("runner.rounds")}
              </Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={config.tabataRounds || 8}
                onChange={(e) =>
                  updateConfig({ tabataRounds: parseInt(e.target.value) })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {/* INTERVALS settings */}
        {config.mode === "INTERVALS" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">
                {t("runner.rounds")}
              </Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={config.intervalsRounds || 10}
                onChange={(e) =>
                  updateConfig({ intervalsRounds: parseInt(e.target.value) })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("runner.work")} (s)
              </Label>
              <Input
                type="number"
                min={10}
                max={600}
                value={config.intervalsWork || 120}
                onChange={(e) =>
                  updateConfig({ intervalsWork: parseInt(e.target.value) })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("runner.rest")} (s)
              </Label>
              <Input
                type="number"
                min={5}
                max={300}
                value={config.intervalsRest || 60}
                onChange={(e) =>
                  updateConfig({ intervalsRest: parseInt(e.target.value) })
                }
                className="mt-1"
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

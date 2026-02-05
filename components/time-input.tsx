import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import React from "react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  /** Value in total seconds */
  value: number | null;
  /** Callback when value changes (receives total seconds or null) */
  onChange: (seconds: number | null) => void;
  /** Disable the inputs */
  disabled?: boolean;
  /** Show labels above inputs */
  showLabels?: boolean;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Show only minutes and seconds (for shorter durations) */
  hideHours?: boolean;
  /** Custom label for hours */
  hoursLabel?: string;
  /** Custom label for minutes */
  minutesLabel?: string;
  /** Custom label for seconds */
  secondsLabel?: string;
  /** Additional className for container */
  className?: string;
}

export function TimeInput({
  value,
  onChange,
  disabled,
  showLabels = false,
  size = "default",
  hideHours = false,
  hoursLabel,
  minutesLabel,
  secondsLabel,
  className,
}: TimeInputProps) {
  const t = useTranslations("common.time");

  // Convert seconds to h/m/s
  const hours = value ? Math.floor(value / 3600) : 0;
  const minutes = value ? Math.floor((value % 3600) / 60) : 0;
  const seconds = value ? value % 60 : 0;

  const handlePartChange = (part: "h" | "m" | "s", inputValue: string) => {
    let h = hideHours ? 0 : hours;
    let m = minutes;
    let s = seconds;

    // Parse and validate input
    const numValue = parseInt(inputValue) || 0;

    if (part === "h" && !hideHours) {
      h = Math.max(0, Math.min(99, numValue));
    } else if (part === "m") {
      m = Math.max(0, Math.min(hideHours ? 999 : 59, numValue));
    } else if (part === "s") {
      s = Math.max(0, Math.min(59, numValue));
    }

    // If all parts are zero, set to null
    if (h === 0 && m === 0 && s === 0) {
      onChange(null);
    } else {
      onChange(h * 3600 + m * 60 + s);
    }
  };

  const inputSizeClasses = {
    sm: "w-14 h-8 text-sm",
    default: "w-20 sm:w-24",
    lg: "w-24 sm:w-28 h-12 text-lg",
  };

  const colonSizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-xl font-semibold",
  };

  return (
    <div className={cn("flex items-end gap-1 sm:gap-2", className)}>
      {/* Hours */}
      {!hideHours && (
        <>
          <div className="flex flex-col gap-1">
            {showLabels && (
              <Label className="text-xs text-muted-foreground">
                {hoursLabel || t("hours")}
              </Label>
            )}
            <Input
              type="number"
              min={0}
              max={99}
              value={hours || ""}
              onChange={(e) => handlePartChange("h", e.target.value)}
              disabled={disabled}
              className={cn("text-center", inputSizeClasses[size])}
              placeholder="HH"
              aria-label={hoursLabel || t("hours")}
            />
          </div>
          <span
            className={cn("pb-2 text-muted-foreground", colonSizeClasses[size])}
          >
            :
          </span>
        </>
      )}

      {/* Minutes */}
      <div className="flex flex-col gap-1">
        {showLabels && (
          <Label className="text-xs text-muted-foreground">
            {minutesLabel || t("minutes")}
          </Label>
        )}
        <Input
          type="number"
          min={0}
          max={hideHours ? 999 : 59}
          value={minutes || ""}
          onChange={(e) => handlePartChange("m", e.target.value)}
          disabled={disabled}
          className={cn("text-center", inputSizeClasses[size])}
          placeholder="MM"
          aria-label={minutesLabel || t("minutes")}
        />
      </div>

      <span
        className={cn("pb-2 text-muted-foreground", colonSizeClasses[size])}
      >
        :
      </span>

      {/* Seconds */}
      <div className="flex flex-col gap-1">
        {showLabels && (
          <Label className="text-xs text-muted-foreground">
            {secondsLabel || t("seconds")}
          </Label>
        )}
        <Input
          type="number"
          min={0}
          max={59}
          value={seconds || ""}
          onChange={(e) => handlePartChange("s", e.target.value)}
          disabled={disabled}
          className={cn("text-center", inputSizeClasses[size])}
          placeholder="SS"
          aria-label={secondsLabel || t("seconds")}
        />
      </div>
    </div>
  );
}

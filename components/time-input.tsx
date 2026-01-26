import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import React from "react";

interface TimeInputProps {
  value: number | null;
  onChange: (seconds: number | null) => void;
  disabled?: boolean;
}

export function TimeInput({ value, onChange, disabled }: TimeInputProps) {
  const t = useTranslations("events.pastParticipation");

  // Convert seconds to h/m/s
  const hours = value ? Math.floor(value / 3600) : 0;
  const minutes = value ? Math.floor((value % 3600) / 60) : 0;
  const seconds = value ? value % 60 : 0;

  const handlePartChange = (part: "h" | "m" | "s", inputValue: string) => {
    let h = hours;
    let m = minutes;
    let s = seconds;

    // Parse and validate input
    const numValue = parseInt(inputValue) || 0;

    if (part === "h") {
      h = Math.max(0, Math.min(99, numValue));
    } else if (part === "m") {
      m = Math.max(0, Math.min(59, numValue));
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

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min={0}
        max={99}
        value={hours || ""}
        onChange={(e) => handlePartChange("h", e.target.value)}
        disabled={disabled}
        className="w-20 text-center sm:w-24"
        placeholder="HH"
        aria-label={t("hours")}
      />
      <span className="text-muted-foreground">:</span>
      <Input
        type="number"
        min={0}
        max={59}
        value={minutes || ""}
        onChange={(e) => handlePartChange("m", e.target.value)}
        disabled={disabled}
        className="w-20 text-center sm:w-24"
        placeholder="MM"
        aria-label={t("minutes")}
      />
      <span className="text-muted-foreground">:</span>
      <Input
        type="number"
        min={0}
        max={59}
        value={seconds || ""}
        onChange={(e) => handlePartChange("s", e.target.value)}
        disabled={disabled}
        className="w-20 text-center sm:w-24"
        placeholder="SS"
        aria-label={t("seconds")}
      />
    </div>
  );
}

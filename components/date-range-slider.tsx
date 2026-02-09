"use client";

import { useState, useCallback, useMemo } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface DateRangeSliderProps {
  /** Start of the full range (typically today) */
  minDate: Date;
  /** End of the full range (typically 1 year from today) */
  maxDate: Date;
  /** Current selected start date */
  startDate: Date;
  /** Current selected end date */
  endDate: Date;
  /** Called when the user changes the range */
  onChange: (startDate: Date, endDate: Date) => void;
  /** Locale for date formatting */
  locale?: string;
  /** Label text */
  label?: string;
}

// Map short locale codes to BCP47 locale identifiers
const LOCALE_MAP: Record<string, string> = {
  pt: "pt-PT",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

/**
 * A dual-handle date range slider.
 * The range spans from minDate to maxDate (in days).
 * Users can drag start/end handles to filter a date range.
 */
export function DateRangeSlider({
  minDate,
  maxDate,
  startDate,
  endDate,
  onChange,
  locale = "pt-PT",
  label,
}: DateRangeSliderProps) {
  // Resolve locale to full BCP47
  const resolvedLocale = LOCALE_MAP[locale] || locale;
  // Total days in the full range
  const totalDays = useMemo(() => {
    return Math.round(
      (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [minDate, maxDate]);

  // Convert dates to day offsets from minDate
  const dateToDayOffset = useCallback(
    (date: Date): number => {
      const offset = Math.round(
        (date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return Math.max(0, Math.min(totalDays, offset));
    },
    [minDate, totalDays]
  );

  // Convert day offset back to date
  const dayOffsetToDate = useCallback(
    (offset: number): Date => {
      const date = new Date(minDate);
      date.setDate(date.getDate() + offset);
      // Reset to start of day
      date.setHours(0, 0, 0, 0);
      return date;
    },
    [minDate]
  );

  const startOffset = dateToDayOffset(startDate);
  const endOffset = dateToDayOffset(endDate);

  // Track values for display while dragging
  const [displayValues, setDisplayValues] = useState<[number, number]>([
    startOffset,
    endOffset,
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleValueChange = useCallback((values: number[]) => {
    const newValues: [number, number] = [values[0], values[1]];
    setDisplayValues(newValues);
    setIsDragging(true);
  }, []);

  const handleValueCommit = useCallback(
    (values: number[]) => {
      setIsDragging(false);
      const newStart = dayOffsetToDate(values[0]);
      const newEnd = dayOffsetToDate(values[1]);
      onChange(newStart, newEnd);
    },
    [dayOffsetToDate, onChange]
  );

  // Use display values when dragging, otherwise use prop values
  const currentStart = isDragging ? displayValues[0] : startOffset;
  const currentEnd = isDragging ? displayValues[1] : endOffset;

  // Format date for display
  const formatDateFull = useCallback(
    (dayOffset: number): string => {
      const date = dayOffsetToDate(dayOffset);
      return date.toLocaleDateString(resolvedLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    [dayOffsetToDate, resolvedLocale]
  );

  // Generate month markers for the track
  const monthMarkers = useMemo(() => {
    const markers: { offset: number; label: string }[] = [];
    const current = new Date(minDate);
    // Start from the next month
    current.setMonth(current.getMonth() + 1);
    current.setDate(1);

    while (current < maxDate) {
      const offset = dateToDayOffset(current);
      markers.push({
        offset,
        label: current.toLocaleDateString(resolvedLocale, { month: "short" }),
      });
      current.setMonth(current.getMonth() + 1);
    }
    return markers;
  }, [minDate, maxDate, dateToDayOffset, resolvedLocale]);

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">{label}</h4>
        </div>
      )}

      {/* Date display */}
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
          {formatDateFull(currentStart)}
        </span>
        <span className="text-muted-foreground">—</span>
        <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
          {formatDateFull(currentEnd)}
        </span>
      </div>

      {/* Slider */}
      <div className="px-2.5 py-1">
        <SliderPrimitive.Root
          className={cn(
            "relative flex w-full touch-none select-none items-center"
          )}
          min={0}
          max={totalDays}
          step={1}
          value={[currentStart, currentEnd]}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          minStepsBetweenThumbs={1}
        >
          <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-6 w-6 cursor-grab rounded-full border-2 border-primary bg-background shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50" />
          <SliderPrimitive.Thumb className="block h-6 w-6 cursor-grab rounded-full border-2 border-primary bg-background shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
      </div>

      {/* Month markers */}
      <div className="relative h-4 px-2.5">
        {monthMarkers.map((marker) => (
          <span
            key={marker.offset}
            className="absolute -translate-x-1/2 text-[10px] text-muted-foreground"
            style={{
              left: `${(marker.offset / totalDays) * 100}%`,
            }}
          >
            {marker.label}
          </span>
        ))}
      </div>
    </div>
  );
}

import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";
import { useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

const TOTAL_DAYS = 365;
const THUMB_SIZE = 22;
const TRACK_HEIGHT = 6;

interface DateRangeSliderProps {
  readonly startDays: number;
  readonly endDays: number;
  readonly onRangeChange: (startDays: number, endDays: number) => void;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatShortDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
}

function getMonthTicks(locale: string): { label: string; position: number }[] {
  const today = new Date();
  const ticks: { label: string; position: number }[] = [];
  const seen = new Set<number>();

  for (let d = 0; d <= TOTAL_DAYS; d += 1) {
    const date = addDays(today, d);
    const month = date.getMonth();
    if (!seen.has(month) && date.getDate() === 1) {
      seen.add(month);
      ticks.push({
        label: new Intl.DateTimeFormat(locale, { month: "short" }).format(date),
        position: d / TOTAL_DAYS,
      });
    }
  }
  return ticks;
}

export function DateRangeSlider({
  startDays,
  endDays,
  onRangeChange,
}: DateRangeSliderProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const trackWidthRef = useRef(0);
  const startRef = useRef(startDays);
  const endRef = useRef(endDays);
  const startInitialRef = useRef(0);
  const endInitialRef = useRef(0);
  const onRangeChangeRef = useRef(onRangeChange);
  const activeThumb = useRef<"start" | "end" | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const monthTicks = useMemo(() => getMonthTicks(locale), [locale]);

  const startDate = useMemo(
    () => addDays(today, startDays),
    [today, startDays]
  );
  const endDate = useMemo(() => addDays(today, endDays), [today, endDays]);

  const startLabel = useMemo(
    () => formatShortDate(startDate, locale),
    [startDate, locale]
  );
  const endLabel = useMemo(
    () => formatShortDate(endDate, locale),
    [endDate, locale]
  );

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  const startPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        activeThumb.current = "start";
        startInitialRef.current = startRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const tw = trackWidthRef.current;
        if (tw <= 0) return;
        const initialPos = (startInitialRef.current / TOTAL_DAYS) * tw;
        const newPos = initialPos + gesture.dx;
        const ratio = Math.max(0, Math.min(1, newPos / tw));
        const newDays = Math.round(ratio * TOTAL_DAYS);
        const clamped = clamp(newDays, 0, endRef.current - 7);
        if (clamped !== startRef.current) {
          startRef.current = clamped;
          onRangeChangeRef.current(clamped, endRef.current);
        }
      },
      onPanResponderRelease: () => {
        activeThumb.current = null;
      },
    })
  ).current;

  const endPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        activeThumb.current = "end";
        endInitialRef.current = endRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const tw = trackWidthRef.current;
        if (tw <= 0) return;
        const initialPos = (endInitialRef.current / TOTAL_DAYS) * tw;
        const newPos = initialPos + gesture.dx;
        const ratio = Math.max(0, Math.min(1, newPos / tw));
        const newDays = Math.round(ratio * TOTAL_DAYS);
        const clamped = clamp(newDays, startRef.current + 7, TOTAL_DAYS);
        if (clamped !== endRef.current) {
          endRef.current = clamped;
          onRangeChangeRef.current(startRef.current, clamped);
        }
      },
      onPanResponderRelease: () => {
        activeThumb.current = null;
      },
    })
  ).current;

  // Keep refs in sync with props
  startRef.current = startDays;
  endRef.current = endDays;
  onRangeChangeRef.current = onRangeChange;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidthRef.current = e.nativeEvent.layout.width;
  }, []);

  const startPct = (startDays / TOTAL_DAYS) * 100;
  const endPct = (endDays / TOTAL_DAYS) * 100;

  return (
    <View style={styles.container}>
      {/* Header row: icon + date labels */}
      <View style={styles.header}>
        <Calendar size={14} color={theme.colors.textTertiary} />
        <Text style={styles.dateLabel}>{startLabel}</Text>
        <Text style={styles.separator}>—</Text>
        <Text style={styles.dateLabel}>{endLabel}</Text>
      </View>

      {/* Slider track */}
      <View style={styles.sliderArea} onLayout={onLayout}>
        {/* Background track */}
        <View style={styles.track} />

        {/* Active range */}
        <View
          style={[
            styles.activeTrack,
            {
              left: `${startPct}%`,
              width: `${endPct - startPct}%`,
            },
          ]}
        />

        {/* Start thumb */}
        <View
          style={[styles.thumb, { left: `${startPct}%` }]}
          {...startPan.panHandlers}
        >
          <View style={styles.thumbInner} />
        </View>

        {/* End thumb */}
        <View
          style={[styles.thumb, { left: `${endPct}%` }]}
          {...endPan.panHandlers}
        >
          <View style={styles.thumbInner} />
        </View>
      </View>

      {/* Month ticks */}
      <View style={styles.ticksRow}>
        {monthTicks.map((tick) => (
          <Text
            key={tick.label}
            style={[styles.tickLabel, { left: `${tick.position * 100}%` }]}
          >
            {tick.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
  },
  separator: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  sliderArea: {
    height: THUMB_SIZE + 4,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: theme.colors.border,
  },
  activeTrack: {
    position: "absolute",
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: theme.colors.primary,
    top: (THUMB_SIZE + 4 - TRACK_HEIGHT) / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -(THUMB_SIZE / 2),
    justifyContent: "center",
    alignItems: "center",
    // Larger hit area for easier dragging
    padding: 8,
  },
  thumbInner: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  ticksRow: {
    position: "relative",
    height: 12,
    marginTop: -2,
  },
  tickLabel: {
    position: "absolute",
    fontSize: 9,
    color: theme.colors.textTertiary,
    transform: [{ translateX: -10 }],
  },
});

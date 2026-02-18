import React, { useRef, useMemo } from "react";
import { View, Text, StyleSheet, PanResponder, Dimensions } from "react-native";
import { theme } from "@/src/constants/theme";

const TRACK_H = 6;
const HANDLE_SIZE = 24;

interface TrimSliderProps {
  /** Total video duration in ms */
  durationMs: number;
  /** Current start of trim in ms */
  startMs: number;
  /** Current end of trim in ms */
  endMs: number;
  /** Called when user drags handles */
  onChange: (startMs: number, endMs: number) => void;
  /** Minimum segment length in ms (default 1000) */
  minSegmentMs?: number;
}

export function TrimSlider({
  durationMs,
  startMs,
  endMs,
  onChange,
  minSegmentMs = 1000,
}: TrimSliderProps) {
  const trackWidth = Dimensions.get("window").width - 48; // padding

  // Use refs so PanResponders always read the latest values without
  // needing to recreate (which caused the end-handle snap-back bug).
  const startRef = useRef(startMs);
  startRef.current = startMs;
  const endRef = useRef(endMs);
  endRef.current = endMs;
  const durationRef = useRef(durationMs);
  durationRef.current = durationMs;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Anchor value captured on grant (start of drag)
  const anchorRef = useRef(0);

  const msToX = (ms: number) => (ms / durationRef.current) * trackWidth;
  const xToMs = (x: number) =>
    Math.round((x / trackWidth) * durationRef.current);

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  // Left handle pan responder — stable, never recreated
  const leftPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          anchorRef.current = msToX(startRef.current);
        },
        onPanResponderMove: (_, gesture) => {
          const currentX = anchorRef.current + gesture.dx;
          const newMs = clamp(
            xToMs(currentX),
            0,
            endRef.current - minSegmentMs
          );
          onChangeRef.current(newMs, endRef.current);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackWidth, minSegmentMs]
  );

  // Right handle pan responder — stable, never recreated
  const rightPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          anchorRef.current = msToX(endRef.current);
        },
        onPanResponderMove: (_, gesture) => {
          const currentX = anchorRef.current + gesture.dx;
          const newMs = clamp(
            xToMs(currentX),
            startRef.current + minSegmentMs,
            durationRef.current
          );
          onChangeRef.current(startRef.current, newMs);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackWidth, minSegmentMs]
  );

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const frac = Math.round((ms % 1000) / 100);
    return `${s}.${frac}s`;
  };

  const leftX = msToX(startMs);
  const rightX = msToX(endMs);

  return (
    <View style={styles.container}>
      {/* Time labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.label}>{formatTime(startMs)}</Text>
        <Text style={styles.labelCenter}>
          {formatTime(endMs - startMs)} segment
        </Text>
        <Text style={styles.label}>{formatTime(endMs)}</Text>
      </View>

      {/* Track */}
      <View style={styles.trackContainer}>
        {/* Background track */}
        <View style={styles.track} />

        {/* Selected region */}
        <View
          style={[
            styles.selectedRegion,
            { left: leftX, width: rightX - leftX },
          ]}
        />

        {/* Left handle */}
        <View
          {...leftPan.panHandlers}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[
            styles.handle,
            styles.handleLeft,
            { left: leftX - HANDLE_SIZE / 2 },
          ]}
        >
          <View style={styles.handleInner} />
        </View>

        {/* Right handle */}
        <View
          {...rightPan.panHandlers}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[
            styles.handle,
            styles.handleRight,
            { left: rightX - HANDLE_SIZE / 2 },
          ]}
        >
          <View style={styles.handleInner} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: theme.spacing.sm,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  labelCenter: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  trackContainer: {
    height: HANDLE_SIZE + 8,
    justifyContent: "center",
  },
  track: {
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: theme.colors.border,
  },
  selectedRegion: {
    position: "absolute",
    height: TRACK_H,
    backgroundColor: theme.colors.primary,
    borderRadius: TRACK_H / 2,
    top: (HANDLE_SIZE + 8 - TRACK_H) / 2,
  },
  handle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    top: 4,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  handleLeft: {},
  handleRight: {},
  handleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
});

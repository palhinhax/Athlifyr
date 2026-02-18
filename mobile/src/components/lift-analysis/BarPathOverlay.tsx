import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polyline, Circle } from "react-native-svg";
import type { BarPathPoint } from "@/src/types/lift-analysis";

interface BarPathOverlayProps {
  /** Tracked path in normalized coords (0..1) */
  path: BarPathPoint[];
  /** Container width in px */
  width: number;
  /** Container height in px */
  height: number;
  /** Current playback time (ms) – if set, only points up to this time are shown */
  currentTimeMs?: number;
  /** Stroke color for the path line */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Show the seed point marker */
  showSeed?: boolean;
}

export function BarPathOverlay({
  path,
  width,
  height,
  currentTimeMs,
  strokeColor = "#00FF88",
  strokeWidth = 3,
  showSeed = true,
}: BarPathOverlayProps) {
  if (path.length < 2 || width === 0 || height === 0) return null;

  // Filter by current time if provided
  const visiblePath =
    currentTimeMs !== undefined
      ? path.filter((p) => p.t <= currentTimeMs)
      : path;

  if (visiblePath.length < 1) return null;

  const pointsStr = visiblePath
    .map((p) => `${p.x * width},${p.y * height}`)
    .join(" ");

  const seed = path[0];
  const tip = visiblePath[visiblePath.length - 1];

  return (
    <View
      style={[StyleSheet.absoluteFill, { width, height }]}
      pointerEvents="none"
    >
      <Svg width={width} height={height}>
        {visiblePath.length >= 2 && (
          <Polyline
            points={pointsStr}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.9}
          />
        )}
        {/* Seed point */}
        {showSeed && (
          <Circle
            cx={seed.x * width}
            cy={seed.y * height}
            r={6}
            fill="#FFFFFF"
            stroke={strokeColor}
            strokeWidth={2}
          />
        )}
        {/* Current tip */}
        {tip && (
          <Circle
            cx={tip.x * width}
            cy={tip.y * height}
            r={5}
            fill={strokeColor}
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        )}
      </Svg>
    </View>
  );
}

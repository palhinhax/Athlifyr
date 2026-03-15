"use client";

import type { ReactNode } from "react";

/**
 * Shared axis tick styling used across all charts in the analytics dashboard.
 */
export const AXIS_TICK_STYLE = {
  fontSize: 12,
  fill: "hsl(var(--muted-foreground))",
} as const;

export const AXIS_TICK_STYLE_SM = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))",
} as const;

/**
 * Common axis props (no tick line, no axis line).
 */
export const CLEAN_AXIS_PROPS = {
  tickLine: false,
  axisLine: false,
} as const;

/**
 * Shared CartesianGrid props.
 */
export const GRID_PROPS = {
  strokeDasharray: "3 3",
  opacity: 0.2,
} as const;

/**
 * Wrapper for Recharts custom tooltip content.
 * Handles the active/payload guard and renders in a consistent styled container.
 */
export function ChartTooltipWrapper({
  active,
  payload,
  children,
}: {
  active?: boolean;
  payload?: ReadonlyArray<Record<string, unknown>> | null;
  children: ReactNode;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      {children}
    </div>
  );
}

/**
 * Reusable SVG linear gradient for area charts.
 */
export function ChartGradient({
  id,
  color,
  startOpacity = 0.4,
  endOpacity = 0,
}: {
  id: string;
  color: string;
  startOpacity?: number;
  endOpacity?: number;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={startOpacity} />
      <stop offset="95%" stopColor={color} stopOpacity={endOpacity} />
    </linearGradient>
  );
}

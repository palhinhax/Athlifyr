/**
 * Wall Clock Types
 */

export interface TimerModeProps {
  /** Time in seconds to display */
  seconds: number;
  /** Current status */
  status?: "idle" | "running" | "paused" | "done" | "preparing";
  /** Current phase (work/rest) */
  phase?: "work" | "rest";
  /** Status label to show */
  statusLabel?: string;
  /** Mode label (e.g., "STOPWATCH", "TABATA x8") */
  modeLabel?: string;
  /** Left display value (round number, minute, etc.) or "inactive" */
  leftDisplayValue?: number | "inactive";
  /** Whether to show warning state (e.g., last 10 seconds) */
  isWarning?: boolean;
}

export type WallClockSize = "sm" | "md" | "lg" | "xl";

export interface WallClockProps {
  /** Size variant */
  size?: WallClockSize;
  /** Timer mode props - if provided, shows timer instead of clock */
  timerMode?: TimerModeProps;
  /** Additional CSS classes */
  className?: string;
}

export interface SevenSegmentDigitProps {
  /** Digit value (0-9) or "-" for dash */
  value: number | "-";
  /** Color for "on" segments */
  colorOn?: string;
  /** Color for "off" segments */
  colorOff?: string;
  /** Width of the digit */
  width?: number;
  /** Height of the digit */
  height?: number;
}

export interface ColonProps {
  /** Height to match digits */
  height?: number;
  /** Color for the colon dots */
  colorOn?: string;
}

export interface StatusBadgesProps {
  /** Current phase */
  phase?: "work" | "rest";
  /** Timer status */
  status?: "idle" | "running" | "paused" | "done" | "preparing";
  /** Badge size class */
  badgeSize: string;
}

// Size configurations
export const SIZE_CONFIG = {
  sm: {
    digitWidth: 24,
    digitHeight: 40,
    leftDisplay: { width: 24, height: 40 },
    gap: "gap-0.5",
    padding: "p-2",
    brandingSize: "text-[8px]",
    badgeSize: "px-1 py-0.5 text-[6px]",
  },
  md: {
    digitWidth: 36,
    digitHeight: 60,
    leftDisplay: { width: 36, height: 60 },
    gap: "gap-1",
    padding: "p-3",
    brandingSize: "text-[10px]",
    badgeSize: "px-1.5 py-0.5 text-[8px]",
  },
  lg: {
    digitWidth: 56,
    digitHeight: 90,
    leftDisplay: { width: 56, height: 90 },
    gap: "gap-1.5",
    padding: "p-4",
    brandingSize: "text-xs",
    badgeSize: "px-2 py-1 text-[10px]",
  },
  xl: {
    digitWidth: 80,
    digitHeight: 130,
    leftDisplay: { width: 80, height: 130 },
    gap: "gap-2",
    padding: "p-6",
    brandingSize: "text-sm",
    badgeSize: "px-3 py-1.5 text-xs",
  },
} as const;

// 7-segment digit patterns (a-g segments)
// Each segment: true = on, false = off
//   aaa
//  f   b
//   ggg
//  e   c
//   ddd
export const DIGIT_PATTERNS: Record<number | "-", boolean[]> = {
  0: [true, true, true, true, true, true, false], // a,b,c,d,e,f
  1: [false, true, true, false, false, false, false], // b,c
  2: [true, true, false, true, true, false, true], // a,b,d,e,g
  3: [true, true, true, true, false, false, true], // a,b,c,d,g
  4: [false, true, true, false, false, true, true], // b,c,f,g
  5: [true, false, true, true, false, true, true], // a,c,d,f,g
  6: [true, false, true, true, true, true, true], // a,c,d,e,f,g
  7: [true, true, true, false, false, false, false], // a,b,c
  8: [true, true, true, true, true, true, true], // all
  9: [true, true, true, true, false, true, true], // a,b,c,d,f,g
  "-": [false, false, false, false, false, false, true], // only g (middle)
};

// Default colors for different time units
export const DEFAULT_COLORS = {
  // Clock mode colors
  hoursOn: "#ff3333",
  hoursOff: "#330a0a",
  minutesOn: "#ff3333",
  minutesOff: "#330a0a",
  secondsOn: "#ff3333",
  secondsOff: "#330a0a",
  colonOn: "#ff3333",
};

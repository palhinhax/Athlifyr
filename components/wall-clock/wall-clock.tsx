"use client";

/**
 * Wall Clock Component
 *
 * A realistic 7-segment LED wall clock display
 * Supports both clock mode (showing current time) and timer mode
 */

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SevenSegmentDigit } from "./seven-segment-digit";
import { Colon } from "./colon";
import { StatusBadges } from "./status-badges";
import { SIZE_CONFIG, DEFAULT_COLORS, type WallClockProps } from "./types";

export function WallClock({
  size = "md",
  timerMode,
  className,
}: WallClockProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update time every second (only in clock mode)
  useEffect(() => {
    if (timerMode) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMode]);

  // Size configurations
  const {
    digitWidth,
    digitHeight,
    leftDisplay,
    gap,
    padding,
    brandingSize,
    badgeSize,
  } = SIZE_CONFIG[size];

  // Calculate time digits
  const time = useMemo(() => {
    if (timerMode) {
      // Timer mode - show MM:SS format (4 digits total)
      const totalSeconds = Math.max(0, timerMode.seconds);
      const minutes = Math.floor(totalSeconds / 60) % 100; // Cap at 99 minutes
      const seconds = totalSeconds % 60;

      return {
        h1: 0, // Not used in timer mode
        h2: 0, // Not used in timer mode
        m1: Math.floor(minutes / 10),
        m2: minutes % 10,
        s1: Math.floor(seconds / 10),
        s2: seconds % 10,
      };
    } else {
      // Clock mode - show HH:MM:SS (6 digits)
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();

      return {
        h1: Math.floor(hours / 10),
        h2: hours % 10,
        m1: Math.floor(minutes / 10),
        m2: minutes % 10,
        s1: Math.floor(seconds / 10),
        s2: seconds % 10,
      };
    }
  }, [timerMode, currentTime]);

  // Calculate left display digits (green, for round/minute counter)
  const leftDigits = useMemo(() => {
    if (
      !timerMode?.leftDisplayValue ||
      timerMode.leftDisplayValue === "inactive"
    ) {
      return { d1: "-" as const, d2: "-" as const, isActive: false };
    }

    const value = Math.min(99, Math.max(0, timerMode.leftDisplayValue));
    return {
      d1: Math.floor(value / 10) as number,
      d2: (value % 10) as number,
      isActive: true,
    };
  }, [timerMode?.leftDisplayValue]);

  // Colors
  const colors = DEFAULT_COLORS;

  // Left display colors (always green, but dim when inactive)
  const leftDisplayColors = {
    on: leftDigits.isActive ? "#22ff22" : "#0a3a0a", // Bright green when active, dim when inactive
    off: "#052205", // Very dark green for off segments
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 via-black to-gray-950",
          padding,
          className
        )}
        style={{
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.6),
            0 4px 16px rgba(0,0,0,0.4),
            0 2px 4px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.05),
            inset 0 -2px 8px rgba(0,0,0,0.4)
          `,
          border: "1px solid rgba(60,60,60,0.6)",
        }}
      >
        <div
          className="animate-pulse rounded bg-gray-900"
          style={{ width: digitWidth * 6 + 50, height: digitHeight }}
        />
      </div>
    );
  }

  // Check if left display should be shown (only in timer mode)
  const showLeftDisplay = !!timerMode;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl",
        // Plastic case gradient - darker at edges, slightly lighter in center
        "bg-gradient-to-b from-gray-900 via-black to-gray-950",
        // Top highlight edge (plastic reflection)
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        // Inner bezel shadow
        "after:pointer-events-none after:absolute after:inset-[3px] after:rounded-lg after:shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),inset_0_-1px_2px_rgba(255,255,255,0.02)]",
        padding,
        className
      )}
      style={{
        // Multi-layer shadow for 3D wall-mount effect
        boxShadow: `
          0 12px 40px rgba(0,0,0,0.7),
          0 6px 20px rgba(0,0,0,0.5),
          0 3px 8px rgba(0,0,0,0.4),
          0 1px 2px rgba(0,0,0,0.3),
          inset 0 1px 0 rgba(255,255,255,0.05),
          inset 0 -3px 12px rgba(0,0,0,0.5)
        `,
        // Subtle border with metallic edge
        border: "1px solid rgba(70,70,70,0.5)",
        borderTop: "1px solid rgba(90,90,90,0.4)",
        borderBottom: "1px solid rgba(30,30,30,0.8)",
      }}
      title={timerMode ? "Timer" : "Current time"}
    >
      {/* Plastic surface texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Digits row */}
      <div className={cn("relative z-10 flex items-center", gap)}>
        {/* Left Display - 2 green digits (round/minute/phase counter) - only in timer mode */}
        {showLeftDisplay && (
          <>
            <div
              className={cn("flex items-end", gap)}
              style={{
                marginRight:
                  size === "sm"
                    ? 4
                    : size === "md"
                      ? 8
                      : size === "lg"
                        ? 12
                        : 16,
              }}
            >
              <SevenSegmentDigit
                value={leftDigits.d1}
                colorOn={leftDisplayColors.on}
                colorOff={leftDisplayColors.off}
                width={leftDisplay.width}
                height={leftDisplay.height}
              />
              <SevenSegmentDigit
                value={leftDigits.d2}
                colorOn={leftDisplayColors.on}
                colorOff={leftDisplayColors.off}
                width={leftDisplay.width}
                height={leftDisplay.height}
              />
            </div>
          </>
        )}

        {/* Hours (HH) - only shown in clock mode */}
        {!timerMode && (
          <>
            <SevenSegmentDigit
              value={time.h1}
              colorOn={colors.hoursOn}
              colorOff={colors.hoursOff}
              width={digitWidth}
              height={digitHeight}
            />
            <SevenSegmentDigit
              value={time.h2}
              colorOn={colors.hoursOn}
              colorOff={colors.hoursOff}
              width={digitWidth}
              height={digitHeight}
            />
            <Colon height={digitHeight} colorOn={colors.colonOn} />
          </>
        )}

        {/* Minutes (MM) - shown in both modes */}
        <SevenSegmentDigit
          value={time.m1}
          colorOn={colors.hoursOn}
          colorOff={colors.hoursOff}
          width={digitWidth}
          height={digitHeight}
        />
        <SevenSegmentDigit
          value={time.m2}
          colorOn={colors.hoursOn}
          colorOff={colors.hoursOff}
          width={digitWidth}
          height={digitHeight}
        />

        <Colon height={digitHeight} colorOn={colors.colonOn} />

        {/* Seconds (SS) - shown in both modes */}
        <SevenSegmentDigit
          value={time.s1}
          colorOn={colors.hoursOn}
          colorOff={colors.hoursOff}
          width={digitWidth}
          height={digitHeight}
        />
        <SevenSegmentDigit
          value={time.s2}
          colorOn={colors.hoursOn}
          colorOff={colors.hoursOff}
          width={digitWidth}
          height={digitHeight}
        />
      </div>

      {/* Bottom row: Branding + Mode + Status Badges */}
      <div className="relative z-10 mt-2 flex items-center justify-between">
        {/* Left side: Branding + Mode Label */}
        <div className="flex items-center gap-2">
          {/* Always show ATHLIFYR branding */}
          <span
            className={cn(
              "font-bold tracking-wider text-white/40",
              brandingSize
            )}
          >
            ATHLIFYR
          </span>
          {/* Mode label (only in timer mode) */}
          {timerMode?.modeLabel && (
            <span
              className={cn(
                "font-bold tracking-wider text-white/25",
                brandingSize
              )}
            >
              • {timerMode.modeLabel}
            </span>
          )}
        </div>

        {/* Status badges - LED style (dim when inactive, bright when active) */}
        <StatusBadges
          phase={timerMode?.phase}
          status={timerMode?.status}
          badgeSize={badgeSize}
        />
      </div>
    </div>
  );
}

"use client";

/**
 * Wall Clock - Authentic SVG 7-Segment LED Display
 *
 * Professional SVG-based 7-segment LED clock for navigation bar
 * Inspired by sevenSeg.js - real vector segments that scale perfectly
 * Each digit has 7 segments (a-g) rendered as SVG polygons
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Segment map: which segments are ON for each digit (0-9)
// Layout:  aaaa
//         f    b
//         f    b
//          gggg
//         e    c
//         e    c
//          dddd
const SEGMENT_MAP: Record<string, boolean[]> = {
  // [a, b, c, d, e, f, g]
  "0": [true, true, true, true, true, true, false],
  "1": [false, true, true, false, false, false, false],
  "2": [true, true, false, true, true, false, true],
  "3": [true, true, true, true, false, false, true],
  "4": [false, true, true, false, false, true, true],
  "5": [true, false, true, true, false, true, true],
  "6": [true, false, true, true, true, true, true],
  "7": [true, true, true, false, false, false, false],
  "8": [true, true, true, true, true, true, true],
  "9": [true, true, true, true, false, true, true],
};

interface SevenSegmentDigitProps {
  value: string;
  colorOn?: string;
  colorOff?: string;
  width?: number;
  height?: number;
}

function SevenSegmentDigit({
  value,
  colorOn = "#ff0000",
  colorOff = "#1a0000",
  width = 24,
  height = 40,
}: SevenSegmentDigitProps) {
  const segments = SEGMENT_MAP[value] || SEGMENT_MAP["8"];

  // Segment thickness ratio
  const t = 0.15; // thickness as ratio of width
  const g = 0.02; // gap between segments

  // Calculate dimensions
  const segW = width * t;
  const segH = (height - segW * 3) / 2;

  // Segment polygons (relative positioning)
  // Horizontal segments (a, d, g) - parallelogram shape
  const hSegment = (x: number, y: number, w: number) => {
    const h = segW;
    const offset = h * 0.4;
    return `${x + offset},${y} ${x + w - offset},${y} ${x + w},${y + h / 2} ${x + w - offset},${y + h} ${x + offset},${y + h} ${x},${y + h / 2}`;
  };

  // Vertical segments (b, c, e, f) - parallelogram shape
  const vSegment = (x: number, y: number, h: number) => {
    const w = segW;
    const offset = w * 0.4;
    return `${x + w / 2},${y} ${x + w},${y + offset} ${x + w},${y + h - offset} ${x + w / 2},${y + h} ${x},${y + h - offset} ${x},${y + offset}`;
  };

  const segmentPaths = [
    // a - top horizontal
    {
      points: hSegment(segW + g, 0, width - segW * 2 - g * 2),
      on: segments[0],
    },
    // b - top right vertical
    {
      points: vSegment(width - segW, segW + g, segH - g * 2),
      on: segments[1],
    },
    // c - bottom right vertical
    {
      points: vSegment(width - segW, segW * 2 + segH + g, segH - g * 2),
      on: segments[2],
    },
    // d - bottom horizontal
    {
      points: hSegment(segW + g, height - segW, width - segW * 2 - g * 2),
      on: segments[3],
    },
    // e - bottom left vertical
    {
      points: vSegment(0, segW * 2 + segH + g, segH - g * 2),
      on: segments[4],
    },
    // f - top left vertical
    { points: vSegment(0, segW + g, segH - g * 2), on: segments[5] },
    // g - middle horizontal
    {
      points: hSegment(segW + g, (height - segW) / 2, width - segW * 2 - g * 2),
      on: segments[6],
    },
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {segmentPaths.map((seg, i) => (
        <polygon
          key={i}
          points={seg.points}
          fill={seg.on ? colorOn : colorOff}
          filter={seg.on ? "url(#glow)" : undefined}
          style={{
            transition: "fill 0.05s ease",
          }}
        />
      ))}
    </svg>
  );
}

function Colon({
  height = 40,
  colorOn = "#ff0000",
}: {
  height?: number;
  colorOn?: string;
}) {
  const dotSize = height * 0.1;
  const spacing = height * 0.25;

  return (
    <svg width={dotSize * 2} height={height} className="mx-0.5 block">
      <defs>
        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={dotSize}
        cy={height / 2 - spacing}
        r={dotSize}
        fill={colorOn}
        filter="url(#dotGlow)"
      />
      <circle
        cx={dotSize}
        cy={height / 2 + spacing}
        r={dotSize}
        fill={colorOn}
        filter="url(#dotGlow)"
      />
    </svg>
  );
}

interface WallClockProps {
  className?: string;
}

export function WallClock({ className }: WallClockProps) {
  const [time, setTime] = useState({ h1: "0", h2: "0", m1: "0", m2: "0" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      setTime({
        h1: hours[0],
        h2: hours[1],
        m1: minutes[0],
        m2: minutes[1],
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Segment colors - bright red LED
  const colorOn = "#ff2222";
  const colorOff = "#220505";
  const digitWidth = 18;
  const digitHeight = 32;

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative flex items-center gap-0.5 overflow-hidden rounded-lg border border-gray-800 bg-black px-2 py-1.5",
          "shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_4px_8px_rgba(0,0,0,0.4)]",
          className
        )}
      >
        <div
          className="animate-pulse rounded bg-gray-900"
          style={{ width: digitWidth * 4 + 30, height: digitHeight }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-0.5 overflow-hidden rounded-lg border border-gray-800 bg-black px-2 py-1.5",
        "shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_4px_8px_rgba(0,0,0,0.4)]",
        "before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-gray-700/20 before:to-transparent",
        className
      )}
      title="Current time"
    >
      {/* Hours */}
      <SevenSegmentDigit
        value={time.h1}
        colorOn={colorOn}
        colorOff={colorOff}
        width={digitWidth}
        height={digitHeight}
      />
      <SevenSegmentDigit
        value={time.h2}
        colorOn={colorOn}
        colorOff={colorOff}
        width={digitWidth}
        height={digitHeight}
      />

      <Colon height={digitHeight} colorOn={colorOn} />

      {/* Minutes */}
      <SevenSegmentDigit
        value={time.m1}
        colorOn={colorOn}
        colorOff={colorOff}
        width={digitWidth}
        height={digitHeight}
      />
      <SevenSegmentDigit
        value={time.m2}
        colorOn={colorOn}
        colorOff={colorOff}
        width={digitWidth}
        height={digitHeight}
      />

      {/* Branding */}
      <span className="absolute bottom-0 left-1 text-[5px] font-bold tracking-wider text-white/30">
        ATHLIFYR
      </span>
    </div>
  );
}

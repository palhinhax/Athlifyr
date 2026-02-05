"use client";

/**
 * Seven Segment Digit Component
 *
 * Renders a single 7-segment LED digit display
 */

import { DIGIT_PATTERNS, type SevenSegmentDigitProps } from "./types";

export function SevenSegmentDigit({
  value,
  colorOn = "#ff3333",
  colorOff = "#330a0a",
  width = 40,
  height = 70,
}: SevenSegmentDigitProps) {
  const pattern = DIGIT_PATTERNS[value] || DIGIT_PATTERNS[0];
  const segmentThickness = width * 0.15;
  const gap = segmentThickness * 0.3;

  // Segment positions and shapes
  const segments = [
    // a - top horizontal
    {
      points: `${gap + segmentThickness},0 ${width - gap - segmentThickness},0 ${width - gap - segmentThickness / 2},${segmentThickness / 2} ${width - gap - segmentThickness},${segmentThickness} ${gap + segmentThickness},${segmentThickness} ${gap + segmentThickness / 2},${segmentThickness / 2}`,
    },
    // b - top right vertical
    {
      points: `${width - segmentThickness},${gap + segmentThickness} ${width},${gap + segmentThickness / 2} ${width},${height / 2 - gap / 2} ${width - segmentThickness / 2},${height / 2} ${width - segmentThickness},${height / 2 - gap / 2}`,
    },
    // c - bottom right vertical
    {
      points: `${width - segmentThickness},${height / 2 + gap / 2} ${width - segmentThickness / 2},${height / 2} ${width},${height / 2 + gap / 2} ${width},${height - gap - segmentThickness / 2} ${width - segmentThickness},${height - gap - segmentThickness}`,
    },
    // d - bottom horizontal
    {
      points: `${gap + segmentThickness},${height - segmentThickness} ${width - gap - segmentThickness},${height - segmentThickness} ${width - gap - segmentThickness / 2},${height - segmentThickness / 2} ${width - gap - segmentThickness},${height} ${gap + segmentThickness},${height} ${gap + segmentThickness / 2},${height - segmentThickness / 2}`,
    },
    // e - bottom left vertical
    {
      points: `0,${height / 2 + gap / 2} ${segmentThickness / 2},${height / 2} ${segmentThickness},${height / 2 + gap / 2} ${segmentThickness},${height - gap - segmentThickness} ${0},${height - gap - segmentThickness / 2}`,
    },
    // f - top left vertical
    {
      points: `0,${gap + segmentThickness / 2} ${segmentThickness},${gap + segmentThickness} ${segmentThickness},${height / 2 - gap / 2} ${segmentThickness / 2},${height / 2} ${0},${height / 2 - gap / 2}`,
    },
    // g - middle horizontal
    {
      points: `${gap + segmentThickness},${height / 2 - segmentThickness / 2} ${width - gap - segmentThickness},${height / 2 - segmentThickness / 2} ${width - gap - segmentThickness / 2},${height / 2} ${width - gap - segmentThickness},${height / 2 + segmentThickness / 2} ${gap + segmentThickness},${height / 2 + segmentThickness / 2} ${gap + segmentThickness / 2},${height / 2}`,
    },
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="drop-shadow-[0_0_3px_rgba(255,50,50,0.3)]"
    >
      {segments.map((segment, index) => (
        <polygon
          key={index}
          points={segment.points}
          fill={pattern[index] ? colorOn : colorOff}
          style={{
            filter: pattern[index]
              ? "drop-shadow(0 0 4px currentColor)"
              : "none",
            transition: "fill 0.1s ease-out",
          }}
        />
      ))}
    </svg>
  );
}

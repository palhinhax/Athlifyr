"use client";

/**
 * Colon Component
 *
 * Renders the colon separator between time digits
 */

import type { ColonProps } from "./types";

export function Colon({ height = 70, colorOn = "#ff3333" }: ColonProps) {
  const dotSize = height * 0.08;
  const spacing = height * 0.25;

  return (
    <svg
      width={dotSize * 2}
      height={height}
      viewBox={`0 0 ${dotSize * 2} ${height}`}
      className="mx-1 drop-shadow-[0_0_3px_rgba(255,50,50,0.3)]"
    >
      <circle
        cx={dotSize}
        cy={height / 2 - spacing}
        r={dotSize}
        fill={colorOn}
        style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
      />
      <circle
        cx={dotSize}
        cy={height / 2 + spacing}
        r={dotSize}
        fill={colorOn}
        style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
      />
    </svg>
  );
}

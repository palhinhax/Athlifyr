import React from "react";
import { render } from "@testing-library/react-native";
import { RunTabContent } from "@/src/components/performance/RunTabContent";

jest.mock("lucide-react-native", () => ({
  Timer: () => "TimerIcon",
  TrendingUp: () => "TrendingUpIcon",
  MapPin: () => "MapPinIcon",
}));

jest.mock("@/src/hooks/usePerformance", () => ({
  formatTime: (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
  formatPace: (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
}));

jest.mock("@/src/components/performance/PerformanceEntriesList", () => ({
  PerformanceEntriesList: () => null,
}));

describe("RunTabContent", () => {
  const emptySummary = {
    run: { chartPoints: [], halfPrediction: null, totalEntries: 0 },
    trail: { chartPoints: [], totalEntries: 0 },
    strength: { exercises: [], totalEntries: 0 },
    hyrox: { entries: [], totalEntries: 0, bestTimeByCategory: {} },
    entries: [],
  };

  it("renders nothing when no run entries", () => {
    const { toJSON } = render(<RunTabContent summary={emptySummary} />);
    expect(toJSON()).toBeNull();
  });

  it("renders stats when entries exist", () => {
    const summary = {
      ...emptySummary,
      run: {
        chartPoints: [{ x: 0, paceSecPerKm: 300, distanceKm: 10 }],
        halfPrediction: null,
        totalEntries: 3,
      },
      entries: [
        {
          id: "1",
          type: "RUN",
          distanceKm: 10,
          timeSeconds: 3000,
          performedAt: "2025-06-01",
        },
      ],
    };
    const { getByText } = render(<RunTabContent summary={summary} />);
    expect(getByText("3")).toBeTruthy(); // total runs stat
  });

  it("renders half marathon prediction when available", () => {
    const summary = {
      ...emptySummary,
      run: {
        chartPoints: [{ x: 0, paceSecPerKm: 300, distanceKm: 10 }],
        halfPrediction: {
          predictedTimeSeconds: 6300,
          rangeLowSeconds: 6120,
          rangeHighSeconds: 6480,
          confidence: "HIGH" as const,
          inputsUsedCount: 5,
        },
        totalEntries: 5,
      },
      entries: [
        {
          id: "1",
          type: "RUN",
          distanceKm: 10,
          timeSeconds: 3000,
          performedAt: "2025-06-01",
        },
      ],
    };
    const { getByText } = render(<RunTabContent summary={summary} />);
    // 6300 seconds = 105 min = "105:00" via our mock formatTime
    expect(getByText("105:00")).toBeTruthy();
  });
});

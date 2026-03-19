import React from "react";
import { render } from "@testing-library/react-native";
import { HyroxTabContent } from "@/src/components/performance/HyroxTabContent";

jest.mock("lucide-react-native", () => ({
  TrendingUp: () => "TrendingUpIcon",
  Layers: () => "LayersIcon",
  Timer: () => "TimerIcon",
}));

jest.mock("@/src/hooks/usePerformance", () => ({
  formatTime: (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
}));

jest.mock("@/src/components/performance/PerformanceEntriesList", () => ({
  PerformanceEntriesList: () => null,
}));

describe("HyroxTabContent", () => {
  const emptySummary = {
    run: { chartPoints: [], halfPrediction: null, totalEntries: 0 },
    trail: { chartPoints: [], totalEntries: 0 },
    strength: { exercises: [], totalEntries: 0 },
    hyrox: { entries: [], totalEntries: 0, bestTimeByCategory: {} },
    entries: [],
  };

  it("renders nothing when no hyrox entries", () => {
    const { toJSON } = render(<HyroxTabContent summary={emptySummary} />);
    expect(toJSON()).toBeNull();
  });

  it("renders stats when entries exist", () => {
    const summary = {
      ...emptySummary,
      hyrox: {
        entries: [
          {
            id: "1",
            category: "OPEN_MEN",
            timeSeconds: 5400,
            performedAt: "2025-06-01",
          },
        ],
        totalEntries: 1,
        bestTimeByCategory: {
          OPEN_MEN: { timeSeconds: 5400, performedAt: "2025-06-01" },
        },
      },
      entries: [
        {
          id: "1",
          type: "HYROX",
          hyroxCategory: "OPEN_MEN",
          timeSeconds: 5400,
          performedAt: "2025-06-01",
        },
      ],
    };
    const { getAllByText } = render(<HyroxTabContent summary={summary} />);
    expect(getAllByText("1").length).toBeGreaterThanOrEqual(1); // total races
  });
});

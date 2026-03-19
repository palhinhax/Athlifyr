import React from "react";
import { render } from "@testing-library/react-native";
import { TrailTabContent } from "@/src/components/performance/TrailTabContent";

jest.mock("lucide-react-native", () => ({
  TrendingUp: () => "TrendingUpIcon",
  Timer: () => "TimerIcon",
  MapPin: () => "MapPinIcon",
  Mountain: () => "MountainIcon",
}));

jest.mock("@/src/hooks/usePerformance", () => ({
  formatPace: (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
}));

jest.mock("@/src/components/performance/PerformanceEntriesList", () => ({
  PerformanceEntriesList: () => null,
}));

describe("TrailTabContent", () => {
  const emptySummary = {
    run: { chartPoints: [], halfPrediction: null, totalEntries: 0 },
    trail: { chartPoints: [], totalEntries: 0 },
    strength: { exercises: [], totalEntries: 0 },
    hyrox: { entries: [], totalEntries: 0, bestTimeByCategory: {} },
    entries: [],
  };

  it("renders nothing when no trail entries", () => {
    const { toJSON } = render(<TrailTabContent summary={emptySummary} />);
    expect(toJSON()).toBeNull();
  });

  it("renders stats when entries exist", () => {
    const summary = {
      ...emptySummary,
      trail: {
        chartPoints: [{ x: 0, paceSecPerKm: 360, distanceKm: 15 }],
        totalEntries: 2,
      },
      entries: [
        {
          id: "1",
          type: "TRAIL",
          distanceKm: 15,
          timeSeconds: 5400,
          elevationGainM: 500,
          performedAt: "2025-06-01",
        },
      ],
    };
    const { getByText } = render(<TrailTabContent summary={summary} />);
    expect(getByText("2")).toBeTruthy(); // total trails
  });
});

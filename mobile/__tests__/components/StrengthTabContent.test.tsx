import React from "react";
import { render } from "@testing-library/react-native";
import { StrengthTabContent } from "@/src/components/performance/StrengthTabContent";

jest.mock("lucide-react-native", () => ({
  Dumbbell: () => "DumbbellIcon",
  Layers: () => "LayersIcon",
  TrendingUp: () => "TrendingUpIcon",
}));

jest.mock("@/src/components/performance/PerformanceEntriesList", () => ({
  PerformanceEntriesList: () => null,
}));

describe("StrengthTabContent", () => {
  const emptySummary = {
    run: { chartPoints: [], halfPrediction: null, totalEntries: 0 },
    trail: { chartPoints: [], totalEntries: 0 },
    strength: { exercises: [], totalEntries: 0 },
    hyrox: { entries: [], totalEntries: 0, bestTimeByCategory: {} },
    entries: [],
  };

  it("renders nothing when no strength entries", () => {
    const { toJSON } = render(<StrengthTabContent summary={emptySummary} />);
    expect(toJSON()).toBeNull();
  });

  it("renders stats when entries exist", () => {
    const summary = {
      ...emptySummary,
      strength: {
        exercises: [
          {
            exerciseId: "ex1",
            exerciseName: "Squat",
            totalSets: 20,
            e1rmPrediction: {
              currentE1rmKg: 140,
              confidence: "HIGH",
              inputsUsedCount: 5,
            },
          },
        ],
        totalEntries: 20,
      },
      entries: [
        {
          id: "1",
          type: "STRENGTH",
          exerciseName: "Squat",
          reps: 8,
          weightKg: 100,
          performedAt: "2025-06-01",
        },
      ],
    };
    const { getByText } = render(<StrengthTabContent summary={summary} />);
    expect(getByText("20")).toBeTruthy(); // total sets
    expect(getByText("Squat")).toBeTruthy();
  });
});

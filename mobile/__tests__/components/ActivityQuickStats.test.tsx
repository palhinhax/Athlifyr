import React from "react";
import { render } from "@testing-library/react-native";
import { ActivityQuickStats } from "@/src/components/save-activity/ActivityQuickStats";

jest.mock("lucide-react-native", () => ({
  Route: () => "RouteIcon",
  Clock: () => "ClockIcon",
  Gauge: () => "GaugeIcon",
  TrendingUp: () => "TrendingUpIcon",
}));

jest.mock("@/src/components/save-activity/save-activity.utils", () => ({
  formatDistance: (m: number) => `${(m / 1000).toFixed(1)} km`,
  formatDuration: () => "00:50:00",
  formatPace: (p: number) => `${Math.floor(p)}:00`,
}));

describe("ActivityQuickStats", () => {
  it("renders all four stats", () => {
    const { toJSON } = render(
      <ActivityQuickStats
        distanceM={10000}
        durationMs={3000000}
        avgPaceMinKm={5.0}
        elevationGainM={150}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders distance value", () => {
    const { getByText } = render(
      <ActivityQuickStats
        distanceM={10000}
        durationMs={3000000}
        avgPaceMinKm={5.0}
        elevationGainM={150}
      />
    );
    expect(getByText("10.0 km")).toBeTruthy();
  });

  it("renders duration value", () => {
    const { getByText } = render(
      <ActivityQuickStats
        distanceM={10000}
        durationMs={3000000}
        avgPaceMinKm={5.0}
        elevationGainM={150}
      />
    );
    expect(getByText("00:50:00")).toBeTruthy();
  });
});

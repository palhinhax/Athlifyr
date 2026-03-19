import React from "react";
import { render } from "@testing-library/react-native";
import { PerformanceEntriesList } from "@/src/components/performance/PerformanceEntriesList";

jest.mock("lucide-react-native", () => ({
  Trash2: () => "Trash2Icon",
  ChevronDown: () => "ChevronDownIcon",
  ChevronUp: () => "ChevronUpIcon",
  AlertCircle: () => "AlertCircleIcon",
}));

jest.mock("@/src/hooks/usePerformance", () => ({
  usePerformance: () => ({
    deleteEntry: jest.fn(),
    isDeleting: false,
  }),
  formatTime: (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
  formatPace: (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
}));

jest.mock("@/src/components/ui/Toast", () => ({
  Toast: () => null,
}));

jest.mock("@/src/hooks/useToast", () => ({
  useToast: () => ({
    toast: { visible: false, message: "", type: "info" },
    showToast: jest.fn(),
    hideToast: jest.fn(),
  }),
}));

jest.mock("@/src/components/ui/ConfirmModal", () => ({
  ConfirmModal: () => null,
}));

const makeEntry = (id: string, type: string, overrides = {}) => ({
  id,
  type,
  performedAt: "2025-06-01T10:00:00Z",
  distanceKm: 10,
  timeSeconds: 3000,
  paceSecondsPerKm: 300,
  elevationGainM: null,
  exerciseName: type === "STRENGTH" ? "Squat" : null,
  reps: type === "STRENGTH" ? 8 : null,
  weightKg: type === "STRENGTH" ? 100 : null,
  hyroxCategory: type === "HYROX" ? "OPEN_MEN" : null,
  ...overrides,
});

describe("PerformanceEntriesList", () => {
  it("renders nothing for empty entries", () => {
    const { toJSON } = render(
      <PerformanceEntriesList entries={[]} type="RUN" />
    );
    expect(toJSON()).toBeNull();
  });

  it("renders run entries with distance and time", () => {
    const entries = [makeEntry("1", "RUN")];
    const { getAllByText } = render(
      <PerformanceEntriesList entries={entries} type="RUN" />
    );
    expect(getAllByText(/10/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders strength entries with exercise details", () => {
    const entries = [makeEntry("1", "STRENGTH")];
    const { getByText } = render(
      <PerformanceEntriesList entries={entries} type="STRENGTH" />
    );
    expect(getByText(/Squat/)).toBeTruthy();
  });

  it("renders hyrox entries with category", () => {
    const entries = [makeEntry("1", "HYROX")];
    const { getByText } = render(
      <PerformanceEntriesList entries={entries} type="HYROX" />
    );
    expect(getByText(/OPEN_MEN/)).toBeTruthy();
  });

  it("shows only 3 entries initially when more exist", () => {
    const entries = [
      makeEntry("1", "RUN"),
      makeEntry("2", "RUN"),
      makeEntry("3", "RUN"),
      makeEntry("4", "RUN"),
      makeEntry("5", "RUN"),
    ];
    const { getByText } = render(
      <PerformanceEntriesList entries={entries} type="RUN" />
    );
    // Should have "Show More" button
    expect(getByText("performance.entries.showMore")).toBeTruthy();
  });
});

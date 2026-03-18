import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { PerformanceSection } from "@/src/components/profile/PerformanceSection";

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock usePerformance hook
const mockPerformanceData = {
  summary: null as {
    run: { chartPoints: []; halfPrediction: null; totalEntries: number };
    trail: { chartPoints: []; totalEntries: number };
    strength: { exercises: []; totalEntries: number };
    hyrox: {
      entries: [];
      totalEntries: number;
      bestTimeByCategory: Record<string, never>;
    };
    entries: [];
  } | null,
  isLoading: false,
  error: null,
  refetch: jest.fn(),
  createEntry: jest.fn(),
  isCreating: false,
  deleteEntry: jest.fn(),
  isDeleting: false,
};

jest.mock("@/src/hooks/usePerformance", () => ({
  usePerformance: () => mockPerformanceData,
}));

// Mock tab content components (complex, with charts)
jest.mock("@/src/components/performance/RunTabContent", () => ({
  RunTabContent: () => {
    const { Text } = require("react-native");
    return <Text>RunTabContent</Text>;
  },
}));

jest.mock("@/src/components/performance/TrailTabContent", () => ({
  TrailTabContent: () => {
    const { Text } = require("react-native");
    return <Text>TrailTabContent</Text>;
  },
}));

jest.mock("@/src/components/performance/StrengthTabContent", () => ({
  StrengthTabContent: () => {
    const { Text } = require("react-native");
    return <Text>StrengthTabContent</Text>;
  },
}));

jest.mock("@/src/components/performance/HyroxTabContent", () => ({
  HyroxTabContent: () => {
    const { Text } = require("react-native");
    return <Text>HyroxTabContent</Text>;
  },
}));

// Mock add sheets (modals)
jest.mock("@/src/components/performance/AddRunSheet", () => ({
  AddRunSheet: () => null,
}));

jest.mock("@/src/components/performance/AddStrengthSheet", () => ({
  AddStrengthSheet: () => null,
}));

jest.mock("@/src/components/performance/AddHyroxSheet", () => ({
  AddHyroxSheet: () => null,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("PerformanceSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceData.summary = null;
    mockPerformanceData.isLoading = false;
  });

  describe("tab rendering", () => {
    it("renders all four sport tabs", () => {
      render(<PerformanceSection />);

      expect(screen.getByText("sports.RUNNING")).toBeTruthy();
      expect(screen.getByText("sports.TRAIL")).toBeTruthy();
      expect(screen.getByText("profile.strength")).toBeTruthy();
      expect(screen.getByText("sports.HYROX")).toBeTruthy();
    });

    it("renders section header with performance title", () => {
      render(<PerformanceSection />);

      expect(screen.getByText("profile.performance")).toBeTruthy();
    });

    it("renders add button", () => {
      render(<PerformanceSection />);

      expect(screen.getByText("performance.add")).toBeTruthy();
    });
  });

  describe("loading state", () => {
    it("shows loading indicator when data is loading", () => {
      mockPerformanceData.isLoading = true;

      render(<PerformanceSection />);

      expect(screen.getByText("performance.loading")).toBeTruthy();
    });
  });

  describe("empty states", () => {
    it("shows running empty state by default", () => {
      render(<PerformanceSection />);

      expect(screen.getByText("performance.run.noData")).toBeTruthy();
      expect(screen.getByText("performance.run.noDataDesc")).toBeTruthy();
    });

    it("shows trail empty state when trail tab is selected", () => {
      render(<PerformanceSection />);

      fireEvent.press(screen.getByText("sports.TRAIL"));

      expect(screen.getByText("performance.trail.noData")).toBeTruthy();
      expect(screen.getByText("performance.trail.noDataDesc")).toBeTruthy();
    });

    it("shows strength empty state when strength tab is selected", () => {
      render(<PerformanceSection />);

      fireEvent.press(screen.getByText("profile.strength"));

      expect(screen.getByText("performance.strength.noData")).toBeTruthy();
      expect(screen.getByText("performance.strength.noDataDesc")).toBeTruthy();
    });

    it("shows hyrox empty state when hyrox tab is selected", () => {
      render(<PerformanceSection />);

      fireEvent.press(screen.getByText("sports.HYROX"));

      expect(screen.getByText("performance.hyrox.noData")).toBeTruthy();
      expect(screen.getByText("performance.hyrox.noDataDesc")).toBeTruthy();
    });
  });

  describe("tab switching with data", () => {
    beforeEach(() => {
      mockPerformanceData.summary = {
        run: { chartPoints: [], halfPrediction: null, totalEntries: 5 },
        trail: { chartPoints: [], totalEntries: 3 },
        strength: { exercises: [], totalEntries: 10 },
        hyrox: { entries: [], totalEntries: 2, bestTimeByCategory: {} },
        entries: [],
      };
    });

    it("shows running content when running tab has data", () => {
      render(<PerformanceSection />);

      expect(screen.getByText("RunTabContent")).toBeTruthy();
    });

    it("shows trail content when trail tab is selected and has data", () => {
      render(<PerformanceSection />);

      fireEvent.press(screen.getByText("sports.TRAIL"));

      expect(screen.getByText("TrailTabContent")).toBeTruthy();
    });

    it("shows strength content when strength tab is selected and has data", () => {
      render(<PerformanceSection />);

      fireEvent.press(screen.getByText("profile.strength"));

      expect(screen.getByText("StrengthTabContent")).toBeTruthy();
    });

    it("shows hyrox content when hyrox tab is selected and has data", () => {
      render(<PerformanceSection />);

      fireEvent.press(screen.getByText("sports.HYROX"));

      expect(screen.getByText("HyroxTabContent")).toBeTruthy();
    });
  });

  describe("mixed data states", () => {
    it("shows content for tab with data and empty state for tab without data", () => {
      mockPerformanceData.summary = {
        run: { chartPoints: [], halfPrediction: null, totalEntries: 5 },
        trail: { chartPoints: [], totalEntries: 0 },
        strength: { exercises: [], totalEntries: 0 },
        hyrox: { entries: [], totalEntries: 0, bestTimeByCategory: {} },
        entries: [],
      };

      render(<PerformanceSection />);

      // Running tab has data
      expect(screen.getByText("RunTabContent")).toBeTruthy();

      // Switch to trail — no data
      fireEvent.press(screen.getByText("sports.TRAIL"));
      expect(screen.getByText("performance.trail.noData")).toBeTruthy();

      // Switch back to running — data again
      fireEvent.press(screen.getByText("sports.RUNNING"));
      expect(screen.getByText("RunTabContent")).toBeTruthy();
    });
  });
});

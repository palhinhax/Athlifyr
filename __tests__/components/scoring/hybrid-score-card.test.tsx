import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { HybridScoreCard } from "@/components/scoring/hybrid-score-card";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("@/components/scoring/workout-score-card", () => ({
  ScorePillarBar: ({
    label,
    value,
  }: {
    label: string;
    value: number;
    colorClass?: string;
  }) => (
    <div data-testid={`pillar-${label}`}>
      {label}: {value}
    </div>
  ),
}));

jest.mock("lucide-react", () => ({
  Activity: () => <span data-testid="activity-icon" />,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const hybridScoreData = {
  totalScore: 720,
  breakdown: { strength: 300, endurance: 250, engine: 170 },
  confidence: "HIGH",
  calculatedAt: "2024-06-01T12:00:00.000Z",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("HybridScoreCard", () => {
  it("shows loading skeleton initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    const { container } = render(<HybridScoreCard />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders score data after successful fetch", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => hybridScoreData,
    });

    await act(async () => {
      render(<HybridScoreCard />);
    });

    await waitFor(() => {
      expect(screen.getByText("720")).toBeInTheDocument();
    });
    expect(screen.getByText("/ 1000")).toBeInTheDocument();
    expect(screen.getByText("hybridScore")).toBeInTheDocument();
    expect(screen.getByText("confidence.HIGH")).toBeInTheDocument();
  });

  it("renders pillar bars with correct values", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => hybridScoreData,
    });

    await act(async () => {
      render(<HybridScoreCard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("pillar-pillars.strength")).toBeInTheDocument();
    });
    expect(screen.getByText(/pillars\.strength: 300/)).toBeInTheDocument();
    expect(screen.getByText(/pillars\.endurance: 250/)).toBeInTheDocument();
    expect(screen.getByText(/pillars\.engine: 170/)).toBeInTheDocument();
  });

  it("renders no-data state when totalScore is 0", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ...hybridScoreData, totalScore: 0 }),
    });

    await act(async () => {
      render(<HybridScoreCard />);
    });

    await waitFor(() => {
      expect(screen.getByText("noDataYet")).toBeInTheDocument();
    });
    expect(screen.queryByText("/ 1000")).not.toBeInTheDocument();
  });

  it("renders no-data state when fetch returns non-ok response", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    await act(async () => {
      render(<HybridScoreCard />);
    });

    await waitFor(() => {
      expect(screen.getByText("noDataYet")).toBeInTheDocument();
    });
  });

  it("renders no-data state when fetch throws error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await act(async () => {
      render(<HybridScoreCard />);
    });

    await waitFor(() => {
      expect(screen.getByText("noDataYet")).toBeInTheDocument();
    });
  });

  it("renders MEDIUM confidence badge", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ...hybridScoreData, confidence: "MEDIUM" }),
    });

    await act(async () => {
      render(<HybridScoreCard />);
    });

    await waitFor(() => {
      expect(screen.getByText("confidence.MEDIUM")).toBeInTheDocument();
    });
  });

  it("renders LOW confidence badge", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ...hybridScoreData, confidence: "LOW" }),
    });

    await act(async () => {
      render(<HybridScoreCard />);
    });

    await waitFor(() => {
      expect(screen.getByText("confidence.LOW")).toBeInTheDocument();
    });
  });

  it("applies custom className", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => hybridScoreData,
    });

    let container: HTMLElement;
    await act(async () => {
      const result = render(<HybridScoreCard className="extra-class" />);
      container = result.container;
    });

    await waitFor(() => {
      expect(screen.getByText("720")).toBeInTheDocument();
    });
    expect(container!.firstChild).toHaveClass("extra-class");
  });

  it("calls fetch with the correct URL", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => hybridScoreData,
    });

    await act(async () => {
      render(<HybridScoreCard />);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/profile/hybrid-score");
  });
});

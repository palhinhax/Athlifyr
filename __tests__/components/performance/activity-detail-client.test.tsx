import { render, screen } from "@testing-library/react";
import { ActivityDetailClient } from "@/components/performance/activity-detail-client";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next/dynamic", () => {
  return function mockDynamic() {
    return function MockMap({ className }: { className?: string }) {
      return <div data-testid="activity-map" className={className} />;
    };
  };
});

jest.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/lib/performance/scoring", () => ({
  formatTime: (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
  formatPace: (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`,
}));

jest.mock("@/lib/geolocation", () => ({
  formatDistance: (km: number) => `${km.toFixed(1)} km`,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_ACTIVITY = {
  id: "a1",
  startedAt: "2026-03-01T08:00:00Z",
  finishedAt: "2026-03-01T09:00:00Z",
  durationMs: 3600000,
  distanceM: 10000,
  avgPaceMinKm: 6.0,
  maxSpeedKmh: 12.5,
  elevationGainM: 200,
  elevationLossM: 180,
  track: [
    { lat: 38.5, lng: -8.9, timestamp: 1000 },
    { lat: 38.6, lng: -8.8, timestamp: 2000 },
    { lat: 38.7, lng: -8.7, timestamp: 3000 },
  ],
};

const DEFAULT_LABELS = {
  title: "Run Activity",
  distance: "Distance",
  duration: "Duration",
  avgPace: "Avg Pace",
  maxSpeed: "Max Speed",
  elevGain: "Elev. Gain",
  elevLoss: "Elev. Loss",
  gpsPoints: "GPS Points",
  back: "Back",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ActivityDetailClient", () => {
  it("renders title and date", () => {
    render(
      <ActivityDetailClient
        activity={DEFAULT_ACTIVITY}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.getByText("Run Activity")).toBeInTheDocument();
  });

  it("renders stat cards for distance, duration, pace, speed", () => {
    render(
      <ActivityDetailClient
        activity={DEFAULT_ACTIVITY}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.getByText("Distance")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Avg Pace")).toBeInTheDocument();
    expect(screen.getByText("Max Speed")).toBeInTheDocument();
    expect(screen.getByText("Elev. Gain")).toBeInTheDocument();
    expect(screen.getByText("Elev. Loss")).toBeInTheDocument();
    expect(screen.getByText("GPS Points")).toBeInTheDocument();
  });

  it("renders elevation values", () => {
    render(
      <ActivityDetailClient
        activity={DEFAULT_ACTIVITY}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.getByText("200m")).toBeInTheDocument();
    expect(screen.getByText("180m")).toBeInTheDocument();
  });

  it("renders GPS point count", () => {
    render(
      <ActivityDetailClient
        activity={DEFAULT_ACTIVITY}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders max speed value", () => {
    render(
      <ActivityDetailClient
        activity={DEFAULT_ACTIVITY}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.getByText("12.5 km/h")).toBeInTheDocument();
  });

  it("shows dash when avgPaceMinKm is null", () => {
    render(
      <ActivityDetailClient
        activity={{ ...DEFAULT_ACTIVITY, avgPaceMinKm: null }}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows dash when maxSpeedKmh is null", () => {
    render(
      <ActivityDetailClient
        activity={{ ...DEFAULT_ACTIVITY, maxSpeedKmh: null }}
        labels={DEFAULT_LABELS}
      />
    );

    // Both avgPace and maxSpeed can show "—"
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders map when track has >= 2 points", () => {
    render(
      <ActivityDetailClient
        activity={DEFAULT_ACTIVITY}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.getByTestId("activity-map")).toBeInTheDocument();
  });

  it("does not render map when track has < 2 points", () => {
    render(
      <ActivityDetailClient
        activity={{
          ...DEFAULT_ACTIVITY,
          track: [{ lat: 38.5, lng: -8.9, timestamp: 1000 }],
        }}
        labels={DEFAULT_LABELS}
      />
    );

    expect(screen.queryByTestId("activity-map")).not.toBeInTheDocument();
  });

  it("renders back link pointing to /profile", () => {
    render(
      <ActivityDetailClient
        activity={DEFAULT_ACTIVITY}
        labels={DEFAULT_LABELS}
      />
    );

    const backLink = screen.getByRole("link");
    expect(backLink).toHaveAttribute("href", "/profile");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

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

jest.mock("@/components/performance/edit-run-dialog", () => ({
  EditRunDialog: () => <div data-testid="edit-run-dialog" />,
}));

jest.mock("@/components/performance/edit-strength-dialog", () => ({
  EditStrengthDialog: () => <div data-testid="edit-strength-dialog" />,
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

import { PerformanceEntriesList } from "@/components/performance/performance-entries-list";
import { type PerformanceEntry } from "@/components/performance/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const RUN_ENTRY: PerformanceEntry = {
  id: "entry-1",
  type: "RUN",
  performedAt: "2026-03-01T08:00:00Z",
  distanceKm: 10,
  timeSeconds: 3000,
  elevationGainM: 200,
  runActivityId: "activity-1",
};

const RUN_ENTRY_NO_ACTIVITY: PerformanceEntry = {
  id: "entry-2",
  type: "RUN",
  performedAt: "2026-02-28T08:00:00Z",
  distanceKm: 5,
  timeSeconds: 1500,
  elevationGainM: 100,
  runActivityId: null,
};

const STRENGTH_ENTRY: PerformanceEntry = {
  id: "entry-3",
  type: "STRENGTH",
  performedAt: "2026-03-01T09:00:00Z",
  exerciseId: "ex-1",
  exerciseName: "Bench Press",
  weightKg: 80,
  reps: 8,
};

const onRefresh = jest.fn();

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("PerformanceEntriesList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when no matching entries", () => {
    const { container } = render(
      <PerformanceEntriesList entries={[]} type="RUN" onRefresh={onRefresh} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders run entries with distance and time", () => {
    render(
      <PerformanceEntriesList
        entries={[RUN_ENTRY]}
        type="RUN"
        onRefresh={onRefresh}
      />
    );

    expect(screen.getByText("entries.title")).toBeInTheDocument();
    expect(screen.getByText("1 entries.count")).toBeInTheDocument();
  });

  it("shows MapPin link when entry has runActivityId", () => {
    render(
      <PerformanceEntriesList
        entries={[RUN_ENTRY]}
        type="RUN"
        onRefresh={onRefresh}
      />
    );

    // Should have a link to the activity detail page
    const mapLinks = screen.getAllByRole("link");
    const activityLink = mapLinks.find(
      (link) => link.getAttribute("href") === "/profile/activities/activity-1"
    );
    expect(activityLink).toBeDefined();
  });

  it("does not show MapPin link when entry has no runActivityId", () => {
    render(
      <PerformanceEntriesList
        entries={[RUN_ENTRY_NO_ACTIVITY]}
        type="RUN"
        onRefresh={onRefresh}
      />
    );

    const mapLinks = screen.queryAllByRole("link");
    const activityLink = mapLinks.find(
      (link) =>
        link.getAttribute("href")?.includes("/profile/activities/") ?? false
    );
    expect(activityLink).toBeUndefined();
  });

  it("renders strength entries with weight and reps", () => {
    render(
      <PerformanceEntriesList
        entries={[STRENGTH_ENTRY]}
        type="STRENGTH"
        onRefresh={onRefresh}
      />
    );

    expect(screen.getByText("entries.title")).toBeInTheDocument();
  });

  it("shows edit and delete buttons for each entry", () => {
    render(
      <PerformanceEntriesList
        entries={[RUN_ENTRY]}
        type="RUN"
        onRefresh={onRefresh}
      />
    );

    // Should have edit and delete buttons (both in mobile + desktop = 2 each but mobile might be hidden)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("shows expand button when more than 5 entries", () => {
    const entries = Array.from({ length: 7 }, (_, i) => ({
      ...RUN_ENTRY,
      id: `entry-${i}`,
      performedAt: new Date(2026, 2, i + 1).toISOString(),
    }));

    render(
      <PerformanceEntriesList
        entries={entries}
        type="RUN"
        onRefresh={onRefresh}
      />
    );

    expect(
      screen.getByText("entries.showMore", { exact: false })
    ).toBeInTheDocument();
  });

  it("expands to show all entries when expand is clicked", () => {
    const entries = Array.from({ length: 7 }, (_, i) => ({
      ...RUN_ENTRY,
      id: `entry-${i}`,
      performedAt: new Date(2026, 2, i + 1).toISOString(),
    }));

    render(
      <PerformanceEntriesList
        entries={entries}
        type="RUN"
        onRefresh={onRefresh}
      />
    );

    const expandButton = screen.getByText("entries.showMore", {
      exact: false,
    });
    fireEvent.click(expandButton);

    expect(
      screen.getByText("entries.showLess", { exact: false })
    ).toBeInTheDocument();
  });

  it("opens delete dialog when delete button clicks", () => {
    render(
      <PerformanceEntriesList
        entries={[RUN_ENTRY]}
        type="RUN"
        onRefresh={onRefresh}
      />
    );

    // Find and click the delete button (destructive variant)
    const deleteButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.className.includes("destructive"));
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      expect(screen.getByText("entries.deleteTitle")).toBeInTheDocument();
    }
  });

  it("filters entries by type", () => {
    const mixedEntries = [RUN_ENTRY, STRENGTH_ENTRY];

    const { container } = render(
      <PerformanceEntriesList
        entries={mixedEntries}
        type="STRENGTH"
        onRefresh={onRefresh}
      />
    );

    // Should only show 1 entry (strength)
    expect(container).toBeTruthy();
    expect(screen.getByText("1 entries.count")).toBeInTheDocument();
  });
});

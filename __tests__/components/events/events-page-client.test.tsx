import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── IntersectionObserver polyfill ─────────────────────────────────────────────

const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: mockIntersectionObserver,
});

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "u1" } }, status: "authenticated" }),
}));

jest.mock("@/components/events-filters", () => ({
  EventsFilters: () => <div data-testid="events-filters" />,
}));

jest.mock("@/components/event-card", () => ({
  EventCard: ({ event }: { event: { id: string; title: string } }) => (
    <div data-testid={`event-${event.id}`}>{event.title}</div>
  ),
}));

jest.mock("@/components/hero-background", () => ({
  HeroBackground: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/date-range-slider", () => ({
  DateRangeSlider: () => <div data-testid="date-range-slider" />,
}));

jest.mock("@/components/suggest-event-dialog", () => ({
  SuggestEventDialog: () => <div data-testid="suggest-dialog" />,
}));

jest.mock("next/dynamic", () => () => {
  return function MockEventsMap() {
    return <div data-testid="events-map" />;
  };
});

jest.mock("@/lib/geolocation", () => ({
  calculateDistance: jest.fn().mockReturnValue(10),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import { EventsPageClient } from "@/components/events-page-client";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      events: [
        {
          id: "e1",
          title: "Trail Run 2026",
          slug: "trail-run-2026",
          isFeatured: false,
          startDate: "2026-06-01",
          variants: [],
        },
      ],
      pagination: {
        page: 1,
        pageSize: 12,
        totalCount: 1,
        totalPages: 1,
        hasMore: false,
      },
      participatingEventIds: [],
    }),
  });
});

describe("EventsPageClient", () => {
  it("renders loading state initially then shows events", async () => {
    render(<EventsPageClient userId="u1" />);

    // Should show loading indicator initially (the component fetches on mount)
    await waitFor(() => {
      expect(screen.getByTestId("event-e1")).toBeInTheDocument();
    });
  });

  it("renders search input", async () => {
    render(<EventsPageClient userId="u1" />);

    await waitFor(() => {
      expect(screen.getByTestId("event-e1")).toBeInTheDocument();
    });

    // Search input should be present
    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("fetches events on mount", async () => {
    render(<EventsPageClient />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/events?")
      );
    });
  });

  it("shows suggest event dialog", async () => {
    render(<EventsPageClient userId="u1" />);

    await waitFor(() => {
      expect(screen.getByTestId("suggest-dialog")).toBeInTheDocument();
    });
  });

  it("renders view mode toggle buttons", async () => {
    render(<EventsPageClient userId="u1" />);

    await waitFor(() => {
      expect(screen.getByTestId("event-e1")).toBeInTheDocument();
    });

    // Should have list and map view buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("handles empty events list", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        events: [],
        pagination: {
          page: 1,
          pageSize: 12,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
        },
        participatingEventIds: [],
      }),
    });

    render(<EventsPageClient userId="u1" />);

    await waitFor(() => {
      expect(screen.getByText("noEvents")).toBeInTheDocument();
    });
  });

  it("handles fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<EventsPageClient userId="u1" />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("debounces search query", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<EventsPageClient userId="u1" />);

    await waitFor(() => {
      expect(screen.getByTestId("event-e1")).toBeInTheDocument();
    });

    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        events: [],
        pagination: {
          page: 1,
          pageSize: 12,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
        },
        participatingEventIds: [],
      }),
    });

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "trail");

    // Should not have fetched yet (debounce)
    expect(mockFetch).not.toHaveBeenCalled();

    // Advance past debounce (500ms)
    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("search=trail")
      );
    });

    jest.useRealTimers();
  });
});

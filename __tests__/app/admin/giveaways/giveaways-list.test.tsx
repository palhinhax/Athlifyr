import { render, screen, waitFor } from "@testing-library/react";

// Import setup (runs all mocks)
import "./helpers/giveaways-setup";

// ── Override session and router for this file ─────────────────────────────────

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/admin/giveaways",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "admin-1", role: "ADMIN" } },
    status: "authenticated",
  }),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import AdminGiveawaysPage from "@/app/[locale]/admin/giveaways/page";
import {
  MOCK_GIVEAWAY,
  MOCK_EVENTS,
  MOCK_SCHEDULED_GIVEAWAY,
} from "./helpers/giveaways-setup";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.resetAllMocks());

function mockFetchGiveawaysAndEvents(
  giveaways: (typeof MOCK_GIVEAWAY)[] = [],
  events: typeof MOCK_EVENTS = MOCK_EVENTS
) {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ giveaways }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events }),
    });
}

describe("AdminGiveawaysPage – List & Loading", () => {
  it("shows loading spinner initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<AdminGiveawaysPage />);

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows empty state after loading when no giveaways", async () => {
    mockFetchGiveawaysAndEvents([]);

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("noGiveaways")).toBeInTheDocument();
    });
  });

  it("renders giveaway cards when data is returned", async () => {
    mockFetchGiveawaysAndEvents([MOCK_GIVEAWAY]);

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    // Shows event title
    expect(screen.getByText("Trail Run 2026")).toBeInTheDocument();
    // Shows status badge
    expect(screen.getByText("status.DRAFT")).toBeInTheDocument();
    // Shows participation count
    expect(screen.getByText("5")).toBeInTheDocument();
    // Shows prize count
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows platform badge for non-ALL platforms", async () => {
    const mobileGiveaway = {
      ...MOCK_GIVEAWAY,
      platform: "MOBILE" as const,
    };
    mockFetchGiveawaysAndEvents([mobileGiveaway]);

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("platform.MOBILE")).toBeInTheDocument();
    });
  });

  it("shows create button", async () => {
    mockFetchGiveawaysAndEvents([]);

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("new")).toBeInTheDocument();
    });
  });

  it("renders multiple giveaway cards", async () => {
    mockFetchGiveawaysAndEvents([MOCK_GIVEAWAY, MOCK_SCHEDULED_GIVEAWAY]);

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("status.DRAFT")).toBeInTheDocument();
      expect(screen.getByText("status.SCHEDULED")).toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: [] }),
      });

    render(<AdminGiveawaysPage />);

    // Should show empty state (giveaways = [])
    await waitFor(() => {
      expect(screen.getByText("noGiveaways")).toBeInTheDocument();
    });
  });

  it("shows draw date when giveaway has drawAt", async () => {
    mockFetchGiveawaysAndEvents([MOCK_GIVEAWAY]);

    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("2026-06-15")).toBeInTheDocument();
    });
  });
});

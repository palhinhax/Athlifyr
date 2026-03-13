import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import setup (runs all mocks)
import "./helpers/giveaways-setup";
import {
  MOCK_GIVEAWAY,
  MOCK_EVENTS,
  MOCK_DRAWN_GIVEAWAY,
} from "./helpers/giveaways-setup";

// ── Override session and router ───────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
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

// ── Helpers ───────────────────────────────────────────────────────────────────

beforeEach(() => jest.resetAllMocks());

const MOCK_PARTICIPANTS = [
  {
    id: "p1",
    ticketNumber: 1,
    createdAt: "2026-03-01T10:00:00Z",
    user: { id: "u1", name: "Alice", email: "alice@test.com" },
  },
  {
    id: "p2",
    ticketNumber: 2,
    createdAt: "2026-03-02T10:00:00Z",
    user: { id: "u2", name: "Bob", email: "bob@test.com" },
  },
];

const MOCK_WINNERS = [
  {
    id: "w1",
    rank: 1,
    user: { id: "u1", name: "Alice", email: "alice@test.com", image: null },
  },
];

function mockInitialLoad(giveaways = [MOCK_GIVEAWAY]) {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ giveaways }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: MOCK_EVENTS }),
    });
}

async function openDetailDialog(giveaway = MOCK_GIVEAWAY) {
  const user = userEvent.setup();
  mockInitialLoad([giveaway]);
  render(<AdminGiveawaysPage />);

  await waitFor(() => {
    expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
  });

  // Mock detail fetches
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ participations: MOCK_PARTICIPANTS }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        giveaway: {
          ...giveaway,
          winners: giveaway.status === "DRAWN" ? MOCK_WINNERS : [],
          winningTicketNumbers: giveaway.status === "DRAWN" ? [1] : [],
        },
      }),
    });

  const giveawayCard = screen
    .getAllByTestId("card")
    .find((c) => c.textContent?.includes("Win a Prize!"));
  if (giveawayCard) await user.click(giveawayCard);

  await waitFor(() => {
    expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
  });

  return user;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminGiveawaysPage – Participants & Detail", () => {
  it("shows participants in detail dialog", async () => {
    await openDetailDialog();

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    });
  });

  it("shows ticket numbers for participants", async () => {
    await openDetailDialog();

    await waitFor(() => {
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("#2")).toBeInTheDocument();
    });
  });

  it("shows winners for DRAWN giveaways", async () => {
    await openDetailDialog(MOCK_DRAWN_GIVEAWAY);

    await waitFor(() => {
      // Winner rank badge
      expect(screen.getAllByText("#1").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows no-winners message when no winners", async () => {
    await openDetailDialog();

    await waitFor(() => {
      expect(screen.getByText("detail.noWinners")).toBeInTheDocument();
    });
  });

  it("shows add participant button for non-DRAWN/CANCELLED giveaways", async () => {
    await openDetailDialog();

    expect(screen.getByText("detail.addParticipant")).toBeInTheDocument();
  });

  it("hides add participant button for DRAWN giveaways", async () => {
    await openDetailDialog(MOCK_DRAWN_GIVEAWAY);

    // No add participant button for drawn giveaways
    const footer = screen.getByTestId("dialog-footer");
    expect(
      footer.querySelector('[data-variant="destructive"]')
    ).not.toBeInTheDocument();
  });

  it("handles empty participants list", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    // Mock detail fetches with no participants
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ participations: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          giveaway: {
            ...MOCK_GIVEAWAY,
            winners: [],
            winningTicketNumbers: [],
          },
        }),
      });

    const giveawayCard = screen
      .getAllByTestId("card")
      .find((c) => c.textContent?.includes("Win a Prize!"));
    if (giveawayCard) await user.click(giveawayCard);

    await waitFor(() => {
      expect(screen.getByText("detail.noParticipants")).toBeInTheDocument();
    });
  });

  it("handles participants fetch failure gracefully", async () => {
    const user = userEvent.setup();
    mockInitialLoad();
    render(<AdminGiveawaysPage />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize!")).toBeInTheDocument();
    });

    // Mock fetch failure
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          giveaway: {
            ...MOCK_GIVEAWAY,
            winners: [],
            winningTicketNumbers: [],
          },
        }),
      });

    const giveawayCard = screen
      .getAllByTestId("card")
      .find((c) => c.textContent?.includes("Win a Prize!"));
    if (giveawayCard) await user.click(giveawayCard);

    await waitFor(() => {
      expect(screen.getByText("detail.noParticipants")).toBeInTheDocument();
    });
  });

  it("shows prize count info in detail view", async () => {
    await openDetailDialog();

    await waitFor(() => {
      // Prize count label
      expect(screen.getByText("fields.prizeCount:")).toBeInTheDocument();
    });
  });
});

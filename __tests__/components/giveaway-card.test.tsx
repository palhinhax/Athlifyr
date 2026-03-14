import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { GiveawayCard } from "@/components/giveaway-card";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
  useLocale: () => "en",
}));

const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/en/events/test-event",
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  toast: (...args: unknown[]) => mockToast(...args),
}));

jest.mock("@prisma/client", () => ({
  GiveawayStatus: {
    SCHEDULED: "SCHEDULED",
    DRAWN: "DRAWN",
    CANCELLED: "CANCELLED",
  },
  GiveawayPlatform: {
    ALL: "ALL",
    MOBILE: "MOBILE",
    ANDROID: "ANDROID",
    IOS: "IOS",
  },
}));

jest.mock("@/components/ui/collapsible", () => ({
  Collapsible: ({
    children,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => <div data-testid="collapsible">{children}</div>,
  CollapsibleContent: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="collapsible-content">{children}</div>,
  CollapsibleTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <button data-testid="collapsible-trigger">{children}</button>,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_GIVEAWAY = {
  id: "giveaway-1",
  status: "SCHEDULED",
  platform: "ALL",
  drawAt: new Date("2027-01-01").toISOString(),
  drawnAt: null,
  prizeCount: 3,
  participantsCount: 50,
  secretHash: null,
  secretRevealed: null,
  finalParticipantsCount: null,
  winningTicketNumbers: [],
  winningTicketAttempts: [],
  isWinner: false,
  translation: { lang: "en", title: "Win a Prize", details: "Details" },
  hasJoined: false,
  ticketNumber: null,
};

function setupFetchGiveaway(giveaway: Record<string, unknown> | null) {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes("/api/events/") && url.includes("/giveaway")) {
      return Promise.resolve({
        ok: giveaway !== null,
        json: () => Promise.resolve({ giveaway }),
      });
    }
    return Promise.resolve({ ok: false });
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
});

describe("GiveawayCard", () => {
  it("renders nothing when fetch returns no giveaway", async () => {
    setupFetchGiveaway(null);

    const { container } = render(<GiveawayCard eventId="event-1" />);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(container.innerHTML).toBe("");
  });

  it("renders giveaway title and prize count", async () => {
    setupFetchGiveaway(BASE_GIVEAWAY);

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize")).toBeInTheDocument();
    });

    expect(
      screen.getByText('prizeCountPlural:{"count":3}')
    ).toBeInTheDocument();
  });

  it("shows participant count when >= 10", async () => {
    setupFetchGiveaway({ ...BASE_GIVEAWAY, participantsCount: 50 });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(
        screen.getByText('participantsCountPlural:{"count":50}')
      ).toBeInTheDocument();
    });
  });

  it("hides participant count when < 10", async () => {
    setupFetchGiveaway({ ...BASE_GIVEAWAY, participantsCount: 5 });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("Win a Prize")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/participantsCountPlural/)
    ).not.toBeInTheDocument();
  });

  it("shows login link for unauthenticated users", async () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    setupFetchGiveaway(BASE_GIVEAWAY);

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("loginToParticipate")).toBeInTheDocument();
    });
  });

  it("shows participate button for authenticated users", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    });
    setupFetchGiveaway(BASE_GIVEAWAY);

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("participate")).toBeInTheDocument();
    });
  });

  it("shows already participating when user has joined", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    });
    setupFetchGiveaway({
      ...BASE_GIVEAWAY,
      hasJoined: true,
      ticketNumber: 42,
    });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("alreadyParticipating")).toBeInTheDocument();
    });

    expect(screen.getByText("#42")).toBeInTheDocument();
  });

  it("shows platform restriction badge for mobile-only giveaways", async () => {
    setupFetchGiveaway({ ...BASE_GIVEAWAY, platform: "MOBILE" });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("platform.MOBILE")).toBeInTheDocument();
    });

    // Participate button should not appear for platform-restricted giveaways
    expect(screen.queryByText("participate")).not.toBeInTheDocument();
    expect(screen.queryByText("loginToParticipate")).not.toBeInTheDocument();
  });

  it("shows draw ended badge for drawn giveaways", async () => {
    setupFetchGiveaway({
      ...BASE_GIVEAWAY,
      status: "DRAWN",
      drawnAt: new Date().toISOString(),
    });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("drawEnded")).toBeInTheDocument();
    });
  });

  it("shows winner banner when user won", async () => {
    setupFetchGiveaway({
      ...BASE_GIVEAWAY,
      status: "DRAWN",
      isWinner: true,
      hasJoined: true,
      ticketNumber: 7,
      winningTicketNumbers: [7],
      winningTicketAttempts: [0],
    });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("youWon")).toBeInTheDocument();
    });
  });

  it("shows transparency section when secretHash exists", async () => {
    setupFetchGiveaway({
      ...BASE_GIVEAWAY,
      secretHash: "abc123hash",
    });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("collapsible")).toBeInTheDocument();
    });

    expect(screen.getByText("abc123hash")).toBeInTheDocument();
  });

  it("renders nothing for cancelled giveaways", async () => {
    setupFetchGiveaway({ ...BASE_GIVEAWAY, status: "CANCELLED" });

    const { container } = render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Small delay for state update
    await waitFor(() => {
      expect(container.querySelector(".overflow-hidden")).toBeNull();
    });
  });

  it("handles join action successfully", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    });

    mockFetch.mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes("/giveaway?lang=")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ giveaway: BASE_GIVEAWAY }),
        });
      }
      if (url.includes("/join") && options?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ ticketNumber: 99, currentParticipantsCount: 51 }),
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("participate")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("participate"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({ title: "joinSuccess" });
    });
  });

  it("shows draw pending badge when draw time has passed", async () => {
    setupFetchGiveaway({
      ...BASE_GIVEAWAY,
      drawAt: new Date("2020-01-01").toISOString(), // past date
    });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText("drawPending")).toBeInTheDocument();
    });

    // Participate button should not appear when pending draw
    expect(screen.queryByText("participate")).not.toBeInTheDocument();
  });

  it("uses singular prize count text for 1 prize", async () => {
    setupFetchGiveaway({ ...BASE_GIVEAWAY, prizeCount: 1 });

    render(<GiveawayCard eventId="event-1" />);

    await waitFor(() => {
      expect(screen.getByText('prizeCount:{"count":1}')).toBeInTheDocument();
    });
  });
});

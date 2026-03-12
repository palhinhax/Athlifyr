import { render, screen, waitFor } from "@testing-library/react";
import { GiveawayCard } from "@/components/giveaway-card";

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: "Giveaway",
      participate: "Participate",
      loginToParticipate: "Login to participate",
      alreadyParticipating: "Already participating",
      exclusiveMobile: "Exclusive to mobile app",
      exclusiveAndroid: "Exclusive to Android",
      exclusiveIOS: "Exclusive to iOS",
      drawEnded: "Draw ended",
      drawPending: "Draw pending",
      youWon: "You won!",
      joinSuccess: "Joined!",
      joinError: "Error",
      prizeCount: "{count} prize",
      prizeCountPlural: "{count} prizes",
      participantsCountPlural: "{count} participants",
      "transparency.transparency": "Transparency",
      "transparency.howItWorks": "How it works",
      "transparency.step1": "Step 1",
      "transparency.step2": "Step 2",
      "transparency.step3": "Step 3",
      "transparency.formulaTitle": "Formula",
      "transparency.formulaExplanation": "Explanation",
      "transparency.secretHash": "Secret Hash",
      "transparency.secretHashExplanation": "Hash explanation",
    };
    return translations[key] ?? key;
  },
  useLocale: () => "en",
}));

// Mock next-auth
const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

// Mock toast
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/en/events/test-event",
}));

// Mock next/link
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

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

const futureDate = new Date(Date.now() + 86400000).toISOString();

function makeGiveawayResponse(overrides: Record<string, unknown> = {}) {
  return {
    giveaway: {
      id: "g1",
      status: "SCHEDULED",
      platform: "ALL",
      drawAt: futureDate,
      drawnAt: null,
      prizeCount: 1,
      participantsCount: 15,
      secretHash: null,
      secretRevealed: null,
      finalParticipantsCount: null,
      winningTicketNumbers: [],
      winningTicketAttempts: [],
      isWinner: false,
      translation: { lang: "en", title: "Win a prize!", details: "Details" },
      hasJoined: false,
      ticketNumber: null,
      ...overrides,
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
});

describe("GiveawayCard", () => {
  it("renders nothing when loading", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // never resolves
    const { container } = render(<GiveawayCard eventId="e1" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when no giveaway returned", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ giveaway: null }),
    });

    const { container } = render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("renders giveaway title from translation", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(makeGiveawayResponse()),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Win a prize!")).toBeInTheDocument();
    });
  });

  // ── Platform exclusivity on web ──

  it("shows exclusive mobile badge when platform is MOBILE", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(makeGiveawayResponse({ platform: "MOBILE" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Exclusive to mobile app")).toBeInTheDocument();
    });
  });

  it("shows exclusive Android badge when platform is ANDROID", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(makeGiveawayResponse({ platform: "ANDROID" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Exclusive to Android")).toBeInTheDocument();
    });
  });

  it("shows exclusive iOS badge when platform is IOS", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(makeGiveawayResponse({ platform: "IOS" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Exclusive to iOS")).toBeInTheDocument();
    });
  });

  it("does not show exclusive badge when platform is ALL", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(makeGiveawayResponse({ platform: "ALL" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Win a prize!")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Exclusive to mobile app")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Exclusive to Android")).not.toBeInTheDocument();
    expect(screen.queryByText("Exclusive to iOS")).not.toBeInTheDocument();
  });

  it("hides join button when platform is MOBILE and user not joined", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "u1" } },
      status: "authenticated",
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(makeGiveawayResponse({ platform: "MOBILE" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Exclusive to mobile app")).toBeInTheDocument();
    });
    expect(screen.queryByText("Participate")).not.toBeInTheDocument();
  });

  it("shows join button when platform is ALL and user authenticated", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "u1" } },
      status: "authenticated",
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(makeGiveawayResponse({ platform: "ALL" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Participate")).toBeInTheDocument();
    });
  });

  it("shows login link when platform is ALL and user not authenticated", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(makeGiveawayResponse({ platform: "ALL" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Login to participate")).toBeInTheDocument();
    });
  });

  it("hides login link when platform is ANDROID", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(makeGiveawayResponse({ platform: "ANDROID" })),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Exclusive to Android")).toBeInTheDocument();
    });
    expect(screen.queryByText("Login to participate")).not.toBeInTheDocument();
  });

  // ── Ticket badge when already joined ──

  it("shows ticket badge when user has already joined", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "u1" } },
      status: "authenticated",
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(
          makeGiveawayResponse({ hasJoined: true, ticketNumber: 42 })
        ),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText(/#42/)).toBeInTheDocument();
    });
  });

  it("does not show exclusive badge when user already joined mobile giveaway", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "u1" } },
      status: "authenticated",
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(
          makeGiveawayResponse({
            platform: "MOBILE",
            hasJoined: true,
            ticketNumber: 5,
          })
        ),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText(/#5/)).toBeInTheDocument();
    });
    // Badge should not appear because hasJoined is true
    expect(
      screen.queryByText("Exclusive to mobile app")
    ).not.toBeInTheDocument();
  });

  // ── Drawn state ──

  it("renders nothing when giveaway status is CANCELLED", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(makeGiveawayResponse({ status: "CANCELLED" })),
    });

    const { container } = render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
    // CANCELLED should not render (only SCHEDULED and DRAWN render)
    await waitFor(() => {
      expect(container.querySelector(".rounded-xl")).toBeNull();
    });
  });

  it("shows draw ended badge when status is DRAWN", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(
          makeGiveawayResponse({ status: "DRAWN", drawnAt: futureDate })
        ),
    });

    render(<GiveawayCard eventId="e1" />);
    await waitFor(() => {
      expect(screen.getByText("Draw ended")).toBeInTheDocument();
    });
  });
});

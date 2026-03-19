import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { VenueDetailClient } from "@/components/venue-detail-client";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Tabs – simple passthrough
jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({
    children,
    defaultValue,
  }: {
    children: React.ReactNode;
    defaultValue?: string;
  }) => (
    <div data-testid="tabs" data-default={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <button data-value={value}>{children}</button>,
  TabsContent: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

// AlertDialog stubs
jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...p}>{children}</button>
  ),
  AlertDialogCancel: ({
    children,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...p}>{children}</button>
  ),
}));

// Heavy child components – all stubbed
jest.mock("@/components/venue-profile-header", () => ({
  VenueProfileHeader: () => <div data-testid="venue-profile-header" />,
}));
jest.mock("@/components/venue-feed", () => ({
  VenueFeed: () => <div data-testid="venue-feed" />,
}));
jest.mock("@/components/venue-plan-modal/index", () => ({
  VenuePlanModal: () => <div data-testid="venue-plan-modal" />,
}));
jest.mock("@/components/venue-subscribers-manager", () => ({
  VenueSubscribersManager: () => (
    <div data-testid="venue-subscribers-manager" />
  ),
}));
jest.mock("@/components/venue-sessions-calendar", () => ({
  VenueSessionsCalendar: () => <div data-testid="venue-sessions-calendar" />,
}));
jest.mock("@/components/venue-clients-manager", () => ({
  VenueClientsManager: () => <div data-testid="venue-clients-manager" />,
}));
jest.mock("@/components/venue-ownership-claim-button", () => ({
  VenueOwnershipClaimButton: () => (
    <div data-testid="venue-ownership-claim-button" />
  ),
}));
jest.mock("@/components/venue-about-tab", () => ({
  VenueAboutTab: () => <div data-testid="venue-about-tab" />,
}));
jest.mock("@/components/venue-plans-tab", () => ({
  VenuePlansTab: () => <div data-testid="venue-plans-tab" />,
}));
jest.mock("@/components/venue-team-tab", () => ({
  VenueTeamTab: () => <div data-testid="venue-team-tab" />,
}));
jest.mock("@/components/venue-shop-tab", () => ({
  VenueShopTab: () => <div data-testid="venue-shop-tab" />,
}));
jest.mock("@/components/venue-shop-purchases", () => ({
  VenueShopPurchases: () => <div data-testid="venue-shop-purchases" />,
}));
jest.mock("@/components/venue-checkout-dialog", () => ({
  VenueCheckoutDialog: () => <div data-testid="venue-checkout-dialog" />,
}));
jest.mock("@/components/product-checkout-dialog", () => ({
  ProductCheckoutDialog: () => <div data-testid="product-checkout-dialog" />,
}));
jest.mock("@/components/purchase-success-dialog", () => ({
  PurchaseSuccessDialog: () => <div data-testid="purchase-success-dialog" />,
}));
jest.mock("@/components/trial-booking-button", () => ({
  TrialBookingButton: () => <div data-testid="trial-booking-button" />,
}));

jest.mock("lucide-react", () => ({
  Calendar: () => <svg />,
  Home: () => <svg />,
  Info: () => <svg />,
  CreditCard: () => <svg />,
  Users: () => <svg />,
  ShoppingBag: () => <svg />,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = mockFetch;
});

function makeVenue(overrides: Record<string, unknown> = {}) {
  return {
    id: "v1",
    slug: "gym-x",
    name: "Gym X",
    type: "GYM",
    logo: null,
    coverImage: null,
    description: "A great gym",
    phone: null,
    email: null,
    website: null,
    instagram: null,
    whatsapp: null,
    address: null,
    city: "Lisbon",
    country: "PT",
    latitude: null,
    longitude: null,
    services: [],
    defaultSessionCapacity: null,
    defaultBookingAdvanceDays: 7,
    defaultBookingDeadlineMinutes: 60,
    defaultCancellationDeadlineMinutes: 120,
    requiresPlanToBook: false,
    paymentMode: "EXTERNAL" as const,
    externalPaymentInstructions: null,
    enableTrialBooking: false,
    visibleTabs: ["feed", "about", "plans", "sessions", "team", "shop"],
    members: [],
    plans: [],
    _count: { sessions: 0, bookings: 0, subscriptions: 0 },
    crossVenueSubscriptions: [],
    ...overrides,
  };
}

function setupFetch(venue: ReturnType<typeof makeVenue>) {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => venue,
  });
}

const defaultProps = {
  slug: "gym-x",
  locale: "en",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenueDetailClient", () => {
  // ── Loading state ─────────────────────────────────────────────────────────────

  it("returns null during initial load (SSR content remains)", () => {
    let resolve!: (v: unknown) => void;
    mockFetch.mockReturnValueOnce(new Promise((r) => (resolve = r)));
    const { container } = render(<VenueDetailClient {...defaultProps} />);
    expect(container.firstChild).toBeNull();
    resolve({ ok: true, json: async () => makeVenue() });
  });

  // ── Error / not found state ───────────────────────────────────────────────────

  it("returns null when fetch returns error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    const { container } = render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() => expect(container.firstChild).toBeNull());
  });

  // ── Successful render ─────────────────────────────────────────────────────────

  it("renders venue profile header after successful fetch", async () => {
    setupFetch(makeVenue());
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-profile-header")).toBeInTheDocument()
    );
  });

  it("renders tabs after successful fetch", async () => {
    setupFetch(makeVenue());
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() => expect(screen.getByTestId("tabs")).toBeInTheDocument());
  });

  it("renders feed tab content", async () => {
    setupFetch(makeVenue());
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
  });

  it("renders checkout dialogs", async () => {
    setupFetch(makeVenue());
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId("venue-checkout-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("product-checkout-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("purchase-success-dialog")).toBeInTheDocument();
    });
  });

  // ── Owner/admin rendering ─────────────────────────────────────────────────────

  it("shows clients and subscriptions tabs for owner", async () => {
    const venue = makeVenue({
      members: [
        {
          id: "m1",
          role: "OWNER",
          userId: "u1",
          user: { id: "u1", name: "Owner", email: "o@x.com", image: null },
        },
      ],
    });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("tabs-list")).toBeInTheDocument()
    );
    expect(screen.getByTestId("tab-content-clients")).toBeInTheDocument();
    expect(screen.getByTestId("tab-content-subscriptions")).toBeInTheDocument();
  });

  it("shows clients manager for owner", async () => {
    const venue = makeVenue({
      members: [
        {
          id: "m1",
          role: "OWNER",
          userId: "u1",
          user: { id: "u1", name: "Owner", email: "o@x.com", image: null },
        },
      ],
    });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-clients-manager")).toBeInTheDocument()
    );
  });

  it("does not show clients tab for non-members", async () => {
    setupFetch(makeVenue());
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
    expect(screen.queryByTestId("tab-content-clients")).not.toBeInTheDocument();
  });

  it("shows shop purchases for owner in shop tab", async () => {
    const venue = makeVenue({
      members: [
        {
          id: "m1",
          role: "OWNER",
          userId: "u1",
          user: { id: "u1", name: "Owner", email: "o@x.com", image: null },
        },
      ],
    });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-shop-purchases")).toBeInTheDocument()
    );
  });

  it("does not show shop purchases for non-owners", async () => {
    setupFetch(makeVenue());
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-shop-tab")).toBeInTheDocument()
    );
    expect(
      screen.queryByTestId("venue-shop-purchases")
    ).not.toBeInTheDocument();
  });

  // ── App-level ADMIN role ──────────────────────────────────────────────────────

  it("shows admin tabs for app-level ADMIN user", async () => {
    setupFetch(makeVenue());
    render(
      <VenueDetailClient {...defaultProps} userId="u1" userRole="ADMIN" />
    );
    await waitFor(() =>
      expect(screen.getByTestId("tab-content-clients")).toBeInTheDocument()
    );
  });

  // ── Trial booking button ──────────────────────────────────────────────────────

  it("shows trial booking button for non-member logged-in user when enabled", async () => {
    const venue = makeVenue({ enableTrialBooking: true, members: [] });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("trial-booking-button")).toBeInTheDocument()
    );
  });

  it("does not show trial booking button when disabled", async () => {
    const venue = makeVenue({ enableTrialBooking: false, members: [] });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
    expect(
      screen.queryByTestId("trial-booking-button")
    ).not.toBeInTheDocument();
  });

  it("does not show trial booking button when user is already a member", async () => {
    const venue = makeVenue({
      enableTrialBooking: true,
      members: [
        {
          id: "m1",
          role: "MEMBER",
          userId: "u1",
          user: { id: "u1", name: "User", email: "u@x.com", image: null },
        },
      ],
    });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
    expect(
      screen.queryByTestId("trial-booking-button")
    ).not.toBeInTheDocument();
  });

  // ── Tab visibility control ────────────────────────────────────────────────────

  it("hides tabs list when only 1 public tab is visible", async () => {
    const venue = makeVenue({ visibleTabs: ["feed"] });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
    // visibleTabsCount = 1 → TabsList hidden
    expect(screen.queryByTestId("tabs-list")).not.toBeInTheDocument();
  });

  it("hides tab content for non-visible tabs", async () => {
    const venue = makeVenue({ visibleTabs: ["feed"] });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
    expect(screen.queryByTestId("tab-content-about")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tab-content-shop")).not.toBeInTheDocument();
  });

  // ── Ownership claim ───────────────────────────────────────────────────────────

  it("shows ownership claim button when venue has no owner", async () => {
    const venue = makeVenue({ members: [] });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() =>
      expect(
        screen.getByTestId("venue-ownership-claim-button")
      ).toBeInTheDocument()
    );
  });

  it("does not show ownership claim button when venue has owner", async () => {
    const venue = makeVenue({
      members: [
        {
          id: "m1",
          role: "OWNER",
          userId: "u1",
          user: { id: "u1", name: "Owner", email: "o@x.com", image: null },
        },
      ],
    });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
    expect(
      screen.queryByTestId("venue-ownership-claim-button")
    ).not.toBeInTheDocument();
  });

  // ── Plan toggle active dialog ─────────────────────────────────────────────────

  it("renders toggle plan dialog is closed initially", async () => {
    const venue = makeVenue({
      members: [
        {
          id: "m1",
          role: "OWNER",
          userId: "u1",
          user: { id: "u1", name: "Owner", email: "o@x.com", image: null },
        },
      ],
      plans: [
        {
          id: "plan-1",
          name: "Gold",
          description: null,
          price: 30,
          currency: "EUR",
          isActive: true,
          subscriptions: [],
        },
      ],
    });
    setupFetch(venue);
    render(<VenueDetailClient {...defaultProps} userId="u1" />);
    await waitFor(() =>
      expect(screen.getByTestId("venue-profile-header")).toBeInTheDocument()
    );
    // deleteAlertOpen is false, so alert-dialog should not be visible
    expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
  });

  // ── Fetch endpoint ────────────────────────────────────────────────────────────

  it("fetches from the correct venue slug endpoint", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => makeVenue(),
    });
    render(<VenueDetailClient slug="my-venue" locale="en" />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/venues/my-venue");
  });

  // ── initialTranslatedDescription ─────────────────────────────────────────────

  it("does not re-fetch SEO translations when initialTranslatedDescription is provided", async () => {
    setupFetch(makeVenue());
    render(
      <VenueDetailClient
        {...defaultProps}
        initialTranslatedDescription="Pre-translated"
      />
    );
    await waitFor(() =>
      expect(screen.getByTestId("venue-feed")).toBeInTheDocument()
    );
    // Only the /api/venues/gym-x fetch should have been called (not the /seo endpoint)
    const seoCalls = mockFetch.mock.calls.filter(
      (c: string[]) => typeof c[0] === "string" && c[0].includes("/seo")
    );
    expect(seoCalls.length).toBe(0);
  });
});

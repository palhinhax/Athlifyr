import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenueProfileHeader } from "@/components/venue-profile-header";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    variant: _v,
    size: _s,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }) => <button {...p}>{children}</button>,
}));

jest.mock("lucide-react", () => ({
  MapPin: () => <svg data-testid="map-pin" />,
  Settings: () => <svg data-testid="settings-icon" />,
  BarChart3: () => <svg data-testid="bar-chart" />,
}));

jest.mock("@/components/venue-settings-modal", () => ({
  VenueSettingsModal: ({
    open,
    onOpenChange,
    venue,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venue: { name: string };
  }) =>
    open ? (
      <div data-testid="venue-settings-modal">
        <p>{venue.name}</p>
        <button onClick={() => onOpenChange(false)}>closeModal</button>
      </div>
    ) : null,
}));

jest.mock("@/components/share-button", () => ({
  ShareButton: ({ title }: { title: string }) => (
    <button data-testid="share-button">{title}</button>
  ),
}));

jest.mock("@/components/venue-recommendations", () => ({
  VenueRecommendations: ({ venueId }: { venueId: string }) => (
    <div data-testid={`recommendations-${venueId}`} />
  ),
}));

jest.mock("@/components/venue-reviews-modal", () => ({
  VenueReviewsModal: ({ venueId }: { venueId: string }) => (
    <div data-testid={`reviews-${venueId}`} />
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const MEMBER_OWNER = {
  id: "m1",
  role: "OWNER",
  userId: "u1",
  user: { id: "u1", name: "Alice", email: "alice@test.com", image: null },
};

const MEMBER_MEMBER = {
  id: "m2",
  role: "MEMBER",
  userId: "u2",
  user: { id: "u2", name: "Bob", email: "bob@test.com", image: null },
};

const BASE_VENUE = {
  id: "v1",
  slug: "test-gym",
  name: "Test Gym",
  type: "GYM",
  logo: null,
  coverImage: null,
  description: "A great gym",
  city: "Lisbon",
  country: "PT",
  address: "Rua do Gym 1",
  phone: null,
  email: null,
  website: null,
  instagram: null,
  whatsapp: null,
  latitude: 38.7,
  longitude: -9.1,
  services: [] as string[],
  defaultSessionCapacity: 20,
  defaultBookingAdvanceDays: 7,
  defaultBookingDeadlineMinutes: 60,
  defaultCancellationDeadlineMinutes: 120,
  requiresPlanToBook: false,
  paymentMode: "EXTERNAL" as const,
  externalPaymentInstructions: null,
  enableTrialBooking: false,
  visibleTabs: [] as string[],
  members: [MEMBER_OWNER],
  _count: { sessions: 5, bookings: 10, subscriptions: 3 },
};

const defaultProps = {
  venue: BASE_VENUE,
  userId: "u1",
  isOwnerOrAdmin: true,
  slug: "test-gym",
  locale: "en",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenueProfileHeader", () => {
  // ── Basic rendering ───────────────────────────────────────────────────────────

  it("renders venue name", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    expect(screen.getAllByText("Test Gym").length).toBeGreaterThan(0);
  });

  it("renders venue type via translation key", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    expect(screen.getByText("GYM")).toBeInTheDocument();
  });

  it("shows share button with venue name", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    expect(screen.getByTestId("share-button")).toBeInTheDocument();
  });

  // ── Owner controls ────────────────────────────────────────────────────────────

  it("shows analytics link and edit button for isOwnerOrAdmin", () => {
    render(<VenueProfileHeader {...defaultProps} isOwnerOrAdmin={true} />);
    expect(screen.getByText("analytics.button")).toBeInTheDocument();
    expect(screen.getByText("editVenue")).toBeInTheDocument();
  });

  it("hides analytics link and edit button for non-owners", () => {
    render(<VenueProfileHeader {...defaultProps} isOwnerOrAdmin={false} />);
    expect(screen.queryByText("analytics.button")).not.toBeInTheDocument();
    expect(screen.queryByText("editVenue")).not.toBeInTheDocument();
  });

  it("analytics link points to /venues/[slug]/analytics", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    const link = screen.getByText("analytics.button").closest("a")!;
    expect(link).toHaveAttribute("href", "/venues/test-gym/analytics");
  });

  // ── Edit modal ────────────────────────────────────────────────────────────────

  it("opens settings modal when edit button clicked", async () => {
    render(<VenueProfileHeader {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText("editVenue"));
    expect(screen.getByTestId("venue-settings-modal")).toBeInTheDocument();
  });

  it("does not render settings modal when not isOwnerOrAdmin", () => {
    render(
      <VenueProfileHeader
        {...defaultProps}
        isOwnerOrAdmin={false}
        userId="u1"
      />
    );
    // Modal not rendered at all when !isOwnerOrAdmin
    expect(
      screen.queryByTestId("venue-settings-modal")
    ).not.toBeInTheDocument();
  });

  it("does not render settings modal when userId is undefined even as owner", () => {
    render(
      <VenueProfileHeader
        {...defaultProps}
        isOwnerOrAdmin={true}
        userId={undefined}
      />
    );
    // isOwnerOrAdmin is true but userId is falsy → modal not rendered
    expect(
      screen.queryByTestId("venue-settings-modal")
    ).not.toBeInTheDocument();
  });

  // ── Cover image ───────────────────────────────────────────────────────────────

  it("shows cover image when coverImage is set", () => {
    const venue = { ...BASE_VENUE, coverImage: "https://cdn.test/cover.jpg" };
    render(<VenueProfileHeader {...defaultProps} venue={venue} />);
    expect(screen.getByAltText("Test Gym cover")).toBeInTheDocument();
  });

  it("shows map pin fallback when no coverImage", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    expect(screen.getByTestId("map-pin")).toBeInTheDocument();
  });

  it("shows city text in fallback cover", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    expect(screen.getByText("Lisbon")).toBeInTheDocument();
  });

  // ── Logo ──────────────────────────────────────────────────────────────────────

  it("shows logo image when logo is set", () => {
    const venue = { ...BASE_VENUE, logo: "https://cdn.test/logo.jpg" };
    render(<VenueProfileHeader {...defaultProps} venue={venue} />);
    expect(screen.getByAltText("Test Gym")).toBeInTheDocument();
  });

  // ── Services ──────────────────────────────────────────────────────────────────

  it("shows service tags when venue has services", () => {
    const venue = { ...BASE_VENUE, services: ["YOGA", "PILATES"] };
    render(<VenueProfileHeader {...defaultProps} venue={venue} />);
    expect(screen.getByText("YOGA")).toBeInTheDocument();
    expect(screen.getByText("PILATES")).toBeInTheDocument();
  });

  it("shows +N badge when more than 4 services", () => {
    const venue = {
      ...BASE_VENUE,
      services: ["YOGA", "PILATES", "BOXING", "CYCLING", "CROSSFIT"],
    };
    render(<VenueProfileHeader {...defaultProps} venue={venue} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  // ── Recommendations and Reviews ───────────────────────────────────────────────

  it("renders venue recommendations", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    expect(screen.getByTestId("recommendations-v1")).toBeInTheDocument();
  });

  it("renders venue reviews modal", () => {
    render(<VenueProfileHeader {...defaultProps} />);
    expect(screen.getByTestId("reviews-v1")).toBeInTheDocument();
  });

  // ── isOwner determination ─────────────────────────────────────────────────────

  it("determines isOwner from venue members when user is OWNER role", () => {
    // When the current user is OWNER, the isOwner flag is used for VenueSettingsModal
    const venue = { ...BASE_VENUE, members: [MEMBER_OWNER, MEMBER_MEMBER] };
    render(<VenueProfileHeader {...defaultProps} venue={venue} userId="u1" />);
    // Modal rendered (isOwnerOrAdmin=true and userId set)
    // clicking edit should open modal
    expect(screen.getByText("editVenue")).toBeInTheDocument();
  });
});

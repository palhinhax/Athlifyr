import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenueSettingsModal } from "@/components/venue-settings-modal";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="settings-dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

jest.mock("@/components/ui/responsive-tabs", () => ({
  ResponsiveTabs: ({
    tabs,
    value,
    onValueChange,
  }: {
    tabs: Array<{ value: string; label: string }>;
    value: string;
    onValueChange: (v: string) => void;
  }) => (
    <div data-testid="responsive-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          data-testid={`tab-${tab.value}`}
          aria-selected={value === tab.value}
          onClick={() => onValueChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ),
  ResponsiveTabsContent: ({
    children,
    value,
    activeValue,
  }: {
    children: React.ReactNode;
    value: string;
    activeValue: string;
  }) =>
    value === activeValue ? (
      <div data-testid={`tab-content-${value}`}>{children}</div>
    ) : null,
}));

jest.mock("lucide-react", () => ({
  Building2Icon: () => <svg />,
  CalendarIcon: () => <svg />,
  CreditCardIcon: () => <svg />,
  GlobeIcon: () => <svg />,
  SearchIcon: () => <svg />,
  Settings2Icon: () => <svg />,
  ShoppingBagIcon: () => <svg />,
  UsersIcon: () => <svg />,
}));

jest.mock("@/components/venue/staff", () => ({
  VenueStaffManager: () => <div data-testid="staff-manager" />,
}));

jest.mock("@/components/venue-edit-form", () => ({
  VenueEditForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="edit-form">
      <button onClick={onSuccess}>saveForm</button>
    </div>
  ),
}));

jest.mock("@/components/venue-payments-settings", () => ({
  VenuePaymentsSettings: () => <div data-testid="payments-settings" />,
}));

jest.mock("@/components/venue-sessions-settings", () => ({
  VenueSessionsSettings: () => <div data-testid="sessions-settings" />,
}));

jest.mock("@/components/venue-seo-settings", () => ({
  VenueSEOSettings: () => <div data-testid="seo-settings" />,
}));

jest.mock("@/components/venue-visibility-settings", () => ({
  VenueVisibilitySettings: () => <div data-testid="visibility-settings" />,
}));

jest.mock("@/components/venue-description-translations", () => ({
  VenueDescriptionTranslations: () => (
    <div data-testid="description-translations" />
  ),
}));

jest.mock("@/components/venue-products-settings", () => ({
  VenueProductsSettings: () => <div data-testid="products-settings" />,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  address: "Rua 1",
  phone: null,
  email: null,
  website: null,
  instagram: null,
  whatsapp: null,
  latitude: null,
  longitude: null,
  services: [] as string[],
  defaultSessionCapacity: 20,
  defaultBookingAdvanceDays: 7,
  defaultBookingDeadlineMinutes: 60,
  defaultCancellationDeadlineMinutes: 120,
  requiresPlanToBook: false,
  enableTrialBooking: false,
  paymentMode: "EXTERNAL" as const,
  externalPaymentInstructions: null,
  visibleTabs: [] as string[],
  members: [
    {
      id: "m1",
      role: "OWNER",
      userId: "u1",
      user: { id: "u1", name: "Alice", email: "a@test.com", image: null },
    },
  ],
};

const defaultProps = {
  venue: BASE_VENUE,
  open: true,
  onOpenChange: jest.fn(),
  onRefresh: jest.fn(),
  userId: "u1",
  isOwner: true,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenueSettingsModal", () => {
  // ── Open/close ────────────────────────────────────────────────────────────────

  it("renders nothing when open is false", () => {
    render(<VenueSettingsModal {...defaultProps} open={false} />);
    expect(screen.queryByTestId("settings-dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open is true", () => {
    render(<VenueSettingsModal {...defaultProps} />);
    expect(screen.getByTestId("settings-dialog")).toBeInTheDocument();
  });

  // ── Header content ────────────────────────────────────────────────────────────

  it("shows venueSettings title", () => {
    render(<VenueSettingsModal {...defaultProps} />);
    expect(screen.getByText("venueSettings")).toBeInTheDocument();
  });

  it("shows venue name as dialog description", () => {
    render(<VenueSettingsModal {...defaultProps} />);
    expect(screen.getByText("Test Gym")).toBeInTheDocument();
  });

  // ── Tabs ──────────────────────────────────────────────────────────────────────

  it("renders all 8 settings tabs", () => {
    render(<VenueSettingsModal {...defaultProps} />);
    expect(screen.getByTestId("tab-general")).toBeInTheDocument();
    expect(screen.getByTestId("tab-translations")).toBeInTheDocument();
    expect(screen.getByTestId("tab-sessions")).toBeInTheDocument();
    expect(screen.getByTestId("tab-staff")).toBeInTheDocument();
    expect(screen.getByTestId("tab-payments")).toBeInTheDocument();
    expect(screen.getByTestId("tab-products")).toBeInTheDocument();
    expect(screen.getByTestId("tab-advanced")).toBeInTheDocument();
    expect(screen.getByTestId("tab-seo")).toBeInTheDocument();
  });

  it("defaults to general tab active", () => {
    render(<VenueSettingsModal {...defaultProps} />);
    expect(screen.getByTestId("tab-content-general")).toBeInTheDocument();
    expect(
      screen.queryByTestId("tab-content-sessions")
    ).not.toBeInTheDocument();
  });

  it("shows edit form in general tab", () => {
    render(<VenueSettingsModal {...defaultProps} />);
    expect(screen.getByTestId("edit-form")).toBeInTheDocument();
  });

  // ── Tab switching ─────────────────────────────────────────────────────────────

  it("switches to payments tab when clicked", async () => {
    render(<VenueSettingsModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tab-payments"));
    expect(screen.getByTestId("tab-content-payments")).toBeInTheDocument();
    expect(screen.queryByTestId("tab-content-general")).not.toBeInTheDocument();
  });

  it("switches to staff tab when clicked", async () => {
    render(<VenueSettingsModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tab-staff"));
    expect(screen.getByTestId("tab-content-staff")).toBeInTheDocument();
  });

  it("switches to sessions tab when clicked", async () => {
    render(<VenueSettingsModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tab-sessions"));
    expect(screen.getByTestId("tab-content-sessions")).toBeInTheDocument();
  });

  it("switches to products tab when clicked", async () => {
    render(<VenueSettingsModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tab-products"));
    expect(screen.getByTestId("tab-content-products")).toBeInTheDocument();
  });

  it("switches to translations tab when clicked", async () => {
    render(<VenueSettingsModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tab-translations"));
    expect(screen.getByTestId("tab-content-translations")).toBeInTheDocument();
  });

  it("switches to seo tab when clicked", async () => {
    render(<VenueSettingsModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tab-seo"));
    expect(screen.getByTestId("tab-content-seo")).toBeInTheDocument();
  });

  it("switches to advanced tab when clicked", async () => {
    render(<VenueSettingsModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tab-advanced"));
    expect(screen.getByTestId("tab-content-advanced")).toBeInTheDocument();
  });

  // ── Edit form callbacks ────────────────────────────────────────────────────────

  it("calls onRefresh and closes dialog when edit form saved", async () => {
    const onRefresh = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <VenueSettingsModal
        {...defaultProps}
        onRefresh={onRefresh}
        onOpenChange={onOpenChange}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("saveForm"));
    expect(onRefresh).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

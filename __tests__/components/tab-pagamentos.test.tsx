import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  toast: (...args: unknown[]) => mockToast(...args),
  useToast: () => ({ toast: mockToast }),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...rest
  }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...rest}>{children}</label>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
  CardContent: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>,
  CardHeader: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
  CardTitle: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <h3 {...rest}>{children}</h3>
  ),
}));

jest.mock("@/components/ui/tabs", () => ({
  TabsContent: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`tabs-${value}`}>{children}</div>,
}));

jest.mock("@/components/ui/switch", () => ({
  Switch: ({
    checked,
    disabled,
    onCheckedChange,
  }: {
    checked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (c: boolean) => void;
  }) => (
    <input
      type="checkbox"
      data-testid="switch"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  ),
}));

jest.mock(
  "@/app/[locale]/events/[slug]/manage/_components/stripe-status-badge",
  () => ({
    StripeStatusBadge: ({ status }: { status: string }) => (
      <span data-testid="stripe-badge">{status}</span>
    ),
  })
);

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import { TabPagamentos } from "@/app/[locale]/events/[slug]/manage/_components/tab-pagamentos";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "e1",
    title: "Trail Run",
    slug: "trail-run",
    description: null,
    sportTypes: [],
    startDate: "2026-06-01",
    endDate: null,
    city: "Lisbon",
    country: "PT",
    imageUrl: null,
    latitude: null,
    longitude: null,
    googleMapsUrl: null,
    externalUrl: null,
    stravaRouteEmbed: null,
    hasRegistrations: false,
    hasLiveRace: false,
    liveStatus: "NOT_STARTED",
    stripeOnboardingStatus: "NOT_STARTED",
    stripeChargesEnabled: false,
    stripePayoutsEnabled: false,
    stripeAccountId: null,
    commissionPercent: 5,
    refundDeadline: null,
    checkInOpensAt: null,
    checkInClosesAt: null,
    cancelled: false,
    cancellationReason: null,
    registrationFieldSettings: {},
    variants: [],
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.resetAllMocks());

describe("TabPagamentos", () => {
  const mockOnSave = jest.fn().mockResolvedValue(undefined);
  const mockPopulateEvent = jest.fn();

  it("renders payment tab with stripe badge", () => {
    render(
      <TabPagamentos
        event={makeEvent() as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByTestId("stripe-badge")).toHaveTextContent("NOT_STARTED");
    expect(screen.getByText("stripeConnect")).toBeInTheDocument();
  });

  it("disables registration switch when stripe not complete", () => {
    render(
      <TabPagamentos
        event={makeEvent() as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    const toggle = screen.getByTestId("switch");
    expect(toggle).toBeDisabled();
  });

  it("enables registration switch when stripe is complete", () => {
    render(
      <TabPagamentos
        event={makeEvent({ stripeOnboardingStatus: "COMPLETE" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    const toggle = screen.getByTestId("switch");
    expect(toggle).not.toBeDisabled();
  });

  it("calls onSave when toggling registrations", async () => {
    const user = userEvent.setup();
    render(
      <TabPagamentos
        event={
          makeEvent({
            stripeOnboardingStatus: "COMPLETE",
            hasRegistrations: false,
          }) as never
        }
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByTestId("switch"));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({ hasRegistrations: true });
    });
  });

  it("shows stripe account ID when present", () => {
    render(
      <TabPagamentos
        event={makeEvent({ stripeAccountId: "acct_123" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByText("acct_123")).toBeInTheDocument();
  });

  it("shows setup button when no stripe account", () => {
    render(
      <TabPagamentos
        event={makeEvent() as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByText("setupStripe")).toBeInTheDocument();
  });

  it("shows continue onboarding when stripe account exists", () => {
    render(
      <TabPagamentos
        event={makeEvent({ stripeAccountId: "acct_123" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByText("continueOnboarding")).toBeInTheDocument();
  });

  it("shows commission when commissionPercent > 0", () => {
    render(
      <TabPagamentos
        event={makeEvent({ commissionPercent: 5 }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByText('commission:{"percent":5}')).toBeInTheDocument();
  });

  it("handles stripe connect flow - creates account then gets onboarding link", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://connect.stripe.com/onboard" }),
      });

    render(
      <TabPagamentos
        event={makeEvent() as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("setupStripe"));

    await waitFor(() => {
      // Verify both API calls were made: create account + get onboarding link
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/stripe/connect"),
        expect.objectContaining({ method: "POST" })
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/stripe/onboarding-link"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("handles stripe connect error gracefully", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(
      <TabPagamentos
        event={makeEvent() as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("setupStripe"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("syncs stripe status and refreshes event", async () => {
    const user = userEvent.setup();
    const updatedEvent = makeEvent({ stripeOnboardingStatus: "COMPLETE" });
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => updatedEvent });

    render(
      <TabPagamentos
        event={makeEvent({ stripeAccountId: "acct_123" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("verifyStatus"));

    await waitFor(() => {
      expect(mockPopulateEvent).toHaveBeenCalledWith(updatedEvent);
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "statusUpdated" })
      );
    });
  });

  it("handles sync stripe status error gracefully", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(
      <TabPagamentos
        event={makeEvent({ stripeAccountId: "acct_123" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("verifyStatus"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("skips event refresh when sync status fetch returns non-ok", async () => {
    const user = userEvent.setup();
    // First fetch (status) OK, second (event refresh) not-ok
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false });

    render(
      <TabPagamentos
        event={makeEvent({ stripeAccountId: "acct_123" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("verifyStatus"));

    await waitFor(() => {
      // populateEvent should not have been called since refresh failed
      expect(mockPopulateEvent).not.toHaveBeenCalled();
      // toast should still be called with success
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "statusUpdated" })
      );
    });
  });

  it("shows openDashboard button when stripe is COMPLETE", () => {
    render(
      <TabPagamentos
        event={
          makeEvent({
            stripeAccountId: "acct_123",
            stripeOnboardingStatus: "COMPLETE",
          }) as never
        }
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByText("openDashboard")).toBeInTheDocument();
    expect(screen.queryByText("continueOnboarding")).not.toBeInTheDocument();
  });

  it("opens Stripe dashboard in new tab", async () => {
    const user = userEvent.setup();
    const mockOpen = jest.fn();
    jest.spyOn(globalThis, "open").mockImplementation(mockOpen);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://dashboard.stripe.com/test" }),
    });

    render(
      <TabPagamentos
        event={
          makeEvent({
            stripeAccountId: "acct_123",
            stripeOnboardingStatus: "COMPLETE",
          }) as never
        }
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("openDashboard"));

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalledWith(
        "https://dashboard.stripe.com/test",
        "_blank"
      );
    });

    (globalThis.open as jest.Mock).mockRestore();
  });

  it("handles open dashboard error gracefully", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(
      <TabPagamentos
        event={
          makeEvent({
            stripeAccountId: "acct_123",
            stripeOnboardingStatus: "COMPLETE",
          }) as never
        }
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("openDashboard"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("skips account creation when stripeAccountId already exists during connect", async () => {
    const user = userEvent.setup();
    // Only one fetch needed (onboarding link) since account already exists
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://connect.stripe.com/reonboard" }),
    });

    render(
      <TabPagamentos
        event={makeEvent({ stripeAccountId: "acct_existing" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("continueOnboarding"));

    await waitFor(() => {
      // Should NOT have called /stripe/connect (account already exists)
      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining("/stripe/connect"),
        expect.anything()
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/stripe/onboarding-link"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("handles onboarding link fetch failure", async () => {
    const user = userEvent.setup();
    // connect call succeeds, onboarding link fails
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false });

    render(
      <TabPagamentos
        event={makeEvent() as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByText("setupStripe"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("handles registration toggle onSave failure gracefully", async () => {
    const user = userEvent.setup();
    const failingSave = jest.fn().mockRejectedValue(new Error("Save failed"));

    render(
      <TabPagamentos
        event={
          makeEvent({
            stripeOnboardingStatus: "COMPLETE",
            hasRegistrations: false,
          }) as never
        }
        onSave={failingSave}
        populateEvent={mockPopulateEvent}
      />
    );

    await user.click(screen.getByTestId("switch"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("shows verifyStatus button only when stripeAccountId is present", () => {
    const { rerender } = render(
      <TabPagamentos
        event={makeEvent() as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.queryByText("verifyStatus")).not.toBeInTheDocument();

    rerender(
      <TabPagamentos
        event={makeEvent({ stripeAccountId: "acct_123" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByText("verifyStatus")).toBeInTheDocument();
  });

  it("shows amber warning when stripe is not complete", () => {
    render(
      <TabPagamentos
        event={makeEvent({ stripeOnboardingStatus: "PENDING" }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.getByText("stripeRequired")).toBeInTheDocument();
  });

  it("does not show amber warning when stripe is complete", () => {
    render(
      <TabPagamentos
        event={
          makeEvent({
            stripeOnboardingStatus: "COMPLETE",
            stripeAccountId: "acct_123",
          }) as never
        }
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.queryByText("stripeRequired")).not.toBeInTheDocument();
  });

  it("does not show commission info when commissionPercent is 0", () => {
    render(
      <TabPagamentos
        event={makeEvent({ commissionPercent: 0 }) as never}
        onSave={mockOnSave}
        populateEvent={mockPopulateEvent}
      />
    );

    expect(screen.queryByText(/commission/)).not.toBeInTheDocument();
  });
});

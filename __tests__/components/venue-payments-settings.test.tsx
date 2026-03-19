import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenuePaymentsSettings } from "@/components/venue-payments-settings";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

let mockToast: jest.Mock;
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
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

jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant: _v,
    ...p
  }: React.HTMLAttributes<HTMLSpanElement> & { variant?: string }) => (
    <span {...p}>{children}</span>
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...p}>{children}</label>
  ),
}));

jest.mock("lucide-react", () => ({
  AlertCircle: () => <svg data-testid="alert-circle" />,
  CheckCircle2: () => <svg data-testid="check-circle" />,
  CreditCard: () => <svg data-testid="credit-card" />,
  ExternalLink: () => <svg data-testid="external-link" />,
  Loader2: () => <svg data-testid="loader" />,
  RefreshCw: () => <svg data-testid="refresh" />,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
const mockOpen = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = mockFetch;
  mockToast = (
    jest.requireMock("@/components/ui/use-toast") as { toast: jest.Mock }
  ).toast;

  // Mock window.open
  (globalThis as { open: unknown }).open = mockOpen;
});

const STATUS_NOT_STARTED = {
  accountId: null,
  onboardingStatus: "NOT_STARTED" as const,
  chargesEnabled: false,
  payoutsEnabled: false,
  detailsSubmitted: false,
  lastWebhookAt: null,
};

const STATUS_PENDING = {
  ...STATUS_NOT_STARTED,
  accountId: "acct_1",
  onboardingStatus: "PENDING" as const,
};

const STATUS_COMPLETE = {
  accountId: "acct_1",
  onboardingStatus: "COMPLETE" as const,
  chargesEnabled: true,
  payoutsEnabled: true,
  detailsSubmitted: true,
  lastWebhookAt: null,
};

const STATUS_RESTRICTED = {
  ...STATUS_COMPLETE,
  onboardingStatus: "RESTRICTED" as const,
};

const defaultProps = {
  venueId: "v1",
  isOwner: true,
  currentPaymentMode: "EXTERNAL" as const,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenuePaymentsSettings", () => {
  // ── Non-management access ────────────────────────────────────────────────────

  it("shows ownerOnly message for non-owners", () => {
    // No fetch needed since canManagePayments=false → setLoading(false) directly
    render(
      <VenuePaymentsSettings
        {...defaultProps}
        isOwner={false}
        userRole={undefined}
      />
    );
    expect(screen.getByText("ownerOnly")).toBeInTheDocument();
  });

  it("allows ADMIN userRole to manage", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(
      <VenuePaymentsSettings
        {...defaultProps}
        isOwner={false}
        userRole="ADMIN"
      />
    );
    await waitFor(() =>
      expect(screen.queryByText("ownerOnly")).not.toBeInTheDocument()
    );
  });

  // ── NOT_STARTED status ───────────────────────────────────────────────────────

  it("shows notConfigured card when status is NOT_STARTED", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_NOT_STARTED,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("notConfigured")).toBeInTheDocument()
    );
  });

  it("shows notConfigured when status fetch fails (null status)", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("notConfigured")).toBeInTheDocument()
    );
  });

  it("shows activateStripe button", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_NOT_STARTED,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("activateStripe")).toBeInTheDocument()
    );
  });

  it("activateStripe redirects to onboarding URL on success", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_NOT_STARTED }) // status fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // connect POST
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://connect.stripe.com/onboard/123" }),
      }); // onboarding-link

    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("activateStripe")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("activateStripe"));

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v1/stripe/onboarding-link",
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  it("shows error toast when activateStripe fails", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_NOT_STARTED })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "error" }),
      });

    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("activateStripe")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("activateStripe"));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      )
    );
  });

  // ── PENDING status ───────────────────────────────────────────────────────────

  it("shows onboardingPending card when status is PENDING", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_PENDING,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getAllByText("onboardingPending").length).toBeGreaterThan(0)
    );
  });

  it("shows continueSetup button for PENDING status", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_PENDING,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("continueSetup")).toBeInTheDocument()
    );
  });

  it("shows refreshStatus button for PENDING status", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_PENDING,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("refreshStatus")).toBeInTheDocument()
    );
  });

  it("continueSetup redirects to onboarding-link URL", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_PENDING })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://connect.stripe.com/continue" }),
      });

    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("continueSetup")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("continueSetup"));
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v1/stripe/onboarding-link",
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  it("refreshStatus re-fetches stripe status", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_PENDING })
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_COMPLETE });

    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("refreshStatus")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("refreshStatus"));

    await waitFor(() =>
      expect(screen.getAllByText("active").length).toBeGreaterThan(0)
    );
  });

  // ── COMPLETE status ──────────────────────────────────────────────────────────

  it("shows active card when status is COMPLETE", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getAllByText("active").length).toBeGreaterThan(0)
    );
  });

  it("shows receivesDirectly message for COMPLETE status", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("receivesDirectly")).toBeInTheDocument()
    );
  });

  it("opens dashboard in new tab for COMPLETE status", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_COMPLETE })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://dashboard.stripe.com/login" }),
      });

    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("openDashboard")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("openDashboard"));
    await waitFor(() =>
      expect(mockOpen).toHaveBeenCalledWith(
        "https://dashboard.stripe.com/login",
        "_blank"
      )
    );
  });

  // ── RESTRICTED status ────────────────────────────────────────────────────────

  it("shows restricted card when status is RESTRICTED", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_RESTRICTED,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("restricted")).toBeInTheDocument()
    );
  });

  // ── Payment mode selection ───────────────────────────────────────────────────

  it("renders payment mode radio options", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() => expect(screen.getByText("inApp")).toBeInTheDocument());
    expect(screen.getByText("external")).toBeInTheDocument();
    expect(screen.getByText("mixed")).toBeInTheDocument();
  });

  it("shows current payment mode as selected", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(
      <VenuePaymentsSettings {...defaultProps} currentPaymentMode="IN_APP" />
    );
    await waitFor(() => expect(screen.getByText("inApp")).toBeInTheDocument());
    const inAppOption = screen.getByText("inApp").closest("[role=radio]")!;
    expect(inAppOption).toHaveAttribute("aria-checked", "true");
  });

  it("shows stripeRequired label on IN_APP when stripe not complete", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_PENDING,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getAllByText(/stripeRequired/).length).toBeGreaterThan(0)
    );
  });

  it("does not show stripeRequired when stripe is COMPLETE", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() =>
      expect(screen.queryByText("stripeRequired")).not.toBeInTheDocument()
    );
  });

  it("selecting EXTERNAL mode updates selection", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(
      <VenuePaymentsSettings {...defaultProps} currentPaymentMode="IN_APP" />
    );
    await waitFor(() =>
      expect(screen.getByText("external")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("external").closest("[role=radio]")!);
    expect(
      screen.getByText("external").closest("[role=radio]")
    ).toHaveAttribute("aria-checked", "true");
  });

  it("shows stripeRequiredDescription warning when IN_APP selected without stripe", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_PENDING,
    });
    render(
      <VenuePaymentsSettings {...defaultProps} currentPaymentMode="IN_APP" />
    );
    await waitFor(() =>
      expect(screen.getByText("stripeRequiredDescription")).toBeInTheDocument()
    );
  });

  // ── Save payment mode ────────────────────────────────────────────────────────

  it("calls patch endpoint when save is clicked", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_COMPLETE })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(
      <VenuePaymentsSettings {...defaultProps} currentPaymentMode="EXTERNAL" />
    );
    await waitFor(() => expect(screen.getByText("save")).toBeInTheDocument());
    const user = userEvent.setup();
    await user.click(screen.getByText("save"));

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v1/payment-settings",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ paymentMode: "EXTERNAL" }),
        })
      )
    );
  });

  it("shows saved toast on successful save", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_COMPLETE })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() => expect(screen.getByText("save")).toBeInTheDocument());
    const user = userEvent.setup();
    await user.click(screen.getByText("save"));
    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "saved" })
      )
    );
  });

  it("shows saveFailed toast when save fails", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => STATUS_COMPLETE })
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) });

    render(<VenuePaymentsSettings {...defaultProps} />);
    await waitFor(() => expect(screen.getByText("save")).toBeInTheDocument());
    const user = userEvent.setup();
    await user.click(screen.getByText("save"));
    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "saveFailed",
          variant: "destructive",
        })
      )
    );
  });

  // ── Keyboard interaction on PaymentModeOption ─────────────────────────────────

  it("selects option via keyboard Enter", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(
      <VenuePaymentsSettings {...defaultProps} currentPaymentMode="EXTERNAL" />
    );
    await waitFor(() => expect(screen.getByText("inApp")).toBeInTheDocument());
    const user = userEvent.setup();
    const inAppOption = screen
      .getByText("inApp")
      .closest("[role=radio]") as HTMLElement;
    inAppOption.focus();
    await user.keyboard("{Enter}");
    expect(inAppOption).toHaveAttribute("aria-checked", "true");
  });

  it("selects option via keyboard Space", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => STATUS_COMPLETE,
    });
    render(
      <VenuePaymentsSettings {...defaultProps} currentPaymentMode="EXTERNAL" />
    );
    await waitFor(() => expect(screen.getByText("inApp")).toBeInTheDocument());
    const user = userEvent.setup();
    const inAppOption = screen
      .getByText("inApp")
      .closest("[role=radio]") as HTMLElement;
    inAppOption.focus();
    await user.keyboard(" ");
    expect(inAppOption).toHaveAttribute("aria-checked", "true");
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenueCheckoutDialog } from "@/components/venue-checkout-dialog";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="checkout-dialog">{children}</div> : null),
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
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    variant: _v,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button {...p}>{children}</button>
  ),
}));

jest.mock("@/components/stripe-checkout", () => ({
  StripeCheckout: ({
    planId,
    onSuccess,
    onCancel,
  }: {
    planId: string;
    onSuccess: () => void;
    onCancel: () => void;
  }) => (
    <div data-testid="stripe-checkout" data-plan-id={planId}>
      <button onClick={onSuccess}>stripeSuccess</button>
      <button onClick={onCancel}>stripeCancel</button>
    </div>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLAN = {
  id: "plan-1",
  name: "Premium",
  price: 29.99,
  currency: "EUR",
  duration: "MONTHLY" as const,
};

const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
  venueId: "v1",
  venueName: "Test Gym",
  paymentMode: "IN_APP",
  selectedPlan: PLAN,
  selectedPaymentMethod: null as "IN_APP" | "EXTERNAL" | null,
  onPaymentMethodSelect: jest.fn(),
  onSuccess: jest.fn(),
  onCancel: jest.fn(),
  onOnSiteRequest: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenueCheckoutDialog", () => {
  // ── Open / closed state ───────────────────────────────────────────────────────

  it("renders nothing when open is false", () => {
    render(<VenueCheckoutDialog {...defaultProps} open={false} />);
    expect(screen.queryByTestId("checkout-dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open is true", () => {
    render(<VenueCheckoutDialog {...defaultProps} />);
    expect(screen.getByTestId("checkout-dialog")).toBeInTheDocument();
  });

  // ── Header content ────────────────────────────────────────────────────────────

  it("shows subscribe title", () => {
    render(<VenueCheckoutDialog {...defaultProps} />);
    expect(screen.getByText("subscribe")).toBeInTheDocument();
  });

  it("shows plan name and price in description when plan provided", () => {
    render(<VenueCheckoutDialog {...defaultProps} />);
    expect(screen.getByText(/Premium/)).toBeInTheDocument();
    expect(screen.getByText(/29.99/)).toBeInTheDocument();
  });

  it("shows billing period for MONTHLY duration", () => {
    render(<VenueCheckoutDialog {...defaultProps} />);
    expect(screen.getByText(/perMonth/)).toBeInTheDocument();
  });

  it("does not show billing period for ONE_TIME duration", () => {
    const plan = { ...PLAN, duration: "ONE_TIME" as const };
    render(<VenueCheckoutDialog {...defaultProps} selectedPlan={plan} />);
    expect(screen.queryByText(/perMonth/)).not.toBeInTheDocument();
  });

  it("shows fallback perMonth for unknown duration", () => {
    const plan = { ...PLAN, duration: "BIANNUAL" as unknown as "MONTHLY" };
    render(<VenueCheckoutDialog {...defaultProps} selectedPlan={plan} />);
    expect(screen.getByText(/perMonth/)).toBeInTheDocument();
  });

  it("shows no billing period when plan has no duration", () => {
    const planNoDuration = {
      id: PLAN.id,
      name: PLAN.name,
      price: PLAN.price,
      currency: PLAN.currency,
    } as typeof PLAN;
    render(
      <VenueCheckoutDialog {...defaultProps} selectedPlan={planNoDuration} />
    );
    expect(screen.queryByText(/perMonth/)).not.toBeInTheDocument();
  });

  // ── EXTERNAL mode ─────────────────────────────────────────────────────────────

  it("shows on-site payment UI for EXTERNAL paymentMode", () => {
    render(<VenueCheckoutDialog {...defaultProps} paymentMode="EXTERNAL" />);
    expect(screen.getByText("payment.onSiteTitle")).toBeInTheDocument();
    expect(screen.getByText("payment.onSiteInstructions")).toBeInTheDocument();
  });

  it("shows on-site steps for EXTERNAL mode", () => {
    render(<VenueCheckoutDialog {...defaultProps} paymentMode="EXTERNAL" />);
    expect(screen.getByText("payment.onSiteStep1")).toBeInTheDocument();
    expect(screen.getByText("payment.onSiteStep2")).toBeInTheDocument();
    expect(screen.getByText("payment.onSiteStep3")).toBeInTheDocument();
  });

  it("calls onCancel when goBack button clicked in EXTERNAL mode", async () => {
    const onCancel = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="EXTERNAL"
        onCancel={onCancel}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("payment.goBack"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onCancel when confirmOnSite button clicked in EXTERNAL mode", async () => {
    const onCancel = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="EXTERNAL"
        onCancel={onCancel}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("payment.confirmOnSite"));
    expect(onCancel).toHaveBeenCalled();
  });

  // ── IN_APP mode ───────────────────────────────────────────────────────────────

  it("renders StripeCheckout for IN_APP paymentMode", () => {
    render(<VenueCheckoutDialog {...defaultProps} paymentMode="IN_APP" />);
    expect(screen.getByTestId("stripe-checkout")).toBeInTheDocument();
  });

  it("passes planId to StripeCheckout", () => {
    render(<VenueCheckoutDialog {...defaultProps} paymentMode="IN_APP" />);
    expect(screen.getByTestId("stripe-checkout")).toHaveAttribute(
      "data-plan-id",
      "plan-1"
    );
  });

  it("calls onSuccess when stripe checkout succeeds", async () => {
    const onSuccess = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="IN_APP"
        onSuccess={onSuccess}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("stripeSuccess"));
    expect(onSuccess).toHaveBeenCalled();
  });

  // ── MIXED mode — method selection ─────────────────────────────────────────────

  it("shows payment method choice for MIXED mode without selection", () => {
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod={null}
      />
    );
    expect(screen.getByText("payment.chooseMethod")).toBeInTheDocument();
    expect(screen.getByText("payment.inApp")).toBeInTheDocument();
    expect(screen.getByText("payment.external")).toBeInTheDocument();
  });

  it("calls onPaymentMethodSelect with IN_APP when in-app option clicked", async () => {
    const onPaymentMethodSelect = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod={null}
        onPaymentMethodSelect={onPaymentMethodSelect}
      />
    );
    const user = userEvent.setup();
    // The IN_APP option is the first choice button
    const inAppBtn = screen.getByText("payment.inApp").closest("button")!;
    await user.click(inAppBtn);
    expect(onPaymentMethodSelect).toHaveBeenCalledWith("IN_APP");
  });

  it("calls onPaymentMethodSelect with EXTERNAL when on-site option clicked", async () => {
    const onPaymentMethodSelect = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod={null}
        onPaymentMethodSelect={onPaymentMethodSelect}
      />
    );
    const user = userEvent.setup();
    const externalBtn = screen.getByText("payment.external").closest("button")!;
    await user.click(externalBtn);
    expect(onPaymentMethodSelect).toHaveBeenCalledWith("EXTERNAL");
  });

  it("calls onCancel when cancel button clicked in MIXED method-choice view", async () => {
    const onCancel = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod={null}
        onCancel={onCancel}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("payment.cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  // ── MIXED mode — IN_APP selected ──────────────────────────────────────────────

  it("shows StripeCheckout when MIXED + IN_APP selected", () => {
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod="IN_APP"
      />
    );
    expect(screen.getByTestId("stripe-checkout")).toBeInTheDocument();
  });

  // ── MIXED mode — EXTERNAL selected ────────────────────────────────────────────

  it("shows on-site UI when MIXED + EXTERNAL selected", () => {
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod="EXTERNAL"
      />
    );
    expect(screen.getByText("payment.onSiteTitle")).toBeInTheDocument();
  });

  it("calls onPaymentMethodSelect(null) when back button clicked in MIXED EXTERNAL view", async () => {
    const onPaymentMethodSelect = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod="EXTERNAL"
        onPaymentMethodSelect={onPaymentMethodSelect}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("payment.back"));
    expect(onPaymentMethodSelect).toHaveBeenCalledWith(null);
  });

  it("calls onOnSiteRequest when submit button clicked in MIXED EXTERNAL view", async () => {
    const onOnSiteRequest = jest.fn();
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="MIXED"
        selectedPaymentMethod="EXTERNAL"
        onOnSiteRequest={onOnSiteRequest}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("payment.submitRequest"));
    expect(onOnSiteRequest).toHaveBeenCalled();
  });

  // ── No plan selected ──────────────────────────────────────────────────────────

  it("shows dialog title even with no plan selected", () => {
    render(<VenueCheckoutDialog {...defaultProps} selectedPlan={null} />);
    expect(screen.getByText("subscribe")).toBeInTheDocument();
  });

  it("does not render payment content when selectedPlan is null", () => {
    render(
      <VenueCheckoutDialog
        {...defaultProps}
        paymentMode="IN_APP"
        selectedPlan={null}
      />
    );
    expect(screen.queryByTestId("stripe-checkout")).not.toBeInTheDocument();
  });
});

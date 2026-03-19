import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
}));

const mockConfirmPayment = jest.fn();
const mockSetIsProcessing = jest.fn();
const mockSetErrorMessage = jest.fn();
const mockHandleElementReady = jest.fn();
const mockHandleElementLoadError = jest.fn();
const mockHandleElementChange = jest.fn();

const hookDefaults = {
  stripe: { confirmPayment: mockConfirmPayment } as {
    confirmPayment: jest.Mock;
  } | null,
  elements: {} as Record<string, unknown> | null,
  isProcessing: false,
  errorMessage: null as string | null,
  elementReady: true,
  elementError: false,
  setIsProcessing: mockSetIsProcessing,
  setErrorMessage: mockSetErrorMessage,
  handleElementReady: mockHandleElementReady,
  handleElementLoadError: mockHandleElementLoadError,
  handleElementChange: mockHandleElementChange,
};

let hookOverrides: Partial<typeof hookDefaults> = {};

jest.mock("@/hooks/use-stripe-payment-form", () => ({
  useStripePaymentForm: () => ({ ...hookDefaults, ...hookOverrides }),
}));

// Capture the PaymentElement callback props so tests can trigger them
let paymentElementProps: Record<string, unknown> = {};
jest.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: (props: Record<string, unknown>) => {
    paymentElementProps = props;
    return <div data-testid="payment-element" />;
  },
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type={type} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner" className={className} />
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

import { CheckoutForm } from "@/components/checkout-form";

function renderForm(props: React.ComponentProps<typeof CheckoutForm> = {}) {
  return render(<CheckoutForm {...props} />);
}

async function submitForm() {
  const btn = screen.getByRole("button", { name: /pay/i });
  await userEvent.click(btn);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  hookOverrides = {};
  paymentElementProps = {};
  // Default: payment succeeds with no error
  mockConfirmPayment.mockResolvedValue({ error: null });
  // globalThis.fetch mock
  globalThis.fetch = jest.fn().mockResolvedValue({ ok: true });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("CheckoutForm", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders the PaymentElement and pay button", () => {
    renderForm();
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "pay" })).toBeInTheDocument();
  });

  it("does not render cancel button when onCancel is not provided", () => {
    renderForm();
    expect(
      screen.queryByRole("button", { name: "cancel" })
    ).not.toBeInTheDocument();
  });

  it("renders cancel button when onCancel is provided", () => {
    const onCancel = jest.fn();
    renderForm({ onCancel });
    expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = jest.fn();
    renderForm({ onCancel });
    await userEvent.click(screen.getByRole("button", { name: "cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("displays error message when set", () => {
    hookOverrides = { errorMessage: "Something went wrong" };
    renderForm();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows processing state with spinner", () => {
    hookOverrides = { isProcessing: true };
    renderForm();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByText("processing")).toBeInTheDocument();
  });

  it("disables submit when stripe is not loaded", () => {
    hookOverrides = { stripe: null };
    renderForm();
    expect(screen.getByRole("button", { name: "pay" })).toBeDisabled();
  });

  it("disables submit when elementReady is false", () => {
    hookOverrides = { elementReady: false };
    renderForm();
    expect(screen.getByRole("button", { name: "pay" })).toBeDisabled();
  });

  it("disables submit when elementError is true", () => {
    hookOverrides = { elementError: true };
    renderForm();
    expect(screen.getByRole("button", { name: "pay" })).toBeDisabled();
  });

  it("disables submit when isProcessing", () => {
    hookOverrides = { isProcessing: true };
    renderForm();
    // both buttons disabled when processing
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  // ── PaymentElement callbacks ──────────────────────────────────────────────

  it("passes handleElementReady to PaymentElement onReady", () => {
    renderForm();
    expect(paymentElementProps.onReady).toBeDefined();
    (paymentElementProps.onReady as () => void)();
    expect(mockHandleElementReady).toHaveBeenCalled();
  });

  it("passes handleElementChange to PaymentElement onChange", () => {
    renderForm();
    const fakeEvent = { complete: true };
    (paymentElementProps.onChange as (e: unknown) => void)(fakeEvent);
    expect(mockHandleElementChange).toHaveBeenCalledWith(fakeEvent);
  });

  it("calls handleElementLoadError with translated message on load error", () => {
    renderForm();
    (paymentElementProps.onLoadError as () => void)();
    expect(mockHandleElementLoadError).toHaveBeenCalledWith("paymentFailed");
  });

  // ── Form submission: early returns ────────────────────────────────────────

  it("does nothing if stripe is null on submit", async () => {
    hookOverrides = { stripe: null };
    renderForm();
    // force-click the button even though disabled
    const btn = screen.getByRole("button", { name: "pay" });
    await userEvent.click(btn);
    expect(mockConfirmPayment).not.toHaveBeenCalled();
  });

  it("does nothing if elements is null on submit", async () => {
    hookOverrides = { elements: null };
    renderForm();
    await submitForm();
    expect(mockConfirmPayment).not.toHaveBeenCalled();
  });

  it("does nothing if elementReady is false on submit", async () => {
    hookOverrides = { elementReady: false };
    renderForm();
    await submitForm();
    expect(mockConfirmPayment).not.toHaveBeenCalled();
  });

  it("does nothing if elementError is true on submit", async () => {
    hookOverrides = { elementError: true };
    renderForm();
    await submitForm();
    expect(mockConfirmPayment).not.toHaveBeenCalled();
  });

  // ── Successful payments ───────────────────────────────────────────────────

  it("calls stripe.confirmPayment with correct params", async () => {
    renderForm();
    await submitForm();

    expect(mockConfirmPayment).toHaveBeenCalledWith({
      elements: expect.any(Object),
      confirmParams: {
        return_url: `${globalThis.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });
  });

  it("calls onSuccess after successful payment with no confirmation endpoint", async () => {
    const onSuccess = jest.fn();
    renderForm({ onSuccess });
    await submitForm();

    await waitFor(() => {
      expect(mockSetIsProcessing).toHaveBeenCalledWith(true);
      expect(mockSetErrorMessage).toHaveBeenCalledWith(null);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  // ── Stripe payment error ──────────────────────────────────────────────────

  it("shows payment error message from Stripe", async () => {
    mockConfirmPayment.mockResolvedValue({
      error: { message: "Card declined" },
    });
    renderForm();
    await submitForm();

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith("Card declined");
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
    });
  });

  it("shows fallback error when Stripe error has no message", async () => {
    mockConfirmPayment.mockResolvedValue({
      error: { message: "" },
    });
    renderForm();
    await submitForm();

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith("paymentFailed");
    });
  });

  // ── Confirmation endpoint resolution ──────────────────────────────────────

  it("calls custom confirmEndpoint when provided", async () => {
    renderForm({
      confirmEndpoint: "/api/custom/confirm",
      confirmBody: { foo: "bar" },
    });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/custom/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foo: "bar" }),
      });
    });
  });

  it("calls recurring subscription confirm endpoint", async () => {
    renderForm({
      isRecurring: true,
      venueId: "v1",
      stripeSubscriptionId: "sub_123",
    });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/venues/v1/stripe-subscriptions/confirm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripeSubscriptionId: "sub_123" }),
        }
      );
    });
  });

  it("calls one-time payment confirm endpoint", async () => {
    renderForm({
      paymentIntentId: "pi_abc",
    });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/payment-intents/pi_abc/confirm",
        { method: "POST" }
      );
    });
  });

  it("calls no endpoint when no matching route criteria", async () => {
    const onSuccess = jest.fn();
    // isRecurring but no venueId → no endpoint
    renderForm({ isRecurring: true, onSuccess });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("returns null endpoint when isRecurring is true but missing stripeSubscriptionId", async () => {
    const onSuccess = jest.fn();
    renderForm({ isRecurring: true, venueId: "v1", onSuccess });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("does not use paymentIntentId endpoint when isRecurring is true", async () => {
    const onSuccess = jest.fn();
    renderForm({
      isRecurring: true,
      paymentIntentId: "pi_abc",
      onSuccess,
    });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  // ── Confirm body resolution ───────────────────────────────────────────────

  it("uses custom confirmBody when provided", async () => {
    renderForm({
      confirmEndpoint: "/api/test",
      confirmBody: { key: "value" },
    });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          body: JSON.stringify({ key: "value" }),
        })
      );
    });
  });

  it("sends no body when not recurring and no confirmBody", async () => {
    renderForm({
      confirmEndpoint: "/api/test",
    });
    await submitForm();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/test", {
        method: "POST",
      });
    });
  });

  // ── Confirmation endpoint failures ────────────────────────────────────────

  it("shows error when confirm endpoint returns !ok and not silentConfirm", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    renderForm({
      paymentIntentId: "pi_abc",
    });
    await submitForm();

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith("activationFailed");
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
    });
    errSpy.mockRestore();
  });

  it("ignores !ok response when silentConfirm is true", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });
    const onSuccess = jest.fn();
    renderForm({
      confirmEndpoint: "/api/test",
      silentConfirm: true,
      onSuccess,
    });
    await submitForm();

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("silently handles fetch network error when silentConfirm is true", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );
    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const onSuccess = jest.fn();
    renderForm({
      confirmEndpoint: "/api/test",
      silentConfirm: true,
      onSuccess,
    });
    await submitForm();

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith(
        "Confirm failed, webhook will handle:",
        expect.any(Error)
      );
      expect(onSuccess).toHaveBeenCalled();
    });
    warnSpy.mockRestore();
  });

  it("silently handles confirm failure for recurring subscriptions", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(
      new Error("Server error")
    );
    const warnSpy = jest.spyOn(console, "warn").mockImplementation();
    const onSuccess = jest.fn();
    renderForm({
      isRecurring: true,
      venueId: "v1",
      stripeSubscriptionId: "sub_123",
      onSuccess,
    });
    await submitForm();

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith(
        "Subscription confirm failed, webhook will handle activation:",
        expect.any(Error)
      );
      expect(onSuccess).toHaveBeenCalled();
    });
    warnSpy.mockRestore();
  });

  it("shows error for non-recurring confirm failure", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(
      new Error("Specific error message")
    );
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    renderForm({
      paymentIntentId: "pi_abc",
    });
    await submitForm();

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith(
        "Specific error message"
      );
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
    });
    errSpy.mockRestore();
  });

  it("shows fallback error for non-Error confirm failure", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue("string error");
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    renderForm({
      paymentIntentId: "pi_abc",
    });
    await submitForm();

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith("activationFailed");
    });
    errSpy.mockRestore();
  });

  // ── Unexpected errors ─────────────────────────────────────────────────────

  it("handles unexpected exceptions during payment", async () => {
    mockConfirmPayment.mockRejectedValue(new Error("Unexpected"));
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    renderForm();
    await submitForm();

    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith("unexpectedError");
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
    });
    errSpy.mockRestore();
  });

  // ── Translation namespace ─────────────────────────────────────────────────

  it("uses custom translation namespace", () => {
    renderForm({ translationNamespace: "custom.ns" });
    // The component still renders — the hook receives the custom namespace
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
  });
});

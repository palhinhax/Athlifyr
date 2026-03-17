import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopUpDialog } from "@/components/credits/top-up-dialog";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="dialog">
        <button
          data-testid="dialog-close"
          onClick={() => onOpenChange?.(false)}
        />
        {children}
      </div>
    ) : null,
  DialogContent: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }) => <button {...p}>{children}</button>,
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner" className={className} />
  ),
}));

jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: jest.fn(() => null),
  useElements: jest.fn(() => null),
}));

const {
  useStripe: mockUseStripe,
  useElements: mockUseElements,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require("@stripe/react-stripe-js");

jest.mock("@/lib/stripe-client", () => ({
  getStripe: () => Promise.resolve(null),
}));

jest.mock("@/lib/credits/constants", () => ({
  TOPUP_FEE_PERCENTAGE: 5,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("TopUpDialog", () => {
  const topUpOptions = [
    { amountCents: 500, feeCents: 25, netCreditsCents: 475 },
    { amountCents: 1000, feeCents: 50, netCreditsCents: 950 },
    { amountCents: 2000, feeCents: 100, netCreditsCents: 1900 },
    { amountCents: 5000, feeCents: 250, netCreditsCents: 4750 },
  ];

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    topUpOptions,
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    render(<TopUpDialog {...defaultProps} open={false} />);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open", () => {
    render(<TopUpDialog {...defaultProps} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("renders all top-up options", () => {
    render(<TopUpDialog {...defaultProps} />);
    expect(screen.getByText("5.00€")).toBeInTheDocument();
    expect(screen.getByText("10.00€")).toBeInTheDocument();
    expect(screen.getByText("20.00€")).toBeInTheDocument();
    expect(screen.getByText("50.00€")).toBeInTheDocument();
  });

  it("shows net credits for each option", () => {
    render(<TopUpDialog {...defaultProps} />);
    expect(screen.getByText("4.75")).toBeInTheDocument();
    expect(screen.getByText("9.50")).toBeInTheDocument();
    expect(screen.getByText("19.00")).toBeInTheDocument();
    expect(screen.getByText("47.50")).toBeInTheDocument();
  });

  it("shows fee percentage note", () => {
    render(<TopUpDialog {...defaultProps} />);
    expect(screen.getByText(/processingFeeNote/)).toBeInTheDocument();
  });

  it("transitions to payment step on amount selection", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_test" }),
    });

    render(<TopUpDialog {...defaultProps} />);

    // Click the 5€ option
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/credits/top-up",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("shows error state on failed API call", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Top-up limit exceeded" }),
    });

    render(<TopUpDialog {...defaultProps} />);
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(screen.getByText("Top-up limit exceeded")).toBeInTheDocument();
    });
  });

  it("shows topUp button in error state", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed" }),
    });

    render(<TopUpDialog {...defaultProps} />);
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /topUp/ })).toBeInTheDocument();
    });
  });

  it("resets to select step when clicking retry in error state", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed" }),
    });

    render(<TopUpDialog {...defaultProps} />);
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /topUp/ })).toBeInTheDocument();
    });

    // Click retry button → should go back to select step
    await userEvent.click(screen.getByRole("button", { name: /topUp/ }));

    // Should show the original amount buttons again
    expect(screen.getByText("5.00€")).toBeInTheDocument();
  });

  it("shows payment step with stripe elements on successful API call", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_test_123" }),
    });

    render(<TopUpDialog {...defaultProps} />);
    await userEvent.click(screen.getByText("10.00€"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    });

    // Should show "you pay" and "you receive" info
    expect(screen.getByText(/10.00€/)).toBeInTheDocument();
    expect(screen.getByText(/9\.50/)).toBeInTheDocument();
  });

  it("resets state when dialog is closed and reopened", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error shown" }),
    });

    const onOpenChange = jest.fn();
    const { rerender } = render(
      <TopUpDialog {...defaultProps} onOpenChange={onOpenChange} />
    );

    // Trigger error state
    await userEvent.click(screen.getByText("5.00€"));
    await waitFor(() => {
      expect(screen.getByText("Error shown")).toBeInTheDocument();
    });

    // Simulate dialog close via the handleClose callback
    await userEvent.click(screen.getByTestId("dialog-close"));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    // Parent closes dialog
    rerender(
      <TopUpDialog {...defaultProps} open={false} onOpenChange={onOpenChange} />
    );

    // Reopen
    rerender(
      <TopUpDialog {...defaultProps} open={true} onOpenChange={onOpenChange} />
    );

    // After handleClose reset + reopen, should show select step
    expect(screen.getByText("5.00€")).toBeInTheDocument();
  });

  it("shows loading spinner while creating top-up", async () => {
    // Make fetch hang to observe loading state
    mockFetch.mockImplementationOnce(
      () => new Promise(() => {}) // never resolves
    );

    render(<TopUpDialog {...defaultProps} />);
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });

  it("handles network error on amount selection", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<TopUpDialog {...defaultProps} />);
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("submits payment via stripe and shows success step", async () => {
    const onSuccess = jest.fn();
    const mockConfirmPayment = jest
      .fn()
      .mockResolvedValue({ paymentIntent: { id: "pi_test" } });

    mockUseStripe.mockReturnValue({ confirmPayment: mockConfirmPayment });
    mockUseElements.mockReturnValue({});

    // Get to payment step
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clientSecret: "cs_stripe" }),
      })
      // confirm endpoint call
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<TopUpDialog {...defaultProps} onSuccess={onSuccess} />);
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    });

    // Submit the payment form
    const submitButton = screen.getByRole("button", { name: /confirmTopUp/ });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockConfirmPayment).toHaveBeenCalledWith({
        elements: {},
        redirect: "if_required",
      });
    });

    // Should transition to success step
    await waitFor(() => {
      expect(screen.getByText("topUpSuccess")).toBeInTheDocument();
    });

    // Restore mocks
    mockUseStripe.mockReturnValue(null);
    mockUseElements.mockReturnValue(null);
  });

  it("shows error when stripe payment fails", async () => {
    const mockConfirmPayment = jest.fn().mockResolvedValue({
      error: { message: "Card declined" },
    });

    mockUseStripe.mockReturnValue({ confirmPayment: mockConfirmPayment });
    mockUseElements.mockReturnValue({});

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_stripe" }),
    });

    render(<TopUpDialog {...defaultProps} />);
    await userEvent.click(screen.getByText("5.00€"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: /confirmTopUp/ });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Card declined")).toBeInTheDocument();
    });

    // Restore mocks
    mockUseStripe.mockReturnValue(null);
    mockUseElements.mockReturnValue(null);
  });
});

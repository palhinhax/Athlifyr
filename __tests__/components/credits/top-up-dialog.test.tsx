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
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div data-testid="dialog">{children}</div> : null),
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
  useStripe: () => null,
  useElements: () => null,
}));

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
});

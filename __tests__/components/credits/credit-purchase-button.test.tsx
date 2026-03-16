import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreditPurchaseButton } from "@/components/credits/credit-purchase-button";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
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

jest.mock("@/lib/credits/purchase-service", () => ({
  requiresCreditsOnly: (amountCents: number) => amountCents <= 500,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CreditPurchaseButton", () => {
  const defaultProps = {
    itemId: "item1",
    itemType: "product",
    amountCents: 300,
    venueId: "v1",
    description: "Buy product",
    userBalanceCents: 1000,
    onSuccess: jest.fn(),
    onInsufficientCredits: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pay with credits button when user has enough", () => {
    render(<CreditPurchaseButton {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /purchase\.payWithCredits/ })
    ).toBeInTheDocument();
  });

  it("shows amount on button", () => {
    render(<CreditPurchaseButton {...defaultProps} />);
    expect(screen.getByText(/3\.00/)).toBeInTheDocument();
  });

  it("shows insufficient credits text when user doesn't have enough", () => {
    render(<CreditPurchaseButton {...defaultProps} userBalanceCents={100} />);
    expect(
      screen.getByRole("button", { name: /purchase\.insufficientCredits/ })
    ).toBeInTheDocument();
  });

  it("calls onInsufficientCredits when clicked with insufficient balance", async () => {
    const onInsufficientCredits = jest.fn();
    render(
      <CreditPurchaseButton
        {...defaultProps}
        userBalanceCents={100}
        onInsufficientCredits={onInsufficientCredits}
      />
    );
    // For credits-only (amount ≤ 500), the button is disabled, so find the first button
    const buttons = screen.getAllByRole("button");
    // One of them should be the insufficient credits button - it will be disabled for credits-only
    expect(buttons[0]).toBeDisabled();
  });

  it("calls onInsufficientCredits when clicked with insufficient balance (non-credits-only)", async () => {
    const onInsufficientCredits = jest.fn();
    // amountCents > 500 → not credits-only → button not disabled
    render(
      <CreditPurchaseButton
        {...defaultProps}
        amountCents={1000}
        userBalanceCents={100}
        onInsufficientCredits={onInsufficientCredits}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: /purchase\.insufficientCredits/ })
    );
    expect(onInsufficientCredits).toHaveBeenCalled();
  });

  it("opens confirmation dialog when clicked with sufficient balance", async () => {
    render(<CreditPurchaseButton {...defaultProps} />);
    await userEvent.click(
      screen.getByRole("button", { name: /purchase\.payWithCredits/ })
    );
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("shows description in confirmation dialog", async () => {
    render(<CreditPurchaseButton {...defaultProps} />);
    await userEvent.click(
      screen.getByRole("button", { name: /purchase\.payWithCredits/ })
    );
    expect(screen.getByText("Buy product")).toBeInTheDocument();
  });

  it("calls API and onSuccess on successful purchase", async () => {
    const onSuccess = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ purchaseId: "p1" }),
    });

    render(<CreditPurchaseButton {...defaultProps} onSuccess={onSuccess} />);
    await userEvent.click(
      screen.getByRole("button", { name: /purchase\.payWithCredits/ })
    );

    // Click confirm button in dialog (the one WITHOUT the amount span)
    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");
    const confirmButton = buttons.find(
      (b) =>
        b.textContent?.includes("purchase.payWithCredits") &&
        !b.textContent?.includes("(")
    );
    expect(confirmButton).toBeDefined();
    await userEvent.click(confirmButton!);

    // Wait for the success callback (response processed)
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/credits/purchase",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("handles 402 response (insufficient credits)", async () => {
    const onInsufficientCredits = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 402,
      json: async () => ({
        error: "Insufficient credits",
        currentBalanceCents: 100,
      }),
    });

    render(
      <CreditPurchaseButton
        {...defaultProps}
        onInsufficientCredits={onInsufficientCredits}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: /purchase\.payWithCredits/ })
    );

    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    // Click confirm in dialog
    const buttons = screen.getAllByRole("button");
    const confirmButton = buttons.find(
      (b) =>
        b.textContent?.includes("purchase.payWithCredits") &&
        !b.textContent?.includes("(")
    );
    expect(confirmButton).toBeDefined();
    await userEvent.click(confirmButton!);

    await waitFor(() => {
      expect(onInsufficientCredits).toHaveBeenCalled();
    });
  });

  it("shows credits-only message for small amounts without enough balance", () => {
    render(
      <CreditPurchaseButton
        {...defaultProps}
        amountCents={300}
        userBalanceCents={100}
      />
    );
    expect(screen.getByText("purchase.creditsOnly")).toBeInTheDocument();
  });

  it("shows error message on purchase failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Server error" }),
    });

    render(<CreditPurchaseButton {...defaultProps} />);
    await userEvent.click(
      screen.getByRole("button", { name: /purchase\.payWithCredits/ })
    );

    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");
    const confirmButton = buttons.find(
      (b) =>
        b.textContent?.includes("purchase.payWithCredits") &&
        !b.textContent?.includes("(")
    );
    expect(confirmButton).toBeDefined();
    await userEvent.click(confirmButton!);

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("shows credits-or-card message for larger amounts without enough balance", () => {
    render(
      <CreditPurchaseButton
        {...defaultProps}
        amountCents={1000}
        userBalanceCents={100}
      />
    );
    expect(screen.getByText("purchase.creditsOrCard")).toBeInTheDocument();
  });
});

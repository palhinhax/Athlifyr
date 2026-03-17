import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCheckoutDialog } from "@/components/product-checkout-dialog";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Suppress console.error from error boundary noise
beforeAll(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterAll(() => (console.error as jest.Mock).mockRestore());

// Stripe – not needed for dialog logic
jest.mock("@/lib/stripe-client", () => ({
  getStripe: () => null,
}));

// Elements wrapper – just renders children
jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ProductCheckoutForm stub
jest.mock("@/components/product-checkout-form", () => ({
  ProductCheckoutForm: ({
    onSuccess,
    onCancel,
  }: {
    onSuccess?: () => void;
    onCancel?: () => void;
  }) => (
    <div data-testid="product-checkout-form">
      <button onClick={onSuccess}>triggerSuccess</button>
      <button onClick={onCancel}>triggerCancel</button>
    </div>
  ),
}));

// Spinner stub
jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <div data-testid="spinner" className={className} />
  ),
}));

// UI stubs
jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (v: boolean) => void;
  }) =>
    open ? (
      <div
        data-testid="alert-dialog"
        onClick={(e) => {
          // Only trigger close when clicking the backdrop (the div itself), not children
          if (e.target === e.currentTarget) onOpenChange?.(false);
        }}
      >
        {children}
      </div>
    ) : null,
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

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h3 className={className}>{children}</h3>,
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockPurchaseFetch = jest.fn();
let walletBalanceCents = 0;

beforeEach(() => {
  jest.clearAllMocks();
  walletBalanceCents = 0;
  // Route-based fetch mock: wallet endpoint handled automatically,
  // everything else delegated to mockPurchaseFetch
  globalThis.fetch = jest.fn((url: string, ...args: unknown[]) => {
    if (url === "/api/credits/wallet") {
      return Promise.resolve({
        ok: true,
        json: async () => ({ wallet: { balanceCents: walletBalanceCents } }),
      });
    }
    return mockPurchaseFetch(url, ...args);
  }) as jest.Mock;
});

// Helper: wait for method selection to appear, then click Stripe option.
// Must be called with a userEvent instance created BEFORE render.
async function selectStripeMethod(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => expect(screen.getByText("pay")).toBeInTheDocument());
  await user.click(screen.getByText("pay").closest("button")!);
}

const PRODUCT = {
  id: "prod-1",
  name: "Protein Shake",
  price: 12.5,
  currency: "EUR",
};

const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
  venueId: "v1",
  venueName: "Iron Gym",
  product: PRODUCT,
  quantity: 1,
  onSuccess: jest.fn(),
  onCancel: jest.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ProductCheckoutDialog", () => {
  // ── Visibility ──────────────────────────────────────────────────────────────

  it("renders nothing when open=false", () => {
    const { container } = render(
      <ProductCheckoutDialog {...defaultProps} open={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders dialog when open=true", async () => {
    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
  });

  // ── Title and description ──────────────────────────────────────────────────

  it("shows the dialog title translation key", async () => {
    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("shows venue name and product name in description", async () => {
    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByText(/Iron Gym/)).toBeInTheDocument();
    expect(screen.getByText(/Protein Shake/)).toBeInTheDocument();
  });

  it("shows x{quantity} in description when quantity > 1", async () => {
    render(<ProductCheckoutDialog {...defaultProps} quantity={3} />);
    expect(screen.getByText(/x3/)).toBeInTheDocument();
  });

  // ── Loading state ───────────────────────────────────────────────────────────

  it("shows spinner while wallet is loading", async () => {
    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  // ── Success flow ────────────────────────────────────────────────────────────

  it("shows the payment form once clientSecret is received via Stripe", async () => {
    const user = userEvent.setup();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_live",
        purchase: { id: "pur-2" },
      }),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);
    await selectStripeMethod(user);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );
  });

  it("shows total amount in method selection", async () => {
    render(<ProductCheckoutDialog {...defaultProps} quantity={2} />);

    await waitFor(() => {
      // 12.5 * 2 = 25.00 — appears in both summary card and stripe option
      expect(screen.getAllByText("25.00 EUR").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows x{quantity} in description when quantity > 1", async () => {
    render(<ProductCheckoutDialog {...defaultProps} quantity={4} />);

    await waitFor(() => {
      expect(screen.getByText(/x4/)).toBeInTheDocument();
    });
  });

  it("calls onSuccess when payment form reports success", async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_s", purchase: { id: "p1" } }),
    });

    render(<ProductCheckoutDialog {...defaultProps} onSuccess={onSuccess} />);
    await selectStripeMethod(user);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    await user.click(screen.getByText("triggerSuccess"));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when payment form cancel is triggered", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_s", purchase: { id: "p1" } }),
    });

    render(<ProductCheckoutDialog {...defaultProps} onCancel={onCancel} />);
    await selectStripeMethod(user);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    await user.click(screen.getByText("triggerCancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("POSTs to the correct purchase endpoint", async () => {
    const user = userEvent.setup();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_x", purchase: { id: "p1" } }),
    });

    render(
      <ProductCheckoutDialog
        {...defaultProps}
        venueId="venue-99"
        product={{ ...PRODUCT, id: "prod-42" }}
        quantity={2}
      />
    );
    await selectStripeMethod(user);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    expect(mockPurchaseFetch).toHaveBeenCalledWith(
      "/api/venues/venue-99/products/prod-42/purchase",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ quantity: 2 }),
      })
    );
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it("shows error card when Stripe init returns non-ok", async () => {
    const user = userEvent.setup();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Out of stock" }),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);
    await selectStripeMethod(user);

    await waitFor(() => {
      expect(screen.getByText("paymentError")).toBeInTheDocument();
      expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });
  });

  it("shows fallback error message when API error has no message", async () => {
    const user = userEvent.setup();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);
    await selectStripeMethod(user);

    await waitFor(() => {
      expect(screen.getByText("failedCreatePayment")).toBeInTheDocument();
    });
  });

  it("shows goBack button in error state", async () => {
    const user = userEvent.setup();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error" }),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);
    await selectStripeMethod(user);

    await waitFor(() => {
      expect(screen.getByText("goBack")).toBeInTheDocument();
    });
  });

  it("calls onCancel when goBack is clicked in error state", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    mockPurchaseFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error" }),
    });

    render(<ProductCheckoutDialog {...defaultProps} onCancel={onCancel} />);
    await selectStripeMethod(user);

    await waitFor(() => expect(screen.getByText("goBack")).toBeInTheDocument());

    await user.click(screen.getByText("goBack"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows error message when Stripe init throws", async () => {
    const user = userEvent.setup();
    mockPurchaseFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ProductCheckoutDialog {...defaultProps} />);
    await selectStripeMethod(user);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  // ── Reset on close ──────────────────────────────────────────────────────────

  it("resets state and calls onOpenChange when dialog is closed via interaction", async () => {
    const onOpenChange = jest.fn();

    render(
      <ProductCheckoutDialog {...defaultProps} onOpenChange={onOpenChange} />
    );

    // Wait for wallet to load and method selection to appear
    await waitFor(() => expect(screen.getByText("pay")).toBeInTheDocument());

    // Clicking the alert-dialog div triggers onOpenChange(false) via mock
    const user = userEvent.setup();
    await user.click(screen.getByTestId("alert-dialog"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Idempotency ─────────────────────────────────────────────────────────────

  it("does not call purchase fetch again on re-render once initialized", async () => {
    const user = userEvent.setup();
    mockPurchaseFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ clientSecret: "cs_x", purchase: { id: "p1" } }),
    });

    const { rerender } = render(<ProductCheckoutDialog {...defaultProps} />);
    await selectStripeMethod(user);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    const callsBefore = mockPurchaseFetch.mock.calls.length;

    rerender(<ProductCheckoutDialog {...defaultProps} />);

    // Should not have fetched again
    expect(mockPurchaseFetch.mock.calls.length).toBe(callsBefore);
  });

  // ── No product ─────────────────────────────────────────────────────────────

  it("does not call fetch when product is null", () => {
    render(<ProductCheckoutDialog {...defaultProps} product={null} />);
    expect(mockPurchaseFetch).not.toHaveBeenCalled();
  });

  // ── Credits Flow ────────────────────────────────────────────────────────────

  describe("credits payment flow", () => {
    const SMALL_PRODUCT = {
      id: "prod-s",
      name: "Water Bottle",
      price: 2.5,
      currency: "EUR",
    };

    it("fetches wallet balance when dialog opens", async () => {
      render(
        <ProductCheckoutDialog {...defaultProps} product={SMALL_PRODUCT} />
      );

      await waitFor(() =>
        expect(globalThis.fetch).toHaveBeenCalledWith("/api/credits/wallet")
      );
    });

    it("shows payment method selection after wallet loads with enough credits", async () => {
      walletBalanceCents = 50000;

      render(<ProductCheckoutDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("payWithCredits")).toBeInTheDocument();
      });
    });

    it("shows credits-only warning when insufficient credits for small product", async () => {
      walletBalanceCents = 10;

      render(
        <ProductCheckoutDialog {...defaultProps} product={SMALL_PRODUCT} />
      );

      await waitFor(() => {
        expect(screen.getByText("creditsOnly")).toBeInTheDocument();
      });
    });

    it("completes credits purchase successfully", async () => {
      walletBalanceCents = 50000;
      const onSuccess = jest.fn();
      const user = userEvent.setup();

      render(
        <ProductCheckoutDialog
          {...defaultProps}
          product={SMALL_PRODUCT}
          onSuccess={onSuccess}
        />
      );

      // Wait for auto-select to fire: confirmation screen has a button with exact name "payWithCredits"
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^payWithCredits$/ })
        ).toBeInTheDocument();
      });

      // Mock the credits purchase API
      mockPurchaseFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await user.click(
        screen.getByRole("button", { name: /^payWithCredits$/ })
      );

      await waitFor(() => {
        expect(mockPurchaseFetch).toHaveBeenCalledWith(
          "/api/credits/purchase",
          expect.objectContaining({ method: "POST" })
        );
      });
    });

    it("shows error when credits purchase returns 402", async () => {
      walletBalanceCents = 50000;
      const user = userEvent.setup();

      render(
        <ProductCheckoutDialog {...defaultProps} product={SMALL_PRODUCT} />
      );

      // Wait for auto-select to fire: confirmation screen button
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^payWithCredits$/ })
        ).toBeInTheDocument();
      });

      // Mock 402 response
      mockPurchaseFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: async () => ({
          requiredAmountCents: 250,
          currentBalanceCents: 100,
        }),
      });

      await user.click(
        screen.getByRole("button", { name: /^payWithCredits$/ })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/insufficientCreditsDescription/)
        ).toBeInTheDocument();
      });
    });

    it("shows stripe option for larger amounts", async () => {
      walletBalanceCents = 50000;

      render(<ProductCheckoutDialog {...defaultProps} />);

      await waitFor(() => {
        // Product is 12.50 > 5.00 threshold, so stripe option should appear
        expect(screen.getByText("pay")).toBeInTheDocument();
      });
    });
  });
});

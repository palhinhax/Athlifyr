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
      <div data-testid="alert-dialog" onClick={() => onOpenChange?.(false)}>
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

const mockFetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = mockFetch;
});

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
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_test",
        purchase: { id: "pur-1" },
      }),
    });
    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
  });

  // ── Title and description ──────────────────────────────────────────────────

  it("shows the dialog title translation key", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_x",
        purchase: { id: "p1" },
      }),
    });
    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("shows venue name and product name in description", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_x", purchase: { id: "p1" } }),
    });
    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByText(/Iron Gym/)).toBeInTheDocument();
    expect(screen.getByText(/Protein Shake/)).toBeInTheDocument();
  });

  it("shows x{quantity} in description when quantity > 1", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_x", purchase: { id: "p1" } }),
    });
    render(<ProductCheckoutDialog {...defaultProps} quantity={3} />);
    expect(screen.getByText(/x3/)).toBeInTheDocument();
  });

  // ── Loading state ───────────────────────────────────────────────────────────

  it("shows spinner while fetching clientSecret", async () => {
    let resolvePromise!: (v: unknown) => void;
    mockFetch.mockReturnValueOnce(
      new Promise((r) => {
        resolvePromise = r;
      })
    );

    render(<ProductCheckoutDialog {...defaultProps} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Resolve to avoid dangling promises
    resolvePromise({
      ok: true,
      json: async () => ({ clientSecret: "cs_x", purchase: { id: "p1" } }),
    });
    await waitFor(() =>
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
    );
  });

  // ── Success flow ────────────────────────────────────────────────────────────

  it("shows the payment form once clientSecret is received", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_live",
        purchase: { id: "pur-2" },
      }),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );
  });

  it("shows total amount once payment form is visible", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_live",
        purchase: { id: "pur-3" },
      }),
    });

    render(<ProductCheckoutDialog {...defaultProps} quantity={2} />);

    await waitFor(() => {
      // 12.5 * 2 = 25.00
      expect(screen.getByText("25.00 EUR")).toBeInTheDocument();
    });
  });

  it("shows x{quantity} in payment card description when quantity > 1", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_live", purchase: { id: "p4" } }),
    });

    render(<ProductCheckoutDialog {...defaultProps} quantity={4} />);

    await waitFor(() => {
      expect(screen.getByText(/x4/)).toBeInTheDocument();
    });
  });

  it("calls onSuccess when payment form reports success", async () => {
    const onSuccess = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_s", purchase: { id: "p1" } }),
    });

    render(<ProductCheckoutDialog {...defaultProps} onSuccess={onSuccess} />);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("triggerSuccess"));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when payment form cancel is triggered", async () => {
    const onCancel = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_s", purchase: { id: "p1" } }),
    });

    render(<ProductCheckoutDialog {...defaultProps} onCancel={onCancel} />);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("triggerCancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("POSTs to the correct purchase endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
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

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/venues/venue-99/products/prod-42/purchase",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ quantity: 2 }),
      })
    );
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it("shows error card when fetch returns non-ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Out of stock" }),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("paymentError")).toBeInTheDocument();
      expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });
  });

  it("shows fallback error message when API error has no message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("failedCreatePayment")).toBeInTheDocument();
    });
  });

  it("shows goBack button in error state", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error" }),
    });

    render(<ProductCheckoutDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("goBack")).toBeInTheDocument();
    });
  });

  it("calls onCancel when goBack is clicked in error state", async () => {
    const onCancel = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error" }),
    });

    const user = userEvent.setup();
    render(<ProductCheckoutDialog {...defaultProps} onCancel={onCancel} />);

    await waitFor(() => expect(screen.getByText("goBack")).toBeInTheDocument());

    await user.click(screen.getByText("goBack"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows error message when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ProductCheckoutDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  // ── Reset on close ──────────────────────────────────────────────────────────

  it("resets state and calls onOpenChange when dialog is closed via interaction", async () => {
    const onOpenChange = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ clientSecret: "cs_x", purchase: { id: "p1" } }),
    });

    render(
      <ProductCheckoutDialog {...defaultProps} onOpenChange={onOpenChange} />
    );

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    // Clicking the alert-dialog div triggers onOpenChange(false) via mock
    const user = userEvent.setup();
    await user.click(screen.getByTestId("alert-dialog"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Idempotency ─────────────────────────────────────────────────────────────

  it("does not call fetch again on re-render once initialized", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ clientSecret: "cs_x", purchase: { id: "p1" } }),
    });

    const { rerender } = render(<ProductCheckoutDialog {...defaultProps} />);

    await waitFor(() =>
      expect(screen.getByTestId("product-checkout-form")).toBeInTheDocument()
    );

    const callsBefore = mockFetch.mock.calls.length;

    rerender(<ProductCheckoutDialog {...defaultProps} />);

    // Should not have fetched again
    expect(mockFetch.mock.calls.length).toBe(callsBefore);
  });

  // ── No product ─────────────────────────────────────────────────────────────

  it("does not call fetch when product is null", () => {
    render(<ProductCheckoutDialog {...defaultProps} product={null} />);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

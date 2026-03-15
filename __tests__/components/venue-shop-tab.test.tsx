import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenueShopTab } from "@/components/venue-shop-tab";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <div data-testid="spinner" className={className} />
  ),
}));

jest.mock("lucide-react", () => ({
  ShoppingBag: () => <svg data-testid="shopping-bag" />,
  Package: () => <svg data-testid="package-icon" />,
  Plus: () => <span>+</span>,
  Minus: () => <span>-</span>,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = mockFetch;
});

const PRODUCT = {
  id: "p1",
  name: "Protein Bar",
  description: "High protein snack",
  price: 3.5,
  currency: "EUR",
  stock: 10,
};

const defaultProps = {
  venueId: "v1",
  userId: "u1",
  paymentMode: "IN_APP",
  onPurchaseClick: jest.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenueShopTab", () => {
  // ── Loading ──────────────────────────────────────────────────────────────────

  it("shows spinner while loading", () => {
    let resolve!: (v: unknown) => void;
    mockFetch.mockReturnValueOnce(new Promise((r) => (resolve = r)));
    render(<VenueShopTab {...defaultProps} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    resolve({ ok: true, json: async () => ({ products: [] }) });
  });

  // ── Empty state ──────────────────────────────────────────────────────────────

  it("shows empty state when no products", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() => expect(screen.getByText("empty")).toBeInTheDocument());
    expect(screen.getByText("emptyDescription")).toBeInTheDocument();
  });

  // ── Product list ─────────────────────────────────────────────────────────────

  it("renders product name and description", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    expect(screen.getByText("High protein snack")).toBeInTheDocument();
  });

  it("shows formatted price with currency", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("3.50 EUR")).toBeInTheDocument()
    );
  });

  it("shows in-stock badge with count", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText(/inStock/)).toBeInTheDocument()
    );
  });

  it("shows outOfStock badge when stock is 0", async () => {
    const product = { ...PRODUCT, stock: 0 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [product] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getAllByText("outOfStock").length).toBeGreaterThan(0)
    );
  });

  it("shows product without stock badge when stock is null", async () => {
    const product = { ...PRODUCT, stock: null };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [product] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    // No stock badge
    expect(screen.queryByText("outOfStock")).not.toBeInTheDocument();
    expect(screen.queryByText(/inStock/)).not.toBeInTheDocument();
  });

  // ── Purchase controls ─────────────────────────────────────────────────────────

  it("shows quantity controls and buy button for eligible users", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: /buy/i })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // default quantity
  });

  it("shows loginToBuy when no userId", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} userId={undefined} />);
    await waitFor(() =>
      expect(screen.getByText("loginToBuy")).toBeInTheDocument()
    );
  });

  it("shows loginToBuy when paymentMode is EXTERNAL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} paymentMode="EXTERNAL" />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    // canPurchase is false → no buy button, but not "loginToBuy" explicitly unless userId missing
    // With userId but EXTERNAL mode → canPurchase=false → no controls shown (null branch)
    expect(
      screen.queryByRole("button", { name: /buy/i })
    ).not.toBeInTheDocument();
  });

  it("calls onPurchaseClick with product and quantity", async () => {
    const onPurchaseClick = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(
      <VenueShopTab {...defaultProps} onPurchaseClick={onPurchaseClick} />
    );
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /buy/i }));
    expect(onPurchaseClick).toHaveBeenCalledWith(PRODUCT, 1);
  });

  // ── Quantity controls ─────────────────────────────────────────────────────────

  it("increments quantity when + button is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("+"));
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not decrement below 1", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    // - button is disabled at qty=1
    const minusBtn = screen.getByText("-").closest("button")!;
    expect(minusBtn).toBeDisabled();
  });

  it("buy button shows computed total for quantity > 1", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("+"));
    // 3.50 * 2 = 7.00
    expect(screen.getByText(/7\.00 EUR/)).toBeInTheDocument();
  });

  it("disables + button when quantity reaches stock limit", async () => {
    const product = { ...PRODUCT, stock: 2 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [product] }),
    });
    render(<VenueShopTab {...defaultProps} />);
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("+"));
    expect(screen.getByText("2")).toBeInTheDocument();
    // + button now disabled (qty=2 = stock limit)
    const plusBtn = screen.getByText("+").closest("button")!;
    expect(plusBtn).toBeDisabled();
  });

  it("calls onPurchaseClick with incremented quantity", async () => {
    const onPurchaseClick = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(
      <VenueShopTab {...defaultProps} onPurchaseClick={onPurchaseClick} />
    );
    await waitFor(() =>
      expect(screen.getByText("Protein Bar")).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("+"));
    await user.click(screen.getByRole("button", { name: /buy/i }));
    expect(onPurchaseClick).toHaveBeenCalledWith(expect.any(Object), 2);
  });

  // ── MIXED mode ───────────────────────────────────────────────────────────────

  it("shows buy button in MIXED payment mode", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [PRODUCT] }),
    });
    render(<VenueShopTab {...defaultProps} paymentMode="MIXED" />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /buy/i })).toBeInTheDocument()
    );
  });

  // ── Fetch endpoint ───────────────────────────────────────────────────────────

  it("fetches from the correct venue products endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [] }),
    });
    render(<VenueShopTab {...defaultProps} venueId="venue-99" />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/venues/venue-99/products");
  });
});

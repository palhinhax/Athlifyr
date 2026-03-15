import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenueShopPurchases } from "@/components/venue-shop-purchases";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
  useLocale: () => "en",
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
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

let capturedOnOpenChange: ((open: boolean) => void) | undefined;
jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
    capturedOnOpenChange = onOpenChange;
    return open ? <div data-testid="alert-dialog">{children}</div> : null;
  },
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
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...p}>{children}</button>
  ),
  AlertDialogCancel: ({
    children,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...p} onClick={() => capturedOnOpenChange?.(false)}>
      {children}
    </button>
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

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AvatarImage: ({ src }: { src?: string }) => <img src={src} alt="" />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock("lucide-react", () => ({
  Receipt: () => <svg data-testid="receipt-icon" />,
  RotateCcw: () => <svg data-testid="rotate-icon" />,
  RefreshCw: () => <svg data-testid="refresh-icon" />,
}));

// Mock date-fns to return deterministic output
jest.mock("date-fns", () => ({
  formatDistanceToNow: () => "2 hours ago",
}));

jest.mock("date-fns/locale", () => ({
  enUS: {},
  pt: {},
  es: {},
  fr: {},
  de: {},
  it: {},
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = mockFetch;
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

const PURCHASE_CONFIRMED = {
  id: "pur-1",
  quantity: 1,
  unitPrice: 10,
  totalAmount: 10,
  currency: "EUR",
  status: "CONFIRMED" as const,
  createdAt: new Date().toISOString(),
  confirmedAt: new Date().toISOString(),
  product: { name: "Protein Shake" },
  user: { name: "Alice", email: "alice@example.com", image: null },
};

const PURCHASE_PENDING = {
  ...PURCHASE_CONFIRMED,
  id: "pur-2",
  status: "CREATED" as const,
};
const PURCHASE_REFUNDED = {
  ...PURCHASE_CONFIRMED,
  id: "pur-3",
  status: "REFUNDED" as const,
};
const PURCHASE_FAILED = {
  ...PURCHASE_CONFIRMED,
  id: "pur-4",
  status: "FAILED" as const,
};
const PURCHASE_CANCELLED = {
  ...PURCHASE_CONFIRMED,
  id: "pur-5",
  status: "CANCELLED" as const,
};

type ShopPurchaseRecord = Omit<typeof PURCHASE_CONFIRMED, "status" | "user"> & {
  status: "CONFIRMED" | "CREATED" | "REFUNDED" | "FAILED" | "CANCELLED";
  user: { name: string | null; email: string; image: string | null };
};
function setupFetch(purchases: ShopPurchaseRecord[]) {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ purchases }),
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenueShopPurchases", () => {
  // ── Loading ──────────────────────────────────────────────────────────────────

  it("shows spinner while loading", () => {
    let resolve!: (v: unknown) => void;
    mockFetch.mockReturnValueOnce(new Promise((r) => (resolve = r)));
    render(<VenueShopPurchases venueId="v1" />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    resolve({ ok: true, json: async () => ({ purchases: [] }) });
  });

  // ── Empty state ──────────────────────────────────────────────────────────────

  it("shows empty message when no purchases", async () => {
    setupFetch([]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("empty")).toBeInTheDocument());
  });

  // ── Title and count ──────────────────────────────────────────────────────────

  it("shows title and purchase count badge", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("title")).toBeInTheDocument());
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("does not show count badge when empty", async () => {
    setupFetch([]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("empty")).toBeInTheDocument());
    // No badge count
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  // ── Purchase rows ────────────────────────────────────────────────────────────

  it("renders user name and product name", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());
    expect(screen.getByText("Protein Shake")).toBeInTheDocument();
  });

  it("renders total amount with currency", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.getByText("10.00 EUR")).toBeInTheDocument()
    );
  });

  it("shows quantity when > 1", async () => {
    const p = { ...PURCHASE_CONFIRMED, quantity: 3 };
    setupFetch([p]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText(/x3/)).toBeInTheDocument());
  });

  it("renders relative time from date-fns", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.getByText("2 hours ago")).toBeInTheDocument()
    );
  });

  // ── Status badges ────────────────────────────────────────────────────────────

  it("shows statusConfirmed badge for CONFIRMED purchase", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.getByText("statusConfirmed")).toBeInTheDocument()
    );
  });

  it("shows statusPending badge for CREATED purchase", async () => {
    setupFetch([PURCHASE_PENDING]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.getByText("statusPending")).toBeInTheDocument()
    );
  });

  it("shows statusRefunded badge for REFUNDED purchase", async () => {
    setupFetch([PURCHASE_REFUNDED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.getByText("statusRefunded")).toBeInTheDocument()
    );
  });

  it("shows statusFailed badge for FAILED purchase", async () => {
    setupFetch([PURCHASE_FAILED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.getByText("statusFailed")).toBeInTheDocument()
    );
  });

  it("shows statusCancelled badge for CANCELLED purchase", async () => {
    setupFetch([PURCHASE_CANCELLED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.getByText("statusCancelled")).toBeInTheDocument()
    );
  });

  // ── Refund button ────────────────────────────────────────────────────────────

  it("shows refund button only for CONFIRMED purchases", async () => {
    setupFetch([PURCHASE_CONFIRMED, PURCHASE_PENDING]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("refund")).toBeInTheDocument());
    expect(screen.getAllByText("refund").length).toBe(1);
  });

  it("does not show refund button for non-CONFIRMED purchases", async () => {
    setupFetch([PURCHASE_PENDING, PURCHASE_REFUNDED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() =>
      expect(screen.queryByText("refund")).not.toBeInTheDocument()
    );
  });

  // ── Refund confirmation dialog ────────────────────────────────────────────────

  it("opens refund confirmation dialog when refund button is clicked", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("refund")).toBeInTheDocument());
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText("refund"));
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    expect(screen.getByText("refundConfirmTitle")).toBeInTheDocument();
  });

  it("closes dialog on cancel click", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("refund")).toBeInTheDocument());
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText("refund"));
    await user.click(screen.getByText("cancel"));
    expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
  });

  it("calls refund API when confirmed", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ purchases: [PURCHASE_CONFIRMED] }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // refund
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ purchases: [] }),
      }); // refetch

    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("refund")).toBeInTheDocument());
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText("refund"));
    await user.click(screen.getByText("confirmRefund"));

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v1/purchases/pur-1/refund",
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  it("shows success toast after successful refund", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ purchases: [PURCHASE_CONFIRMED] }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ purchases: [] }),
      });

    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("refund")).toBeInTheDocument());
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText("refund"));
    await user.click(screen.getByText("confirmRefund"));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "refundSuccess" })
      )
    );
  });

  it("shows error toast when refund fails", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ purchases: [PURCHASE_CONFIRMED] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Not allowed" }),
      });

    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("refund")).toBeInTheDocument());
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText("refund"));
    await user.click(screen.getByText("confirmRefund"));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "refundFailed",
          variant: "destructive",
        })
      )
    );
  });

  // ── Refresh button ───────────────────────────────────────────────────────────

  it("calls fetch again when refresh button is clicked", async () => {
    setupFetch([]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("empty")).toBeInTheDocument());

    const callsBefore = mockFetch.mock.calls.length;

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByTestId("refresh-icon").closest("button")!);

    await waitFor(() =>
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callsBefore)
    );
  });

  // ── Auto-refresh ─────────────────────────────────────────────────────────────

  it("auto-refreshes every 30 seconds", async () => {
    setupFetch([]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(() => expect(screen.getByText("empty")).toBeInTheDocument());

    const callsBefore = mockFetch.mock.calls.length;
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });
    await waitFor(() =>
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callsBefore)
    );
  });

  // ── Fetch endpoint ───────────────────────────────────────────────────────────

  it("fetches from correct purchases endpoint", async () => {
    setupFetch([]);
    render(<VenueShopPurchases venueId="venue-42" />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/venues/venue-42/purchases");
  });

  // ── Avatar fallback ──────────────────────────────────────────────────────────

  it("shows user initial in avatar fallback", async () => {
    setupFetch([PURCHASE_CONFIRMED]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(
      () => expect(screen.getByText("A")).toBeInTheDocument() // "Alice".charAt(0)
    );
  });

  it("shows email initial when name is null", async () => {
    const p = {
      ...PURCHASE_CONFIRMED,
      user: { name: null, email: "bob@example.com", image: null },
    };
    setupFetch([p]);
    render(<VenueShopPurchases venueId="v1" />);
    await waitFor(
      () => expect(screen.getByText("B")).toBeInTheDocument() // "bob@example.com".charAt(0)
    );
  });
});

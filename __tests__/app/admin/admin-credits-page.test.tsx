import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import AdminCreditsPage from "@/app/[locale]/admin/credits/page";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...rest
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    size?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} data-variant={rest.variant}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
  }: {
    children: React.ReactNode;
    variant?: string;
    className?: string;
  }) => <span>{children}</span>,
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <div data-testid="spinner" className={className} />
  ),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
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
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  AlertDialogCancel: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock("lucide-react", () => ({
  Search: () => <svg data-testid="icon-search" />,
  Coins: () => <svg data-testid="icon-coins" />,
  ArrowUpDown: () => <svg data-testid="icon-arrowupdown" />,
  RefreshCw: () => <svg data-testid="icon-refresh" />,
  AlertTriangle: () => <svg data-testid="icon-alert" />,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Main page ─────────────────────────────────────────────────────────────────

describe("AdminCreditsPage", () => {
  it("renders with title and tab buttons", () => {
    render(<AdminCreditsPage />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("userCredits")).toBeInTheDocument();
    expect(screen.getByText("settlements")).toBeInTheDocument();
  });

  it("defaults to users view with search input", () => {
    render(<AdminCreditsPage />);
    expect(screen.getByPlaceholderText("searchUser")).toBeInTheDocument();
  });

  it("switches to settlements view on tab click", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ overview: [], recentSettlements: [] }),
    });

    render(<AdminCreditsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("settlements"));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/credits/settlements");
    });
  });

  it("switches back to users view", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ overview: [], recentSettlements: [] }),
    });

    render(<AdminCreditsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("settlements"));
    });

    await act(async () => {
      fireEvent.click(screen.getByText("userCredits"));
    });

    expect(screen.getByPlaceholderText("searchUser")).toBeInTheDocument();
  });
});

// ── User View ─────────────────────────────────────────────────────────────────

describe("AdminCreditsUserView (via page)", () => {
  it("triggers user search after typing", async () => {
    jest.useFakeTimers();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<AdminCreditsPage />);
    const input = screen.getByPlaceholderText("searchUser");

    await act(async () => {
      fireEvent.change(input, { target: { value: "ab" } });
    });

    // Advance past the debounce
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/users/search?q=ab");

    jest.useRealTimers();
  });

  it("does not search for queries shorter than 2 characters", async () => {
    jest.useFakeTimers();

    render(<AdminCreditsPage />);
    const input = screen.getByPlaceholderText("searchUser");

    await act(async () => {
      fireEvent.change(input, { target: { value: "a" } });
    });

    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(mockFetch).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});

// ── Settlements View ──────────────────────────────────────────────────────────

describe("AdminCreditsSettlementsView (via page)", () => {
  it("shows empty state when no pending settlements", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ overview: [], recentSettlements: [] }),
    });

    render(<AdminCreditsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("settlements"));
    });

    await waitFor(() => {
      expect(screen.getByText("noPending")).toBeInTheDocument();
    });
  });

  it("displays venue overview with pending amounts", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        overview: [
          {
            venueId: "v1",
            venue: {
              id: "v1",
              name: "Test Gym",
              slug: "test-gym",
              stripeAccountId: "acct_123",
              stripePayoutsEnabled: true,
            },
            pendingAmountCents: 15000,
            pendingEntriesCount: 5,
          },
        ],
        recentSettlements: [],
      }),
    });

    render(<AdminCreditsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("settlements"));
    });

    await waitFor(() => {
      expect(screen.getByText("Test Gym")).toBeInTheDocument();
      expect(screen.getAllByText("150.00€").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("displays settlement history with batch details", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        overview: [],
        recentSettlements: [
          {
            id: "b1",
            venueId: "v1",
            totalAmountCents: 10000,
            currency: "EUR",
            status: "COMPLETED",
            entriesCount: 3,
            periodStart: "2024-01-01T00:00:00Z",
            periodEnd: "2024-01-07T00:00:00Z",
            processedAt: "2024-01-08T00:00:00Z",
            failedAt: null,
            failureReason: null,
            stripeTransferId: "tr_123",
            createdAt: "2024-01-08T00:00:00Z",
            venue: { id: "v1", name: "Test Gym", slug: "test-gym" },
          },
        ],
      }),
    });

    render(<AdminCreditsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("settlements"));
    });

    await waitFor(() => {
      expect(screen.getByText("100.00€")).toBeInTheDocument();
      expect(screen.getByText("COMPLETED")).toBeInTheDocument();
      expect(screen.getByText("tr_123")).toBeInTheDocument();
    });
  });

  it("shows retry button for failed settlements", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        overview: [],
        recentSettlements: [
          {
            id: "b_fail",
            venueId: "v1",
            totalAmountCents: 5000,
            currency: "EUR",
            status: "FAILED",
            entriesCount: 2,
            periodStart: "2024-01-01T00:00:00Z",
            periodEnd: "2024-01-07T00:00:00Z",
            processedAt: null,
            failedAt: "2024-01-08T00:00:00Z",
            failureReason: "Transfer failed",
            stripeTransferId: null,
            createdAt: "2024-01-08T00:00:00Z",
            venue: { id: "v1", name: "Failed Gym", slug: "failed" },
          },
        ],
      }),
    });

    render(<AdminCreditsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("settlements"));
    });

    await waitFor(() => {
      expect(screen.getByText("FAILED")).toBeInTheDocument();
      expect(screen.getByText("Transfer failed")).toBeInTheDocument();
      expect(screen.getByText("retry")).toBeInTheDocument();
    });
  });

  it("shows error state and refresh button when fetch fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    render(<AdminCreditsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("settlements"));
    });

    await waitFor(() => {
      expect(screen.getByText("refresh")).toBeInTheDocument();
    });
  });
});

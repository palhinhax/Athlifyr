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

jest.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock recharts — render children and invoke callback props for coverage
jest.mock("recharts", () => {
  const Passthrough = ({
    children,
    ..._rest
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <div>{children}</div>;

  const AxisMock = (props: {
    tickFormatter?: (v: string | number) => string;
    [key: string]: unknown;
  }) => {
    // Call tickFormatter so its code is covered
    if (props.tickFormatter) {
      props.tickFormatter("2026-01");
      props.tickFormatter("2026-02-01");
    }
    return <div data-testid="chart-axis" />;
  };

  const TooltipMock = (props: {
    content?:
      | React.FC<{
          active?: boolean;
          payload?: Array<{
            name?: string;
            value?: number;
            color?: string;
            payload?: Record<string, unknown>;
          }>;
          label?: string;
        }>
      | React.ReactElement;
    [key: string]: unknown;
  }) => {
    // Invoke the content renderer for coverage
    if (typeof props.content === "function") {
      const Content = props.content;
      try {
        const result = Content({
          active: true,
          payload: [
            {
              name: "subscriptions",
              value: 100,
              color: "#000",
              payload: {
                name: "Monday",
                title: "Yoga",
                total_bookings: 10,
                session_count: 5,
                avg_capacity: 12,
              },
            },
            { name: "products", value: 50, color: "#111" },
          ],
          label: "2026-01",
        });
        return (
          <div data-testid="chart-tooltip">{result as React.ReactNode}</div>
        );
      } catch {
        return <div data-testid="chart-tooltip" />;
      }
    }
    return <div data-testid="chart-tooltip" />;
  };

  return {
    ResponsiveContainer: Passthrough,
    AreaChart: Passthrough,
    BarChart: Passthrough,
    LineChart: Passthrough,
    Area: () => <div data-testid="chart-area" />,
    Bar: () => <div data-testid="chart-bar" />,
    Line: () => <div data-testid="chart-line" />,
    XAxis: AxisMock,
    YAxis: AxisMock,
    CartesianGrid: () => <div data-testid="chart-grid" />,
    Tooltip: TooltipMock,
    PieChart: Passthrough,
    Pie: Passthrough,
    Cell: () => <div data-testid="chart-cell" />,
  };
});

jest.mock("@/components/charts/chart-helpers", () => ({
  ChartTooltipWrapper: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ChartGradient: () => <div data-testid="chart-gradient" />,
  AXIS_TICK_STYLE: {},
  AXIS_TICK_STYLE_SM: {},
  CLEAN_AXIS_PROPS: {},
  GRID_PROPS: {},
}));

jest.mock("@/components/charts/donut-chart", () => ({
  DonutChart: ({ unitLabel }: { unitLabel: string }) => (
    <div data-testid="donut-chart">{unitLabel}</div>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>{children}</div>
  ),
  CardContent: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>{children}</div>
  ),
  CardDescription: ({
    children,
    ...p
  }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...p}>{children}</p>,
  CardHeader: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>{children}</div>
  ),
  CardTitle: ({ children, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...p}>{children}</h3>
  ),
}));

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({
    children,
    ...p
  }: React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string;
  }) => <div {...p}>{children}</div>,
  TabsContent: ({
    children,
    value,
    ...p
  }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => (
    <div data-testid={`tab-${value}`} {...p}>
      {children}
    </div>
  ),
  TabsList: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
    <div role="tablist" {...p}>
      {children}
    </div>
  ),
  TabsTrigger: ({
    children,
    value,
    ...p
  }: React.HTMLAttributes<HTMLButtonElement> & { value: string }) => (
    <button role="tab" data-testid={`trigger-${value}`} {...p}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode;
    onValueChange?: (v: string) => void;
    value?: string;
  }) => (
    <div data-testid="select" data-value={value}>
      {children}
      {/* hidden helper for tests */}
      <input
        data-testid="select-input"
        type="hidden"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
      />
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({
    children,
    ...p
  }: React.HTMLAttributes<HTMLButtonElement>) => (
    <button {...p}>{children}</button>
  ),
  SelectValue: () => <span />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }) => {
    const { ...rest } = p;
    return <button {...rest}>{children}</button>;
  },
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner" className={className} />
  ),
}));

// Suppress lucide-react dynamic imports
jest.mock(
  "lucide-react",
  () =>
    new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (typeof prop === "string" && prop !== "__esModule") {
            const Icon = ({ className }: { className?: string }) => (
              <span data-testid={`icon-${prop}`} className={className} />
            );
            Icon.displayName = prop;
            return Icon;
          }
          return undefined;
        },
      }
    )
);

// ── Test data ─────────────────────────────────────────────────────────────────

const MOCK_DATA = {
  period: { days: 30, start: "2026-02-13" },
  members: {
    byRole: [
      { role: "MEMBER", count: 10 },
      { role: "COACH", count: 2 },
    ],
    byStatus: [
      { status: "ACTIVE", count: 8 },
      { status: "INACTIVE", count: 4 },
    ],
    growth: [
      { month: "2026-01", count: 3 },
      { month: "2026-02", count: 5 },
    ],
    totalActive: 12,
  },
  subscriptions: { active: 8, totalPaid: 6, totalRevenue: 480 },
  bookings: {
    byStatus: [
      { status: "CONFIRMED", count: 20 },
      { status: "CANCELLED", count: 3 },
    ],
    byDayOfWeek: [
      { day_of_week: 1, count: 8 },
      { day_of_week: 3, count: 6 },
    ],
    trend: [
      { week: "2026-02-01", count: 10 },
      { week: "2026-02-08", count: 12 },
    ],
    total: 50,
    attended: 40,
    noShow: 5,
    cancelled: 3,
    attendanceRate: 80,
    trials: 2,
  },
  sessions: {
    total: 30,
    avgCapacity: 15,
    popular: [
      {
        title: "Yoga",
        session_count: 10,
        total_bookings: 80,
        avg_capacity: 12,
      },
    ],
  },
  products: {
    totalSales: 25,
    totalRevenue: 375,
    topProducts: [{ name: "T-Shirt", total_quantity: 15, total_revenue: 225 }],
  },
  revenue: {
    monthly: [
      { month: "2026-01", subscriptions: 200, products: 75, total: 275 },
      { month: "2026-02", subscriptions: 280, products: 100, total: 380 },
    ],
    totalSubscriptions: 480,
    totalProducts: 175,
    grandTotal: 655,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

import { VenueAnalyticsDashboard } from "@/components/venue-analytics-dashboard";

const defaultProps = {
  venueId: "v1",
  venueName: "My Gym",
  venueSlug: "my-gym",
};

function renderDashboard(
  props: Partial<React.ComponentProps<typeof VenueAnalyticsDashboard>> = {}
) {
  return render(<VenueAnalyticsDashboard {...defaultProps} {...props} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("VenueAnalyticsDashboard", () => {
  // ── Loading state ───────────────────────────────────────────────────────

  it("shows loading spinner on initial render", () => {
    (globalThis.fetch as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    renderDashboard();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  // ── Error state ─────────────────────────────────────────────────────────

  it("shows error state when fetch fails", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("fetchError")).toBeInTheDocument();
    });
    expect(screen.getByText("retry")).toBeInTheDocument();
  });

  it("shows error state when response is not ok", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("fetchError")).toBeInTheDocument();
    });
  });

  it("retry button re-fetches analytics", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error("fail"));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("retry")).toBeInTheDocument();
    });

    (globalThis.fetch as jest.Mock).mockClear();
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error("fail again"));

    await userEvent.click(screen.getByText("retry"));

    await waitFor(() => {
      // Should have called fetch again
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/venues/v1/analytics?days=30"
      );
    });
  });

  // ── Successful data render ──────────────────────────────────────────────

  it("renders KPI cards with correct data", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("12")).toBeInTheDocument(); // totalActive
    });
    expect(screen.getByText("8")).toBeInTheDocument(); // active subs
    // 50 appears in both overview and bookings KPI cards
    expect(screen.getAllByText("50").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("80%")).toBeInTheDocument(); // attendance rate
    expect(screen.getAllByText("25").length).toBeGreaterThanOrEqual(1); // product sales
    expect(screen.getByText("€655")).toBeInTheDocument(); // total revenue
  });

  it("displays dash when attendanceRate is null", async () => {
    const nullData = {
      ...MOCK_DATA,
      bookings: { ...MOCK_DATA.bookings, attendanceRate: null },
    };
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(nullData),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  it("renders venue name", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("My Gym")).toBeInTheDocument();
    });
  });

  it("renders back link to venue page", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/venues/my-gym");
    });
  });

  // ── Tabs ────────────────────────────────────────────────────────────────

  it("renders all 5 tab triggers", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByTestId("trigger-overview")).toBeInTheDocument();
    });
    expect(screen.getByTestId("trigger-members")).toBeInTheDocument();
    expect(screen.getByTestId("trigger-bookings")).toBeInTheDocument();
    expect(screen.getByTestId("trigger-revenue")).toBeInTheDocument();
    expect(screen.getByTestId("trigger-sessions")).toBeInTheDocument();
  });

  // ── Overview tab ────────────────────────────────────────────────────────

  it("renders overview tab with revenue chart", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("charts.revenueOverTime")).toBeInTheDocument();
    });
    expect(screen.getByText("charts.revenueOverTimeDesc")).toBeInTheDocument();
  });

  it("renders bookings trend and member growth charts in overview", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("charts.bookingsTrend")).toBeInTheDocument();
    });
    expect(screen.getByText("charts.memberGrowth")).toBeInTheDocument();
  });

  // ── Members tab ─────────────────────────────────────────────────────────

  it("renders members tab with role chart and status bars", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("charts.membersByRole")).toBeInTheDocument();
    });
    expect(screen.getByText("charts.membersByStatus")).toBeInTheDocument();
  });

  it("renders member status percentages", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      // ACTIVE: 8 out of 12 => 67%
      expect(screen.getByText("8 (67%)")).toBeInTheDocument();
      // INACTIVE: 4 out of 12 => 33%
      expect(screen.getByText("4 (33%)")).toBeInTheDocument();
    });
  });

  it("renders member growth detailed chart", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(
        screen.getByText("charts.memberGrowthDetailed")
      ).toBeInTheDocument();
    });
  });

  // ── Bookings tab ────────────────────────────────────────────────────────

  it("renders bookings tab KPIs", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      // bookings tab has sub-KPIs: total:50, attended:40, noShow:5, trials:2
      expect(screen.getByText("40")).toBeInTheDocument(); // attended
      expect(screen.getByText("5")).toBeInTheDocument(); // noShow
    });
  });

  it("renders bookings by status donut chart", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("charts.bookingsByStatus")).toBeInTheDocument();
    });
  });

  it("renders bookings by day of week chart", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("charts.bookingsByDay")).toBeInTheDocument();
    });
  });

  it("renders weekly bookings trend chart", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(
        screen.getByText("charts.weeklyBookingsTrend")
      ).toBeInTheDocument();
    });
  });

  // ── Revenue tab ─────────────────────────────────────────────────────────

  it("renders revenue tab KPIs with formatted amounts", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("€655.00")).toBeInTheDocument(); // grandTotal
    });
    expect(screen.getByText("€480.00")).toBeInTheDocument(); // subs
    expect(screen.getByText("€175.00")).toBeInTheDocument(); // products
  });

  it("renders monthly revenue bar chart", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("charts.monthlyRevenue")).toBeInTheDocument();
    });
  });

  it("renders top products table", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
      expect(screen.getByText("€225.00")).toBeInTheDocument();
    });
  });

  it("hides top products when empty", async () => {
    const noProducts = {
      ...MOCK_DATA,
      products: { ...MOCK_DATA.products, topProducts: [] },
    };
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(noProducts),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("title")).toBeInTheDocument();
    });
    expect(screen.queryByText("charts.topProducts")).not.toBeInTheDocument();
  });

  // ── Sessions tab ────────────────────────────────────────────────────────

  it("renders sessions tab KPIs", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("30")).toBeInTheDocument(); // total sessions
      expect(screen.getByText("15")).toBeInTheDocument(); // avgCapacity
    });
  });

  it("displays dash when avgCapacity is null", async () => {
    const nullCap = {
      ...MOCK_DATA,
      sessions: { ...MOCK_DATA.sessions, avgCapacity: null },
    };
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(nullCap),
    });
    renderDashboard();

    await waitFor(() => {
      // find all dashes — one from sessions avgCapacity
      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders popular sessions chart", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("charts.popularSessions")).toBeInTheDocument();
    });
  });

  it("hides popular sessions when empty", async () => {
    const noSessions = {
      ...MOCK_DATA,
      sessions: { ...MOCK_DATA.sessions, popular: [] },
    };
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(noSessions),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("title")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("charts.popularSessions")
    ).not.toBeInTheDocument();
  });

  // ── Fetch parameters ───────────────────────────────────────────────────

  it("fetches analytics with correct default params", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/venues/v1/analytics?days=30"
      );
    });
  });

  it("refresh button triggers re-fetch", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("title")).toBeInTheDocument();
    });

    (globalThis.fetch as jest.Mock).mockClear();
    // The RefreshCw button — find buttons and click the one that's an icon button
    const buttons = screen.getAllByRole("button");
    // the refresh icon button is the last one in the header area
    const refreshBtn = buttons.find(
      (btn) => btn.querySelector('[data-testid="icon-RefreshCw"]') !== null
    );
    expect(refreshBtn).toBeDefined();
    await userEvent.click(refreshBtn!);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/venues/v1/analytics?days=30"
      );
    });
  });

  // ── Period selector ──────────────────────────────────────────────────

  it("renders period options", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("periods.7days")).toBeInTheDocument();
    });
    expect(screen.getByText("periods.30days")).toBeInTheDocument();
    expect(screen.getByText("periods.90days")).toBeInTheDocument();
    expect(screen.getByText("periods.180days")).toBeInTheDocument();
    expect(screen.getByText("periods.365days")).toBeInTheDocument();
  });

  // ── DonutChart rendering ──────────────────────────────────────────────

  it("renders donut charts with correct unit labels", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    });
    renderDashboard();

    await waitFor(() => {
      const donuts = screen.getAllByTestId("donut-chart");
      expect(donuts).toHaveLength(2); // members by role + bookings by status
    });
  });

  // ── Members status with zero total ────────────────────────────────────

  it("handles zero total member status gracefully", async () => {
    const zeroMembers = {
      ...MOCK_DATA,
      members: {
        ...MOCK_DATA.members,
        byStatus: [{ status: "ACTIVE", count: 0 }],
      },
    };
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(zeroMembers),
    });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("0 (0%)")).toBeInTheDocument();
    });
  });
});

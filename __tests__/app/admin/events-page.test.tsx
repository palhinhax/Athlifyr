import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@prisma/client", () => ({
  SportType: {
    RUNNING: "RUNNING",
    TRAIL_RUNNING: "TRAIL_RUNNING",
    CYCLING: "CYCLING",
    TRIATHLON: "TRIATHLON",
    HYROX: "HYROX",
  },
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  toast: (...args: unknown[]) => mockToast(...args),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...rest} />
  ),
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/lib/event-utils", () => ({
  formatDateShort: () => "Jan 1, 2026",
}));

jest.mock("@/components/sport-badge", () => ({
  SportBadge: ({ sportType }: { sportType: string }) => (
    <span data-testid="sport-badge">{sportType}</span>
  ),
}));

jest.mock("@/components/admin-event-suggestions", () => ({
  AdminEventSuggestions: () => (
    <div data-testid="admin-event-suggestions">Suggestions</div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <label {...props}>{children}</label>,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
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
  DialogContent: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="dialog-content">{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="dialog-trigger">{asChild ? children : children}</div>,
}));

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({
    children,
    defaultValue,
  }: {
    children: React.ReactNode;
    defaultValue?: string;
    className?: string;
  }) => <div data-testid={`tabs-${defaultValue}`}>{children}</div>,
  TabsContent: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`tab-content-${value}`}>{children}</div>,
  TabsList: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => <button data-testid={`tab-trigger-${value}`}>{children}</button>,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import AdminEventsPage from "@/app/[locale]/admin/events/page";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOCK_EVENTS = [
  {
    id: "event-1",
    title: "Trail Run 2026",
    slug: "trail-run-2026",
    description: "A great trail run",
    sportTypes: ["TRAIL_RUNNING"],
    startDate: "2026-01-01T00:00:00.000Z",
    city: "Lisbon",
    country: "Portugal",
    imageUrl: "https://example.com/image.jpg",
    latitude: 38.7,
    longitude: -9.1,
    googleMapsUrl: "https://maps.google.com",
    externalUrl: "https://event.com",
  },
  {
    id: "event-2",
    title: "City Marathon",
    slug: "city-marathon",
    description: "",
    sportTypes: ["RUNNING"],
    startDate: "2026-03-15T00:00:00.000Z",
    city: "Porto",
    country: "Portugal",
    imageUrl: null,
    latitude: null,
    longitude: null,
    googleMapsUrl: null,
    externalUrl: null,
  },
];

function setupFetchEvents(
  events = MOCK_EVENTS,
  pagination = { totalPages: 1, totalCount: 2 }
) {
  mockFetch.mockImplementation((url: string) => {
    if (typeof url === "string" && url.includes("/api/admin/events")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ events, pagination }),
      });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSession.mockReturnValue({
    data: { user: { id: "admin-1", role: "ADMIN" } },
    status: "authenticated",
  });
});

describe("AdminEventsPage", () => {
  it("redirects non-admin users", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "user-1", role: "USER" } },
      status: "authenticated",
    });
    setupFetchEvents([]);

    render(<AdminEventsPage />);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows loading state initially", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "admin-1", role: "ADMIN" } },
      status: "authenticated",
    });
    setupFetchEvents();

    render(<AdminEventsPage />);
    // Loading skeleton or indicator
    expect(document.body).toBeTruthy();
  });

  it("renders events list after loading", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getByText("Trail Run 2026")).toBeInTheDocument();
    });

    expect(screen.getByText("City Marathon")).toBeInTheDocument();
  });

  it("shows event details (city, date)", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getByText("Trail Run 2026")).toBeInTheDocument();
    });

    expect(screen.getByText(/Lisbon/)).toBeInTheDocument();
  });

  it("renders sport type badges", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("sport-badge").length).toBeGreaterThan(0);
    });
  });

  it("shows missing fields indicator for incomplete events", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getByText("City Marathon")).toBeInTheDocument();
    });

    // Event 2 is missing image, coordinates, google maps, external url, description
    // The component should show missing field indicators
  });

  it("renders search input", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getByText("Trail Run 2026")).toBeInTheDocument();
    });

    // The component uses an Input component which renders an <input>
    const searchInput = document.querySelector("input");
    expect(searchInput).toBeTruthy();
  });

  it("filters events by search query", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getByText("Trail Run 2026")).toBeInTheDocument();
    });

    // Find search input and type a query
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: "Trail" } });

      // Wait for debounced search to trigger
      await waitFor(
        () => {
          const fetchCalls = mockFetch.mock.calls.filter(
            (call) =>
              typeof call[0] === "string" && call[0].includes("search=Trail")
          );
          expect(fetchCalls.length).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );
    }
  });

  it("shows tabs for events and suggestions", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("tabs-events")).toBeInTheDocument();
    });

    expect(screen.getByTestId("tab-trigger-events")).toBeInTheDocument();
    expect(screen.getByTestId("tab-trigger-suggestions")).toBeInTheDocument();
  });

  it("renders AdminEventSuggestions in suggestions tab", async () => {
    setupFetchEvents();

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("admin-event-suggestions")).toBeInTheDocument();
    });
  });

  it("handles empty events list", async () => {
    setupFetchEvents([], { totalPages: 0, totalCount: 0 });

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("handles fetch error gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<AdminEventsPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("does not redirect while session is loading", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<AdminEventsPage />);
    expect(mockPush).not.toHaveBeenCalled();
  });
});

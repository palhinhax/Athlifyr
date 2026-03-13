import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@prisma/client", () => ({
  SportType: { TRAIL_RUNNING: "TRAIL_RUNNING" },
  EventOrganizerRole: {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    FINANCE: "FINANCE",
  },
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  toast: (...args: unknown[]) => mockToast(...args),
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled} {...rest}>
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
    ...rest
  }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...rest}>{children}</label>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
  CardContent: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>,
  CardHeader: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
  CardTitle: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <h3 {...rest}>{children}</h3>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant,
    ...rest
  }: React.HTMLAttributes<HTMLSpanElement> & { variant?: string }) => (
    <span data-variant={variant} {...rest}>
      {children}
    </span>
  ),
}));

jest.mock("@/components/ui/switch", () => ({
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked?: boolean;
    onCheckedChange?: (c: boolean) => void;
  }) => (
    <input
      type="checkbox"
      data-testid="switch"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (v: string) => void;
  }) => <div data-value={value}>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
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
  }) => <div data-value={value}>{children}</div>,
}));

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({ id: "event-1" }),
  usePathname: () => "/admin/events/event-1",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "admin-1", role: "ADMIN" } },
    status: "authenticated",
  }),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import AdminEventSettingsPage from "@/app/[locale]/admin/events/[id]/page";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_EVENT = {
  id: "event-1",
  title: "Trail Run 2026",
  slug: "trail-run-2026",
  city: "Lisbon",
  country: "PT",
  startDate: "2026-06-01T00:00:00Z",
  sportTypes: ["TRAIL_RUNNING"],
  hasRegistrations: true,
  hasLiveRace: false,
  isFeatured: false,
  commissionPercent: 5,
  refundDeadline: null,
  checkInOpensAt: null,
  checkInClosesAt: null,
  stripeOnboardingStatus: "COMPLETE",
  stripeAccountId: "acct_123",
  cancelled: false,
};

const MOCK_ORGANIZERS = [
  {
    id: "org-1",
    role: "OWNER",
    user: { id: "u1", name: "Admin User", email: "admin@test.com" },
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockReset();
});

describe("AdminEventSettingsPage", () => {
  it("renders loading spinner initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<AdminEventSettingsPage />);

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("loads and displays event settings", async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/organizers")) {
        return Promise.resolve({
          ok: true,
          json: async () => MOCK_ORGANIZERS,
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => MOCK_EVENT,
      });
    });

    render(<AdminEventSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText("Trail Run 2026")).toBeInTheDocument();
    });
  });

  it("loads organizers after event loads", async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/organizers")) {
        return Promise.resolve({
          ok: true,
          json: async () => MOCK_ORGANIZERS,
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => MOCK_EVENT,
      });
    });

    render(<AdminEventSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });
  });

  it("handles event load failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    render(<AdminEventSettingsPage />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/admin/events");
    });
  });
});

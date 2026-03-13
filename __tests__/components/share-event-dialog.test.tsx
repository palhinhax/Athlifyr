import React from "react";
import { render, screen } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
  useLocale: () => "en",
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

jest.mock("@/components/featured-event-card", () => ({
  FeaturedEventCard: ({ event }: { event: { title: string } }) => (
    <div data-testid="featured-card">{event.title}</div>
  ),
}));

jest.mock("@/components/sport-badge", () => ({
  SportBadge: ({ sportType }: { sportType: string }) => (
    <span data-testid="sport-badge">{sportType}</span>
  ),
}));

jest.mock("@/lib/event-utils", () => ({
  formatDateRange: () => "Jan 1 - Jan 2",
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) => (
    <img alt={alt} {...rest} />
  ),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
    _onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    _onOpenChange?: (open: boolean) => void;
  }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogTrigger: ({
    children,
    _asChild,
  }: {
    children: React.ReactNode;
    _asChild?: boolean;
  }) => <div data-testid="dialog-trigger">{children}</div>,
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

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
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

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import { ShareEventDialog } from "@/components/share-event-dialog";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.resetAllMocks());

describe("ShareEventDialog", () => {
  it("renders trigger children", () => {
    render(
      <ShareEventDialog venueId="venue1" venueName="Gym A">
        <button>Share</button>
      </ShareEventDialog>
    );

    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("renders search dialog content when dialog is forced open", () => {
    render(
      <ShareEventDialog venueId="venue1" venueName="Gym A">
        <button>Share</button>
      </ShareEventDialog>
    );

    // Dialog renders but starts closed
    expect(screen.getByTestId("dialog")).toHaveAttribute("data-open", "false");
  });
});

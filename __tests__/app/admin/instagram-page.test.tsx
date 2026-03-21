import React from "react";
import { render, screen } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <button {...props}>{children}</button>,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("lucide-react", () => ({
  Loader2: () => <span data-testid="loader">Loading...</span>,
  Download: () => "Download",
  Save: () => "Save",
  Eye: () => "Eye",
  EyeOff: () => "EyeOff",
  FolderOpen: () => "FolderOpen",
  Trash2: () => "Trash2",
}));

jest.mock("@/components/instagram/canvas-preview", () => ({
  CanvasPreview: () => <div data-testid="canvas-preview">Preview</div>,
}));

jest.mock("@/lib/instagram-export", () => ({
  exportToImage: jest.fn(),
}));

jest.mock("@/components/instagram/event-search", () => ({
  EventSearch: () => <div data-testid="event-search">EventSearch</div>,
}));

jest.mock("@/components/instagram/template-selector", () => ({
  TemplateSelector: () => (
    <div data-testid="template-selector">TemplateSelector</div>
  ),
}));

jest.mock("@/components/instagram/background-controls", () => ({
  BackgroundControls: () => (
    <div data-testid="background-controls">BackgroundControls</div>
  ),
}));

jest.mock("@/components/instagram/event-hero-form", () => ({
  EventHeroForm: () => <div>EventHeroForm</div>,
}));

jest.mock("@/components/instagram/category-card-form", () => ({
  CategoryCardForm: () => <div>CategoryCardForm</div>,
}));

jest.mock("@/components/instagram/weekly-picks-form", () => ({
  WeeklyPicksForm: () => <div>WeeklyPicksForm</div>,
}));

jest.mock("@/components/instagram/minimal-quote-form", () => ({
  MinimalQuoteForm: () => <div>MinimalQuoteForm</div>,
}));

jest.mock("@/components/instagram/monthly-events-form", () => ({
  MonthlyEventsForm: () => <div>MonthlyEventsForm</div>,
}));

jest.mock("@/components/instagram/bold-text-overlay-form", () => ({
  BoldTextOverlayForm: () => <div>BoldTextOverlayForm</div>,
}));

jest.mock("@/components/instagram/split-screen-form", () => ({
  SplitScreenForm: () => <div>SplitScreenForm</div>,
}));

jest.mock("@/components/instagram/testimonial-stats-form", () => ({
  TestimonialStatsForm: () => <div>TestimonialStatsForm</div>,
}));

jest.mock("@/components/instagram/vertical-challenge-form", () => ({
  VerticalChallengeForm: () => <div>VerticalChallengeForm</div>,
}));

jest.mock("@/components/instagram/hook-cta-form", () => ({
  HookCtaForm: () => <div>HookCtaForm</div>,
}));

jest.mock("@/components/instagram/venue-promo-form", () => ({
  VenuePromoForm: () => <div>VenuePromoForm</div>,
}));

jest.mock("@/components/instagram/giveaway-promo-form", () => ({
  GiveawayPromoForm: () => <div>GiveawayPromoForm</div>,
}));

jest.mock("@/components/instagram/app-download-form", () => ({
  AppDownloadForm: () => <div>AppDownloadForm</div>,
}));

jest.mock("@/components/instagram/athli-chat-promo-form", () => ({
  AthliChatPromoForm: () => <div>AthliChatPromoForm</div>,
}));

jest.mock("@/components/instagram/giveaway-winner-form", () => ({
  GiveawayWinnerForm: () => <div>GiveawayWinnerForm</div>,
}));

jest.mock("@/types/instagram", () => ({
  BRAND_COLORS: { primary: "#000" },
  BRAND_GRADIENTS: [{ from: "#000", to: "#fff", angle: 45, name: "Default" }],
  INSTAGRAM_SIZES: {
    SQUARE: { width: 1080, height: 1080 },
    PORTRAIT: { width: 1080, height: 1350 },
    STORY: { width: 1080, height: 1920 },
  },
}));

// ── Import after mocks ────────────────────────────────────────────────────────

import InstagramGeneratorPage from "@/app/[locale]/admin/instagram/page";

describe("InstagramGeneratorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner when session is loading", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<InstagramGeneratorPage />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("redirects non-admin users to home", () => {
    mockUseSession.mockReturnValue({
      data: { user: { role: "USER" } },
      status: "authenticated",
    });

    render(<InstagramGeneratorPage />);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("redirects unauthenticated users to home", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<InstagramGeneratorPage />);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("renders page content for admin users", () => {
    mockUseSession.mockReturnValue({
      data: { user: { role: "ADMIN" } },
      status: "authenticated",
    });

    render(<InstagramGeneratorPage />);

    expect(
      screen.getByText("Instagram & TikTok Post Generator")
    ).toBeInTheDocument();
    expect(screen.getByTestId("event-search")).toBeInTheDocument();
  });
});

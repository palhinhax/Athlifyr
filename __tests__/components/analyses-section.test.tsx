import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { LucideIcon } from "lucide-react";
import {
  AnalysisModalHeader,
  type AnalysisRecord,
} from "@/components/analyses-section";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next/dynamic", () => () => () => null);

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AlertDialogAction: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TabsTrigger: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    title,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    title?: string;
  }) => (
    <button onClick={onClick} title={title}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock("@/components/ui/slider", () => ({
  Slider: () => <div />,
}));

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

jest.mock("@/lib/analytics", () => ({
  analyticsEvent: jest.fn(),
}));

jest.mock("@/components/video-analysis-upload", () => ({
  VideoAnalysisUpload: () => <div data-testid="video-upload" />,
}));

// Stub lucide icons to render identifiable elements
jest.mock("lucide-react", () => {
  const icons = [
    "Activity",
    "Dumbbell",
    "CalendarDays",
    "Clock",
    "Play",
    "Pause",
    "Download",
    "Loader2",
    "Plus",
    "Video",
    "Box",
    "Trash2",
    "ChevronLeft",
    "ChevronRight",
    "RotateCcw",
    "Sparkles",
    "Target",
    "Timer",
    "Repeat",
    "TrendingUp",
    "ShieldAlert",
    "Lightbulb",
    "CheckCircle2",
  ];
  const mocks: Record<string, React.FC<{ className?: string }>> = {};
  for (const name of icons) {
    mocks[name] = ({ className }: { className?: string }) => (
      <svg data-testid={`icon-${name}`} className={className} />
    );
  }
  return mocks;
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOCK_RECORD: AnalysisRecord = {
  id: "rec-1",
  localId: "local-1",
  label: "Test Analysis",
  videoUrl: "https://example.com/video.mp4",
  createdAt: "2025-01-01T00:00:00Z",
  analysisJson: {},
};

function MockIcon({ className }: { className?: string }) {
  return <svg data-testid="mock-icon" className={className} />;
}
function MockSplitIcon({ className }: { className?: string }) {
  return <svg data-testid="mock-split-icon" className={className} />;
}
const MockIconCasted = MockIcon as unknown as LucideIcon;
const MockSplitIconCasted = MockSplitIcon as unknown as LucideIcon;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AnalysisModalHeader", () => {
  it("renders title and meta content", () => {
    render(
      <AnalysisModalHeader
        icon={MockIconCasted}
        splitIcon={MockSplitIconCasted}
        title="Motion Analysis"
        metaContent={<span>Jan 2025</span>}
        hasSkeletonData={false}
        viewMode="video"
        setViewMode={jest.fn()}
        record={null}
      />
    );

    expect(screen.getByText("Motion Analysis")).toBeInTheDocument();
    expect(screen.getByText("Jan 2025")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <AnalysisModalHeader
        icon={MockIconCasted}
        splitIcon={MockSplitIconCasted}
        title="Test"
        metaContent={null}
        hasSkeletonData={false}
        viewMode="video"
        setViewMode={jest.fn()}
        record={null}
      />
    );

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("shows view mode buttons when hasSkeletonData is true", () => {
    render(
      <AnalysisModalHeader
        icon={MockIconCasted}
        splitIcon={MockSplitIconCasted}
        title="Test"
        metaContent={null}
        hasSkeletonData={true}
        viewMode="video"
        setViewMode={jest.fn()}
        record={null}
      />
    );

    expect(screen.getByTitle("Vídeo")).toBeInTheDocument();
    expect(screen.getByTitle("Vídeo + 3D")).toBeInTheDocument();
    expect(screen.getByTitle("Esqueleto 3D")).toBeInTheDocument();
  });

  it("hides view mode buttons when hasSkeletonData is false", () => {
    render(
      <AnalysisModalHeader
        icon={MockIconCasted}
        splitIcon={MockSplitIconCasted}
        title="Test"
        metaContent={null}
        hasSkeletonData={false}
        viewMode="video"
        setViewMode={jest.fn()}
        record={null}
      />
    );

    expect(screen.queryByTitle("Vídeo")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Vídeo + 3D")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Esqueleto 3D")).not.toBeInTheDocument();
  });

  it("calls setViewMode when view mode buttons are clicked", async () => {
    const setViewMode = jest.fn();
    const user = userEvent.setup();

    render(
      <AnalysisModalHeader
        icon={MockIconCasted}
        splitIcon={MockSplitIconCasted}
        title="Test"
        metaContent={null}
        hasSkeletonData={true}
        viewMode="video"
        setViewMode={setViewMode}
        record={null}
      />
    );

    await user.click(screen.getByTitle("Vídeo + 3D"));
    expect(setViewMode).toHaveBeenCalledWith("split");

    await user.click(screen.getByTitle("Esqueleto 3D"));
    expect(setViewMode).toHaveBeenCalledWith("skeleton");

    await user.click(screen.getByTitle("Vídeo"));
    expect(setViewMode).toHaveBeenCalledWith("video");
  });

  it("renders export button when record is provided", () => {
    render(
      <AnalysisModalHeader
        icon={MockIconCasted}
        splitIcon={MockSplitIconCasted}
        title="Test"
        metaContent={null}
        hasSkeletonData={false}
        viewMode="video"
        setViewMode={jest.fn()}
        record={MOCK_RECORD}
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/video.mp4");
    expect(link).toHaveAttribute("download");
  });

  it("does not render export button when record is null", () => {
    render(
      <AnalysisModalHeader
        icon={MockIconCasted}
        splitIcon={MockSplitIconCasted}
        title="Test"
        metaContent={null}
        hasSkeletonData={false}
        viewMode="video"
        setViewMode={jest.fn()}
        record={null}
      />
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

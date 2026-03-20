import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimerHeader } from "@/components/workout-runner/timer-header";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
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

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    asChild,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    asChild?: boolean;
    [key: string]: unknown;
  }) => {
    // When asChild, render children directly (simulates Slot behavior)
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, props as Record<string, unknown>);
    }
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock("lucide-react", () => ({
  ArrowLeftIcon: () => <span data-testid="arrow-left-icon" />,
  ExpandIcon: () => <span data-testid="expand-icon" />,
  ShrinkIcon: () => <span data-testid="shrink-icon" />,
  SettingsIcon: () => <span data-testid="settings-icon" />,
  Volume2Icon: () => <span data-testid="volume2-icon" />,
  VolumeXIcon: () => <span data-testid="volumex-icon" />,
  ClockIcon: () => <span data-testid="clock-icon" />,
  EyeOffIcon: () => <span data-testid="eyeoff-icon" />,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const defaultProps = {
  workoutName: "Test Workout",
  isFullscreen: false,
  hasStarted: false,
  isMuted: false,
  isClockVisible: true,
  returnTo: undefined as string | undefined,
  onToggleMute: jest.fn(),
  onToggleClockVisibility: jest.fn(),
  onToggleSettings: jest.fn(),
  onToggleFullscreen: jest.fn(),
};

function renderHeader(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<TimerHeader {...props} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("TimerHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Normal mode ───────────────────────────────────────────────────────────

  describe("normal mode", () => {
    it("renders workout name and in-progress text", () => {
      renderHeader();

      expect(screen.getByText("Test Workout")).toBeInTheDocument();
      expect(screen.getByText("runner.inProgress")).toBeInTheDocument();
    });

    it("renders back link defaulting to /workouts", () => {
      renderHeader();

      const backLink = screen.getByRole("link", {
        name: "runner.backToWorkouts",
      });
      expect(backLink).toHaveAttribute("href", "/workouts");
    });

    it("renders back link with custom returnTo", () => {
      renderHeader({ returnTo: "/custom-path" });

      const backLink = screen.getByRole("link", {
        name: "runner.backToWorkouts",
      });
      expect(backLink).toHaveAttribute("href", "/custom-path");
    });

    it("shows volume icon when not muted", () => {
      renderHeader({ isMuted: false });

      expect(screen.getByTestId("volume2-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("volumex-icon")).not.toBeInTheDocument();
    });

    it("shows muted icon when muted", () => {
      renderHeader({ isMuted: true });

      expect(screen.getByTestId("volumex-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("volume2-icon")).not.toBeInTheDocument();
    });

    it("shows clock icon when clock is visible", () => {
      renderHeader({ isClockVisible: true });

      expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("eyeoff-icon")).not.toBeInTheDocument();
    });

    it("shows eye-off icon when clock is hidden", () => {
      renderHeader({ isClockVisible: false });

      expect(screen.getByTestId("eyeoff-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("clock-icon")).not.toBeInTheDocument();
    });

    it("shows expand icon in normal mode", () => {
      renderHeader({ isFullscreen: false });

      expect(screen.getByTestId("expand-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("shrink-icon")).not.toBeInTheDocument();
    });

    it("renders settings button with aria-label", () => {
      renderHeader();

      const settingsBtn = screen.getByRole("button", {
        name: "runner.settings",
      });
      expect(settingsBtn).toBeInTheDocument();
    });

    it("disables settings button when workout has started", () => {
      renderHeader({ hasStarted: true });

      const settingsBtn = screen.getByRole("button", {
        name: "runner.settings",
      });
      expect(settingsBtn).toBeDisabled();
    });

    it("enables settings button when workout has not started", () => {
      renderHeader({ hasStarted: false });

      const settingsBtn = screen.getByRole("button", {
        name: "runner.settings",
      });
      expect(settingsBtn).not.toBeDisabled();
    });

    it("renders fullscreen button with correct aria-label", () => {
      renderHeader({ isFullscreen: false });

      const fsBtn = screen.getByRole("button", {
        name: "runner.enterFullscreen",
      });
      expect(fsBtn).toBeInTheDocument();
    });

    it("calls onToggleMute when mute button clicked", () => {
      const onToggleMute = jest.fn();
      renderHeader({ onToggleMute });

      fireEvent.click(screen.getByTitle("runner.mute"));
      expect(onToggleMute).toHaveBeenCalledTimes(1);
    });

    it("calls onToggleClockVisibility when clock button clicked", () => {
      const onToggleClockVisibility = jest.fn();
      renderHeader({ onToggleClockVisibility });

      fireEvent.click(screen.getByTitle("runner.hideClock"));
      expect(onToggleClockVisibility).toHaveBeenCalledTimes(1);
    });

    it("calls onToggleSettings when settings button clicked", () => {
      const onToggleSettings = jest.fn();
      renderHeader({ onToggleSettings });

      fireEvent.click(screen.getByRole("button", { name: "runner.settings" }));
      expect(onToggleSettings).toHaveBeenCalledTimes(1);
    });

    it("calls onToggleFullscreen when fullscreen button clicked", () => {
      const onToggleFullscreen = jest.fn();
      renderHeader({ onToggleFullscreen });

      fireEvent.click(
        screen.getByRole("button", { name: "runner.enterFullscreen" })
      );
      expect(onToggleFullscreen).toHaveBeenCalledTimes(1);
    });
  });

  // ── Fullscreen mode ───────────────────────────────────────────────────────

  describe("fullscreen mode", () => {
    it("renders workout name and in-progress text", () => {
      renderHeader({ isFullscreen: true });

      expect(screen.getByText("Test Workout")).toBeInTheDocument();
      expect(screen.getByText("runner.inProgress")).toBeInTheDocument();
    });

    it("does not render back link", () => {
      renderHeader({ isFullscreen: true });

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("does not render settings button", () => {
      renderHeader({ isFullscreen: true });

      expect(
        screen.queryByRole("button", { name: "runner.settings" })
      ).not.toBeInTheDocument();
    });

    it("renders shrink icon for exit fullscreen", () => {
      renderHeader({ isFullscreen: true });

      expect(screen.getByTestId("shrink-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("expand-icon")).not.toBeInTheDocument();
    });

    it("renders exit fullscreen button with aria-label", () => {
      renderHeader({ isFullscreen: true });

      const exitBtn = screen.getByRole("button", {
        name: "runner.exitFullscreen",
      });
      expect(exitBtn).toBeInTheDocument();
    });

    it("calls onToggleMute in fullscreen", () => {
      const onToggleMute = jest.fn();
      renderHeader({ isFullscreen: true, onToggleMute });

      fireEvent.click(screen.getByTitle("runner.mute"));
      expect(onToggleMute).toHaveBeenCalledTimes(1);
    });

    it("calls onToggleClockVisibility in fullscreen", () => {
      const onToggleClockVisibility = jest.fn();
      renderHeader({ isFullscreen: true, onToggleClockVisibility });

      fireEvent.click(screen.getByTitle("runner.hideClock"));
      expect(onToggleClockVisibility).toHaveBeenCalledTimes(1);
    });

    it("calls onToggleFullscreen in fullscreen", () => {
      const onToggleFullscreen = jest.fn();
      renderHeader({ isFullscreen: true, onToggleFullscreen });

      fireEvent.click(
        screen.getByRole("button", { name: "runner.exitFullscreen" })
      );
      expect(onToggleFullscreen).toHaveBeenCalledTimes(1);
    });

    it("shows muted icon when muted in fullscreen", () => {
      renderHeader({ isFullscreen: true, isMuted: true });

      expect(screen.getByTestId("volumex-icon")).toBeInTheDocument();
    });

    it("shows eye-off icon when clock hidden in fullscreen", () => {
      renderHeader({ isFullscreen: true, isClockVisible: false });

      expect(screen.getByTestId("eyeoff-icon")).toBeInTheDocument();
    });
  });
});

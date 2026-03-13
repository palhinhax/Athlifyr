import { render, screen, fireEvent } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

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
    type?: "button" | "submit" | "reset";
    variant?: string;
    className?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("SocialAuthButtons", () => {
  const defaultProps = {
    onGoogleClick: jest.fn(),
    onAppleClick: jest.fn(),
    googleLabel: "Continue with Google",
    appleLabel: "Continue with Apple",
  };

  it("renders Google and Apple buttons with labels", () => {
    render(<SocialAuthButtons {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /Continue with Google/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Continue with Apple/ })
    ).toBeInTheDocument();
  });

  it("calls onGoogleClick when Google button is clicked", () => {
    render(<SocialAuthButtons {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Continue with Google/ })
    );
    expect(defaultProps.onGoogleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onAppleClick when Apple button is clicked", () => {
    render(<SocialAuthButtons {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Continue with Apple/ })
    );
    expect(defaultProps.onAppleClick).toHaveBeenCalledTimes(1);
  });

  it("disables both buttons when disabled prop is true", () => {
    render(<SocialAuthButtons {...defaultProps} disabled={true} />);

    expect(
      screen.getByRole("button", { name: /Continue with Google/ })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Continue with Apple/ })
    ).toBeDisabled();
  });

  it("disables Google button when isGoogleLoading is true", () => {
    render(<SocialAuthButtons {...defaultProps} isGoogleLoading={true} />);

    expect(
      screen.getByRole("button", { name: /Continue with Google/ })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Continue with Apple/ })
    ).not.toBeDisabled();
  });

  it("disables Apple button when isAppleLoading is true", () => {
    render(<SocialAuthButtons {...defaultProps} isAppleLoading={true} />);

    expect(
      screen.getByRole("button", { name: /Continue with Google/ })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Continue with Apple/ })
    ).toBeDisabled();
  });

  it("both buttons are enabled by default with no loading/disabled props", () => {
    render(<SocialAuthButtons {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /Continue with Google/ })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Continue with Apple/ })
    ).not.toBeDisabled();
  });
});

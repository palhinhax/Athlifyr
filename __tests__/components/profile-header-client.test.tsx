import React from "react";
import { render, screen } from "@testing-library/react";
import { ProfileHeaderClient } from "@/components/profile-header-client";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("@/components/profile-image-upload", () => ({
  ProfileImageUpload: () => <div data-testid="profile-image-upload" />,
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock("lucide-react", () => ({
  Coins: () => <span data-testid="coins-icon" />,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ProfileHeaderClient", () => {
  const defaultProps = {
    user: { name: "Test User", email: "test@example.com", image: null },
    stats: {
      upcomingEvents: 3,
      pastEvents: 7,
      friendsCount: 12,
    },
    participations: [],
    sessionBookings: [],
  };

  it("renders user name and email", () => {
    render(<ProfileHeaderClient {...defaultProps} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders event counts", () => {
    render(<ProfileHeaderClient {...defaultProps} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders friends count", () => {
    render(<ProfileHeaderClient {...defaultProps} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renders profile image upload", () => {
    render(<ProfileHeaderClient {...defaultProps} />);
    expect(screen.getByTestId("profile-image-upload")).toBeInTheDocument();
  });

  it("renders credits link when user has credits", () => {
    render(
      <ProfileHeaderClient
        {...defaultProps}
        stats={{ ...defaultProps.stats, creditBalanceCents: 5000 }}
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/credits");
    expect(screen.getByText("50.00")).toBeInTheDocument();
  });

  it("does not render credits link when balance is zero", () => {
    render(
      <ProfileHeaderClient
        {...defaultProps}
        stats={{ ...defaultProps.stats, creditBalanceCents: 0 }}
      />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not render credits link when creditBalanceCents is undefined", () => {
    render(<ProfileHeaderClient {...defaultProps} />);
    expect(screen.queryByTestId("coins-icon")).not.toBeInTheDocument();
  });
});

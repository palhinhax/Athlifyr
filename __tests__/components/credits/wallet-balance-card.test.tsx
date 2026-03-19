import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WalletBalanceCard } from "@/components/credits/wallet-balance-card";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div>{children}</div>,
  CardTitle: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h3>{children}</h3>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }) => <button {...p}>{children}</button>,
}));

jest.mock("lucide-react", () => ({
  Plus: () => <span data-testid="plus-icon" />,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("WalletBalanceCard", () => {
  const defaultProps = {
    balanceCents: 5000,
    totalTopUpCents: 10000,
    totalSpentCents: 5000,
    totalRewardedCents: 500,
    onTopUp: jest.fn(),
  };

  it("renders wallet balance", () => {
    render(<WalletBalanceCard {...defaultProps} />);
    expect(screen.getByText("50.00")).toBeInTheDocument();
  });

  it("renders top-up, spent, and rewarded amounts", () => {
    render(<WalletBalanceCard {...defaultProps} />);
    expect(screen.getByText("100.00€")).toBeInTheDocument();
    expect(screen.getByText("50.00€")).toBeInTheDocument();
    expect(screen.getByText("5.00")).toBeInTheDocument();
  });

  it("renders add credits button", () => {
    render(<WalletBalanceCard {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /addCredits/i })
    ).toBeInTheDocument();
  });

  it("calls onTopUp when add credits button is clicked", async () => {
    const onTopUp = jest.fn();
    render(<WalletBalanceCard {...defaultProps} onTopUp={onTopUp} />);

    await userEvent.click(screen.getByRole("button", { name: /addCredits/i }));
    expect(onTopUp).toHaveBeenCalledTimes(1);
  });

  it("renders zero balance correctly", () => {
    render(
      <WalletBalanceCard
        {...defaultProps}
        balanceCents={0}
        totalTopUpCents={0}
        totalSpentCents={0}
        totalRewardedCents={0}
      />
    );
    expect(screen.getAllByText("0.00").length).toBeGreaterThanOrEqual(1);
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { WalletPageClient } from "@/components/credits/wallet-page-client";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("@/hooks/use-credits-wallet", () => ({
  useCreditsWallet: jest.fn(),
}));

import { useCreditsWallet } from "@/hooks/use-credits-wallet";
const mockUseCreditsWallet = useCreditsWallet as jest.Mock;

jest.mock("@/components/credits/wallet-balance-card", () => ({
  WalletBalanceCard: (props: Record<string, unknown>) => (
    <div data-testid="wallet-balance-card" data-balance={props.balanceCents} />
  ),
}));

jest.mock("@/components/credits/transaction-history", () => ({
  TransactionHistory: () => <div data-testid="transaction-history" />,
}));

jest.mock("@/components/credits/top-up-dialog", () => ({
  TopUpDialog: () => <div data-testid="top-up-dialog" />,
}));

jest.mock("@/components/credits/credit-legal-disclaimer", () => ({
  CreditLegalDisclaimer: () => <div data-testid="credit-legal-disclaimer" />,
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner" className={className} />
  ),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("WalletPageClient", () => {
  it("renders loading state", () => {
    mockUseCreditsWallet.mockReturnValue({
      wallet: null,
      transactions: [],
      topUpOptions: [],
      isLoading: true,
      isLoadingMore: false,
      hasMore: false,
      error: null,
      loadMore: jest.fn(),
      refresh: jest.fn(),
    });

    render(<WalletPageClient />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseCreditsWallet.mockReturnValue({
      wallet: null,
      transactions: [],
      topUpOptions: [],
      isLoading: false,
      isLoadingMore: false,
      hasMore: false,
      error: "Something went wrong",
      loadMore: jest.fn(),
      refresh: jest.fn(),
    });

    render(<WalletPageClient />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders wallet page with all components", () => {
    mockUseCreditsWallet.mockReturnValue({
      wallet: {
        balanceCents: 5000,
        totalTopUpCents: 10000,
        totalSpentCents: 5000,
        totalRewardedCents: 0,
      },
      transactions: [],
      topUpOptions: [],
      isLoading: false,
      isLoadingMore: false,
      hasMore: false,
      error: null,
      loadMore: jest.fn(),
      refresh: jest.fn(),
    });

    render(<WalletPageClient />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("wallet-balance-card")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-history")).toBeInTheDocument();
    expect(screen.getByTestId("credit-legal-disclaimer")).toBeInTheDocument();
    expect(screen.getByTestId("top-up-dialog")).toBeInTheDocument();
  });

  it("passes zero balance when wallet is null", () => {
    mockUseCreditsWallet.mockReturnValue({
      wallet: null,
      transactions: [],
      topUpOptions: [],
      isLoading: false,
      isLoadingMore: false,
      hasMore: false,
      error: null,
      loadMore: jest.fn(),
      refresh: jest.fn(),
    });

    render(<WalletPageClient />);
    const card = screen.getByTestId("wallet-balance-card");
    expect(card).toHaveAttribute("data-balance", "0");
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionHistory } from "@/components/credits/transaction-history";

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
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner" className={className} />
  ),
}));

jest.mock("lucide-react", () => ({
  ArrowUpRight: () => <span data-testid="icon-up" />,
  ArrowDownLeft: () => <span data-testid="icon-down" />,
  Gift: () => <span data-testid="icon-gift" />,
  Settings2: () => <span data-testid="icon-settings" />,
}));

jest.mock("date-fns", () => ({
  formatDistanceToNow: () => "2 hours ago",
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeTx = (
  overrides: Partial<
    Parameters<typeof TransactionHistory>[0]["transactions"][number]
  > = {}
) => ({
  id: "tx1",
  type: "TOP_UP",
  source: "STRIPE",
  amountCents: 1000,
  balanceAfterCents: 5000,
  description: "Test topup",
  createdAt: "2024-01-15T10:00:00.000Z",
  ...overrides,
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("TransactionHistory", () => {
  it("renders empty state when no transactions", () => {
    render(
      <TransactionHistory
        transactions={[]}
        isLoadingMore={false}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByText("historyEmpty")).toBeInTheDocument();
  });

  it("renders transaction list", () => {
    render(
      <TransactionHistory
        transactions={[
          makeTx(),
          makeTx({ id: "tx2", type: "PURCHASE", amountCents: -500 }),
        ]}
        isLoadingMore={false}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByText("+10.00")).toBeInTheDocument();
    expect(screen.getByText("-5.00")).toBeInTheDocument();
  });

  it("renders transaction description", () => {
    render(
      <TransactionHistory
        transactions={[makeTx({ description: "My top-up" })]}
        isLoadingMore={false}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByText("My top-up")).toBeInTheDocument();
  });

  it("renders load more button when hasMore is true", () => {
    render(
      <TransactionHistory
        transactions={[makeTx()]}
        isLoadingMore={false}
        hasMore={true}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onLoadMore when button is clicked", async () => {
    const onLoadMore = jest.fn();
    render(
      <TransactionHistory
        transactions={[makeTx()]}
        isLoadingMore={false}
        hasMore={true}
        onLoadMore={onLoadMore}
      />
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("shows spinner when loading more", () => {
    render(
      <TransactionHistory
        transactions={[makeTx()]}
        isLoadingMore={true}
        hasMore={true}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders balance after for each transaction", () => {
    render(
      <TransactionHistory
        transactions={[makeTx({ balanceAfterCents: 7500 })]}
        isLoadingMore={false}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByText("75.00")).toBeInTheDocument();
  });

  it("handles null description", () => {
    render(
      <TransactionHistory
        transactions={[makeTx({ description: null })]}
        isLoadingMore={false}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByText("+10.00")).toBeInTheDocument();
  });

  it("renders different icons for transaction types", () => {
    render(
      <TransactionHistory
        transactions={[
          makeTx({ id: "tx1", type: "TOP_UP" }),
          makeTx({ id: "tx2", type: "PURCHASE", amountCents: -200 }),
          makeTx({ id: "tx3", type: "REWARD" }),
          makeTx({ id: "tx4", type: "MANUAL_ADJUSTMENT" }),
        ]}
        isLoadingMore={false}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    // All transaction type labels rendered
    expect(screen.getAllByText(/transactionTypes\./)).toHaveLength(4);
  });
});

import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreditsWallet } from "@/hooks/use-credits-wallet";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

const walletResponse = {
  wallet: {
    balanceCents: 5000,
    totalTopUpCents: 10000,
    totalSpentCents: 5000,
    totalRewardedCents: 0,
  },
};

const transactionsResponse = {
  items: [
    {
      id: "tx1",
      type: "TOP_UP",
      source: "STRIPE_TOP_UP",
      amountCents: 1000,
      balanceAfterCents: 5000,
      description: null,
      grossAmountCents: 1040,
      platformFeeCents: 40,
      netCreditedCents: 1000,
      venueId: null,
      createdAt: "2026-03-16T00:00:00Z",
      expiresAt: null,
    },
  ],
  nextCursor: undefined,
  hasMore: false,
};

const topUpResponse = {
  topUpOptions: [
    { amountCents: 500, feeCents: 20, netCreditsCents: 480 },
    { amountCents: 1000, feeCents: 40, netCreditsCents: 960 },
  ],
};

function setupFetchResponses() {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes("/api/credits/wallet")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(walletResponse),
      });
    }
    if (url.includes("/api/credits/transactions")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(transactionsResponse),
      });
    }
    if (url.includes("/api/credits/top-up")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(topUpResponse),
      });
    }
    return Promise.resolve({ ok: false });
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useCreditsWallet", () => {
  it("starts in loading state", () => {
    setupFetchResponses();
    const { result } = renderHook(() => useCreditsWallet());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.wallet).toBeNull();
    expect(result.current.transactions).toEqual([]);
  });

  it("fetches wallet, transactions, and top-up options on mount", async () => {
    setupFetchResponses();
    const { result } = renderHook(() => useCreditsWallet());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.wallet).toEqual(walletResponse.wallet);
    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.topUpOptions).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it("sets error when wallet fetch fails", async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/credits/wallet")) {
        return Promise.resolve({ ok: false });
      }
      if (url.includes("/api/credits/transactions")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(transactionsResponse),
        });
      }
      if (url.includes("/api/credits/top-up")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(topUpResponse),
        });
      }
      return Promise.resolve({ ok: false });
    });

    const { result } = renderHook(() => useCreditsWallet());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to fetch wallet");
  });

  it("refresh reloads all data", async () => {
    setupFetchResponses();
    const { result } = renderHook(() => useCreditsWallet());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Clear and re-setup
    mockFetch.mockClear();
    setupFetchResponses();

    await act(async () => {
      await result.current.refresh();
    });

    // 3 fetches per refresh: wallet, transactions, top-up
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("loadMore does nothing when hasMore is false", async () => {
    setupFetchResponses();
    const { result } = renderHook(() => useCreditsWallet());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);

    mockFetch.mockClear();

    await act(async () => {
      await result.current.loadMore();
    });

    // Should not fetch since hasMore is false
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("loadMore appends transactions when hasMore is true", async () => {
    // First load returns hasMore=true
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/credits/wallet")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(walletResponse),
        });
      }
      if (url.includes("/api/credits/transactions")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [transactionsResponse.items[0]],
              nextCursor: "cursor_2",
              hasMore: true,
            }),
        });
      }
      if (url.includes("/api/credits/top-up")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(topUpResponse),
        });
      }
      return Promise.resolve({ ok: false });
    });

    const { result } = renderHook(() => useCreditsWallet());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(true);
    expect(result.current.transactions).toHaveLength(1);

    // Mock loadMore to return a second page
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/credits/transactions")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [{ ...transactionsResponse.items[0], id: "tx2" }],
              nextCursor: undefined,
              hasMore: false,
            }),
        });
      }
      return Promise.resolve({ ok: false });
    });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.hasMore).toBe(false);
  });
});

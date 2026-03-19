import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { StripeCheckout } from "@/components/stripe-checkout";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/lib/stripe-client", () => ({
  getStripe: () => null,
}));

jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/checkout-form", () => ({
  CheckoutForm: () => <div data-testid="checkout-form" />,
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <div data-testid="spinner" className={className} />
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

beforeAll(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterAll(() => (console.error as jest.Mock).mockRestore());

// ── Setup ─────────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  globalThis.fetch = mockFetch;
});

const defaultProps = {
  venueId: "v1",
  venueName: "Iron Gym",
  planId: "plan-1",
  planName: "Monthly Plan",
  price: 29.99,
  currency: "EUR",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("StripeCheckout", () => {
  it("shows spinner while loading", () => {
    mockFetch.mockReturnValueOnce(new Promise(() => {})); // never resolves
    render(<StripeCheckout {...defaultProps} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows checkout form after successful one-time payment init", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_test",
        paymentIntent: { id: "pi_1" },
      }),
    });

    render(<StripeCheckout {...defaultProps} />);

    await waitFor(() =>
      expect(screen.getByTestId("checkout-form")).toBeInTheDocument()
    );
  });

  it("shows error when fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Plan not found" }),
    });

    render(<StripeCheckout {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("paymentError")).toBeInTheDocument();
      expect(screen.getByText("Plan not found")).toBeInTheDocument();
    });
  });

  it("calls subscription endpoint for recurring plans", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_sub",
        subscriptionId: "sub_1",
      }),
    });

    render(<StripeCheckout {...defaultProps} duration="MONTHLY" />);

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v1/stripe-subscriptions",
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  it("calls payment-intents endpoint for one-time plans", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        clientSecret: "cs_pi",
        paymentIntent: { id: "pi_1" },
      }),
    });

    render(<StripeCheckout {...defaultProps} />);

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v1/payment-intents",
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  it("shows error message when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<StripeCheckout {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });
});

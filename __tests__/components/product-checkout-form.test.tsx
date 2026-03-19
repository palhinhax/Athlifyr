import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductCheckoutForm } from "@/components/product-checkout-form";

// ── Mocks ─────────────────────────────────────────────────────────────────────

let capturedProps: Record<string, unknown> = {};

jest.mock("@/components/checkout-form", () => ({
  CheckoutForm: (props: Record<string, unknown>) => {
    capturedProps = props;
    return <div data-testid="checkout-form" />;
  },
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ProductCheckoutForm", () => {
  beforeEach(() => {
    capturedProps = {};
  });

  it("renders the CheckoutForm", () => {
    render(<ProductCheckoutForm venueId="v1" purchaseId="p1" />);
    expect(screen.getByTestId("checkout-form")).toBeInTheDocument();
  });

  it("passes the correct confirmEndpoint", () => {
    render(<ProductCheckoutForm venueId="v1" purchaseId="p1" />);
    expect(capturedProps.confirmEndpoint).toBe(
      "/api/venues/v1/purchases/p1/confirm"
    );
  });

  it("passes silentConfirm=true", () => {
    render(<ProductCheckoutForm venueId="v1" purchaseId="p1" />);
    expect(capturedProps.silentConfirm).toBe(true);
  });

  it("passes the correct translationNamespace", () => {
    render(<ProductCheckoutForm venueId="v1" purchaseId="p1" />);
    expect(capturedProps.translationNamespace).toBe("venues.shop.checkout");
  });

  it("forwards onSuccess callback", () => {
    const onSuccess = jest.fn();
    render(
      <ProductCheckoutForm venueId="v1" purchaseId="p1" onSuccess={onSuccess} />
    );
    expect(capturedProps.onSuccess).toBe(onSuccess);
  });

  it("forwards onCancel callback", () => {
    const onCancel = jest.fn();
    render(
      <ProductCheckoutForm venueId="v1" purchaseId="p1" onCancel={onCancel} />
    );
    expect(capturedProps.onCancel).toBe(onCancel);
  });

  it("builds endpoint with different venueId and purchaseId", () => {
    render(
      <ProductCheckoutForm venueId="venue-abc" purchaseId="purchase-xyz" />
    );
    expect(capturedProps.confirmEndpoint).toBe(
      "/api/venues/venue-abc/purchases/purchase-xyz/confirm"
    );
  });
});

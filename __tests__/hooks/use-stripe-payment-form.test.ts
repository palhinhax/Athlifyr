import { renderHook, act } from "@testing-library/react";
import { useStripePaymentForm } from "@/hooks/use-stripe-payment-form";
import type { StripePaymentElementChangeEvent } from "@stripe/stripe-js";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockStripe = { confirmPayment: jest.fn() };
const mockElements = { submit: jest.fn() };

jest.mock("@stripe/react-stripe-js", () => ({
  useStripe: () => mockStripe,
  useElements: () => mockElements,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useStripePaymentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("returns stripe and elements from context", () => {
    const { result } = renderHook(() => useStripePaymentForm());
    expect(result.current.stripe).toBe(mockStripe);
    expect(result.current.elements).toBe(mockElements);
  });

  it("initializes isProcessing to false", () => {
    const { result } = renderHook(() => useStripePaymentForm());
    expect(result.current.isProcessing).toBe(false);
  });

  it("initializes errorMessage to null", () => {
    const { result } = renderHook(() => useStripePaymentForm());
    expect(result.current.errorMessage).toBeNull();
  });

  it("initializes elementReady to false", () => {
    const { result } = renderHook(() => useStripePaymentForm());
    expect(result.current.elementReady).toBe(false);
  });

  it("initializes elementError to false", () => {
    const { result } = renderHook(() => useStripePaymentForm());
    expect(result.current.elementError).toBe(false);
  });

  // ── setIsProcessing ───────────────────────────────────────────────────────

  it("setIsProcessing sets isProcessing to true", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.setIsProcessing(true);
    });

    expect(result.current.isProcessing).toBe(true);
  });

  it("setIsProcessing sets isProcessing back to false", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.setIsProcessing(true);
    });
    act(() => {
      result.current.setIsProcessing(false);
    });

    expect(result.current.isProcessing).toBe(false);
  });

  // ── setErrorMessage ───────────────────────────────────────────────────────

  it("setErrorMessage sets a string error", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.setErrorMessage("Payment failed");
    });

    expect(result.current.errorMessage).toBe("Payment failed");
  });

  it("setErrorMessage clears error when set to null", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.setErrorMessage("Some error");
    });
    act(() => {
      result.current.setErrorMessage(null);
    });

    expect(result.current.errorMessage).toBeNull();
  });

  // ── handleElementReady ────────────────────────────────────────────────────

  it("handleElementReady sets elementReady to true", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.handleElementReady();
    });

    expect(result.current.elementReady).toBe(true);
  });

  it("handleElementReady clears elementError", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    // First set an error
    act(() => {
      result.current.handleElementLoadError("Load failed");
    });
    expect(result.current.elementError).toBe(true);

    // Then signal ready
    act(() => {
      result.current.handleElementReady();
    });

    expect(result.current.elementError).toBe(false);
  });

  it("handleElementReady is stable across re-renders (useCallback)", () => {
    const { result, rerender } = renderHook(() => useStripePaymentForm());
    const firstRef = result.current.handleElementReady;
    rerender();
    expect(result.current.handleElementReady).toBe(firstRef);
  });

  // ── handleElementLoadError ─────────────────────────────────────────────────

  it("handleElementLoadError sets elementError to true", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.handleElementLoadError("Could not load payment element");
    });

    expect(result.current.elementError).toBe(true);
  });

  it("handleElementLoadError sets errorMessage to the passed string", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.handleElementLoadError("Network error");
    });

    expect(result.current.errorMessage).toBe("Network error");
  });

  it("handleElementLoadError is stable across re-renders (useCallback)", () => {
    const { result, rerender } = renderHook(() => useStripePaymentForm());
    const firstRef = result.current.handleElementLoadError;
    rerender();
    expect(result.current.handleElementLoadError).toBe(firstRef);
  });

  // ── handleElementChange ───────────────────────────────────────────────────

  it("handleElementChange clears errorMessage when event.complete is true", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.setErrorMessage("Old error");
    });
    act(() => {
      result.current.handleElementChange({
        complete: true,
      } as StripePaymentElementChangeEvent);
    });

    expect(result.current.errorMessage).toBeNull();
  });

  it("handleElementChange does NOT clear errorMessage when event.complete is false", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.setErrorMessage("Existing error");
    });
    act(() => {
      result.current.handleElementChange({
        complete: false,
      } as StripePaymentElementChangeEvent);
    });

    expect(result.current.errorMessage).toBe("Existing error");
  });

  it("handleElementChange is stable across re-renders (useCallback)", () => {
    const { result, rerender } = renderHook(() => useStripePaymentForm());
    const firstRef = result.current.handleElementChange;
    rerender();
    expect(result.current.handleElementChange).toBe(firstRef);
  });

  // ── Combined flows ─────────────────────────────────────────────────────────

  it("full error-then-recovery flow: load error → ready → change complete", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    // Simulate element failing to load
    act(() => {
      result.current.handleElementLoadError("Stripe unavailable");
    });
    expect(result.current.elementError).toBe(true);
    expect(result.current.errorMessage).toBe("Stripe unavailable");
    expect(result.current.elementReady).toBe(false);

    // Element retries and becomes ready
    act(() => {
      result.current.handleElementReady();
    });
    expect(result.current.elementReady).toBe(true);
    expect(result.current.elementError).toBe(false);
    expect(result.current.errorMessage).toBe("Stripe unavailable"); // not cleared by ready

    // User fills the form; event.complete fires
    act(() => {
      result.current.handleElementChange({
        complete: true,
      } as StripePaymentElementChangeEvent);
    });
    expect(result.current.errorMessage).toBeNull();
  });

  it("processing flow: setIsProcessing true, then reset on error", () => {
    const { result } = renderHook(() => useStripePaymentForm());

    act(() => {
      result.current.setIsProcessing(true);
    });
    expect(result.current.isProcessing).toBe(true);

    // Simulate Stripe returning an error
    act(() => {
      result.current.setIsProcessing(false);
      result.current.setErrorMessage("Card declined");
    });
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.errorMessage).toBe("Card declined");
  });
});

import { renderHook, act } from "@testing-library/react";
import { useAppleAuth } from "@/hooks/use-apple-auth";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockSignIn = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useAppleAuth", () => {
  it("initializes with isLoading false", () => {
    const { result } = renderHook(() => useAppleAuth());
    expect(result.current.isLoading).toBe(false);
  });

  it("calls signIn with apple provider and callbackUrl", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAppleAuth());

    await act(async () => {
      await result.current.signInWithApple("/dashboard");
    });

    expect(mockSignIn).toHaveBeenCalledWith("apple", {
      callbackUrl: "/dashboard",
    });
  });

  it("uses default callbackUrl when none provided", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAppleAuth());

    await act(async () => {
      await result.current.signInWithApple();
    });

    expect(mockSignIn).toHaveBeenCalledWith("apple", { callbackUrl: "/" });
  });

  it("sets isLoading to true during sign in", async () => {
    let resolveSignIn: () => void;
    mockSignIn.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveSignIn = resolve;
      })
    );

    const { result } = renderHook(() => useAppleAuth());

    expect(result.current.isLoading).toBe(false);

    let signInPromise: Promise<void>;
    act(() => {
      signInPromise = result.current.signInWithApple();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveSignIn!();
      await signInPromise!;
    });
  });

  it("resets isLoading and rethrows on error", async () => {
    const error = new Error("Sign in failed");
    mockSignIn.mockRejectedValue(error);

    const { result } = renderHook(() => useAppleAuth());

    await expect(
      act(async () => {
        await result.current.signInWithApple();
      })
    ).rejects.toThrow("Sign in failed");

    expect(result.current.isLoading).toBe(false);
  });
});

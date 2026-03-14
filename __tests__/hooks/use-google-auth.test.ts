import { renderHook, act } from "@testing-library/react";
import { useGoogleAuth } from "@/hooks/use-google-auth";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockSignIn = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.NEXT_PUBLIC_GOOGLE_AUTH_METHOD;
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useGoogleAuth", () => {
  it("initializes with isLoading false", () => {
    const { result } = renderHook(() => useGoogleAuth());
    expect(result.current.isLoading).toBe(false);
  });

  it("defaults authMethod to nextauth", () => {
    const { result } = renderHook(() => useGoogleAuth());
    expect(result.current.authMethod).toBe("nextauth");
  });

  describe("NextAuth method (default)", () => {
    it("calls signIn with google provider and callbackUrl", async () => {
      mockSignIn.mockResolvedValue(undefined);
      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle("/dashboard");
      });

      expect(mockSignIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/dashboard",
      });
    });

    it("uses default callbackUrl when none provided", async () => {
      mockSignIn.mockResolvedValue(undefined);
      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });
    });

    it("sets isLoading to true during sign in", async () => {
      let resolveSignIn: () => void;
      mockSignIn.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveSignIn = resolve;
        })
      );

      const { result } = renderHook(() => useGoogleAuth());
      expect(result.current.isLoading).toBe(false);

      let signInPromise: Promise<void>;
      act(() => {
        signInPromise = result.current.signInWithGoogle();
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

      const { result } = renderHook(() => useGoogleAuth());

      await expect(
        act(async () => {
          await result.current.signInWithGoogle();
        })
      ).rejects.toThrow("Failed to sign in with Google");

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("REST API method", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_METHOD = "rest-api";
    });

    afterEach(() => {
      delete process.env.NEXT_PUBLIC_GOOGLE_AUTH_METHOD;
    });

    it("sets authMethod to rest-api from env", () => {
      const { result } = renderHook(() => useGoogleAuth());
      expect(result.current.authMethod).toBe("rest-api");
    });

    it("fetches auth URL from backend for redirect", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ authUrl: "https://accounts.google.com/oauth" }),
      });
      global.fetch = mockFetch;

      const { result } = renderHook(() => useGoogleAuth());

      // signInWithGoogle will set location.href which triggers jsdom navigation
      // We just need to verify the fetch call was made correctly
      try {
        await act(async () => {
          await result.current.signInWithGoogle();
        });
      } catch {
        // jsdom may throw on location.href assignment - that's expected
      }

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/google-web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAuthUrl" }),
      });
    });

    it("throws on fetch failure", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      global.fetch = mockFetch;

      const { result } = renderHook(() => useGoogleAuth());

      await expect(
        act(async () => {
          await result.current.signInWithGoogle();
        })
      ).rejects.toThrow("Failed to sign in with Google");

      expect(result.current.isLoading).toBe(false);
    });

    it("throws on network error", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useGoogleAuth());

      await expect(
        act(async () => {
          await result.current.signInWithGoogle();
        })
      ).rejects.toThrow("Failed to sign in with Google");

      expect(result.current.isLoading).toBe(false);
    });
  });
});

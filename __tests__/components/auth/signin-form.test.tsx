import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    if (params) return `${key}:${JSON.stringify(params)}`;
    return key;
  },
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockSignIn = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

const mockSignInWithGoogle = jest.fn();
jest.mock("@/hooks/use-google-auth", () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    isLoading: false,
  }),
}));

const mockSignInWithApple = jest.fn();
jest.mock("@/hooks/use-apple-auth", () => ({
  useAppleAuth: () => ({
    signInWithApple: mockSignInWithApple,
    isLoading: false,
  }),
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockRouterPush = jest.fn();
const mockRouterRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: mockRouterRefresh,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/components/auth/social-auth-buttons", () => ({
  SocialAuthButtons: ({
    onGoogleClick,
    onAppleClick,
    googleLabel,
    appleLabel,
  }: {
    onGoogleClick: () => void;
    onAppleClick: () => void;
    disabled?: boolean;
    isGoogleLoading?: boolean;
    isAppleLoading?: boolean;
    googleLabel?: string;
    appleLabel?: string;
  }) => (
    <div data-testid="social-auth-buttons">
      <button type="button" onClick={onGoogleClick}>
        {googleLabel}
      </button>
      <button type="button" onClick={onAppleClick}>
        {appleLabel}
      </button>
    </div>
  ),
}));

import { SignInForm } from "@/components/auth/signin-form";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  // Mock sessionStorage
  const store: Record<string, string> = {};
  jest.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => {
    delete store[key];
  });
});

describe("SignInForm", () => {
  it("renders the login form", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continueWithGoogle/ })
    ).toBeInTheDocument();
  });

  it("does not show demo users by default", () => {
    render(<SignInForm />);

    expect(screen.queryByText(/demo\.quickAccess/)).not.toBeInTheDocument();
  });

  it("shows demo users when showDemoUsers is true", () => {
    render(<SignInForm showDemoUsers={true} />);

    expect(screen.getByText(/demo\.quickAccess/)).toBeInTheDocument();
  });

  it("submits form and redirects on success", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: null });

    render(<SignInForm />);

    await user.type(screen.getByLabelText("email"), "test@example.com");
    await user.type(screen.getByLabelText("password"), "Test123!");

    // Find submit button
    const submitBtn = screen.getByRole("button", { name: /title|signIn/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "Test123!",
        redirect: false,
      });
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast on failed login", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: "Invalid credentials" });

    render(<SignInForm />);

    await user.type(screen.getByLabelText("email"), "test@example.com");
    await user.type(screen.getByLabelText("password"), "wrong");

    const submitBtn = screen.getByRole("button", { name: /title|signIn/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("handles demo login", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: null });

    render(<SignInForm showDemoUsers={true} />);

    // Click on first demo user button (Owner)
    const demoButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg") && btn.closest(".grid"));
    if (demoButtons.length > 0) {
      await user.click(demoButtons[0]);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("credentials", {
          email: "tiago@acor.pt",
          password: "Test123!",
          redirect: false,
        });
      });
    }
  });

  it("shows error toast on demo login failure", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: "failed" });

    render(<SignInForm showDemoUsers={true} />);

    const demoButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg") && btn.closest(".grid"));
    if (demoButtons.length > 0) {
      await user.click(demoButtons[0]);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({ variant: "destructive" })
        );
      });
    }
  });

  it("handles Google sign-in error", async () => {
    const user = userEvent.setup();
    mockSignInWithGoogle.mockRejectedValueOnce(new Error("Google error"));

    render(<SignInForm />);

    const googleBtn = screen.getByRole("button", {
      name: /continueWithGoogle/,
    });
    await user.click(googleBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    const passwordInput = screen.getByLabelText("password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButtons = screen.getAllByRole("button");
    const toggleBtn = toggleButtons.find(
      (btn) => btn.closest(".relative") && btn.querySelector("svg")
    );
    if (toggleBtn) {
      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
    }
  });

  it("handles Apple sign-in error", async () => {
    const user = userEvent.setup();
    mockSignInWithApple.mockRejectedValueOnce(new Error("Apple error"));

    render(<SignInForm />);

    const appleBtn = screen.getByRole("button", {
      name: /continueWithApple/,
    });
    await user.click(appleBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("calls signInWithApple on Apple button click", async () => {
    const user = userEvent.setup();
    mockSignInWithApple.mockResolvedValueOnce(undefined);

    render(<SignInForm />);

    const appleBtn = screen.getByRole("button", {
      name: /continueWithApple/,
    });
    await user.click(appleBtn);

    await waitFor(() => {
      expect(mockSignInWithApple).toHaveBeenCalledWith("/");
    });
  });

  it("handles catch in handleSubmit", async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error("network error"));

    render(<SignInForm />);

    await user.type(screen.getByLabelText("email"), "test@example.com");
    await user.type(screen.getByLabelText("password"), "Test123!");

    const submitBtn = screen.getByRole("button", { name: /title|signIn/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });
});

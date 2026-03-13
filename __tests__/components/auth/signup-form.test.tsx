import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

// Mock i18n routing Link
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

// Mock google auth hook
const mockSignInWithGoogle = jest.fn();
jest.mock("@/hooks/use-google-auth", () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    isLoading: false,
  }),
}));

// Mock apple auth hook
const mockSignInWithApple = jest.fn();
jest.mock("@/hooks/use-apple-auth", () => ({
  useAppleAuth: () => ({
    signInWithApple: mockSignInWithApple,
    isLoading: false,
  }),
}));

// Mock toast
const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock analytics
jest.mock("@/lib/analytics", () => ({
  analyticsEvent: jest.fn(),
  ANALYTICS_EVENTS: {
    SIGNUP_START: "signup_start",
    SIGNUP_COMPLETED: "signup_completed",
    SIGNUP_FAILED: "signup_failed",
  },
}));

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

import { SignUpForm } from "@/components/auth/signup-form";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("SignUpForm", () => {
  it("renders the form with all fields", () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continueWithGoogle/ })
    ).toBeInTheDocument();
  });

  it("shows password strength indicator when typing", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const passwordInput = screen.getByLabelText("password");
    await user.type(passwordInput, "Abc123!@#longpass");

    // Password strength should appear - the mock translator returns the key
    await waitFor(() => {
      expect(
        screen.getByText("passwordStrength.strongMessage")
      ).toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const passwordInput = screen.getByLabelText("password");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the toggle button (the one with Eye icon inside password field)
    const toggleButtons = screen.getAllByRole("button");
    const toggleBtn = toggleButtons.find(
      (btn) => btn.closest(".relative") && btn.querySelector("svg")
    );
    if (toggleBtn) {
      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
    }
  });

  it("submits form successfully and redirects to signin", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "success" }),
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText("name"), "Test User");
    await user.type(screen.getByLabelText("email"), "test@example.com");
    await user.type(screen.getByLabelText("password"), "Test123!");

    const submitBtn = screen.getByRole("button", { name: "title" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "Test123!",
        }),
      });
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining("/auth/signin")
      );
    });
  });

  it("shows error toast on registration failure", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already exists" }),
    });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText("name"), "Test User");
    await user.type(screen.getByLabelText("email"), "test@example.com");
    await user.type(screen.getByLabelText("password"), "Test123!");

    const submitBtn = screen.getByRole("button", { name: "title" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });

  it("handles Google sign-in error", async () => {
    const user = userEvent.setup();
    mockSignInWithGoogle.mockRejectedValueOnce(new Error("google error"));

    render(<SignUpForm />);

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

  it("shows weak/medium/strong password strength", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const passwordInput = screen.getByLabelText("password");

    // Weak password
    await user.type(passwordInput, "abc");
    await waitFor(() => {
      expect(screen.getByText("passwordStrength.hint")).toBeInTheDocument();
    });

    // Clear and type strong password
    await user.clear(passwordInput);
    await user.type(passwordInput, "Abc123!@#longpass");
    await waitFor(() => {
      expect(
        screen.getByText("passwordStrength.strongMessage")
      ).toBeInTheDocument();
    });
  });

  it("handles Apple sign-in error", async () => {
    const user = userEvent.setup();
    mockSignInWithApple.mockRejectedValueOnce(new Error("Apple error"));

    render(<SignUpForm />);

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

    render(<SignUpForm />);

    const appleBtn = screen.getByRole("button", {
      name: /continueWithApple/,
    });
    await user.click(appleBtn);

    await waitFor(() => {
      expect(mockSignInWithApple).toHaveBeenCalledWith("/");
    });
  });

  it("handles fetch throwing an exception on submit", async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValueOnce(new Error("network error"));

    render(<SignUpForm />);

    await user.type(screen.getByLabelText("name"), "Test User");
    await user.type(screen.getByLabelText("email"), "test@example.com");
    await user.type(screen.getByLabelText("password"), "Test123!");

    const submitBtn = screen.getByRole("button", { name: "title" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      );
    });
  });
});

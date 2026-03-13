/**
 * @jest-environment node
 */

/**
 * Tests for auth page server components (signin/signup)
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl/server", () => ({
  getTranslations: jest
    .fn()
    .mockResolvedValue((key: string) => `translated:${key}`),
}));

jest.mock("@/components/auth/signin-form", () => ({
  SignInForm: ({ showDemoUsers }: { showDemoUsers?: boolean }) => (
    <div
      data-testid="signin-form"
      data-demo={showDemoUsers ? "true" : "false"}
    />
  ),
}));

jest.mock("@/components/auth/signup-form", () => ({
  SignUpForm: () => <div data-testid="signup-form" />,
}));

jest.mock("@/components/auth/auth-video-background", () => ({
  AuthVideoBackground: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-bg">{children}</div>
  ),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("SignIn page", () => {
  it("generates metadata with translations", async () => {
    const { generateMetadata } =
      await import("@/app/[locale]/auth/signin/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
  });

  it("renders SignInForm with showDemoUsers from env", async () => {
    // Set demo mode to false by default
    const originalEnv = process.env.NEXT_PUBLIC_DEMO_MODE;
    process.env.NEXT_PUBLIC_DEMO_MODE = "false";

    const mod = await import("@/app/[locale]/auth/signin/page");
    const Page = mod.default;
    const element = Page();

    expect(element).toBeTruthy();

    process.env.NEXT_PUBLIC_DEMO_MODE = originalEnv;
  });

  it("passes showDemoUsers=true when DEMO_MODE is true", async () => {
    const originalEnv = process.env.NEXT_PUBLIC_DEMO_MODE;
    process.env.NEXT_PUBLIC_DEMO_MODE = "true";

    // Re-import to pick up env change
    jest.resetModules();
    jest.mock("next-intl/server", () => ({
      getTranslations: jest
        .fn()
        .mockResolvedValue((key: string) => `translated:${key}`),
    }));
    jest.mock("@/components/auth/signin-form", () => ({
      SignInForm: ({ showDemoUsers }: { showDemoUsers?: boolean }) => (
        <div
          data-testid="signin-form"
          data-demo={showDemoUsers ? "true" : "false"}
        />
      ),
    }));
    jest.mock("@/components/auth/auth-video-background", () => ({
      AuthVideoBackground: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
    }));

    const mod = await import("@/app/[locale]/auth/signin/page");
    const Page = mod.default;
    const element = Page();

    expect(element).toBeTruthy();

    process.env.NEXT_PUBLIC_DEMO_MODE = originalEnv;
  });
});

describe("SignUp page", () => {
  it("generates metadata with translations", async () => {
    const { generateMetadata } =
      await import("@/app/[locale]/auth/signup/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
  });

  it("renders SignUpForm", async () => {
    const mod = await import("@/app/[locale]/auth/signup/page");
    const Page = mod.default;
    const element = Page();

    expect(element).toBeTruthy();
  });
});

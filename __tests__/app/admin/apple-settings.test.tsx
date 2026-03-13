import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: string;
    className?: string;
    size?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  CardDescription: ({ children, ...props }: { children: React.ReactNode }) => (
    <p {...props}>{children}</p>
  ),
  CardHeader: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  CardTitle: ({ children, ...props }: { children: React.ReactNode }) => (
    <h2 {...props}>{children}</h2>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  } & React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props}>{children}</label>
  ),
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}));

jest.mock("@/components/ui/alert", () => ({
  Alert: ({
    children,
    variant,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <div role="alert" data-variant={variant} {...props}>
      {children}
    </div>
  ),
  AlertDescription: ({ children, ...props }: { children: React.ReactNode }) => (
    <span {...props}>{children}</span>
  ),
  AlertTitle: ({ children, ...props }: { children: React.ReactNode }) => (
    <strong {...props}>{children}</strong>
  ),
}));

jest.mock("lucide-react", () => ({
  Apple: () => <span data-testid="apple-icon" />,
  Copy: () => <span data-testid="copy-icon" />,
  Check: () => <span data-testid="check-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
  AlertTriangle: () => <span data-testid="alert-icon" />,
  Shield: () => <span data-testid="shield-icon" />,
  Info: () => <span data-testid="info-icon" />,
}));

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

const mockClipboard = { writeText: jest.fn().mockResolvedValue(undefined) };
Object.assign(navigator, { clipboard: mockClipboard });

import AdminAppleSettingsPage from "@/app/[locale]/admin/apple-settings/page";

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("AdminAppleSettingsPage", () => {
  it("renders title and info sections", () => {
    render(<AdminAppleSettingsPage />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("form.title")).toBeInTheDocument();
    expect(screen.getByText("info.title")).toBeInTheDocument();
  });

  it("renders form fields with default values", () => {
    render(<AdminAppleSettingsPage />);

    const keyIdInput = screen.getByDisplayValue("M2MVUK46V5");
    const teamIdInput = screen.getByDisplayValue("DKK4H2SAU4");
    const clientIdInput = screen.getByDisplayValue("com.athlifyr.web");

    expect(keyIdInput).toBeInTheDocument();
    expect(teamIdInput).toBeInTheDocument();
    expect(clientIdInput).toBeInTheDocument();
  });

  it("disables generate button when privateKey is empty", () => {
    render(<AdminAppleSettingsPage />);

    const generateBtn = screen.getByRole("button", { name: /form\.generate/ });
    expect(generateBtn).toBeDisabled();
  });

  it("enables generate button when all fields are filled", () => {
    render(<AdminAppleSettingsPage />);

    fireEvent.change(screen.getByPlaceholderText(/BEGIN PRIVATE KEY/), {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----",
      },
    });

    const generateBtn = screen.getByRole("button", { name: /form\.generate/ });
    expect(generateBtn).not.toBeDisabled();
  });

  it("calls API and shows generated secret on success", async () => {
    jest.useRealTimers();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        secret: "generated-jwt-secret",
        expiresAt: "2026-09-10T00:00:00Z",
      }),
    });

    render(<AdminAppleSettingsPage />);

    fireEvent.change(screen.getByPlaceholderText(/BEGIN PRIVATE KEY/), {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /form\.generate/ }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/apple-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("privateKey"),
      });
    });

    await waitFor(() => {
      expect(screen.getByText("result.title")).toBeInTheDocument();
    });
  });

  it("shows error on API failure", async () => {
    jest.useRealTimers();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid key" }),
    });

    render(<AdminAppleSettingsPage />);

    fireEvent.change(screen.getByPlaceholderText(/BEGIN PRIVATE KEY/), {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /form\.generate/ }));

    await waitFor(() => {
      expect(screen.getByText("Invalid key")).toBeInTheDocument();
    });
  });

  it("shows generic error on fetch exception", async () => {
    jest.useRealTimers();
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AdminAppleSettingsPage />);

    fireEvent.change(screen.getByPlaceholderText(/BEGIN PRIVATE KEY/), {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /form\.generate/ }));

    await waitFor(() => {
      expect(screen.getByText("form.errors.generic")).toBeInTheDocument();
    });
  });

  it("copies secret to clipboard", async () => {
    jest.useRealTimers();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        secret: "generated-jwt-secret",
        expiresAt: "2026-09-10T00:00:00Z",
      }),
    });

    render(<AdminAppleSettingsPage />);

    fireEvent.change(screen.getByPlaceholderText(/BEGIN PRIVATE KEY/), {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /form\.generate/ }));

    await waitFor(() => {
      expect(screen.getByText("result.title")).toBeInTheDocument();
    });

    const copyBtn = screen.getByRole("button", { name: /result\.copy/ });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        "generated-jwt-secret"
      );
    });
  });

  it("updates field values on change", () => {
    render(<AdminAppleSettingsPage />);

    const keyIdInput = screen.getByDisplayValue("M2MVUK46V5");
    fireEvent.change(keyIdInput, { target: { value: "NEW_KEY_ID" } });
    expect(screen.getByDisplayValue("NEW_KEY_ID")).toBeInTheDocument();

    const teamIdInput = screen.getByDisplayValue("DKK4H2SAU4");
    fireEvent.change(teamIdInput, { target: { value: "NEW_TEAM_ID" } });
    expect(screen.getByDisplayValue("NEW_TEAM_ID")).toBeInTheDocument();
  });
});

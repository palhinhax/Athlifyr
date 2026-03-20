import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EasyBookFormDialog } from "@/components/easy-book/easy-book-form-dialog";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      type={type as "button" | "submit"}
      disabled={disabled}
    >
      {children}
    </button>
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
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

jest.mock("lucide-react", () => ({
  Loader2: ({ className }: { className?: string }) => (
    <span data-testid="loader" className={className} />
  ),
  Calendar: ({ className }: { className?: string }) => (
    <span data-testid="icon-calendar" className={className} />
  ),
  Clock: ({ className }: { className?: string }) => (
    <span data-testid="icon-clock" className={className} />
  ),
  User: ({ className }: { className?: string }) => (
    <span data-testid="icon-user" className={className} />
  ),
}));

// ── Test data ──────────────────────────────────────────────────────────────

const defaultSession = {
  id: "s_1",
  title: "Morning WOD",
  startsAt: "2025-06-15T09:00:00.000Z",
  endsAt: "2025-06-15T10:00:00.000Z",
};

const defaultUser = {
  id: "u_1",
  name: "João",
  email: "joao@test.com",
  hasActiveSubscription: true,
  isMember: true,
};

const mockOnOpenChange = jest.fn();
const mockOnSuccess = jest.fn();

function renderDialog(
  overrides: Partial<Parameters<typeof EasyBookFormDialog>[0]> = {}
) {
  return render(
    <EasyBookFormDialog
      open={true}
      onOpenChange={mockOnOpenChange}
      venueId="v_1"
      venueName="CrossFit Lisboa"
      session={defaultSession}
      locale="en"
      user={defaultUser}
      onSuccess={mockOnSuccess}
      {...overrides}
    />
  );
}

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe("EasyBookFormDialog", () => {
  it("renders nothing when session is null", () => {
    const { container } = renderDialog({ session: null });
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when dialog is closed", () => {
    const { container } = renderDialog({ open: false });
    expect(container.innerHTML).toBe("");
  });

  it("renders dialog title and venue name", () => {
    renderDialog();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("CrossFit Lisboa")).toBeInTheDocument();
  });

  it("renders session info", () => {
    renderDialog();
    expect(screen.getByText("Morning WOD")).toBeInTheDocument();
  });

  it("renders logged-in user info and hides guest fields", () => {
    renderDialog();
    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("joao@test.com")).toBeInTheDocument();
    // Guest fields should NOT be shown
    expect(screen.queryByLabelText("name")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("email")).not.toBeInTheDocument();
  });

  it("renders guest form fields when user is null", () => {
    renderDialog({ user: null });
    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("phone")).toBeInTheDocument();
  });

  it("shows user email when user has no name", () => {
    renderDialog({
      user: { ...defaultUser, name: null },
    });
    // email shown as display name
    expect(screen.getAllByText("joao@test.com").length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("validates required fields for guest booking", () => {
    renderDialog({ user: null });

    const form = screen.getByText("confirmBooking").closest("form")!;
    fireEvent.submit(form);

    // Validation errors should appear
    const errors = screen.getAllByText("required");
    expect(errors.length).toBe(3); // name, email, phone
  });

  it("validates email format for guest booking", () => {
    renderDialog({ user: null });

    const nameInput = screen.getByLabelText("name");
    const emailInput = screen.getByLabelText("email");
    const phoneInput = screen.getByLabelText("phone");

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "invalid" } });
    fireEvent.change(phoneInput, { target: { value: "+351912345678" } });

    const form = screen.getByText("confirmBooking").closest("form")!;
    fireEvent.submit(form);

    expect(screen.getByText("invalidEmail")).toBeInTheDocument();
  });

  it("submits booking for logged-in user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderDialog();

    const submitBtn = screen.getByText("confirmBooking");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v_1/sessions/s_1/book",
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "success" })
    );
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("submits guest booking with form data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderDialog({ user: null });

    fireEvent.change(screen.getByLabelText("name"), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "maria@test.com" },
    });
    fireEvent.change(screen.getByLabelText("phone"), {
      target: { value: "+351912345678" },
    });

    fireEvent.click(screen.getByText("confirmBooking"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/venues/v_1/sessions/s_1/easy-book",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            guestName: "Maria",
            guestEmail: "maria@test.com",
            guestPhone: "+351912345678",
          }),
        })
      );
    });
  });

  it("handles SESSION_FULL error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ reason: "SESSION_FULL" }),
    });

    renderDialog();

    fireEvent.click(screen.getByText("confirmBooking"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "error",
          variant: "destructive",
        })
      );
    });
  });

  it("handles ALREADY_BOOKED error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ reason: "ALREADY_BOOKED" }),
    });

    renderDialog();

    fireEvent.click(screen.getByText("confirmBooking"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "error",
          variant: "destructive",
        })
      );
    });
  });

  it("handles generic API error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    renderDialog();

    fireEvent.click(screen.getByText("confirmBooking"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "error",
          description: "Network error",
          variant: "destructive",
        })
      );
    });
  });

  it("handles non-Error exception", async () => {
    mockFetch.mockRejectedValueOnce("unexpected");

    renderDialog();

    fireEvent.click(screen.getByText("confirmBooking"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "error",
          description: "errorDescription",
          variant: "destructive",
        })
      );
    });
  });

  it("calls onOpenChange when cancel button is clicked", () => {
    renderDialog();

    fireEvent.click(screen.getByText("cancel"));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});

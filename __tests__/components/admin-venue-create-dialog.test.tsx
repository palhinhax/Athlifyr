import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminVenueCreateDialog } from "@/components/admin/admin-venue-create-dialog";

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  toast: (...args: unknown[]) => mockToast(...args),
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
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode;
    onValueChange?: (v: string) => void;
    value?: string;
  }) => (
    <div data-testid="select" data-value={value}>
      {children}
      {onValueChange && (
        <input
          data-testid="select-hidden"
          type="hidden"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
      )}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children: React.ReactNode; id?: string }) => (
    <div>{children}</div>
  ),
  SelectValue: () => <span />,
}));

jest.mock("lucide-react", () => ({
  Loader2: ({ className }: { className?: string }) => (
    <span data-testid="loader" className={className} />
  ),
}));

// ── Helpers ────────────────────────────────────────────────────────────────

const mockOnOpenChange = jest.fn();
const mockOnSuccess = jest.fn();

function renderDialog(
  overrides: Partial<Parameters<typeof AdminVenueCreateDialog>[0]> = {}
) {
  return render(
    <AdminVenueCreateDialog
      open={true}
      onOpenChange={mockOnOpenChange}
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

describe("AdminVenueCreateDialog", () => {
  it("renders nothing when dialog is closed", () => {
    const { container } = renderDialog({ open: false });
    expect(container.innerHTML).toBe("");
  });

  it("renders dialog title and description", () => {
    renderDialog();
    expect(screen.getByText("Criar Novo Venue")).toBeInTheDocument();
    expect(
      screen.getByText("Preenche os dados para criar um novo venue")
    ).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    renderDialog();
    expect(screen.getByLabelText("Nome *")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Slug (gerado automaticamente)")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Morada *")).toBeInTheDocument();
    expect(screen.getByLabelText("Cidade *")).toBeInTheDocument();
    expect(screen.getByLabelText("País *")).toBeInTheDocument();
    expect(screen.getByLabelText("Latitude")).toBeInTheDocument();
    expect(screen.getByLabelText("Longitude")).toBeInTheDocument();
  });

  it("auto-generates slug from name", () => {
    renderDialog();
    const nameInput = screen.getByLabelText("Nome *");
    fireEvent.change(nameInput, {
      target: { value: "CrossFit Lisboa Norte" },
    });
    const slugInput = screen.getByLabelText("Slug (gerado automaticamente)");
    expect(slugInput).toHaveValue("crossfit-lisboa-norte");
  });

  it("generates slug with accents removed", () => {
    renderDialog();
    const nameInput = screen.getByLabelText("Nome *");
    fireEvent.change(nameInput, {
      target: { value: "Ginásio São João" },
    });
    const slugInput = screen.getByLabelText("Slug (gerado automaticamente)");
    expect(slugInput).toHaveValue("ginasio-sao-joao");
  });

  it("generates slug collapsing multiple dashes", () => {
    renderDialog();
    const nameInput = screen.getByLabelText("Nome *");
    fireEvent.change(nameInput, {
      target: { value: "Test -- Venue !!" },
    });
    const slugInput = screen.getByLabelText("Slug (gerado automaticamente)");
    expect(slugInput).toHaveValue("test-venue");
  });

  it("slug field is disabled", () => {
    renderDialog();
    const slugInput = screen.getByLabelText("Slug (gerado automaticamente)");
    expect(slugInput).toBeDisabled();
  });

  it("submits form successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "v_new" }),
    });

    renderDialog();

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Test Gym" },
    });
    fireEvent.change(screen.getByLabelText("Morada *"), {
      target: { value: "Rua ABC 1" },
    });
    fireEvent.change(screen.getByLabelText("Cidade *"), {
      target: { value: "Lisboa" },
    });
    fireEvent.change(screen.getByLabelText("Latitude"), {
      target: { value: "38.72" },
    });
    fireEvent.change(screen.getByLabelText("Longitude"), {
      target: { value: "-9.14" },
    });

    const form = screen.getByText("Criar Venue").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/admin/venues",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("Test Gym"),
        })
      );
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Sucesso",
      })
    );
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("sends null for empty latitude/longitude", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "v_new" }),
    });

    renderDialog();

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Test" },
    });

    const form = screen.getByText("Criar Venue").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.latitude).toBeNull();
    expect(body.longitude).toBeNull();
  });

  it("shows error toast on API failure with custom message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Slug already exists" }),
    });

    renderDialog();

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Test" },
    });

    const form = screen.getByText("Criar Venue").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Erro",
          description: "Slug already exists",
          variant: "destructive",
        })
      );
    });
  });

  it("shows error toast on API failure without custom message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    renderDialog();

    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Test" },
    });

    const form = screen.getByText("Criar Venue").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Erro",
          description: "Failed to create venue",
          variant: "destructive",
        })
      );
    });
  });

  it("shows error toast on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    renderDialog();

    const form = screen.getByText("Criar Venue").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Erro",
          description: "Network error",
          variant: "destructive",
        })
      );
    });
  });

  it("shows generic error for non-Error exception", async () => {
    mockFetch.mockRejectedValueOnce("unexpected");

    renderDialog();

    const form = screen.getByText("Criar Venue").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Erro",
          description: "Erro ao criar venue",
          variant: "destructive",
        })
      );
    });
  });

  it("resets form and calls onOpenChange when cancel is clicked", () => {
    renderDialog();

    // Type something first
    fireEvent.change(screen.getByLabelText("Nome *"), {
      target: { value: "Something" },
    });

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("updates address, city, country fields", () => {
    renderDialog();

    const addressInput = screen.getByLabelText("Morada *");
    fireEvent.change(addressInput, { target: { value: "Rua Nova 10" } });
    expect(addressInput).toHaveValue("Rua Nova 10");

    const cityInput = screen.getByLabelText("Cidade *");
    fireEvent.change(cityInput, { target: { value: "Porto" } });
    expect(cityInput).toHaveValue("Porto");

    const countryInput = screen.getByLabelText("País *");
    fireEvent.change(countryInput, { target: { value: "Spain" } });
    expect(countryInput).toHaveValue("Spain");
  });

  it("updates description field", () => {
    renderDialog();

    const descInput = screen.getByPlaceholderText("Breve descrição do venue");
    fireEvent.change(descInput, { target: { value: "Best gym" } });
    expect(descInput).toHaveValue("Best gym");
  });

  it("has default country set to Portugal", () => {
    renderDialog();
    const countryInput = screen.getByLabelText("País *");
    expect(countryInput).toHaveValue("Portugal");
  });
});

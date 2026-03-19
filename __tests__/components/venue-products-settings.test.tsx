import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────

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

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>{children}</div>
  ),
  CardContent: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>{children}</div>
  ),
  CardDescription: ({
    children,
    ...p
  }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...p}>{children}</p>,
  CardHeader: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>{children}</div>
  ),
  CardTitle: ({ children, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...p}>{children}</h3>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    variant: _variant,
    size: _size,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }) => <button {...p}>{children}</button>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...p}>{children}</label>
  ),
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant: _variant,
    ...p
  }: React.HTMLAttributes<HTMLSpanElement> & { variant?: string }) => (
    <span {...p}>{children}</span>
  ),
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner" className={className} />
  ),
}));

jest.mock(
  "lucide-react",
  () =>
    new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (typeof prop === "string" && prop !== "__esModule") {
            const Icon = ({ className }: { className?: string }) => (
              <span data-testid={`icon-${prop}`} className={className} />
            );
            Icon.displayName = prop;
            return Icon;
          }
          return undefined;
        },
      }
    )
);

// ── Test data ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: "p1",
    name: "T-Shirt",
    description: "Gym branded tee",
    price: 25.0,
    currency: "EUR",
    stock: 50,
    isActive: true,
  },
  {
    id: "p2",
    name: "Water Bottle",
    description: null,
    price: 10.0,
    currency: "EUR",
    stock: null,
    isActive: true,
  },
  {
    id: "p3",
    name: "Old Towel",
    description: "Discontinued",
    price: 15.0,
    currency: "EUR",
    stock: 0,
    isActive: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

import { VenueProductsSettings } from "@/components/venue-products-settings";

function renderProducts(venueId = "v1") {
  return render(<VenueProductsSettings venueId={venueId} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("VenueProductsSettings", () => {
  // ── Loading state ───────────────────────────────────────────────────────

  it("shows loading spinner on initial render", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderProducts();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  // ── Empty state ─────────────────────────────────────────────────────────

  it("shows empty state when no products", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("empty")).toBeInTheDocument();
    });
    expect(screen.getByText("emptyDescription")).toBeInTheDocument();
  });

  // ── Fetch error ─────────────────────────────────────────────────────────

  it("handles fetch error gracefully", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network fail"));
    renderProducts();

    // Should stop loading eventually (no crash)
    await waitFor(() => {
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });
    errSpy.mockRestore();
  });

  it("handles non-ok response gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    renderProducts();

    await waitFor(() => {
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });
  });

  // ── Product list ────────────────────────────────────────────────────────

  it("renders product list with correct data", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    });
    expect(screen.getByText("Water Bottle")).toBeInTheDocument();
    expect(screen.getByText("Old Towel")).toBeInTheDocument();
  });

  it("displays product prices with currency", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("25.00 EUR")).toBeInTheDocument();
    });
    expect(screen.getByText("10.00 EUR")).toBeInTheDocument();
    expect(screen.getByText("15.00 EUR")).toBeInTheDocument();
  });

  it("shows description for products that have one", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("Gym branded tee")).toBeInTheDocument();
    });
    expect(screen.getByText("Discontinued")).toBeInTheDocument();
  });

  it("shows inactive badge for deactivated products", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("inactive")).toBeInTheDocument();
    });
  });

  it("shows stock count badge", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('stockCount:{"count":50}')).toBeInTheDocument();
    });
    expect(screen.getByText('stockCount:{"count":0}')).toBeInTheDocument();
  });

  it("does not show stock badge when stock is null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [PRODUCTS[1]] }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("Water Bottle")).toBeInTheDocument();
    });
    // Water Bottle has null stock, so no stockCount badge
    expect(screen.queryByText(/stockCount/)).not.toBeInTheDocument();
  });

  it("shows add product button", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });
  });

  // ── Add product form ──────────────────────────────────────────────────

  it("shows add form when add button clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));

    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("price")).toBeInTheDocument();
    expect(screen.getByLabelText("currency")).toBeInTheDocument();
    expect(screen.getByLabelText("descriptionLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("stock")).toBeInTheDocument();
    expect(screen.getByText("save")).toBeInTheDocument();
    expect(screen.getByText("cancel")).toBeInTheDocument();
  });

  it("hides add button when form is open", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));

    // Form title is "addProduct" but the button outside should be gone
    // The form shows, but there's no second add button
    const buttons = screen
      .getAllByRole("button")
      .filter((b) => b.textContent === "addProduct");
    expect(buttons).toHaveLength(0);
  });

  it("closes form when cancel is clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    expect(screen.getByLabelText("name")).toBeInTheDocument();

    await userEvent.click(screen.getByText("cancel"));
    expect(screen.queryByLabelText("name")).not.toBeInTheDocument();
  });

  // ── Save validation ───────────────────────────────────────────────────

  it("shows validation toast when name is empty", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.click(screen.getByText("save"));

    expect(mockToast).toHaveBeenCalledWith({
      title: "validationError",
      description: "nameAndPriceRequired",
      variant: "destructive",
    });
  });

  it("shows validation toast when price is 0", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "Test");
    await userEvent.type(screen.getByLabelText("price"), "0");
    await userEvent.click(screen.getByText("save"));

    expect(mockToast).toHaveBeenCalledWith({
      title: "validationError",
      description: "nameAndPriceRequired",
      variant: "destructive",
    });
  });

  it("shows validation toast when stock is negative", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "Test");
    await userEvent.type(screen.getByLabelText("price"), "10");
    await userEvent.clear(screen.getByLabelText("stock"));
    await userEvent.type(screen.getByLabelText("stock"), "-5");
    await userEvent.click(screen.getByText("save"));

    expect(mockToast).toHaveBeenCalledWith({
      title: "validationError",
      description: "invalidStock",
      variant: "destructive",
    });
  });

  // ── Save product (create) ─────────────────────────────────────────────

  it("creates product with POST on save", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "new" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            products: [
              {
                id: "new",
                name: "Protein Bar",
                description: null,
                price: 5,
                currency: "EUR",
                stock: null,
                isActive: true,
              },
            ],
          }),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "Protein Bar");
    await userEvent.type(screen.getByLabelText("price"), "5");
    await userEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/venues/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Protein Bar",
          description: null,
          price: 5,
          currency: "EUR",
          stock: null,
        }),
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "productCreated",
      variant: "default",
    });
  });

  it("sends stock as integer when provided", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "new" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "Item");
    await userEvent.type(screen.getByLabelText("price"), "10");
    await userEvent.type(screen.getByLabelText("stock"), "20");
    await userEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/venues/v1/products",
        expect.objectContaining({
          body: expect.stringContaining('"stock":20'),
        })
      );
    });
  });

  // ── Save product failure ──────────────────────────────────────────────

  it("shows error toast on save failure", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Duplicate name" }),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "Dup");
    await userEvent.type(screen.getByLabelText("price"), "10");
    await userEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "saveFailed",
        description: "Duplicate name",
        variant: "destructive",
      });
    });
    errSpy.mockRestore();
  });

  it("shows fallback error when save throws non-Error", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      })
      .mockRejectedValueOnce("string error");
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "X");
    await userEvent.type(screen.getByLabelText("price"), "5");
    await userEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "saveFailed",
        description: undefined,
        variant: "destructive",
      });
    });
    errSpy.mockRestore();
  });

  // ── Edit product ──────────────────────────────────────────────────────

  it("populates form when edit button clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: PRODUCTS }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    });

    // Click edit on first product (Pencil icon)
    const editButtons = screen
      .getAllByRole("button")
      .filter(
        (btn) => btn.querySelector('[data-testid="icon-Pencil"]') !== null
      );
    await userEvent.click(editButtons[0]);

    expect(screen.getByLabelText("name")).toHaveValue("T-Shirt");
    expect(screen.getByLabelText("price")).toHaveValue(25);
    expect(screen.getByLabelText("currency")).toHaveValue("EUR");
    expect(screen.getByLabelText("descriptionLabel")).toHaveValue(
      "Gym branded tee"
    );
    expect(screen.getByLabelText("stock")).toHaveValue(50);
  });

  it("sends PATCH when saving in edit mode", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "p1" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    });

    const editButtons = screen
      .getAllByRole("button")
      .filter(
        (btn) => btn.querySelector('[data-testid="icon-Pencil"]') !== null
      );
    await userEvent.click(editButtons[0]);
    await userEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/venues/v1/products/p1",
        expect.objectContaining({ method: "PATCH" })
      );
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "productUpdated",
      variant: "default",
    });
  });

  it("populates empty stock when editing product with null stock", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [PRODUCTS[1]] }), // Water Bottle, stock: null
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("Water Bottle")).toBeInTheDocument();
    });

    const editButtons = screen
      .getAllByRole("button")
      .filter(
        (btn) => btn.querySelector('[data-testid="icon-Pencil"]') !== null
      );
    await userEvent.click(editButtons[0]);

    expect(screen.getByLabelText("stock")).toHaveValue(null);
  });

  // ── Toggle active/deactivate ──────────────────────────────────────────

  it("deactivates an active product with DELETE", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      })
      .mockResolvedValueOnce({ ok: true }) // DELETE
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    });

    // Click the Trash2/RotateCcw button for the first active product
    const toggleButtons = screen
      .getAllByRole("button")
      .filter(
        (btn) =>
          btn.querySelector('[data-testid="icon-Trash2"]') !== null ||
          btn.querySelector('[data-testid="icon-RotateCcw"]') !== null
      );
    // First active product toggle → Trash2
    const deactivateBtn = toggleButtons.find(
      (btn) => btn.querySelector('[data-testid="icon-Trash2"]') !== null
    );
    await userEvent.click(deactivateBtn!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/venues/v1/products/p1", {
        method: "DELETE",
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "productDeactivated",
      variant: "default",
    });
  });

  it("reactivates an inactive product with PATCH", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      })
      .mockResolvedValueOnce({ ok: true }) // PATCH
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("Old Towel")).toBeInTheDocument();
    });

    const reactivateBtn = screen
      .getAllByRole("button")
      .find(
        (btn) => btn.querySelector('[data-testid="icon-RotateCcw"]') !== null
      );
    await userEvent.click(reactivateBtn!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/venues/v1/products/p3", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "productReactivated",
      variant: "default",
    });
  });

  it("shows error toast when toggle fails", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      })
      .mockResolvedValueOnce({ ok: false }); // DELETE fails
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    });

    const deactivateBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector('[data-testid="icon-Trash2"]') !== null);
    await userEvent.click(deactivateBtn!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "saveFailed",
        variant: "destructive",
      });
    });
    errSpy.mockRestore();
  });

  it("shows error toast when toggle throws", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: PRODUCTS }),
      })
      .mockRejectedValueOnce(new Error("Network"));
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    });

    const deactivateBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector('[data-testid="icon-Trash2"]') !== null);
    await userEvent.click(deactivateBtn!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "saveFailed",
        variant: "destructive",
      });
    });
    errSpy.mockRestore();
  });

  it("uses fallback error message when API response has no error field", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "X");
    await userEvent.type(screen.getByLabelText("price"), "5");
    await userEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "saveFailed",
        description: "saveFailed",
        variant: "destructive",
      });
    });
    errSpy.mockRestore();
  });

  it("shows error toast when reactivate fails with !ok response", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [PRODUCTS[2]] }), // Old Towel (inactive)
      })
      .mockResolvedValueOnce({ ok: false }); // PATCH fails
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("Old Towel")).toBeInTheDocument();
    });

    const reactivateBtn = screen
      .getAllByRole("button")
      .find(
        (btn) => btn.querySelector('[data-testid="icon-RotateCcw"]') !== null
      );
    await userEvent.click(reactivateBtn!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "saveFailed",
        variant: "destructive",
      });
    });
    errSpy.mockRestore();
  });

  // ── Fetch url correctness ─────────────────────────────────────────────

  it("fetches products with correct URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    renderProducts("venue-42");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/venues/venue-42/products?all=true"
      );
    });
  });

  // ── Form description with content ─────────────────────────────────────

  it("sends description when provided", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "new" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ products: [] }),
      });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    await userEvent.type(screen.getByLabelText("name"), "Towel");
    await userEvent.type(screen.getByLabelText("price"), "12");
    await userEvent.type(
      screen.getByLabelText("descriptionLabel"),
      "Soft cotton"
    );
    await userEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/venues/v1/products",
        expect.objectContaining({
          body: expect.stringContaining('"description":"Soft cotton"'),
        })
      );
    });
  });

  // ── Currency uppercase ────────────────────────────────────────────────

  it("converts currency to uppercase", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText("addProduct")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("addProduct"));
    const currencyInput = screen.getByLabelText("currency");
    await userEvent.clear(currencyInput);
    await userEvent.type(currencyInput, "usd");
    expect(currencyInput).toHaveValue("USD");
  });
});

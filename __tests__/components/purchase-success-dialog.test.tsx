import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PurchaseSuccessDialog } from "@/components/purchase-success-dialog";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...rest
  }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

// Stub out icon components
jest.mock("lucide-react", () => ({
  CheckCircle2: () => <svg data-testid="check-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
}));

// Mock dialog shell so we only test the content
jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogDescription: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (asChild ? <>{children}</> : <p>{children}</p>),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
  venueName: "Iron Gym",
  venueLogo: null,
  productName: "Protein Shake",
  quantity: 1,
  totalAmount: 12.5,
  currency: "EUR",
  purchasedAt: new Date(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("PurchaseSuccessDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Visibility ─────────────────────────────────────────────────────────────

  it("renders nothing when open=false", () => {
    const { container } = render(
      <PurchaseSuccessDialog {...defaultProps} open={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders dialog when open=true", () => {
    render(<PurchaseSuccessDialog {...defaultProps} />);
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
  });

  // ── Content ────────────────────────────────────────────────────────────────

  it("shows the success title translation key", () => {
    render(<PurchaseSuccessDialog {...defaultProps} />);
    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("shows the check icon", () => {
    render(<PurchaseSuccessDialog {...defaultProps} />);
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("shows the venue name", () => {
    render(<PurchaseSuccessDialog {...defaultProps} venueName="Power Box" />);
    expect(screen.getByText("Power Box")).toBeInTheDocument();
  });

  it("shows the product name", () => {
    render(
      <PurchaseSuccessDialog {...defaultProps} productName="Creatine 300g" />
    );
    expect(screen.getByText("Creatine 300g")).toBeInTheDocument();
  });

  it("shows the formatted total amount and currency", () => {
    render(
      <PurchaseSuccessDialog
        {...defaultProps}
        totalAmount={24.99}
        currency="USD"
      />
    );
    expect(screen.getByText("24.99 USD")).toBeInTheDocument();
  });

  it("shows quantity when greater than 1", () => {
    render(<PurchaseSuccessDialog {...defaultProps} quantity={3} />);
    expect(screen.getByText("x3")).toBeInTheDocument();
  });

  it("does not show quantity label when quantity is 1", () => {
    render(<PurchaseSuccessDialog {...defaultProps} quantity={1} />);
    expect(screen.queryByText("x1")).not.toBeInTheDocument();
  });

  // ── Venue logo ─────────────────────────────────────────────────────────────

  it("renders venue logo image when venueLogo is provided", () => {
    render(
      <PurchaseSuccessDialog
        {...defaultProps}
        venueLogo="https://example.com/logo.png"
        venueName="Gym A"
      />
    );
    const img = screen.getByAltText("Gym A");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/logo.png");
  });

  it("renders letter avatar fallback when venueLogo is null", () => {
    render(
      <PurchaseSuccessDialog
        {...defaultProps}
        venueLogo={null}
        venueName="Power Gym"
      />
    );
    // Should show the initial letter P
    expect(screen.getByText("P")).toBeInTheDocument();
  });

  it("renders letter avatar fallback when venueLogo is undefined", () => {
    const props = { ...defaultProps, venueName: "Zenith" };
    // venueLogo defaults to undefined from parent
    render(<PurchaseSuccessDialog {...props} venueLogo={undefined} />);
    expect(screen.getByText("Z")).toBeInTheDocument();
  });

  // ── Close button ───────────────────────────────────────────────────────────

  it("calls onOpenChange(false) when close button clicked", async () => {
    const onOpenChange = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <PurchaseSuccessDialog {...defaultProps} onOpenChange={onOpenChange} />
    );

    await user.click(screen.getByText("close"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Elapsed timer ──────────────────────────────────────────────────────────

  it("shows 00:00 elapsed immediately when purchasedAt is now", () => {
    render(
      <PurchaseSuccessDialog {...defaultProps} purchasedAt={new Date()} />
    );
    expect(screen.getByText(/elapsed 00:00/)).toBeInTheDocument();
  });

  it("updates the elapsed timer after 1 second", () => {
    render(
      <PurchaseSuccessDialog {...defaultProps} purchasedAt={new Date()} />
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/elapsed 00:01/)).toBeInTheDocument();
  });

  it("updates the elapsed timer after 61 seconds (shows minutes)", () => {
    render(
      <PurchaseSuccessDialog {...defaultProps} purchasedAt={new Date()} />
    );

    act(() => {
      jest.advanceTimersByTime(61000);
    });

    expect(screen.getByText(/elapsed 01:01/)).toBeInTheDocument();
  });

  it("resets elapsed to 00:00 when closed (purchasedAt becomes null)", () => {
    const { rerender } = render(
      <PurchaseSuccessDialog {...defaultProps} purchasedAt={new Date()} />
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Close the dialog by reopening with purchasedAt null
    rerender(
      <PurchaseSuccessDialog
        {...defaultProps}
        open={false}
        purchasedAt={null}
      />
    );

    // Reopen
    rerender(
      <PurchaseSuccessDialog
        {...defaultProps}
        open={true}
        purchasedAt={new Date()}
      />
    );

    expect(screen.getByText(/elapsed 00:00/)).toBeInTheDocument();
  });

  it("shows 00:00 when purchasedAt is null", () => {
    render(<PurchaseSuccessDialog {...defaultProps} purchasedAt={null} />);
    expect(screen.getByText(/elapsed 00:00/)).toBeInTheDocument();
  });

  it("cleans up the interval on unmount", () => {
    const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval");
    const { unmount } = render(
      <PurchaseSuccessDialog {...defaultProps} purchasedAt={new Date()} />
    );
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});

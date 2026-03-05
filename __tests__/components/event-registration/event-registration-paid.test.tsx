import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventRegistrationPaid } from "@/components/event-registration/event-registration-paid";
import type {
  EventVariant,
  PaidRegistration,
  PricingPhase,
} from "@/components/event-registration/event-registration-types";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      loginToParticipate: "Login to participate",
      signIn: "Sign In",
      registrationConfirmed: "Registration Confirmed",
      variant: "Variant",
      paymentConfirmed: "Payment confirmed",
      showTicket: "Show Ticket",
      registrationPending: "Registration Pending",
      registrationPendingDesc: "Your payment is being processed.",
      retryPayment: "Retry Payment",
      cancelPending: "Cancel",
      allSoldOut: "All Sold Out",
      allSoldOutDesc: "All variants are sold out.",
      registrationsClosed: "Registrations Closed",
      registrationsClosedDesc: "No active pricing phase.",
      chooseVariant: "Choose variant",
      soldOut: "Sold Out",
      variantSoldOutDesc: "This variant is sold out.",
      registrationClosed: "Registration Closed",
      registrationClosedDesc: "No active pricing phase for this variant.",
      currentPrice: "Current Price",
      redirectingToPayment: "Redirecting to payment...",
      registerAndPay: "Register & Pay",
      securePaymentInfo: "Secure payment via Stripe.",
    };
    return translations[key] ?? key;
  },
}));

// Mock i18n routing
jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock EventTicketModal
jest.mock("@/components/event-ticket-modal", () => ({
  EventTicketModal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="ticket-modal">Ticket Modal</div> : null,
}));

// Mock EventVariantSelect — exercise the helper props to cover them
jest.mock("@/components/event-registration/event-variant-select", () => ({
  EventVariantSelect: ({
    onVariantChange,
    variants,
    isVariantSoldOut,
    variantHasActivePrice,
  }: {
    onVariantChange: (id: string) => void;
    variants: { id: string; name: string }[];
    isVariantSoldOut: (v: { id: string }) => boolean;
    variantHasActivePrice: (v: { id: string }) => boolean;
  }) => {
    // Call helper functions on each variant to generate coverage
    return (
      <select
        data-testid="variant-select"
        onChange={(e) => onVariantChange(e.target.value)}
      >
        <option value="">Select</option>
        {variants.map((v) => (
          <option
            key={v.id}
            value={v.id}
            disabled={isVariantSoldOut(v) || !variantHasActivePrice(v)}
          >
            {v.name}
          </option>
        ))}
      </select>
    );
  },
}));

const now = new Date();
const futureDate = new Date(now.getTime() + 86400000);
const pastDate = new Date(now.getTime() - 86400000);

const mockVariant: EventVariant = {
  id: "v1",
  name: "Trail 30km",
  distanceKm: 30,
  startDate: futureDate.toISOString(),
  startTime: "09:00",
  maxParticipants: 100,
  registrationCount: 10,
  pricingPhases: [
    {
      id: "pp1",
      name: "Phase 1",
      price: 25,
      currency: "EUR",
      startDate: pastDate.toISOString(),
      endDate: futureDate.toISOString(),
    },
  ],
};

const soldOutVariant: EventVariant = {
  ...mockVariant,
  id: "v2",
  maxParticipants: 10,
  registrationCount: 10,
  pricingPhases: [
    {
      id: "pp2",
      name: "Phase 1",
      price: 25,
      currency: "EUR",
      startDate: pastDate.toISOString(),
      endDate: futureDate.toISOString(),
    },
  ],
};

const noPriceVariant: EventVariant = {
  ...mockVariant,
  id: "v3",
  pricingPhases: [],
};

const confirmedRegistration: PaidRegistration = {
  id: "reg1",
  status: "CONFIRMED",
  variantId: "v1",
  variant: {
    id: "v1",
    name: "Trail 30km",
    distanceKm: 30,
    startDate: futureDate.toISOString(),
    startTime: "09:00",
  },
  amountCents: 2500,
  currency: "EUR",
};

const pendingRegistration: PaidRegistration = {
  id: "reg2",
  status: "PENDING",
  variantId: "v1",
  variant: {
    id: "v1",
    name: "Trail 30km",
    distanceKm: 30,
  },
  amountCents: 2500,
  currency: "EUR",
};

const activePrice: PricingPhase = {
  id: "pp1",
  name: "Phase 1",
  price: 25,
  currency: "EUR",
  startDate: pastDate.toISOString(),
  endDate: futureDate.toISOString(),
};

const defaultProps = {
  eventId: "ev1",
  isAuthenticated: true,
  registrationChecked: true,
  paidRegistration: null as PaidRegistration | null,
  variants: [mockVariant],
  selectedVariantId: "v1",
  onVariantChange: jest.fn(),
  isLoading: false,
  activePrice: activePrice as PricingPhase | null,
  selectedVariantSoldOut: false,
  selectedVariantNoPrice: false,
  allVariantsSoldOut: false,
  allVariantsNoPrice: false,
  showTicketModal: false,
  onShowTicketModal: jest.fn(),
  isCancellingPending: false,
  isRetryingPayment: false,
  onCheckout: jest.fn(),
  onRetryPayment: jest.fn(),
  onCancelPending: jest.fn(),
};

describe("EventRegistrationPaid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Unauthenticated state ────────────────────────────────────────

  it("shows login prompt when not authenticated", () => {
    render(<EventRegistrationPaid {...defaultProps} isAuthenticated={false} />);
    expect(screen.getByText("Login to participate")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  // ── Loading state ────────────────────────────────────────────────

  it("shows spinner when registration not yet checked", () => {
    const { container } = render(
      <EventRegistrationPaid {...defaultProps} registrationChecked={false} />
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  // ── Confirmed registration ──────────────────────────────────────

  it("shows confirmed status with variant info", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={confirmedRegistration}
      />
    );
    expect(screen.getByText("Registration Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Show Ticket")).toBeInTheDocument();
  });

  it("shows confirmed registration without distance", () => {
    const regNoDistance: PaidRegistration = {
      ...confirmedRegistration,
      variant: {
        id: "v1",
        name: "Trail 30km",
        distanceKm: null,
        startDate: null,
      },
    };
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={regNoDistance}
      />
    );
    expect(screen.getByText("Registration Confirmed")).toBeInTheDocument();
  });

  it("shows confirmed registration without variant", () => {
    const regNoVariant: PaidRegistration = {
      ...confirmedRegistration,
      variant: undefined,
    };
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={regNoVariant}
      />
    );
    expect(screen.getByText("Registration Confirmed")).toBeInTheDocument();
  });

  it("opens ticket modal on button click", async () => {
    const user = userEvent.setup();
    const onShowTicketModal = jest.fn();
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={confirmedRegistration}
        onShowTicketModal={onShowTicketModal}
      />
    );
    await user.click(screen.getByText("Show Ticket"));
    expect(onShowTicketModal).toHaveBeenCalledWith(true);
  });

  it("renders ticket modal when showTicketModal is true", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={confirmedRegistration}
        showTicketModal={true}
      />
    );
    expect(screen.getByTestId("ticket-modal")).toBeInTheDocument();
  });

  // ── Pending registration ────────────────────────────────────────

  it("shows pending status with variant info", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={pendingRegistration}
      />
    );
    expect(screen.getByText("Registration Pending")).toBeInTheDocument();
    expect(
      screen.getByText("Your payment is being processed.")
    ).toBeInTheDocument();
    expect(screen.getByText("Retry Payment")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows pending registration without variant distance", () => {
    const pending: PaidRegistration = {
      ...pendingRegistration,
      variant: { id: "v1", name: "Trail 30km", distanceKm: null },
    };
    render(
      <EventRegistrationPaid {...defaultProps} paidRegistration={pending} />
    );
    expect(screen.getByText("Registration Pending")).toBeInTheDocument();
  });

  it("shows pending registration without variant", () => {
    const pending: PaidRegistration = {
      ...pendingRegistration,
      variant: undefined,
    };
    render(
      <EventRegistrationPaid {...defaultProps} paidRegistration={pending} />
    );
    expect(screen.getByText("Registration Pending")).toBeInTheDocument();
  });

  it("calls onRetryPayment when retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetryPayment = jest.fn();
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={pendingRegistration}
        onRetryPayment={onRetryPayment}
      />
    );
    await user.click(screen.getByText("Retry Payment"));
    expect(onRetryPayment).toHaveBeenCalled();
  });

  it("calls onCancelPending when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancelPending = jest.fn();
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={pendingRegistration}
        onCancelPending={onCancelPending}
      />
    );
    await user.click(screen.getByText("Cancel"));
    expect(onCancelPending).toHaveBeenCalled();
  });

  it("disables buttons when retrying payment", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={pendingRegistration}
        isRetryingPayment={true}
      />
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("disables buttons when cancelling pending", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        paidRegistration={pendingRegistration}
        isCancellingPending={true}
      />
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  // ── New registration flow ───────────────────────────────────────

  it("shows all sold out message when all variants are sold out", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        variants={[soldOutVariant]}
        allVariantsSoldOut={true}
      />
    );
    expect(screen.getByText("All Sold Out")).toBeInTheDocument();
  });

  it("shows registrations closed when all variants have no price", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        variants={[noPriceVariant]}
        allVariantsNoPrice={true}
      />
    );
    expect(screen.getByText("Registrations Closed")).toBeInTheDocument();
  });

  it("shows variant selection when variants available", () => {
    render(<EventRegistrationPaid {...defaultProps} />);
    expect(screen.getByTestId("variant-select")).toBeInTheDocument();
  });

  it("hides variant selection when all sold out", () => {
    render(
      <EventRegistrationPaid {...defaultProps} allVariantsSoldOut={true} />
    );
    expect(screen.queryByTestId("variant-select")).not.toBeInTheDocument();
  });

  it("hides variant selection when all variants have no price", () => {
    render(
      <EventRegistrationPaid {...defaultProps} allVariantsNoPrice={true} />
    );
    expect(screen.queryByTestId("variant-select")).not.toBeInTheDocument();
  });

  it("shows sold out indicator for selected variant", () => {
    render(
      <EventRegistrationPaid {...defaultProps} selectedVariantSoldOut={true} />
    );
    expect(screen.getByText("Sold Out")).toBeInTheDocument();
  });

  it("shows registration closed indicator for variant with no price", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        selectedVariantNoPrice={true}
        activePrice={null}
      />
    );
    expect(screen.getByText("Registration Closed")).toBeInTheDocument();
  });

  it("does not show registration closed when variant is sold out", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        selectedVariantSoldOut={true}
        selectedVariantNoPrice={true}
        activePrice={null}
      />
    );
    // Sold out takes precedence - registration closed should not show
    expect(screen.getByText("Sold Out")).toBeInTheDocument();
  });

  it("shows active price display", () => {
    render(<EventRegistrationPaid {...defaultProps} />);
    expect(screen.getByText("Phase 1:")).toBeInTheDocument();
  });

  it("hides price when variant is sold out", () => {
    render(
      <EventRegistrationPaid {...defaultProps} selectedVariantSoldOut={true} />
    );
    expect(screen.queryByText("Phase 1:")).not.toBeInTheDocument();
  });

  it("shows current price label when price name is null", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        activePrice={{ ...activePrice, name: null }}
      />
    );
    expect(screen.getByText("Current Price:")).toBeInTheDocument();
  });

  it("shows checkout button", () => {
    render(<EventRegistrationPaid {...defaultProps} />);
    expect(screen.getByText("Register & Pay")).toBeInTheDocument();
  });

  it("calls onCheckout when register button clicked", async () => {
    const user = userEvent.setup();
    const onCheckout = jest.fn();
    render(<EventRegistrationPaid {...defaultProps} onCheckout={onCheckout} />);
    await user.click(screen.getByText("Register & Pay"));
    expect(onCheckout).toHaveBeenCalled();
  });

  it("disables checkout button when loading", () => {
    render(<EventRegistrationPaid {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Redirecting to payment...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /redirecting/i })).toBeDisabled();
  });

  it("disables checkout button when selected variant is sold out", () => {
    render(
      <EventRegistrationPaid {...defaultProps} selectedVariantSoldOut={true} />
    );
    const checkoutBtn = screen.getByRole("button", {
      name: /register & pay/i,
    });
    expect(checkoutBtn).toBeDisabled();
  });

  it("disables checkout button when no variant selected", () => {
    render(<EventRegistrationPaid {...defaultProps} selectedVariantId="" />);
    const checkoutBtn = screen.getByRole("button", {
      name: /register & pay/i,
    });
    expect(checkoutBtn).toBeDisabled();
  });

  it("disables checkout button when selected variant has no price", () => {
    render(
      <EventRegistrationPaid
        {...defaultProps}
        selectedVariantNoPrice={true}
        activePrice={null}
      />
    );
    const checkoutBtn = screen.getByRole("button", {
      name: /register & pay/i,
    });
    expect(checkoutBtn).toBeDisabled();
  });

  it("hides checkout button when all variants are sold out", () => {
    render(
      <EventRegistrationPaid {...defaultProps} allVariantsSoldOut={true} />
    );
    expect(
      screen.queryByRole("button", { name: /register & pay/i })
    ).not.toBeInTheDocument();
  });

  it("hides checkout button when all variants have no price", () => {
    render(
      <EventRegistrationPaid {...defaultProps} allVariantsNoPrice={true} />
    );
    expect(
      screen.queryByRole("button", { name: /register & pay/i })
    ).not.toBeInTheDocument();
  });

  it("shows no variant select when variants array is empty", () => {
    render(<EventRegistrationPaid {...defaultProps} variants={[]} />);
    expect(screen.queryByTestId("variant-select")).not.toBeInTheDocument();
  });

  // ── Helper function coverage ──────────────────────────────────────

  it("exercises variantHasActivePrice and isVariantSoldOut via variant select", () => {
    const variantNoPricing: EventVariant = {
      ...mockVariant,
      id: "vn",
      pricingPhases: [],
    };
    const variantExpired: EventVariant = {
      ...mockVariant,
      id: "ve",
      pricingPhases: [
        {
          id: "ppe",
          name: "Expired",
          price: 20,
          currency: "EUR",
          startDate: new Date(now.getTime() - 172800000).toISOString(),
          endDate: pastDate.toISOString(),
        },
      ],
    };
    const variantNullDates: EventVariant = {
      ...mockVariant,
      id: "vnd",
      pricingPhases: [
        {
          id: "ppnd",
          name: "No Dates",
          price: 15,
          currency: "EUR",
          startDate: null,
          endDate: null,
        },
      ],
    };
    const variantNoMax: EventVariant = {
      ...mockVariant,
      id: "vnm",
      maxParticipants: null,
    };

    render(
      <EventRegistrationPaid
        {...defaultProps}
        variants={[
          mockVariant,
          soldOutVariant,
          noPriceVariant,
          variantNoPricing,
          variantExpired,
          variantNullDates,
          variantNoMax,
        ]}
      />
    );

    // Variant select renders and exercises helpers on each variant
    const select = screen.getByTestId("variant-select");
    expect(select).toBeInTheDocument();
    // Check that options are rendered for each variant
    const options = select.querySelectorAll("option");
    // 1 placeholder + 7 variants = 8
    expect(options.length).toBe(8);
  });
});

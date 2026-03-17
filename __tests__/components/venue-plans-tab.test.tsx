import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenuePlansTab } from "@/components/venue-plans-tab";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    variant: _v,
    size: _s,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }) => <button {...p}>{children}</button>,
}));

jest.mock("lucide-react", () => ({
  Trash2: () => <svg data-testid="trash-icon" />,
  CheckCircle: () => <svg data-testid="check-circle" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  AlertCircle: () => <svg data-testid="alert-circle" />,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const FUTURE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
const PAST = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();
const NOW_MINUS_1H = new Date(Date.now() - 1000 * 60 * 60).toISOString();

const basePlan = {
  id: "plan-1",
  name: "Gold Plan",
  description: "Best plan",
  price: 50,
  currency: "EUR",
  isActive: true,
  subscriptions: [],
};

const baseProps = {
  plans: [],
  crossVenueSubscriptions: [],
  venueId: "v1",
  locale: "en",
  userId: "u1",
  isOwnerOrAdmin: false,
  onSubscribeClick: jest.fn(),
  onCancelSubscription: jest.fn(),
  onCreatePlan: jest.fn(),
  onEditPlan: jest.fn(),
  onTogglePlanActive: jest.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("VenuePlansTab", () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Empty state ─────────────────────────────────────────────────────────────

  it("shows empty state when no plans", () => {
    render(<VenuePlansTab {...baseProps} />);
    expect(screen.getByText("noPlansAvailable")).toBeInTheDocument();
  });

  it("shows createFirstPlan hint in empty state for owners", () => {
    render(<VenuePlansTab {...baseProps} isOwnerOrAdmin />);
    expect(screen.getByText("createFirstPlan")).toBeInTheDocument();
  });

  it("does not show createFirstPlan hint for non-owners", () => {
    render(<VenuePlansTab {...baseProps} isOwnerOrAdmin={false} />);
    expect(screen.queryByText("createFirstPlan")).not.toBeInTheDocument();
  });

  it("shows create plan button for owners", () => {
    render(<VenuePlansTab {...baseProps} isOwnerOrAdmin />);
    expect(screen.getByText("createPlan")).toBeInTheDocument();
  });

  it("does not show create plan button for non-owners", () => {
    render(<VenuePlansTab {...baseProps} />);
    expect(screen.queryByText("createPlan")).not.toBeInTheDocument();
  });

  it("calls onCreatePlan when button clicked", async () => {
    const onCreatePlan = jest.fn();
    render(
      <VenuePlansTab
        {...baseProps}
        isOwnerOrAdmin
        onCreatePlan={onCreatePlan}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("createPlan"));
    expect(onCreatePlan).toHaveBeenCalledTimes(1);
  });

  // ── Plan cards ──────────────────────────────────────────────────────────────

  it("renders plan name and description", () => {
    render(<VenuePlansTab {...baseProps} plans={[basePlan]} />);
    expect(screen.getByText("Gold Plan")).toBeInTheDocument();
    expect(screen.getByText("Best plan")).toBeInTheDocument();
  });

  it("shows price with currency", () => {
    render(<VenuePlansTab {...baseProps} plans={[basePlan]} />);
    expect(screen.getByText(/50.*EUR/)).toBeInTheDocument();
  });

  it("shows inactive badge when plan is inactive", () => {
    render(
      <VenuePlansTab
        {...baseProps}
        plans={[{ ...basePlan, isActive: false }]}
      />
    );
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("shows edit button for owners", () => {
    render(<VenuePlansTab {...baseProps} plans={[basePlan]} isOwnerOrAdmin />);
    expect(screen.getByText("edit")).toBeInTheDocument();
  });

  it("calls onEditPlan when edit button clicked", async () => {
    const onEditPlan = jest.fn();
    render(
      <VenuePlansTab
        {...baseProps}
        plans={[basePlan]}
        isOwnerOrAdmin
        onEditPlan={onEditPlan}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("edit"));
    expect(onEditPlan).toHaveBeenCalledWith(basePlan);
  });

  it("calls onTogglePlanActive when deactivate button clicked", async () => {
    const onTogglePlanActive = jest.fn();
    render(
      <VenuePlansTab
        {...baseProps}
        plans={[basePlan]}
        isOwnerOrAdmin
        onTogglePlanActive={onTogglePlanActive}
      />
    );
    const user = userEvent.setup();
    // Active plan shows trash icon button
    await user.click(screen.getByTestId("trash-icon").closest("button")!);
    expect(onTogglePlanActive).toHaveBeenCalledWith("plan-1");
  });

  it("shows Reactivate text for inactive plans", () => {
    render(
      <VenuePlansTab
        {...baseProps}
        plans={[{ ...basePlan, isActive: false }]}
        isOwnerOrAdmin
      />
    );
    expect(screen.getByText("Reactivate")).toBeInTheDocument();
  });

  // ── Subscribe button (no subscriptions) ────────────────────────────────────

  it("shows subscribe button when plan has no subscriptions", () => {
    render(<VenuePlansTab {...baseProps} plans={[basePlan]} />);
    expect(screen.getByText("subscribe")).toBeInTheDocument();
  });

  it("calls onSubscribeClick when subscribe button clicked", async () => {
    const onSubscribeClick = jest.fn();
    render(
      <VenuePlansTab
        {...baseProps}
        plans={[basePlan]}
        onSubscribeClick={onSubscribeClick}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("subscribe"));
    expect(onSubscribeClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "plan-1", name: "Gold Plan" })
    );
  });

  it("subscribe button is disabled when no userId", () => {
    render(
      <VenuePlansTab {...baseProps} plans={[basePlan]} userId={undefined} />
    );
    expect(screen.getByText("subscribe")).toBeDisabled();
  });

  // ── Active subscription ─────────────────────────────────────────────────────

  it("shows subscribed status for active subscription", () => {
    const plan = {
      ...basePlan,
      subscriptions: [
        {
          id: "sub-1",
          status: "ACTIVE",
          paymentStatus: "PAID",
          startsAt: NOW_MINUS_1H,
          endsAt: FUTURE,
          createdAt: NOW_MINUS_1H,
        },
      ],
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    expect(screen.getByText("subscribed")).toBeInTheDocument();
  });

  it("shows cancel subscription button for active stripe subscription", () => {
    const plan = {
      ...basePlan,
      subscriptions: [
        {
          id: "sub-1",
          status: "ACTIVE",
          paymentStatus: "PAID",
          startsAt: NOW_MINUS_1H,
          endsAt: FUTURE,
          createdAt: NOW_MINUS_1H,
          stripeSubscriptionId: "stripe_sub_123",
        },
      ],
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    expect(screen.getByText("cancelSubscription")).toBeInTheDocument();
  });

  it("calls onCancelSubscription when cancel is clicked", async () => {
    const onCancelSubscription = jest.fn();
    const plan = {
      ...basePlan,
      subscriptions: [
        {
          id: "sub-1",
          status: "ACTIVE",
          paymentStatus: "PAID",
          startsAt: NOW_MINUS_1H,
          endsAt: FUTURE,
          createdAt: NOW_MINUS_1H,
          stripeSubscriptionId: "stripe_sub_123",
        },
      ],
    };
    render(
      <VenuePlansTab
        {...baseProps}
        plans={[plan]}
        onCancelSubscription={onCancelSubscription}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("cancelSubscription"));
    expect(onCancelSubscription).toHaveBeenCalledWith("sub-1");
  });

  // ── CANCELLING status ───────────────────────────────────────────────────────

  it("shows subscriptionEnding for CANCELLING status", () => {
    const plan = {
      ...basePlan,
      subscriptions: [
        {
          id: "sub-1",
          status: "CANCELLING",
          paymentStatus: "PAID",
          startsAt: NOW_MINUS_1H,
          endsAt: FUTURE,
          createdAt: NOW_MINUS_1H,
        },
      ],
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    expect(screen.getByText("subscriptionEnding")).toBeInTheDocument();
  });

  // ── Exhausted pack ──────────────────────────────────────────────────────────

  it("shows packExhausted when all bookings used", () => {
    const plan = {
      ...basePlan,
      policy: { duration: "ONE_TIME" as const, maxTotalBookings: 5 },
      subscriptions: [
        {
          id: "sub-1",
          status: "ACTIVE",
          paymentStatus: "PAID",
          startsAt: NOW_MINUS_1H,
          endsAt: FUTURE,
          createdAt: NOW_MINUS_1H,
          totalBookingsUsed: 5,
        },
      ],
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    expect(screen.getAllByText("packExhausted").length).toBeGreaterThan(0);
  });

  it("shows resubscribe button when pack exhausted", () => {
    const plan = {
      ...basePlan,
      policy: { duration: "ONE_TIME" as const, maxTotalBookings: 5 },
      subscriptions: [
        {
          id: "sub-1",
          status: "ACTIVE",
          paymentStatus: "PAID",
          startsAt: NOW_MINUS_1H,
          endsAt: FUTURE,
          createdAt: NOW_MINUS_1H,
          totalBookingsUsed: 5,
        },
      ],
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    expect(screen.getByText("resubscribe")).toBeInTheDocument();
  });

  // ── Scheduled subscription ──────────────────────────────────────────────────

  it("shows scheduled status for future subscription", () => {
    const plan = {
      ...basePlan,
      subscriptions: [
        {
          id: "sub-1",
          status: "CREATED",
          paymentStatus: "PENDING",
          startsAt: FUTURE,
          endsAt: null,
          createdAt: NOW_MINUS_1H,
        },
      ],
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    expect(screen.getByText("scheduled")).toBeInTheDocument();
  });

  // ── Plan policy ──────────────────────────────────────────────────────────────

  it("shows policy duration when plan has policy", () => {
    const plan = {
      ...basePlan,
      policy: { duration: "MONTHLY" as const },
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    // tPolicy(`durationType.MONTHLY`) → "durationType.MONTHLY"
    expect(screen.getByText("durationType.MONTHLY")).toBeInTheDocument();
  });

  it("shows billing period suffix for recurring plans", () => {
    const plan = {
      ...basePlan,
      policy: { duration: "MONTHLY" as const },
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    expect(screen.getByText(/perMonth/)).toBeInTheDocument();
  });

  // ── Cross-venue subscriptions ───────────────────────────────────────────────

  it("shows cross-venue subscriptions section", () => {
    const crossSub = {
      id: "cv-1",
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: NOW_MINUS_1H,
      endsAt: FUTURE,
      createdAt: NOW_MINUS_1H,
      plan: {
        id: "p1",
        name: "Premium Multi",
        description: null,
        price: 100,
        currency: "EUR",
        venue: {
          id: "v2",
          name: "Another Gym",
          slug: "another-gym",
          city: null,
          logo: null,
        },
      },
    };
    render(
      <VenuePlansTab {...baseProps} crossVenueSubscriptions={[crossSub]} />
    );
    expect(screen.getByText("crossVenueTitle")).toBeInTheDocument();
    expect(screen.getByText("Premium Multi")).toBeInTheDocument();
  });

  it("shows exhausted icon for exhausted cross-venue subscription", () => {
    const crossSub = {
      id: "cv-1",
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: NOW_MINUS_1H,
      endsAt: FUTURE,
      createdAt: NOW_MINUS_1H,
      totalBookingsUsed: 10,
      plan: {
        id: "p1",
        name: "Pack 10",
        description: null,
        price: 100,
        currency: "EUR",
        policy: { maxTotalBookings: 10, duration: "ONE_TIME" as const },
        venue: {
          id: "v2",
          name: "Other Gym",
          slug: "other-gym",
          city: null,
          logo: null,
        },
      },
    };
    render(
      <VenuePlansTab {...baseProps} crossVenueSubscriptions={[crossSub]} />
    );
    expect(screen.getAllByText("packExhausted").length).toBeGreaterThan(0);
  });

  // ── Expired subscription (fallback subscribe button) ───────────────────────

  it("shows subscribe button when subscription is expired (past endsAt)", () => {
    const plan = {
      ...basePlan,
      subscriptions: [
        {
          id: "sub-1",
          status: "ACTIVE",
          paymentStatus: "PAID",
          startsAt: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 60
          ).toISOString(),
          endsAt: PAST,
          createdAt: PAST,
        },
      ],
    };
    render(<VenuePlansTab {...baseProps} plans={[plan]} />);
    // Expired subscription → no active → fallback subscribe button
    expect(screen.getByText("subscribe")).toBeInTheDocument();
  });
});

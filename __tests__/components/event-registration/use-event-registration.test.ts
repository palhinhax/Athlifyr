import { renderHook, act, waitFor } from "@testing-library/react";
import { useEventRegistration } from "@/components/event-registration/use-event-registration";
import type {
  EventVariant,
  EventRegistrationProps,
} from "@/components/event-registration/event-registration-types";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}(${JSON.stringify(params)})`;
    return key;
  },
}));

// Mock i18n routing
const mockPush = jest.fn();
jest.mock("@/i18n/routing", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock toast
const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock next-auth with controllable session
let mockSession: { data: { user: { id: string } } | null; status: string } = {
  data: { user: { id: "user1" } },
  status: "authenticated",
};
jest.mock("next-auth/react", () => ({
  useSession: () => mockSession,
}));

// Mock next/navigation with controllable searchParams
let mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
}));

// Setup fetch mock
const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

// Mock globalThis.history.replaceState used by search param cleanup
const originalReplaceState = globalThis.history.replaceState;
beforeAll(() => {
  globalThis.history.replaceState = jest.fn();
});

afterAll(() => {
  globalThis.history.replaceState = originalReplaceState;
});

const now = new Date();
const futureDate = new Date(now.getTime() + 86400000);
const pastDate = new Date(now.getTime() - 86400000);

const activeVariant: EventVariant = {
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
  ...activeVariant,
  id: "v2",
  name: "Trail 50km",
  maxParticipants: 10,
  registrationCount: 10,
};

const noPriceVariant: EventVariant = {
  ...activeVariant,
  id: "v3",
  name: "Trail 10km",
  pricingPhases: [],
};

const baseProps: EventRegistrationProps = {
  eventId: "ev1",
  eventSlug: "test-event",
  eventTitle: "Test Event",
  hasRegistrations: true,
  variants: [activeVariant],
  registrationFieldSettings: {},
};

function setupFetchMock() {
  mockFetch.mockImplementation((url: string) => {
    if (typeof url === "string" && url.includes("/custom-fields")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    if (typeof url === "string" && url.includes("/registration/status")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ registration: null }),
      });
    }
    if (typeof url === "string" && url.includes("/participations")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            participations: [],
            counts: { going: 5, interested: 2 },
          }),
      });
    }
    if (typeof url === "string" && url.includes("/api/profile")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            dateOfBirth: null,
            citizenId: null,
            nationality: null,
            emergencyContactName: null,
            emergencyContactPhone: null,
          }),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
}

describe("useEventRegistration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ advanceTimers: true });
    mockSession = {
      data: { user: { id: "user1" } },
      status: "authenticated",
    };
    mockSearchParams = new URLSearchParams();
    setupFetchMock();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Initial state ───────────────────────────────────────────────

  it("returns correct initial state", async () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.userParticipation).toBeNull();
    expect(result.current.state.paidRegistration).toBeNull();
    expect(result.current.state.showShareDialog).toBe(false);
    expect(result.current.state.showConsentDialog).toBe(false);
    expect(result.current.state.showTicketModal).toBe(false);
    expect(result.current.state.isCancellingPending).toBe(false);
    expect(result.current.state.isRetryingPayment).toBe(false);
  });

  // ── Derived state: activePrice ──────────────────────────────────

  it("computes activePrice for selected variant", async () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setSelectedVariantId("v1");
    });

    expect(result.current.derived.activePrice).not.toBeNull();
    expect(result.current.derived.activePrice?.price).toBe(25);
  });

  it("returns null activePrice when no variant selected", () => {
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, variants: [activeVariant] })
    );
    // Initially empty selectedVariantId
    expect(result.current.derived.activePrice).toBeNull();
  });

  it("returns null activePrice for free events", () => {
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, hasRegistrations: false })
    );
    expect(result.current.derived.activePrice).toBeNull();
  });

  // ── Derived state: sold out / no price ──────────────────────────

  it("detects allVariantsSoldOut", () => {
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, variants: [soldOutVariant] })
    );
    expect(result.current.derived.allVariantsSoldOut).toBe(true);
  });

  it("allVariantsSoldOut is false when at least one variant available", () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        variants: [activeVariant, soldOutVariant],
      })
    );
    expect(result.current.derived.allVariantsSoldOut).toBe(false);
  });

  it("detects allVariantsNoPrice", () => {
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, variants: [noPriceVariant] })
    );
    expect(result.current.derived.allVariantsNoPrice).toBe(true);
  });

  it("allVariantsNoPrice is false when at least one variant has price", () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        variants: [activeVariant, noPriceVariant],
      })
    );
    expect(result.current.derived.allVariantsNoPrice).toBe(false);
  });

  it("detects selectedVariantSoldOut", () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        variants: [activeVariant, soldOutVariant],
      })
    );

    act(() => {
      result.current.actions.setSelectedVariantId("v2");
    });

    expect(result.current.derived.selectedVariantSoldOut).toBe(true);
  });

  it("detects selectedVariantNoPrice", () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        variants: [activeVariant, noPriceVariant],
      })
    );

    act(() => {
      result.current.actions.setSelectedVariantId("v3");
    });

    expect(result.current.derived.selectedVariantNoPrice).toBe(true);
  });

  it("selectedVariantSoldOut is false when no variant selected", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));
    expect(result.current.derived.selectedVariantSoldOut).toBe(false);
  });

  it("selectedVariantNoPrice is false when no variant selected", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));
    expect(result.current.derived.selectedVariantNoPrice).toBe(false);
  });

  // ── Derived state: team/consent ─────────────────────────────────

  it("needsConsentOrTeam is false when no fields configured and team size is 1", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));
    expect(result.current.derived.needsConsentOrTeam).toBe(false);
  });

  it("needsConsentOrTeam is true when registration fields configured", () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        registrationFieldSettings: { dateOfBirth: "required" },
      })
    );
    expect(result.current.derived.needsConsentOrTeam).toBe(true);
  });

  it("computes required and optional registration fields", () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        registrationFieldSettings: {
          dateOfBirth: "required",
          citizenId: "optional",
          nationality: "required",
        },
      })
    );
    expect(result.current.derived.requiredRegistrationFields).toEqual(
      expect.arrayContaining(["dateOfBirth", "nationality"])
    );
    expect(result.current.derived.optionalRegistrationFields).toEqual([
      "citizenId",
    ]);
  });

  // ── Action: setSelectedVariantId ────────────────────────────────

  it("updates selected variant", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setSelectedVariantId("v1");
    });

    expect(result.current.state.selectedVariantId).toBe("v1");
  });

  // ── Action: handleCheckout ──────────────────────────────────────

  it("handleCheckout shows toast when no session user", async () => {
    mockSession = { data: null, status: "unauthenticated" };
    const { result } = renderHook(() => useEventRegistration(baseProps));

    await act(async () => {
      await result.current.actions.handleCheckout();
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" })
    );
  });

  it("handleCheckout shows toast when no variant selected", async () => {
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, variants: [activeVariant] })
    );
    // selectedVariantId is "" by default

    await act(async () => {
      await result.current.actions.handleCheckout();
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" })
    );
  });

  it("handleCheckout navigates to register page with variant", async () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setSelectedVariantId("v1");
    });

    await act(async () => {
      await result.current.actions.handleCheckout();
    });

    expect(mockPush).toHaveBeenCalledWith(
      "/events/test-event/register?variant=v1"
    );
  });

  it("handleCheckout navigates without variant param when none selected and no variants", async () => {
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, variants: [] })
    );

    await act(async () => {
      await result.current.actions.handleCheckout();
    });

    expect(mockPush).toHaveBeenCalledWith("/events/test-event/register");
  });

  // ── Action: handleRegister (free) ──────────────────────────────

  it("handleRegister shows toast when not authenticated", async () => {
    mockSession = { data: null, status: "unauthenticated" };
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, hasRegistrations: false })
    );

    await act(async () => {
      await result.current.actions.handleRegister();
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" })
    );
  });

  it("handleRegister shows toast when variant required but not selected", async () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        hasRegistrations: false,
        variants: [activeVariant],
      })
    );

    await act(async () => {
      await result.current.actions.handleRegister();
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" })
    );
  });

  it("handleRegister opens consent dialog when configured fields exist", async () => {
    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        hasRegistrations: false,
        variants: [],
        registrationFieldSettings: { dateOfBirth: "required" },
      })
    );

    await act(async () => {
      await result.current.actions.handleRegister();
    });

    expect(result.current.state.showConsentDialog).toBe(true);
  });

  it("handleRegister calls API for free registration", async () => {
    mockFetch.mockImplementation((url: string) => {
      if (typeof url === "string" && url.includes("/participations")) {
        if (url.includes("?eventId=")) {
          // GET participations
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                participations: [],
                counts: { going: 5, interested: 2 },
              }),
          });
        }
        // POST participations
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: "p1",
              status: "going",
              variantId: null,
              variant: null,
            }),
        });
      }
      if (typeof url === "string" && url.includes("/custom-fields")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (typeof url === "string" && url.includes("/registration/status")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ registration: null }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const { result } = renderHook(() =>
      useEventRegistration({
        ...baseProps,
        hasRegistrations: false,
        variants: [],
      })
    );

    await act(async () => {
      await result.current.actions.handleRegister();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/participations",
      expect.objectContaining({ method: "POST" })
    );
  });

  // ── Action: handleUnregister ────────────────────────────────────

  it("handleUnregister does nothing when not authenticated", async () => {
    mockSession = { data: null, status: "unauthenticated" };
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, hasRegistrations: false })
    );

    await act(async () => {
      await result.current.actions.handleUnregister();
    });

    // Should not call fetch for DELETE
    expect(mockFetch).not.toHaveBeenCalledWith(
      expect.stringContaining("/participations?eventId="),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  // ── Action: handleMarkInterested ────────────────────────────────

  it("handleMarkInterested shows toast when not authenticated", async () => {
    mockSession = { data: null, status: "unauthenticated" };
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, hasRegistrations: false })
    );

    await act(async () => {
      await result.current.actions.handleMarkInterested();
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" })
    );
  });

  // ── Action: handleSharePost ─────────────────────────────────────

  it("handleSharePost does nothing when no session user", async () => {
    mockSession = { data: null, status: "unauthenticated" };
    const { result } = renderHook(() => useEventRegistration(baseProps));

    await act(async () => {
      await result.current.actions.handleSharePost();
    });

    expect(mockFetch).not.toHaveBeenCalledWith(
      "/api/posts",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("handleSharePost does nothing when share content is empty", async () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    await act(async () => {
      await result.current.actions.handleSharePost();
    });

    expect(mockFetch).not.toHaveBeenCalledWith(
      "/api/posts",
      expect.objectContaining({ method: "POST" })
    );
  });

  // ── Action: handleCancelPending ─────────────────────────────────

  it("handleCancelPending calls cancel API", async () => {
    mockFetch.mockImplementation((url: string, options?: RequestInit) => {
      if (
        typeof url === "string" &&
        url.includes("/registration/cancel") &&
        options?.method === "POST"
      ) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      if (typeof url === "string" && url.includes("/custom-fields")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (typeof url === "string" && url.includes("/registration/status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              registration: {
                id: "r1",
                status: "PENDING",
                variantId: "v1",
                amountCents: 2500,
                currency: "EUR",
              },
            }),
        });
      }
      if (typeof url === "string" && url.includes("/participations")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              participations: [],
              counts: { going: 0, interested: 0 },
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const { result } = renderHook(() => useEventRegistration(baseProps));

    // Wait for registration status to be fetched
    await waitFor(() => {
      expect(result.current.state.paidRegistration).not.toBeNull();
    });

    await act(async () => {
      await result.current.actions.handleCancelPending();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `/api/events/ev1/registration/cancel`,
      expect.objectContaining({ method: "POST" })
    );
    expect(result.current.state.paidRegistration).toBeNull();
  });

  // ── Team size ───────────────────────────────────────────────────

  it("selectedVariantTeamSize defaults to 1 for single-player variant", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setSelectedVariantId("v1");
    });

    expect(result.current.derived.selectedVariantTeamSize).toBe(1);
  });

  it("needsConsentOrTeam is true when team size > 1", () => {
    const teamVariant: EventVariant = { ...activeVariant, teamSize: 3 };
    const { result } = renderHook(() =>
      useEventRegistration({ ...baseProps, variants: [teamVariant] })
    );

    act(() => {
      result.current.actions.setSelectedVariantId("v1");
    });

    expect(result.current.derived.needsConsentOrTeam).toBe(true);
  });

  // ── Fetching counts ─────────────────────────────────────────────

  it("fetches participant counts on mount", async () => {
    renderHook(() => useEventRegistration(baseProps));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/participations?eventId=ev1")
      );
    });
  });

  // ── State setters ───────────────────────────────────────────────

  it("toggles share dialog", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setShowShareDialog(true);
    });
    expect(result.current.state.showShareDialog).toBe(true);

    act(() => {
      result.current.actions.setShowShareDialog(false);
    });
    expect(result.current.state.showShareDialog).toBe(false);
  });

  it("updates share content", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setShareContent("My share text");
    });
    expect(result.current.state.shareContent).toBe("My share text");
  });

  it("toggles ticket modal", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setShowTicketModal(true);
    });
    expect(result.current.state.showTicketModal).toBe(true);
  });

  it("toggles consent dialog", () => {
    const { result } = renderHook(() => useEventRegistration(baseProps));

    act(() => {
      result.current.actions.setShowConsentDialog(true);
    });
    expect(result.current.state.showConsentDialog).toBe(true);
  });
});

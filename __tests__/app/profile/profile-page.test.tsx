/**
 * @jest-environment node
 */

import React from "react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));

const mockRedirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
jest.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest
    .fn()
    .mockResolvedValue((key: string, params?: Record<string, unknown>) =>
      params ? `${key}:${JSON.stringify(params)}` : key
    ),
}));

jest.mock("@/lib/event-utils", () => ({
  formatDate: (date: Date, _locale: string) => date.toISOString().split("T")[0],
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// ── Child component stubs (no-op) ────────────────────────────────────────────

jest.mock("@/components/profile-header-client", () => ({
  ProfileHeaderClient: () => null,
}));

jest.mock("@/components/profile-upcoming-events", () => ({
  ProfileUpcomingEvents: () => null,
}));

jest.mock("@/components/profile-upcoming-sessions", () => ({
  ProfileUpcomingSessions: () => null,
}));

jest.mock("@/components/profile-past-sessions", () => ({
  ProfilePastSessions: () => null,
}));

jest.mock("@/components/profile-professional-section", () => ({
  ProfileProfessionalSection: () => null,
}));

jest.mock("@/components/friends-section", () => ({
  FriendsSection: () => null,
}));

jest.mock("@/components/photo-gallery", () => ({
  PhotoGallery: () => null,
}));

jest.mock("@/components/performance/performance-section", () => ({
  PerformanceSection: () => null,
}));

jest.mock("@/components/scoring/hybrid-score-card", () => ({
  HybridScoreCard: () => null,
}));

jest.mock("@/components/analyses-section", () => ({
  AnalysesSection: () => null,
}));

jest.mock("@/components/page-container", () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("lucide-react", () => ({
  Calendar: () => null,
  Trophy: () => null,
  Users: () => null,
}));

// ── Prisma mock ───────────────────────────────────────────────────────────────

const mockUserFindUnique = jest.fn();
const mockVenueBookingFindMany = jest.fn();
const mockWorkoutLogFindMany = jest.fn();
const mockRegistrationFindMany = jest.fn();
const mockCreditWalletFindUnique = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...args: unknown[]) => mockUserFindUnique(...args) },
    venueBooking: {
      findMany: (...args: unknown[]) => mockVenueBookingFindMany(...args),
    },
    workoutLog: {
      findMany: (...args: unknown[]) => mockWorkoutLogFindMany(...args),
    },
    registration: {
      findMany: (...args: unknown[]) => mockRegistrationFindMany(...args),
    },
    creditWallet: {
      findUnique: (...args: unknown[]) => mockCreditWalletFindUnique(...args),
    },
  },
}));

// ── Import AFTER mocks ────────────────────────────────────────────────────────

import ProfilePage from "@/app/[locale]/profile/page";

// ── Helpers ───────────────────────────────────────────────────────────────────

const USER_ID = "user-1";
const USER_EMAIL = "test@example.com";

const futureDate = new Date("2026-06-15");
const pastDate = new Date("2025-06-15");

/**
 * In node environment, the server component returns a React element tree.
 * Each child component appears with its INCOMING props accessible
 * at result.props.children[index].props.
 *
 * PageContainer children indices:
 *   0: ProfileHeaderClient
 *   1: Upcoming events section (false | div)
 *   2: ProfileUpcomingSessions
 *   3: ProfilePastSessions
 *   4: Past events section (false | div)
 *   5: Empty state section (false | div)
 *   6: HybridScoreCard wrapper div
 *   7: PerformanceSection
 *   8: AnalysesSection
 *   9: ProfileProfessionalSection
 *  10: PhotoGallery
 *  11: FriendsSection
 */
const IDX = {
  HEADER: 0,
  UPCOMING_EVENTS: 1,
  UPCOMING_SESSIONS: 2,
  PAST_SESSIONS: 3,
  PAST_EVENTS: 4,
  EMPTY_STATE: 5,
  HYBRID_SCORE: 6,
  PERFORMANCE: 7,
  ANALYSES: 8,
  PROFESSIONAL: 9,
  GALLERY: 10,
  FRIENDS: 11,
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = any;

function getChildren(result: AnyElement): AnyElement[] {
  return result.props.children;
}

function getChild(result: AnyElement, index: number): AnyElement {
  return getChildren(result)[index];
}

function getChildProps(result: AnyElement, index: number): AnyElement {
  const child = getChild(result, index);
  return child?.props ?? null;
}

function makeUser(overrides?: Record<string, unknown>) {
  return {
    id: USER_ID,
    name: "Test User",
    email: USER_EMAIL,
    image: "https://example.com/avatar.jpg",
    participations: [],
    results: [],
    sentFriendships: [],
    receivedFriendships: [],
    ...overrides,
  };
}

function makeParticipation(
  id: string,
  eventDate: Date,
  opts?: { variant?: boolean; status?: string }
) {
  return {
    id,
    status: opts?.status ?? "going",
    event: {
      id: `event-${id}`,
      title: `Event ${id}`,
      slug: `event-${id}`,
      startDate: eventDate,
      city: "Lisbon",
      country: "PT",
      sportTypes: ["RUNNING"],
    },
    variant: opts?.variant
      ? {
          name: "10km",
          distanceKm: 10,
          startDate: eventDate,
          startTime: "09:00",
        }
      : null,
  };
}

function makeBooking(
  id: string,
  startsAt: Date,
  opts?: { workouts?: boolean }
) {
  return {
    id,
    session: {
      id: `session-${id}`,
      title: `Session ${id}`,
      startsAt,
      endsAt: new Date(startsAt.getTime() + 3600000),
      venue: {
        id: `venue-${id}`,
        name: `Venue ${id}`,
        slug: `venue-${id}`,
        city: "Porto",
      },
      ...(opts?.workouts
        ? {
            sessionWorkouts: [
              {
                id: `sw-${id}`,
                workout: { id: `w-${id}`, name: `Workout ${id}` },
              },
            ],
          }
        : { sessionWorkouts: [] }),
    },
  };
}

function setupDefaultMocks() {
  mockAuth.mockResolvedValue({ user: { id: USER_ID, email: USER_EMAIL } });
  mockUserFindUnique.mockResolvedValue(makeUser());
  mockVenueBookingFindMany.mockResolvedValue([]);
  mockWorkoutLogFindMany.mockResolvedValue([]);
  mockRegistrationFindMany.mockResolvedValue([]);
  mockCreditWalletFindUnique.mockResolvedValue({ balanceCents: 500 });
}

async function callPage(locale = "en") {
  return ProfilePage({ params: { locale } });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Authentication ────────────────────────────────────────────────────────────

describe("ProfilePage — authentication", () => {
  it("redirects to /auth/signin when session is null", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(callPage()).rejects.toThrow("NEXT_REDIRECT:/auth/signin");
    expect(mockRedirect).toHaveBeenCalledWith("/auth/signin");
  });

  it("redirects when session has no user id", async () => {
    mockAuth.mockResolvedValue({ user: {} });

    await expect(callPage()).rejects.toThrow("NEXT_REDIRECT:/auth/signin");
  });

  it("redirects when user is not found in database", async () => {
    mockAuth.mockResolvedValue({ user: { id: USER_ID } });
    mockUserFindUnique.mockResolvedValue(null);

    await expect(callPage()).rejects.toThrow("NEXT_REDIRECT:/auth/signin");
  });
});

// ── ProfileHeaderClient ───────────────────────────────────────────────────────

describe("ProfilePage — ProfileHeaderClient props", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("passes user info", async () => {
    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.user).toEqual({
      name: "Test User",
      email: USER_EMAIL,
      image: "https://example.com/avatar.jpg",
    });
  });

  it("computes friendsCount from sent + received friendships", async () => {
    const user = makeUser({
      sentFriendships: [{ id: "f1" }, { id: "f2" }],
      receivedFriendships: [{ id: "f3" }],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.stats.friendsCount).toBe(3);
  });

  it("passes wallet balance", async () => {
    mockCreditWalletFindUnique.mockResolvedValue({ balanceCents: 1250 });

    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.stats.creditBalanceCents).toBe(1250);
  });

  it("passes 0 balance when wallet is null", async () => {
    mockCreditWalletFindUnique.mockResolvedValue(null);

    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.stats.creditBalanceCents).toBe(0);
  });

  it("computes event counts for stats", async () => {
    const user = makeUser({
      participations: [
        makeParticipation("up1", futureDate),
        makeParticipation("up2", futureDate),
        makeParticipation("past1", pastDate),
      ],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.stats.upcomingEvents).toBe(2);
    expect(headerProps.stats.pastEvents).toBe(1);
  });

  it("passes participations with variant data", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate, { variant: true })],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.participations[0].variant).toEqual(
      expect.objectContaining({
        name: "10km",
        distanceKm: 10,
        startTime: "09:00",
      })
    );
  });

  it("passes participations without variant as null", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate, { variant: false })],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.participations[0].variant).toBeNull();
  });

  it("passes session bookings to header", async () => {
    const booking = makeBooking("b1", futureDate);
    mockVenueBookingFindMany
      .mockResolvedValueOnce([booking])
      .mockResolvedValueOnce([]);

    const result = await callPage();
    const headerProps = getChildProps(result, IDX.HEADER);

    expect(headerProps.sessionBookings).toHaveLength(1);
    expect(headerProps.sessionBookings[0].id).toBe("b1");
    expect(headerProps.sessionBookings[0].session.venue.name).toBe("Venue b1");
  });
});

// ── Upcoming events ───────────────────────────────────────────────────────────

describe("ProfilePage — upcoming events", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("renders section when user has future participations", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);

    expect(section).toBeTruthy(); // not false
    // The section contains ProfileUpcomingEvents
    const upcomingEventsEl = section.props.children[1];
    expect(upcomingEventsEl.props.events).toHaveLength(1);
    expect(upcomingEventsEl.props.events[0].event.title).toBe("Event 1");
    expect(upcomingEventsEl.props.locale).toBe("en");
  });

  it("does not render section when no future events", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", pastDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);

    expect(section).toBeFalsy();
  });

  it("merges confirmed registrations without duplicates", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    mockRegistrationFindMany
      .mockResolvedValueOnce([
        {
          id: "reg-1",
          eventId: "event-1", // duplicate
          event: {
            id: "event-1",
            title: "Event 1",
            slug: "event-1",
            startDate: futureDate,
            city: "Lisbon",
            country: "PT",
            sportTypes: ["RUNNING"],
          },
          variant: null,
        },
        {
          id: "reg-2",
          eventId: "event-extra",
          event: {
            id: "event-extra",
            title: "Extra Event",
            slug: "extra-event",
            startDate: futureDate,
            city: "Porto",
            country: "PT",
            sportTypes: ["TRAIL_RUNNING"],
          },
          variant: null,
        },
      ])
      .mockResolvedValueOnce([{ eventId: "event-1" }]);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);
    const events = section.props.children[1].props.events;

    // 2 events: 1 participation + 1 unique registration (duplicate filtered)
    expect(events).toHaveLength(2);
    expect(events.map((e: AnyElement) => e.event.title)).toContain(
      "Extra Event"
    );
  });

  it("sorts upcoming events by date ascending", async () => {
    const earlier = new Date("2026-05-01");
    const later = new Date("2026-08-01");
    const user = makeUser({
      participations: [
        makeParticipation("late", later),
        makeParticipation("early", earlier),
      ],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);
    const events = section.props.children[1].props.events;

    expect(events[0].event.startDate.getTime()).toBeLessThan(
      events[1].event.startDate.getTime()
    );
  });

  it("passes confirmed ticket event IDs", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    mockRegistrationFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ eventId: "event-1" }]);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);
    const ticketIds = section.props.children[1].props.confirmedTicketEventIds;

    expect(ticketIds).toEqual(["event-1"]);
  });
});

// ── Past events ───────────────────────────────────────────────────────────────

describe("ProfilePage — past events", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("renders past events section with event data", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", pastDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const section = getChild(result, IDX.PAST_EVENTS);

    expect(section).toBeTruthy();
    const tree = JSON.stringify(section);
    expect(tree).toContain("Event 1");
  });

  it("renders variant info in past events", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", pastDate, { variant: true })],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const tree = JSON.stringify(getChild(result, IDX.PAST_EVENTS));

    expect(tree).toContain("10km");
    expect(tree).toContain("10 km");
  });

  it("renders variant date when different from event date", async () => {
    const variantDate = new Date("2025-06-20");
    const user = makeUser({
      participations: [
        {
          id: "p1",
          status: "going",
          event: {
            id: "e1",
            title: "Multi-day Event",
            slug: "multi-day",
            startDate: pastDate,
            city: "Lisbon",
            country: "PT",
            sportTypes: ["RUNNING"],
          },
          variant: {
            name: "Marathon",
            distanceKm: 42,
            startDate: variantDate,
            startTime: "08:00",
          },
        },
      ],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const tree = JSON.stringify(getChild(result, IDX.PAST_EVENTS));

    expect(tree).toContain("2025-06-20");
    expect(tree).toContain("08:00");
  });

  it("does not render variant date block when same date reference", async () => {
    const sharedDate = new Date("2025-06-15");
    const user = makeUser({
      participations: [
        {
          id: "p1",
          status: "going",
          event: {
            id: "e1",
            title: "Same Day Event",
            slug: "same-day",
            startDate: sharedDate,
            city: "Lisbon",
            country: "PT",
            sportTypes: ["RUNNING"],
          },
          variant: {
            name: "10K",
            distanceKm: 10,
            startDate: sharedDate, // same object reference
            startTime: "10:00",
          },
        },
      ],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const tree = JSON.stringify(getChild(result, IDX.PAST_EVENTS));

    // The "at" translation key only appears in the variant date block
    expect(tree).not.toContain('"at"');
  });

  it("limits past events display to 6 items", async () => {
    const participations = Array.from({ length: 8 }, (_, i) =>
      makeParticipation(
        `past-${i}`,
        new Date(`2025-0${Math.max(1, (i % 9) + 1)}-15`)
      )
    );
    const user = makeUser({ participations });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const tree = JSON.stringify(getChild(result, IDX.PAST_EVENTS));

    // Count event links rendered in the grid
    const linkMatches = tree.match(/"href":"\/events\/event-past-/g);
    expect(linkMatches).not.toBeNull();
    expect((linkMatches ?? []).length).toBeLessThanOrEqual(6);
  });

  it("sorts past events by date descending", async () => {
    const earlier = new Date("2025-03-01");
    const later = new Date("2025-08-01");
    const user = makeUser({
      participations: [
        makeParticipation("old", earlier),
        makeParticipation("recent", later),
      ],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const tree = JSON.stringify(getChild(result, IDX.PAST_EVENTS));

    const recentIdx = tree.indexOf("Event recent");
    const oldIdx = tree.indexOf("Event old");
    expect(recentIdx).toBeLessThan(oldIdx);
  });

  it("does not render when no past events", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    expect(getChild(result, IDX.PAST_EVENTS)).toBeFalsy();
  });
});

// ── Empty state ───────────────────────────────────────────────────────────────

describe("ProfilePage — empty state", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("renders empty state when no events at all", async () => {
    const result = await callPage();
    const section = getChild(result, IDX.EMPTY_STATE);

    expect(section).toBeTruthy();
    const tree = JSON.stringify(section);
    expect(tree).toContain("noEventsTitle");
    expect(tree).toContain("noEventsDescription");
    expect(tree).toContain("exploreEvents");
    expect(tree).toContain("/events");
  });

  it("does not render empty state when has upcoming events", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    expect(getChild(result, IDX.EMPTY_STATE)).toBeFalsy();
  });

  it("does not render empty state when has past events", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", pastDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    expect(getChild(result, IDX.EMPTY_STATE)).toBeFalsy();
  });

  it("does not render when confirmed registrations fill events", async () => {
    mockRegistrationFindMany.mockResolvedValueOnce([
      {
        id: "reg-1",
        eventId: "evt-1",
        event: {
          id: "evt-1",
          title: "Reg Only Event",
          slug: "reg-only",
          startDate: futureDate,
          city: "Lisbon",
          country: "PT",
          sportTypes: ["RUNNING"],
        },
        variant: null,
      },
    ]);

    const result = await callPage();
    expect(getChild(result, IDX.EMPTY_STATE)).toBeFalsy();
  });
});

// ── Venue sessions ────────────────────────────────────────────────────────────

describe("ProfilePage — venue sessions", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("passes upcoming bookings to ProfileUpcomingSessions", async () => {
    const upcomingBooking = makeBooking("b1", futureDate);
    mockVenueBookingFindMany
      .mockResolvedValueOnce([upcomingBooking])
      .mockResolvedValueOnce([]);

    const result = await callPage();
    const props = getChildProps(result, IDX.UPCOMING_SESSIONS);

    expect(props.bookings).toHaveLength(1);
    expect(props.bookings[0].id).toBe("b1");
    expect(props.locale).toBe("en");
  });

  it("passes past bookings with hasLoggedWorkout=true", async () => {
    const pastBooking = makeBooking("b2", pastDate, { workouts: true });
    mockVenueBookingFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([pastBooking]);

    mockWorkoutLogFindMany.mockResolvedValue([{ sessionId: "session-b2" }]);

    const result = await callPage();
    const props = getChildProps(result, IDX.PAST_SESSIONS);

    expect(props.bookings).toHaveLength(1);
    expect(props.bookings[0].id).toBe("b2");
    expect(props.bookings[0].hasLoggedWorkout).toBe(true);
  });

  it("passes past bookings with hasLoggedWorkout=false", async () => {
    const pastBooking = makeBooking("b3", pastDate, { workouts: true });
    mockVenueBookingFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([pastBooking]);

    mockWorkoutLogFindMany.mockResolvedValue([]);

    const result = await callPage();
    const props = getChildProps(result, IDX.PAST_SESSIONS);

    expect(props.bookings[0].hasLoggedWorkout).toBe(false);
  });

  it("passes empty bookings when none exist", async () => {
    const result = await callPage();

    expect(getChildProps(result, IDX.UPCOMING_SESSIONS).bookings).toEqual([]);
    expect(getChildProps(result, IDX.PAST_SESSIONS).bookings).toEqual([]);
  });
});

// ── Participations filtering ──────────────────────────────────────────────────

describe("ProfilePage — participations filtering", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("excludes non-going participations from upcoming events list", async () => {
    const user = makeUser({
      participations: [
        makeParticipation("interested", futureDate, {
          status: "interested",
        }),
        makeParticipation("going", futureDate, { status: "going" }),
      ],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);
    const events = section.props.children[1].props.events;

    expect(events).toHaveLength(1);
    expect(events[0].event.title).toBe("Event going");
  });

  it("correctly separates future and past events", async () => {
    const user = makeUser({
      participations: [
        makeParticipation("future", futureDate),
        makeParticipation("past", pastDate),
      ],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage();

    // Upcoming section exists with future event
    const upcomingSection = getChild(result, IDX.UPCOMING_EVENTS);
    expect(upcomingSection).toBeTruthy();
    expect(upcomingSection.props.children[1].props.events[0].event.title).toBe(
      "Event future"
    );

    // Past section exists with past event
    const pastSection = getChild(result, IDX.PAST_EVENTS);
    expect(pastSection).toBeTruthy();
    expect(JSON.stringify(pastSection)).toContain("Event past");
  });
});

// ── Confirmed ticket IDs ──────────────────────────────────────────────────────

describe("ProfilePage — confirmed ticket IDs", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("skips ticket query when no upcoming events", async () => {
    await callPage();

    // Only one registration findMany call (for merge), not the ticket query
    expect(mockRegistrationFindMany).toHaveBeenCalledTimes(1);
  });

  it("passes empty ticket IDs when no confirmed tickets", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    mockRegistrationFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);
    const ticketIds = section.props.children[1].props.confirmedTicketEventIds;

    expect(ticketIds).toEqual([]);
  });
});

// ── Locale handling ───────────────────────────────────────────────────────────

describe("ProfilePage — locale handling", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("passes locale to session components", async () => {
    const result = await callPage("pt");

    expect(getChildProps(result, IDX.UPCOMING_SESSIONS).locale).toBe("pt");
    expect(getChildProps(result, IDX.PAST_SESSIONS).locale).toBe("pt");
  });

  it("passes locale to upcoming events component", async () => {
    const user = makeUser({
      participations: [makeParticipation("1", futureDate)],
    });
    mockUserFindUnique.mockResolvedValue(user);

    const result = await callPage("de");
    const section = getChild(result, IDX.UPCOMING_EVENTS);

    expect(section.props.children[1].props.locale).toBe("de");
  });
});

// ── Professional section ──────────────────────────────────────────────────────

describe("ProfilePage — professional section", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("passes userId to ProfileProfessionalSection", async () => {
    const result = await callPage();
    const props = getChildProps(result, IDX.PROFESSIONAL);

    expect(props.userId).toBe(USER_ID);
  });
});

// ── Prisma queries ────────────────────────────────────────────────────────────

describe("ProfilePage — prisma queries", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("queries user with correct includes", async () => {
    await callPage();

    expect(mockUserFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: USER_ID },
        include: expect.objectContaining({
          participations: expect.any(Object),
          results: expect.any(Object),
          sentFriendships: expect.any(Object),
          receivedFriendships: expect.any(Object),
        }),
      })
    );
  });

  it("queries venue bookings with correct status filter", async () => {
    await callPage();

    expect(mockVenueBookingFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: USER_ID,
          status: { in: ["BOOKED", "ATTENDED"] },
        }),
      })
    );
  });

  it("queries wallet balance", async () => {
    await callPage();

    expect(mockCreditWalletFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: USER_ID },
        select: { balanceCents: true },
      })
    );
  });

  it("queries confirmed registrations with user and guest conditions", async () => {
    await callPage();

    expect(mockRegistrationFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "CONFIRMED",
          OR: expect.arrayContaining([
            expect.objectContaining({ userId: USER_ID }),
            expect.objectContaining({
              guestEmail: USER_EMAIL,
              teamRole: "MEMBER",
            }),
          ]),
        }),
      })
    );
  });

  it("queries workout logs for past session tracking", async () => {
    const pastBooking = makeBooking("s1", pastDate, { workouts: true });
    mockVenueBookingFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([pastBooking]);

    await callPage();

    expect(mockWorkoutLogFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: USER_ID,
          sessionId: { in: ["session-s1"] },
        }),
      })
    );
  });
});

// ── Confirmed registrations as participations ─────────────────────────────────

describe("ProfilePage — confirmed registrations as participations", () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  it("includes confirmed registrations for past events", async () => {
    mockRegistrationFindMany.mockResolvedValueOnce([
      {
        id: "reg-past",
        eventId: "evt-past",
        event: {
          id: "evt-past",
          title: "Past Reg Event",
          slug: "past-reg",
          startDate: pastDate,
          city: "Faro",
          country: "PT",
          sportTypes: ["RUNNING"],
        },
        variant: {
          name: "Half Marathon",
          distanceKm: 21,
          startDate: pastDate,
          startTime: "07:30",
        },
      },
    ]);

    const result = await callPage();
    const pastTree = JSON.stringify(getChild(result, IDX.PAST_EVENTS));

    expect(pastTree).toContain("Past Reg Event");
    expect(pastTree).toContain("Half Marathon");
  });

  it("adds confirmed registrations for future events to upcoming list", async () => {
    mockRegistrationFindMany
      .mockResolvedValueOnce([
        {
          id: "reg-future",
          eventId: "evt-future",
          event: {
            id: "evt-future",
            title: "Future Reg Event",
            slug: "future-reg",
            startDate: futureDate,
            city: "Porto",
            country: "PT",
            sportTypes: ["TRAIL_RUNNING"],
          },
          variant: null,
        },
      ])
      .mockResolvedValueOnce([]);

    const result = await callPage();
    const section = getChild(result, IDX.UPCOMING_EVENTS);
    const events = section.props.children[1].props.events;

    expect(events).toHaveLength(1);
    expect(events[0].event.title).toBe("Future Reg Event");
  });
});

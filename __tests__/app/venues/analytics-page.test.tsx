/**
 * @jest-environment node
 */

import React from "react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));

const mockPrismaVenueFindFirst = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: {
      findFirst: (...args: unknown[]) => mockPrismaVenueFindFirst(...args),
    },
  },
}));

const mockCanManageVenue = jest.fn();
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: (...args: unknown[]) => mockCanManageVenue(...args),
}));

const mockNotFound = jest.fn();
const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  notFound: () => {
    mockNotFound();
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

jest.mock("@/components/venue-analytics-dashboard", () => ({
  VenueAnalyticsDashboard: ({
    venueId,
    venueName,
    venueSlug,
  }: {
    venueId: string;
    venueName: string;
    venueSlug: string;
  }) => (
    <div data-testid="analytics-dashboard">
      <span data-testid="venue-id">{venueId}</span>
      <span data-testid="venue-name">{venueName}</span>
      <span data-testid="venue-slug">{venueSlug}</span>
    </div>
  ),
}));

import VenueAnalyticsPage from "@/app/[locale]/venues/[slug]/analytics/page";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOCK_VENUE = { id: "venue-1", slug: "my-venue", name: "My Venue" };

function makeParams(slug = "my-venue") {
  return { params: Promise.resolve({ slug, locale: "en" }) };
}

async function callPage(params = makeParams()) {
  return VenueAnalyticsPage(params);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("VenueAnalyticsPage", () => {
  it("redirects to /auth/signin when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(callPage()).rejects.toThrow("NEXT_REDIRECT:/auth/signin");
    expect(mockRedirect).toHaveBeenCalledWith("/auth/signin");
  });

  it("calls notFound when venue does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaVenueFindFirst.mockResolvedValue(null);

    await expect(callPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("calls notFound when venue is found but not active", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    // findFirst returns null (venue not found because isActive: true filter)
    mockPrismaVenueFindFirst.mockResolvedValue(null);

    await expect(callPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("calls notFound when user is not authorized to manage the venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaVenueFindFirst.mockResolvedValue(MOCK_VENUE);
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    await expect(callPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders VenueAnalyticsDashboard for authorized user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaVenueFindFirst.mockResolvedValue(MOCK_VENUE);
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const result = await callPage();

    // result is JSX element — check its props
    expect(result).not.toBeNull();
    const jsx = result as React.ReactElement<{ children: React.ReactNode }>;
    // The container div wraps VenueAnalyticsDashboard
    expect(jsx.props.children).toBeTruthy();
  });

  it("queries venue by slug with isActive: true filter", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaVenueFindFirst.mockResolvedValue(MOCK_VENUE);
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    await callPage(makeParams("my-venue"));

    expect(mockPrismaVenueFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isActive: true,
          OR: expect.arrayContaining([
            { id: "my-venue" },
            { slug: "my-venue" },
          ]),
        }),
      })
    );
  });

  it("checks authorization for the correct user and venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: "admin-user" } });
    mockPrismaVenueFindFirst.mockResolvedValue(MOCK_VENUE);
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    await callPage();

    expect(mockCanManageVenue).toHaveBeenCalledWith("admin-user", "venue-1");
  });

  it("passes correct props to VenueAnalyticsDashboard", async () => {
    const venue = { id: "v-123", slug: "test-gym", name: "Test Gym" };
    mockAuth.mockResolvedValue({ user: { id: "owner-1" } });
    mockPrismaVenueFindFirst.mockResolvedValue(venue);
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const result = await callPage(makeParams("test-gym"));

    // Verify dashboard is somewhere in the render tree
    const jsx = result as React.ReactElement<{
      children: React.ReactElement<{
        venueId: string;
        venueName: string;
        venueSlug: string;
      }>;
    }>;
    // The component renders <div class="container..."><VenueAnalyticsDashboard .../></div>
    const dashboardEl = jsx.props.children;
    expect(dashboardEl.props.venueId).toBe("v-123");
    expect(dashboardEl.props.venueName).toBe("Test Gym");
    expect(dashboardEl.props.venueSlug).toBe("test-gym");
  });

  it("can look up venue by id as well as slug", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrismaVenueFindFirst.mockResolvedValue(MOCK_VENUE);
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    await callPage(makeParams("venue-1"));

    expect(mockPrismaVenueFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([{ id: "venue-1" }, { slug: "venue-1" }]),
        }),
      })
    );
  });
});

/**
 * @jest-environment node
 */

/**
 * Tests for /[locale]/profile/activities/[id]/page.tsx (Server Component)
 *
 * Covers:
 * - Redirect when not authenticated
 * - 404 when activity not found
 * - 404 when user doesn't own activity
 * - Successful render with activity data
 */

import { notFound, redirect } from "next/navigation";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  redirect: jest.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));
import { auth } from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    runActivity: { findUnique: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => key),
}));

jest.mock("@/components/performance/activity-detail-client", () => ({
  ActivityDetailClient: (props: Record<string, unknown>) => props,
}));

import ActivityDetailPage from "@/app/[locale]/profile/activities/[id]/page";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ACTIVITY = {
  id: "activity-1",
  userId: "user-1",
  startedAt: new Date("2026-03-01T08:00:00Z"),
  finishedAt: new Date("2026-03-01T09:00:00Z"),
  durationMs: 3600000,
  distanceM: 10000,
  avgPaceMinKm: 6.0,
  maxSpeedKmh: 12.5,
  elevationGainM: 200,
  elevationLossM: 180,
  track: [
    { lat: 38.5, lng: -8.9, timestamp: 1000 },
    { lat: 38.6, lng: -8.8, timestamp: 2000 },
  ],
};

function makeParams(id = "activity-1", locale = "en") {
  return { params: Promise.resolve({ id, locale }) };
}

// Recursively find a React element by component name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findElement(node: any, name: string): any {
  if (!node) return null;
  if (node.type?.name === name || node.type?.displayName === name) return node;
  // Check props.activity to see if the mock component returned props directly
  if (node.props?.activity && name === "ActivityDetailClient") return node;
  const children = node.props?.children;
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findElement(child, name);
      if (found) return found;
    }
  } else if (children) {
    return findElement(children, name);
  }
  return null;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ActivityDetailPage", () => {
  it("redirects when not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await expect(ActivityDetailPage(makeParams())).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/auth/signin");
  });

  it("redirects when session has no user id", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: {} });

    await expect(ActivityDetailPage(makeParams())).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/auth/signin");
  });

  it("returns notFound when activity does not exist", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(ActivityDetailPage(makeParams())).rejects.toThrow("NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("returns notFound when user does not own activity", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user-2" } });
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue(ACTIVITY);

    await expect(ActivityDetailPage(makeParams())).rejects.toThrow("NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("renders ActivityDetailClient with correct props", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue(ACTIVITY);

    const result = await ActivityDetailPage(makeParams());

    // The server component returns JSX — extract the ActivityDetailClient props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = result as any;
    const clientElement = findElement(element, "ActivityDetailClient");
    expect(clientElement).toBeTruthy();
    expect(clientElement.props.activity.id).toBe("activity-1");
    expect(clientElement.props.activity.distanceM).toBe(10000);
    expect(clientElement.props.activity.durationMs).toBe(3600000);
    expect(clientElement.props.activity.startedAt).toBe(
      "2026-03-01T08:00:00.000Z"
    );
    expect(clientElement.props.activity.track).toHaveLength(2);
    expect(clientElement.props.labels.title).toBe("activity.title");
  });

  it("handles non-array track data gracefully", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue({
      ...ACTIVITY,
      track: "invalid",
    });

    const result = await ActivityDetailPage(makeParams());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = result as any;
    const clientElement = findElement(element, "ActivityDetailClient");
    expect(clientElement).toBeTruthy();
    expect(clientElement.props.activity.track).toEqual([]);
  });
});

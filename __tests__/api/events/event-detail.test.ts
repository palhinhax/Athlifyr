/**
 * @jest-environment node
 */

/**
 * Tests for GET / PATCH / DELETE /api/events/[id]
 *
 * Covers:
 * - GET: fetch by CUID, fetch by slug, 404, 500
 * - PATCH: translations, variants sync, cancellation, date-change notifications,
 *          slug regeneration, organizer access, admin fields, 404, 500
 * - DELETE: admin-only, 401, 403, 404, 500
 */

import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "@/app/api/events/[id]/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    eventOrganizer: { findFirst: jest.fn() },
    eventTranslation: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    eventVariant: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    eventVariantTranslation: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    participation: { deleteMany: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/notifications", () => ({
  notifyEventDateChange: jest.fn().mockReturnValue(Promise.resolve()),
  notifyEventCancelled: jest.fn().mockReturnValue(Promise.resolve()),
}));
import {
  notifyEventDateChange,
  notifyEventCancelled,
} from "@/lib/notifications";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ADMIN_USER = { id: "user-admin", email: "admin@test.com", role: "ADMIN" };
const ORG_USER = { id: "user-org", email: "org@test.com", role: "USER" };

const EXISTING_EVENT = {
  id: "clxxxxxxxxxxxxxxxxxx001",
  title: "Trail Run 2026",
  slug: "trail-run-2026",
  description: "A great trail",
  startDate: new Date("2026-06-01"),
  endDate: null,
  city: "Lisbon",
  country: "PT",
  cancelled: false,
  isFeatured: false,
  hasRegistrations: false,
  hasLiveRace: false,
  commissionPercent: 0,
  variants: [],
};

function makeGetRequest(id: string): Request {
  return new Request(`http://localhost/api/events/${id}`, { method: "GET" });
}

function makePatchRequest(body: Record<string, unknown> = {}): NextRequest {
  return new Request("http://localhost/api/events/clxxxxxxxxxxxxxxxxxx001", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function makeDeleteRequest(): NextRequest {
  return new Request("http://localhost/api/events/clxxxxxxxxxxxxxxxxxx001", {
    method: "DELETE",
  }) as unknown as NextRequest;
}

function makeParams(id = "clxxxxxxxxxxxxxxxxxx001") {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

// ─── GET ──────────────────────────────────────────────────────────────────────

describe("GET /api/events/[id]", () => {
  it("returns event when found by CUID", async () => {
    const event = { ...EXISTING_EVENT, faqs: [], _count: { comments: 0 } };
    (prisma.event.findFirst as jest.Mock).mockResolvedValue(event);

    const res = await GET(
      makeGetRequest("clxxxxxxxxxxxxxxxxxx001"),
      makeParams("clxxxxxxxxxxxxxxxxxx001")
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("clxxxxxxxxxxxxxxxxxx001");
    expect(prisma.event.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "clxxxxxxxxxxxxxxxxxx001" },
      })
    );
  });

  it("returns event when found by slug", async () => {
    const event = { ...EXISTING_EVENT, faqs: [], _count: { comments: 0 } };
    (prisma.event.findFirst as jest.Mock).mockResolvedValue(event);

    const res = await GET(
      makeGetRequest("trail-run-2026"),
      makeParams("trail-run-2026")
    );

    expect(res.status).toBe(200);
    expect(prisma.event.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: "trail-run-2026" },
      })
    );
  });

  it("returns 404 when event not found", async () => {
    (prisma.event.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest("unknown"), makeParams("unknown"));

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("returns 500 on database error", async () => {
    (prisma.event.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(
      makeGetRequest("clxxxxxxxxxxxxxxxxxx001"),
      makeParams("clxxxxxxxxxxxxxxxxxx001")
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to fetch event" });
  });
});

// ─── PATCH ────────────────────────────────────────────────────────────────────

describe("PATCH /api/events/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makePatchRequest({ title: "X" }), makeParams());

    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not admin or organizer", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORG_USER);
    (prisma.eventOrganizer.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makePatchRequest({ title: "X" }), makeParams());

    expect(res.status).toBe(403);
  });

  it("returns 404 when event does not exist", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makePatchRequest({ title: "X" }), makeParams());

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("updates basic fields as admin", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT) // existingEvent
      .mockResolvedValueOnce({ ...EXISTING_EVENT, description: "Updated" }); // finalEvent
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      description: "Updated",
    });

    const res = await PATCH(
      makePatchRequest({ description: "Updated" }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ description: "Updated" }),
      })
    );
  });

  it("generates new slug when title changes", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce({
        ...EXISTING_EVENT,
        title: "New Title",
        slug: "new-title",
      });
    (prisma.event.findFirst as jest.Mock).mockResolvedValue(null); // no slug collision
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      title: "New Title",
      slug: "new-title",
    });

    const res = await PATCH(
      makePatchRequest({ title: "New Title" }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "New Title",
          slug: "new-title",
        }),
      })
    );
  });

  it("appends timestamp to slug on collision", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce({ ...EXISTING_EVENT, title: "Clash" });
    // slug "clash" already taken
    (prisma.event.findFirst as jest.Mock).mockResolvedValue({ id: "other" });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      title: "Clash",
    });

    const res = await PATCH(makePatchRequest({ title: "Clash" }), makeParams());

    expect(res.status).toBe(200);
    const updateCall = (prisma.event.update as jest.Mock).mock.calls[0][0];
    // Slug should contain "clash-" followed by timestamp
    expect(updateCall.data.slug).toMatch(/^clash-\d+$/);
  });

  it("handles translations upsert", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);
    (prisma.eventTranslation.findMany as jest.Mock).mockResolvedValue([]);

    const translations = [
      {
        language: "pt",
        title: "Corrida de Trail 2026",
        description: "Uma grande corrida",
      },
    ];

    const res = await PATCH(makePatchRequest({ translations }), makeParams());

    expect(res.status).toBe(200);
    expect(prisma.eventTranslation.upsert).toHaveBeenCalled();
  });

  it("deletes translations with empty content", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);
    (prisma.eventTranslation.findMany as jest.Mock).mockResolvedValue([
      {
        id: "t1",
        language: "pt",
        title: "Old",
        description: "Old desc",
        city: null,
        metaTitle: null,
        metaDescription: null,
      },
    ]);

    const translations = [{ language: "pt", title: "", description: "" }];

    const res = await PATCH(makePatchRequest({ translations }), makeParams());

    expect(res.status).toBe(200);
    expect(prisma.eventTranslation.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "t1" } })
    );
  });

  it("skips unchanged translations", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);
    (prisma.eventTranslation.findMany as jest.Mock).mockResolvedValue([
      {
        id: "t1",
        language: "pt",
        title: "Same",
        description: "Same desc",
        city: null,
        metaTitle: null,
        metaDescription: null,
      },
    ]);

    const translations = [
      { language: "pt", title: "Same", description: "Same desc" },
    ];

    const res = await PATCH(makePatchRequest({ translations }), makeParams());

    expect(res.status).toBe(200);
    expect(prisma.eventTranslation.upsert).not.toHaveBeenCalled();
  });

  it("syncs variants — create new, update existing, delete removed", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    const existingWithVariants = {
      ...EXISTING_EVENT,
      variants: [
        { id: "v1", name: "10K" },
        { id: "v2", name: "20K" },
      ],
    };
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(existingWithVariants)
      .mockResolvedValueOnce(existingWithVariants);
    (prisma.event.update as jest.Mock).mockResolvedValue(existingWithVariants);

    // deleteRemovedVariants: existing variant ids
    (prisma.eventVariant.findMany as jest.Mock).mockResolvedValue([
      { id: "v1" },
      { id: "v2" },
    ]);

    // upsertVariant for v1 (existing, changed)
    (prisma.eventVariant.findUnique as jest.Mock).mockResolvedValue({
      id: "v1",
      name: "10K",
      distanceKm: 10,
      elevationGainM: null,
      price: null,
      maxParticipants: null,
      teamSize: 1,
      startDate: null,
      startTime: null,
    });
    (prisma.eventVariant.update as jest.Mock).mockResolvedValue({ id: "v1" });
    (prisma.eventVariant.create as jest.Mock).mockResolvedValue({ id: "v3" });

    const variants = [
      { id: "v1", name: "10K Updated", distanceKm: 10 },
      { name: "New 5K", distanceKm: 5 },
    ];

    const res = await PATCH(makePatchRequest({ variants }), makeParams());

    expect(res.status).toBe(200);
    // v2 should have been deleted (not in keepIds)
    expect(prisma.eventVariant.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: ["v2"] } },
      })
    );
    // New variant created
    expect(prisma.eventVariant.create).toHaveBeenCalled();
  });

  it("handles cancellation — deletes participations and sends notification", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT) // not yet cancelled
      .mockResolvedValueOnce({ ...EXISTING_EVENT, cancelled: true });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      cancelled: true,
      title: "Trail Run 2026",
      slug: "trail-run-2026",
    });

    const res = await PATCH(
      makePatchRequest({ cancelled: true, cancellationReason: "Weather" }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.participation.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { eventId: "clxxxxxxxxxxxxxxxxxx001" },
      })
    );
    expect(notifyEventCancelled).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: "clxxxxxxxxxxxxxxxxxx001",
        cancellationReason: "Weather",
      })
    );
  });

  it("sends date-change notification when startDate changes", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      title: "Trail Run 2026",
      slug: "trail-run-2026",
    });

    const res = await PATCH(
      makePatchRequest({ startDate: "2026-07-15" }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(notifyEventDateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: "clxxxxxxxxxxxxxxxxxx001",
        oldDate: EXISTING_EVENT.startDate,
        newDate: new Date("2026-07-15"),
      })
    );
  });

  it("does NOT send date-change notification when date stays the same", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      title: "Trail Run 2026",
      slug: "trail-run-2026",
    });

    const res = await PATCH(
      makePatchRequest({ startDate: "2026-06-01" }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(notifyEventDateChange).not.toHaveBeenCalled();
  });

  it("organizer (non-admin) can update basic fields", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORG_USER);
    (prisma.eventOrganizer.findFirst as jest.Mock).mockResolvedValue({
      id: "org-1",
      eventId: "clxxxxxxxxxxxxxxxxxx001",
      userId: "user-org",
    });
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await PATCH(
      makePatchRequest({ description: "Org updated" }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ description: "Org updated" }),
      })
    );
  });

  it("handles nullable fields (endDate, latitude, longitude, etc.)", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await PATCH(
      makePatchRequest({
        endDate: null,
        latitude: null,
        longitude: null,
        googleMapsUrl: null,
        imageUrl: null,
        externalUrl: null,
        stravaRouteEmbed: null,
        featuredVenueId: null,
        refundDeadline: null,
        checkInOpensAt: null,
        checkInClosesAt: null,
      }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          endDate: null,
          latitude: null,
          longitude: null,
        }),
      })
    );
  });

  it("handles sportTypes update", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await PATCH(
      makePatchRequest({ sportTypes: ["TRAIL", "ROAD"] }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sportTypes: ["TRAIL", "ROAD"] }),
      })
    );
  });

  it("admin can set hasLiveRace and commissionPercent", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await PATCH(
      makePatchRequest({ hasLiveRace: true, commissionPercent: 5 }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          hasLiveRace: true,
          commissionPercent: 5,
        }),
      })
    );
  });

  it("handles hasRegistrations and registrationFieldSettings", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const settings = { tshirtSize: true, idNumber: false };
    const res = await PATCH(
      makePatchRequest({
        hasRegistrations: true,
        registrationFieldSettings: settings,
      }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          hasRegistrations: true,
          registrationFieldSettings: settings,
        }),
      })
    );
  });

  it("admin cancellation sets cancelledAt", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce({ ...EXISTING_EVENT, cancelled: true });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      cancelled: true,
      title: "Trail Run 2026",
      slug: "trail-run-2026",
    });

    await PATCH(makePatchRequest({ cancelled: true }), makeParams());

    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cancelled: true,
          cancelledAt: expect.any(Date),
        }),
      })
    );
  });

  it("handles variant with translations", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce({ ...EXISTING_EVENT, variants: [] })
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);
    (prisma.eventVariant.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.eventVariant.create as jest.Mock).mockResolvedValue({
      id: "v-new",
    });
    (prisma.eventVariantTranslation.findMany as jest.Mock).mockResolvedValue(
      []
    );

    const variants = [
      {
        name: "Trail 30K",
        distanceKm: 30,
        translations: [
          { language: "pt", name: "Trail 30K", description: "Corrida de 30km" },
        ],
      },
    ];

    const res = await PATCH(makePatchRequest({ variants }), makeParams());

    expect(res.status).toBe(200);
    expect(prisma.eventVariant.create).toHaveBeenCalled();
    expect(prisma.eventVariantTranslation.upsert).toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await PATCH(makePatchRequest({ title: "Crash" }), makeParams());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to update event" });
  });

  it("handles date fields (refundDeadline, checkInOpensAt, checkInClosesAt)", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await PATCH(
      makePatchRequest({
        refundDeadline: "2026-05-25T12:00:00Z",
        checkInOpensAt: "2026-06-01T06:00:00Z",
        checkInClosesAt: "2026-06-01T09:00:00Z",
      }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          refundDeadline: new Date("2026-05-25T12:00:00Z"),
          checkInOpensAt: new Date("2026-06-01T06:00:00Z"),
          checkInClosesAt: new Date("2026-06-01T09:00:00Z"),
        }),
      })
    );
  });

  it("does not set startDate in data when not provided", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT)
      .mockResolvedValueOnce(EXISTING_EVENT);
    (prisma.event.update as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await PATCH(makePatchRequest({ city: "Porto" }), makeParams());

    expect(res.status).toBe(200);
    const call = (prisma.event.update as jest.Mock).mock.calls[0][0];
    expect(call.data).not.toHaveProperty("startDate");
  });

  it("does not notify cancellation when event was already cancelled", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce({ ...EXISTING_EVENT, cancelled: true })
      .mockResolvedValueOnce({ ...EXISTING_EVENT, cancelled: true });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      ...EXISTING_EVENT,
      cancelled: true,
      title: "Trail Run 2026",
      slug: "trail-run-2026",
    });

    await PATCH(makePatchRequest({ cancelled: true }), makeParams());

    expect(prisma.participation.deleteMany).not.toHaveBeenCalled();
    expect(notifyEventCancelled).not.toHaveBeenCalled();
  });

  it("returns finalEvent from re-fetch when available", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    const updated = { ...EXISTING_EVENT, description: "updated" };
    const final = { ...EXISTING_EVENT, description: "final" };
    (prisma.event.findUnique as jest.Mock)
      .mockResolvedValueOnce(EXISTING_EVENT) // existing check
      .mockResolvedValueOnce(final); // finalEvent re-fetch
    (prisma.event.update as jest.Mock).mockResolvedValue(updated);

    const res = await PATCH(
      makePatchRequest({ description: "updated" }),
      makeParams()
    );

    const json = await res.json();
    expect(json.description).toBe("final");
  });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

describe("DELETE /api/events/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest(), makeParams());

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 403 when user is not admin", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORG_USER);

    const res = await DELETE(makeDeleteRequest(), makeParams());

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });
  });

  it("returns 404 when event does not exist", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest(), makeParams());

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("deletes event successfully as admin", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(EXISTING_EVENT);
    (prisma.event.delete as jest.Mock).mockResolvedValue(EXISTING_EVENT);

    const res = await DELETE(makeDeleteRequest(), makeParams());

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(prisma.event.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "clxxxxxxxxxxxxxxxxxx001" },
      })
    );
  });

  it("returns 500 on database error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(EXISTING_EVENT);
    (prisma.event.delete as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await DELETE(makeDeleteRequest(), makeParams());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to delete event" });
  });
});

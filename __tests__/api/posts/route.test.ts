/**
 * @jest-environment node
 */

/**
 * Tests for POST/GET/DELETE /api/posts
 *
 * Covers:
 * - POST: integrity check failure
 * - POST: authentication required (401)
 * - POST: validation fails (400) — missing content, invalid URL, invalid postType
 * - POST: event not found (404)
 * - POST: venue not found (404)
 * - POST: workout not found or access denied (404)
 * - POST: successful creation (201) — basic, with event notification
 * - POST: internal server error (500)
 * - GET: public posts (no auth, feed=true)
 * - GET: feed with authenticated user (public + participating events)
 * - GET: filtered by eventId / venueId / userId
 * - GET: pagination metadata
 * - GET: internal server error (500)
 * - DELETE: integrity check failure
 * - DELETE: authentication required (401)
 * - DELETE: missing post ID (400)
 * - DELETE: post not found (404)
 * - DELETE: forbidden — other user's post (403)
 * - DELETE: admin can delete any post
 * - DELETE: successful deletion (200)
 * - DELETE: internal server error (500)
 */

import { NextRequest } from "next/server";
import { POST, GET, DELETE } from "@/app/api/posts/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn(),
}));
import { requireIntegrity } from "@/lib/verify-integrity";

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/notifications", () => ({
  notifyEventNewPost: jest.fn(),
}));
import { notifyEventNewPost } from "@/lib/notifications";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
    venue: { findUnique: jest.fn() },
    workout: { findFirst: jest.fn() },
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    participation: { findMany: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const AUTH_USER = {
  id: "cluser00000001",
  name: "Test User",
  email: "test@example.com",
  role: "USER",
};
const ADMIN_USER = { ...AUTH_USER, id: "cladmin0000001", role: "ADMIN" };

const VALID_BODY = {
  content: "Hello world!",
  isPublic: true,
};

const MOCK_POST = {
  id: "clpost00000001",
  userId: AUTH_USER.id,
  content: "Hello world!",
  imageUrl: null,
  mediaType: null,
  eventId: null,
  venueId: null,
  isPublic: true,
  workoutId: null,
  sessionId: null,
  postType: "STANDARD",
  createdAt: new Date().toISOString(),
  user: { id: AUTH_USER.id, name: AUTH_USER.name, image: null },
  event: null,
  venue: null,
  workout: undefined,
};

function makePostRequest(body: unknown): NextRequest {
  return new Request("http://localhost/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function makeGetRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/posts");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url.toString(), {
    method: "GET",
  }) as unknown as NextRequest;
}

function makeDeleteRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/posts");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url.toString(), {
    method: "DELETE",
  }) as unknown as NextRequest;
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (requireIntegrity as jest.Mock).mockResolvedValue(null);
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
  (notifyEventNewPost as jest.Mock).mockResolvedValue(undefined);
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/posts
// ═══════════════════════════════════════════════════════════════════════════════

describe("POST /api/posts", () => {
  it("returns integrity error when integrity check fails", async () => {
    const integrityResponse = new Response(
      JSON.stringify({ error: "Integrity check failed" }),
      { status: 403 }
    );
    (requireIntegrity as jest.Mock).mockResolvedValue(integrityResponse);

    const res = await POST(makePostRequest(VALID_BODY));
    expect(res.status).toBe(403);
  });

  it("returns 401 when user is not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 for missing content", async () => {
    const res = await POST(makePostRequest({}));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
  });

  it("returns 400 for empty content", async () => {
    const res = await POST(makePostRequest({ content: "" }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
  });

  it("returns 400 for invalid imageUrl", async () => {
    const res = await POST(
      makePostRequest({ content: "test", imageUrl: "not-a-url" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
  });

  it("returns 400 for invalid postType", async () => {
    const res = await POST(
      makePostRequest({ content: "test", postType: "INVALID" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
  });

  it("returns 404 when eventId references non-existent event", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makePostRequest({ content: "test", eventId: "clnotfound000001" })
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Event not found");
  });

  it("returns 404 when venueId references non-existent venue", async () => {
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makePostRequest({ content: "test", venueId: "clnotfound000001" })
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Venue not found");
  });

  it("returns 404 when workoutId references inaccessible workout", async () => {
    (prisma.workout.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makePostRequest({ content: "test", workoutId: "clnotfound000001" })
    );
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Workout not found or access denied");
  });

  it("creates a basic post successfully (201)", async () => {
    (prisma.post.create as jest.Mock).mockResolvedValue(MOCK_POST);

    const res = await POST(makePostRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.content).toBe("Hello world!");
    expect(data.user.id).toBe(AUTH_USER.id);
    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: AUTH_USER.id,
          content: "Hello world!",
          isPublic: true,
        }),
      })
    );
  });

  it("creates a post with valid imageUrl", async () => {
    const body = {
      content: "Check this out",
      imageUrl: "https://example.com/photo.jpg",
      mediaType: "image",
    };
    (prisma.post.create as jest.Mock).mockResolvedValue({
      ...MOCK_POST,
      ...body,
    });

    const res = await POST(makePostRequest(body));
    expect(res.status).toBe(201);
  });

  it("creates a post with event and sends notification", async () => {
    const eventId = "clevent0000001";
    const mockEvent = { id: eventId, title: "Test Event", slug: "test-event" };
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
    (prisma.post.create as jest.Mock).mockResolvedValue({
      ...MOCK_POST,
      eventId,
      event: mockEvent,
    });

    const res = await POST(
      makePostRequest({ content: "Event post!", eventId })
    );
    expect(res.status).toBe(201);
    expect(notifyEventNewPost).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId,
        eventSlug: "test-event",
        eventTitle: "Test Event",
        authorId: AUTH_USER.id,
      })
    );
  });

  it("creates a post with venue after verifying venue exists", async () => {
    const venueId = "clvenue0000001";
    (prisma.venue.findUnique as jest.Mock).mockResolvedValue({
      id: venueId,
      name: "Test Venue",
    });
    (prisma.post.create as jest.Mock).mockResolvedValue({
      ...MOCK_POST,
      venueId,
    });

    const res = await POST(
      makePostRequest({ content: "Venue post!", venueId })
    );
    expect(res.status).toBe(201);
  });

  it("creates a WOD post with workout after verifying access", async () => {
    const workoutId = "clworkout00001";
    (prisma.workout.findFirst as jest.Mock).mockResolvedValue({
      id: workoutId,
      name: "WOD",
    });
    (prisma.post.create as jest.Mock).mockResolvedValue({
      ...MOCK_POST,
      workoutId,
      postType: "WOD",
    });

    const res = await POST(
      makePostRequest({
        content: "Completed the WOD!",
        workoutId,
        postType: "WOD",
      })
    );
    expect(res.status).toBe(201);
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.post.create as jest.Mock).mockRejectedValue(
      new Error("DB connection lost")
    );

    const res = await POST(makePostRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/posts
// ═══════════════════════════════════════════════════════════════════════════════

describe("GET /api/posts", () => {
  const MOCK_POSTS = [
    { ...MOCK_POST, _count: { likes: 2, comments: 1 }, likes: [] },
  ];

  beforeEach(() => {
    (prisma.post.count as jest.Mock).mockResolvedValue(1);
    (prisma.post.findMany as jest.Mock).mockResolvedValue(MOCK_POSTS);
  });

  it("returns public posts for unauthenticated feed request", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest({ feed: "true" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublic: true },
      })
    );
  });

  it("returns feed with participating event posts for authenticated user", async () => {
    (prisma.participation.findMany as jest.Mock).mockResolvedValue([
      { eventId: "clevent0000001" },
      { eventId: "clevent0000002" },
    ]);

    const res = await GET(makeGetRequest({ feed: "true" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { isPublic: true },
            { eventId: { in: ["clevent0000001", "clevent0000002"] } },
          ],
        },
      })
    );
    expect(data.pagination).toBeDefined();
  });

  it("returns feed without event filter when user has no participations", async () => {
    (prisma.participation.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET(makeGetRequest({ feed: "true" }));

    expect(res.status).toBe(200);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ isPublic: true }] },
      })
    );
  });

  it("filters by eventId", async () => {
    const res = await GET(makeGetRequest({ eventId: "clevent0000001" }));

    expect(res.status).toBe(200);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { eventId: "clevent0000001" },
      })
    );
  });

  it("filters by venueId", async () => {
    const res = await GET(makeGetRequest({ venueId: "clvenue0000001" }));

    expect(res.status).toBe(200);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { venueId: "clvenue0000001" },
      })
    );
  });

  it("filters by userId", async () => {
    const res = await GET(makeGetRequest({ userId: "cluser00000001" }));

    expect(res.status).toBe(200);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "cluser00000001" },
      })
    );
  });

  it("returns correct pagination metadata", async () => {
    (prisma.post.count as jest.Mock).mockResolvedValue(25);
    (prisma.post.findMany as jest.Mock).mockResolvedValue(
      Array(10).fill(MOCK_POSTS[0])
    );

    const res = await GET(
      makeGetRequest({ feed: "true", page: "2", pageSize: "10" })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.pagination).toEqual({
      page: 2,
      pageSize: 10,
      totalCount: 25,
      totalPages: 3,
      hasMore: true,
    });
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      })
    );
  });

  it("returns hasMore false on last page", async () => {
    (prisma.post.count as jest.Mock).mockResolvedValue(5);
    (prisma.post.findMany as jest.Mock).mockResolvedValue(
      Array(5).fill(MOCK_POSTS[0])
    );

    const res = await GET(makeGetRequest({ feed: "true" }));
    const data = await res.json();

    expect(data.pagination.hasMore).toBe(false);
    expect(data.pagination.totalPages).toBe(1);
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.post.count as jest.Mock).mockRejectedValue(
      new Error("DB connection lost")
    );

    const res = await GET(makeGetRequest({ feed: "true" }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE /api/posts
// ═══════════════════════════════════════════════════════════════════════════════

describe("DELETE /api/posts", () => {
  it("returns integrity error when integrity check fails", async () => {
    const integrityResponse = new Response(
      JSON.stringify({ error: "Integrity check failed" }),
      { status: 403 }
    );
    (requireIntegrity as jest.Mock).mockResolvedValue(integrityResponse);

    const res = await DELETE(makeDeleteRequest({ id: "clpost00000001" }));
    expect(res.status).toBe(403);
  });

  it("returns 401 when user is not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest({ id: "clpost00000001" }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 when post ID is missing", async () => {
    const res = await DELETE(makeDeleteRequest());
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Post ID is required");
  });

  it("returns 404 when post does not exist", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest({ id: "clnotfound000001" }));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 403 when user does not own the post", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({
      userId: "clother00000001",
      imageUrl: null,
    });

    const res = await DELETE(makeDeleteRequest({ id: "clpost00000001" }));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toBe("Forbidden");
  });

  it("allows admin to delete any post", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({
      userId: "clother00000001",
      imageUrl: null,
    });
    (prisma.post.delete as jest.Mock).mockResolvedValue({});

    const res = await DELETE(makeDeleteRequest({ id: "clpost00000001" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Post deleted successfully");
  });

  it("deletes own post successfully", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({
      userId: AUTH_USER.id,
      imageUrl: null,
    });
    (prisma.post.delete as jest.Mock).mockResolvedValue({});

    const res = await DELETE(makeDeleteRequest({ id: "clpost00000001" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Post deleted successfully");
    expect(prisma.post.delete).toHaveBeenCalledWith({
      where: { id: "clpost00000001" },
    });
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.post.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB connection lost")
    );

    const res = await DELETE(makeDeleteRequest({ id: "clpost00000001" }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
});

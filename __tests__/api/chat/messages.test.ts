/**
 * @jest-environment node
 */

/**
 * Tests for GET/POST /api/chat/conversations/[id]/messages
 *
 * Covers:
 * - GET: unauthorized request → 401
 * - GET: non-participant → 403
 * - GET: returns messages with pagination
 * - GET: supports cursor-based pagination
 * - GET: error handling → 500
 * - POST: unauthorized request → 401
 * - POST: integrity check failure
 * - POST: missing/empty content → 400
 * - POST: non-participant → 403
 * - POST: successful message creation
 * - POST: error handling → 500
 */

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/chat/conversations/[id]/messages/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));
import { getAuthUser } from "@/lib/auth-utils";

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn(),
}));
import { requireIntegrity } from "@/lib/verify-integrity";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    conversationParticipant: { findFirst: jest.fn(), findMany: jest.fn() },
    message: { findMany: jest.fn(), create: jest.fn() },
    conversation: { update: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/push-notifications", () => ({
  sendChatMessageNotification: jest.fn().mockResolvedValue(undefined),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const CONVERSATION_ID = "conv-1";

const MOCK_USER = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  role: "USER",
  image: null,
};

const MOCK_MESSAGE = {
  id: "msg-1",
  conversationId: CONVERSATION_ID,
  senderId: "user-1",
  content: "Hello world",
  createdAt: new Date("2026-01-01"),
  sender: { id: "user-1", name: "Test User", image: null },
};

function makeGetRequest(
  cursor?: string,
  limit?: string
): [Request, { params: Promise<{ id: string }> }] {
  const url = new URL(
    `http://localhost/api/chat/conversations/${CONVERSATION_ID}/messages`
  );
  if (cursor) url.searchParams.set("cursor", cursor);
  if (limit) url.searchParams.set("limit", limit);

  return [
    new Request(url.toString(), { method: "GET" }),
    { params: Promise.resolve({ id: CONVERSATION_ID }) },
  ];
}

function makePostRequest(
  body: Record<string, unknown>
): [NextRequest, { params: Promise<{ id: string }> }] {
  return [
    new NextRequest(
      `http://localhost/api/chat/conversations/${CONVERSATION_ID}/messages`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    ),
    { params: Promise.resolve({ id: CONVERSATION_ID }) },
  ];
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (requireIntegrity as jest.Mock).mockResolvedValue(null);
});

describe("GET /api/chat/conversations/[id]/messages", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(null);

    const [req, ctx] = makeGetRequest();
    const res = await GET(req, ctx);
    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not a participant", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.conversationParticipant.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const [req, ctx] = makeGetRequest();
    const res = await GET(req, ctx);
    expect(res.status).toBe(403);

    const body = await res.json();
    expect(body.error).toBe("Not authorized to view this conversation");
  });

  it("returns messages in chronological order", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.conversationParticipant.findFirst as jest.Mock).mockResolvedValue({
      id: "p-1",
    });

    const messages = [
      { ...MOCK_MESSAGE, id: "msg-2", createdAt: new Date("2026-01-02") },
      { ...MOCK_MESSAGE, id: "msg-1", createdAt: new Date("2026-01-01") },
    ];
    (prisma.message.findMany as jest.Mock).mockResolvedValue(messages);

    const [req, ctx] = makeGetRequest();
    const res = await GET(req, ctx);
    expect(res.status).toBe(200);

    const body = await res.json();
    // Messages are reversed to show oldest first
    expect(body.messages).toHaveLength(2);
    expect(body.nextCursor).toBeNull();
  });

  it("returns nextCursor when limit is reached", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.conversationParticipant.findFirst as jest.Mock).mockResolvedValue({
      id: "p-1",
    });

    // Create messages equal to the limit (2 for this test)
    const messages = [
      { ...MOCK_MESSAGE, id: "msg-2" },
      { ...MOCK_MESSAGE, id: "msg-1" },
    ];
    (prisma.message.findMany as jest.Mock).mockResolvedValue(messages);

    const [req, ctx] = makeGetRequest(undefined, "2");
    const res = await GET(req, ctx);
    const body = await res.json();

    expect(body.nextCursor).toBe("msg-1");
  });

  it("supports cursor-based pagination", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.conversationParticipant.findFirst as jest.Mock).mockResolvedValue({
      id: "p-1",
    });
    (prisma.message.findMany as jest.Mock).mockResolvedValue([]);

    const [req, ctx] = makeGetRequest("cursor-msg-id");
    await GET(req, ctx);

    expect(prisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: { id: "cursor-msg-id" },
        skip: 1,
      })
    );
  });

  it("returns 500 on internal error", async () => {
    (getAuthUser as jest.Mock).mockRejectedValue(new Error("DB error"));

    const [req, ctx] = makeGetRequest();
    const res = await GET(req, ctx);
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBe("Failed to fetch messages");
  });
});

describe("POST /api/chat/conversations/[id]/messages", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(null);

    const [req, ctx] = makePostRequest({ content: "Hello" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(401);
  });

  it("returns integrity error when integrity check fails", async () => {
    const { NextResponse } = await import("next/server");
    (requireIntegrity as jest.Mock).mockResolvedValue(
      NextResponse.json({ error: "Integrity check failed" }, { status: 403 })
    );

    const [req, ctx] = makePostRequest({ content: "Hello" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(403);
  });

  it("returns 400 when content is missing", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);

    const [req, ctx] = makePostRequest({});
    const res = await POST(req, ctx);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("Message content is required");
  });

  it("returns 400 when content is empty string", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);

    const [req, ctx] = makePostRequest({ content: "   " });
    const res = await POST(req, ctx);
    expect(res.status).toBe(400);
  });

  it("returns 400 when content is not a string", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);

    const [req, ctx] = makePostRequest({ content: 123 });
    const res = await POST(req, ctx);
    expect(res.status).toBe(400);
  });

  it("returns 403 when user is not a participant", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.conversationParticipant.findFirst as jest.Mock).mockResolvedValue(
      null
    );

    const [req, ctx] = makePostRequest({ content: "Hello" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(403);

    const body = await res.json();
    expect(body.error).toBe(
      "Not authorized to send messages to this conversation"
    );
  });

  it("creates message and returns it with participant IDs", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.conversationParticipant.findFirst as jest.Mock).mockResolvedValue({
      id: "p-1",
    });
    (prisma.message.create as jest.Mock).mockResolvedValue(MOCK_MESSAGE);
    (prisma.conversationParticipant.findMany as jest.Mock).mockResolvedValue([
      {
        userId: "user-1",
        user: { id: "user-1", pushNotificationsEnabled: false },
      },
      {
        userId: "user-2",
        user: { id: "user-2", pushNotificationsEnabled: true },
      },
    ]);
    (prisma.conversation.update as jest.Mock).mockResolvedValue({});

    const [req, ctx] = makePostRequest({ content: "Hello" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.message.id).toBe("msg-1");
    expect(body.participantUserIds).toEqual(["user-1", "user-2"]);
  });

  it("trims message content", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.conversationParticipant.findFirst as jest.Mock).mockResolvedValue({
      id: "p-1",
    });
    (prisma.message.create as jest.Mock).mockResolvedValue(MOCK_MESSAGE);
    (prisma.conversationParticipant.findMany as jest.Mock).mockResolvedValue(
      []
    );
    (prisma.conversation.update as jest.Mock).mockResolvedValue({});

    const [req, ctx] = makePostRequest({ content: "  Hello world  " });
    await POST(req, ctx);

    expect(prisma.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: "Hello world",
        }),
      })
    );
  });

  it("returns 500 on internal error", async () => {
    (getAuthUser as jest.Mock).mockRejectedValue(new Error("DB error"));

    const [req, ctx] = makePostRequest({ content: "Hello" });
    const res = await POST(req, ctx);
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBe("Failed to send message");
  });
});

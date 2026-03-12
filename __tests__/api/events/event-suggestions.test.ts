/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/event-suggestions
 *
 * Covers:
 * - Returns 401 when not authenticated
 * - Returns 400 when validation fails (missing required fields)
 * - Creates suggestion and returns 201 on valid input
 * - Creates suggestion even when email notification fails
 * - Returns 500 on database error
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/event-suggestions/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    adminNote: { create: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

const mockSend = jest.fn();
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const AUTH_USER = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  role: "USER",
};

function makeRequest(body: Record<string, unknown> = {}): NextRequest {
  return new NextRequest("http://localhost/api/event-suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  title: "Trail Run 2026",
  message: "Great event, please add it!",
  location: "Lisbon",
  date: "2026-06-01",
  sportType: "TRAIL",
  url: "https://example.com",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
});

describe("POST /api/event-suggestions", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 when required fields are missing", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);

    const res = await POST(makeRequest({ title: "A" }));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid data");
    expect(json.details).toBeDefined();
  });

  it("returns 400 when title is too short", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);

    const res = await POST(
      makeRequest({ title: "A", message: "Valid message here" })
    );

    expect(res.status).toBe(400);
  });

  it("creates suggestion and returns 201 on valid input", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.adminNote.create as jest.Mock).mockResolvedValue({
      id: "note-1",
      ...validBody,
      status: "pending",
    });
    mockSend.mockResolvedValue({ id: "email-1" });

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.id).toBe("note-1");

    expect(prisma.adminNote.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: AUTH_USER.id,
        type: "EVENT",
        title: validBody.title,
        message: validBody.message,
        status: "pending",
      }),
    });
  });

  it("creates suggestion with optional fields as null when not provided", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.adminNote.create as jest.Mock).mockResolvedValue({
      id: "note-2",
      status: "pending",
    });
    mockSend.mockResolvedValue({ id: "email-2" });

    const res = await POST(
      makeRequest({ title: "Trail Run", message: "Please add this" })
    );

    expect(res.status).toBe(201);
    expect(prisma.adminNote.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        location: null,
        date: null,
        sportType: null,
        url: null,
      }),
    });
  });

  it("still succeeds when email notification fails", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.adminNote.create as jest.Mock).mockResolvedValue({
      id: "note-3",
      status: "pending",
    });
    mockSend.mockRejectedValue(new Error("Email failed"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(201);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to send suggestion notification email:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("returns 500 on database error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.adminNote.create as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to submit suggestion",
    });

    consoleSpy.mockRestore();
  });

  it("returns 400 for invalid URL format", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);

    const res = await POST(makeRequest({ ...validBody, url: "not-a-url" }));

    expect(res.status).toBe(400);
  });

  it("accepts empty string as URL", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.adminNote.create as jest.Mock).mockResolvedValue({
      id: "note-4",
      status: "pending",
    });
    mockSend.mockResolvedValue({ id: "email-4" });

    const res = await POST(makeRequest({ ...validBody, url: "" }));

    expect(res.status).toBe(201);
  });
});

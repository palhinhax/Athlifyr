/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET, PUT } from "@/app/api/events/[id]/translations/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    eventTranslation: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
    eventVariant: {
      findMany: jest.fn(),
    },
    event: {
      findUnique: jest.fn(),
    },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) });

function makePutRequest(id: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost/api/events/${id}/translations`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const TRANSLATIONS = [
  { language: "en", title: "Trail Run", description: "A run", eventId: "e1" },
  {
    language: "pt",
    title: "Trail Corrida",
    description: "Uma corrida",
    eventId: "e1",
  },
];

const VARIANTS = [
  { id: "v1", translations: [{ language: "en", name: "10K" }] },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.resetAllMocks());

describe("GET /api/events/[id]/translations", () => {
  it("returns translations and variant translations", async () => {
    (prisma.eventTranslation.findMany as jest.Mock).mockResolvedValue(
      TRANSLATIONS
    );
    (prisma.eventVariant.findMany as jest.Mock).mockResolvedValue(VARIANTS);

    const res = await GET(
      new Request("http://localhost/api/events/e1/translations"),
      mockParams("e1")
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.translations).toEqual(TRANSLATIONS);
    expect(body.variantTranslations).toHaveProperty("v1");
  });

  it("returns 500 on database error", async () => {
    (prisma.eventTranslation.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(
      new Request("http://localhost/api/events/e1/translations"),
      mockParams("e1")
    );

    expect(res.status).toBe(500);
  });
});

describe("PUT /api/events/[id]/translations", () => {
  it("returns 401 when user is not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await PUT(
      makePutRequest("e1", { translations: [] }),
      mockParams("e1")
    );

    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not admin", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "u1",
      role: "USER",
    });

    const res = await PUT(
      makePutRequest("e1", { translations: [] }),
      mockParams("e1")
    );

    expect(res.status).toBe(403);
  });

  it("returns 400 when translations is not an array", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "u1",
      role: "ADMIN",
    });

    const res = await PUT(
      makePutRequest("e1", { translations: "not-array" }),
      mockParams("e1")
    );

    expect(res.status).toBe(400);
  });

  it("returns 404 when event not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "u1",
      role: "ADMIN",
    });
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await PUT(
      makePutRequest("e1", {
        translations: [{ language: "en", title: "T", description: "D" }],
      }),
      mockParams("e1")
    );

    expect(res.status).toBe(404);
  });

  it("upserts translations for valid input", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "u1",
      role: "ADMIN",
    });
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({ id: "e1" });
    (prisma.eventTranslation.upsert as jest.Mock).mockResolvedValue({
      id: "t1",
    });

    const res = await PUT(
      makePutRequest("e1", {
        translations: [{ language: "en", title: "Trail", description: "Run" }],
      }),
      mockParams("e1")
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBe("Translations updated successfully");
    expect(prisma.eventTranslation.upsert).toHaveBeenCalled();
  });

  it("deletes translations when title and description are empty", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "u1",
      role: "ADMIN",
    });
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({ id: "e1" });
    (prisma.eventTranslation.deleteMany as jest.Mock).mockResolvedValue({
      count: 1,
    });

    const res = await PUT(
      makePutRequest("e1", {
        translations: [{ language: "en", title: "", description: "" }],
      }),
      mockParams("e1")
    );

    expect(res.status).toBe(200);
    expect(prisma.eventTranslation.deleteMany).toHaveBeenCalled();
  });

  it("returns 500 on database error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "u1",
      role: "ADMIN",
    });
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await PUT(
      makePutRequest("e1", {
        translations: [{ language: "en", title: "T", description: "D" }],
      }),
      mockParams("e1")
    );

    expect(res.status).toBe(500);
  });
});

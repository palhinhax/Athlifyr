/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";
import { GET } from "@/app/api/venues/[id]/purchases/route";
import { prisma } from "@/lib/prisma";

// Mock auth
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueProductPurchase: {
      findMany: jest.fn(),
    },
  },
}));

// Mock authorization
const mockCanManageVenue = jest.fn();
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: (...args: unknown[]) => mockCanManageVenue(...args),
}));

// Mock stripe-route-helpers (authenticateVenueManager used by GET)
const mockAuthenticateVenueManager = jest.fn();
jest.mock("@/lib/venues/stripe-route-helpers", () => ({
  authenticateVenueManager: (...args: unknown[]) =>
    mockAuthenticateVenueManager(...args),
}));

const venueId = "venue-1";
const userId = "user-1";

const makeParams = () =>
  ({ params: Promise.resolve({ id: venueId }) }) as {
    params: Promise<{ id: string }>;
  };

describe("GET /api/venues/[id]/purchases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    });

    const req = new Request(`http://localhost/api/venues/${venueId}/purchases`);
    const res = (await GET(req, makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
    expect(prisma.venueProductPurchase.findMany).not.toHaveBeenCalled();
  });

  it("returns 403 when not authorized to manage venue", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    });

    const req = new Request(`http://localhost/api/venues/${venueId}/purchases`);
    const res = (await GET(req, makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
    expect(prisma.venueProductPurchase.findMany).not.toHaveBeenCalled();
  });

  it("returns all purchases when authorized with no filters", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      session: { user: { id: userId } },
      venue: { id: venueId },
    });

    const purchases = [
      {
        id: "purchase-1",
        venueId,
        status: "CONFIRMED",
        product: { name: "Water" },
        user: { name: "John", email: "john@test.com", image: null },
      },
    ];
    (prisma.venueProductPurchase.findMany as jest.Mock).mockResolvedValue(
      purchases
    );

    const req = new Request(`http://localhost/api/venues/${venueId}/purchases`);
    const res = (await GET(req, makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.purchases).toEqual(purchases);
    expect(prisma.venueProductPurchase.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { venueId },
        take: 50,
      })
    );
  });

  it("filters purchases by status", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      session: { user: { id: userId } },
      venue: { id: venueId },
    });
    (prisma.venueProductPurchase.findMany as jest.Mock).mockResolvedValue([]);

    const req = new Request(
      `http://localhost/api/venues/${venueId}/purchases?status=REFUNDED`
    );
    const res = (await GET(req, makeParams()))!;

    expect(res.status).toBe(200);
    expect(prisma.venueProductPurchase.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { venueId, status: "REFUNDED" },
      })
    );
  });

  it("returns 400 for invalid status parameter", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      session: { user: { id: userId } },
      venue: { id: venueId },
    });

    const req = new Request(
      `http://localhost/api/venues/${venueId}/purchases?status=INVALID`
    );
    const res = (await GET(req, makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid status parameter");
    expect(prisma.venueProductPurchase.findMany).not.toHaveBeenCalled();
  });

  it("respects limit parameter (capped at 200)", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      session: { user: { id: userId } },
      venue: { id: venueId },
    });
    (prisma.venueProductPurchase.findMany as jest.Mock).mockResolvedValue([]);

    const req = new Request(
      `http://localhost/api/venues/${venueId}/purchases?limit=10`
    );
    await GET(req, makeParams());

    expect(prisma.venueProductPurchase.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    );
  });

  it("caps limit at 200", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      session: { user: { id: userId } },
      venue: { id: venueId },
    });
    (prisma.venueProductPurchase.findMany as jest.Mock).mockResolvedValue([]);

    const req = new Request(
      `http://localhost/api/venues/${venueId}/purchases?limit=999`
    );
    await GET(req, makeParams());

    expect(prisma.venueProductPurchase.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 200 })
    );
  });

  it("returns 500 on database error", async () => {
    mockAuthenticateVenueManager.mockResolvedValue({
      session: { user: { id: userId } },
      venue: { id: venueId },
    });
    (prisma.venueProductPurchase.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = new Request(`http://localhost/api/venues/${venueId}/purchases`);
    const res = (await GET(req, makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to fetch purchases");
  });
});

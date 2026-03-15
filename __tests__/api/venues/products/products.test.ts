/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/venues/[id]/products/route";
import { prisma } from "@/lib/prisma";

// Mock auth
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueProduct: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock authorization
const mockCanManageVenue = jest.fn();
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: (...args: unknown[]) => mockCanManageVenue(...args),
}));

describe("GET /api/venues/[id]/products", () => {
  const venueId = "venue-1";
  const makeParams = () =>
    ({ params: Promise.resolve({ id: venueId }) }) as {
      params: Promise<{ id: string }>;
    };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns active products for public request (no all=true)", async () => {
    const products = [
      { id: "p1", name: "Product 1", isActive: true, price: 10, venueId },
    ];
    (prisma.venueProduct.findMany as jest.Mock).mockResolvedValue(products);

    const req = new Request("http://localhost/api/venues/venue-1/products");
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.products).toEqual(products);
    expect(prisma.venueProduct.findMany).toHaveBeenCalledWith({
      where: { venueId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns 401 when unauthenticated and all=true", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new Request(
      "http://localhost/api/venues/venue-1/products?all=true"
    );
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
    expect(prisma.venueProduct.findMany).not.toHaveBeenCalled();
  });

  it("returns 403 when not authorized and all=true", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const req = new Request(
      "http://localhost/api/venues/venue-1/products?all=true"
    );
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
    expect(prisma.venueProduct.findMany).not.toHaveBeenCalled();
  });

  it("returns all products (including inactive) when authorized and all=true", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const products = [
      { id: "p1", name: "Product 1", isActive: true, venueId },
      { id: "p2", name: "Product 2", isActive: false, venueId },
    ];
    (prisma.venueProduct.findMany as jest.Mock).mockResolvedValue(products);

    const req = new Request(
      "http://localhost/api/venues/venue-1/products?all=true"
    );
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.products).toEqual(products);
    expect(prisma.venueProduct.findMany).toHaveBeenCalledWith({
      where: { venueId },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns 500 on database error", async () => {
    (prisma.venueProduct.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = new Request("http://localhost/api/venues/venue-1/products");
    const res = await GET(req, makeParams());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to fetch products");
  });
});

describe("POST /api/venues/[id]/products", () => {
  const venueId = "venue-1";
  const userId = "user-1";
  const makeParams = () =>
    ({ params: Promise.resolve({ id: venueId }) }) as {
      params: Promise<{ id: string }>;
    };
  const makeRequest = (body: object) =>
    new Request("http://localhost/api/venues/venue-1/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(
      makeRequest({ name: "Test", price: 10 }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 403 when not authorized to manage venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = await POST(
      makeRequest({ name: "Test", price: 10 }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
    expect(prisma.venueProduct.create).not.toHaveBeenCalled();
  });

  it("returns 400 when name is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const res = await POST(makeRequest({ price: 10 }), makeParams());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Name and a valid price are required");
    expect(prisma.venueProduct.create).not.toHaveBeenCalled();
  });

  it("returns 400 when price is not a number", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const res = await POST(
      makeRequest({ name: "Test", price: "invalid" }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Name and a valid price are required");
  });

  it("returns 400 when price is zero", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const res = await POST(
      makeRequest({ name: "Test", price: 0 }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Name and a valid price are required");
  });

  it("returns 400 when price is negative", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const res = await POST(
      makeRequest({ name: "Test", price: -5 }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Name and a valid price are required");
  });

  it("creates product successfully with minimal fields", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const createdProduct = {
      id: "p1",
      venueId,
      name: "Protein Bar",
      description: null,
      price: 5,
      currency: "EUR",
      stock: null,
    };
    (prisma.venueProduct.create as jest.Mock).mockResolvedValue(createdProduct);

    const res = await POST(
      makeRequest({ name: "Protein Bar", price: 5 }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.product).toEqual(createdProduct);
    expect(prisma.venueProduct.create).toHaveBeenCalledWith({
      data: {
        venueId,
        name: "Protein Bar",
        description: null,
        price: 5,
        currency: "EUR",
        stock: null,
      },
    });
  });

  it("creates product successfully with all fields", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });

    const createdProduct = {
      id: "p2",
      venueId,
      name: "Water Bottle",
      description: "500ml",
      price: 2.5,
      currency: "USD",
      stock: 100,
    };
    (prisma.venueProduct.create as jest.Mock).mockResolvedValue(createdProduct);

    const res = await POST(
      makeRequest({
        name: "Water Bottle",
        description: "500ml",
        price: 2.5,
        currency: "USD",
        stock: 100,
      }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.product).toEqual(createdProduct);
  });

  it("uses EUR as default currency when not provided", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.create as jest.Mock).mockResolvedValue({
      id: "p3",
      currency: "EUR",
    });

    await POST(makeRequest({ name: "Test", price: 10 }), makeParams());

    expect(prisma.venueProduct.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ currency: "EUR" }),
      })
    );
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.create as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(
      makeRequest({ name: "Test", price: 10 }),
      makeParams()
    );
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to create product");
  });
});

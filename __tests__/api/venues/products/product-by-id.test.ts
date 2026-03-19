/**
 * @jest-environment node
 */

import {
  PATCH,
  DELETE,
} from "@/app/api/venues/[id]/products/[productId]/route";
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
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock authorization
const mockCanManageVenue = jest.fn();
jest.mock("@/lib/venues/authorization", () => ({
  canManageVenue: (...args: unknown[]) => mockCanManageVenue(...args),
}));

const venueId = "venue-1";
const productId = "product-1";
const userId = "user-1";

const makeParams = () =>
  ({
    params: Promise.resolve({ id: venueId, productId }),
  }) as {
    params: Promise<{ id: string; productId: string }>;
  };

describe("PATCH /api/venues/[id]/products/[productId]", () => {
  const makeRequest = (body: object) =>
    new Request(
      `http://localhost/api/venues/${venueId}/products/${productId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = (await PATCH(makeRequest({ name: "Updated" }), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 403 when not authorized to manage venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = (await PATCH(makeRequest({ name: "Updated" }), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
    expect(prisma.venueProduct.findFirst).not.toHaveBeenCalled();
  });

  it("returns 404 when product does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue(null);

    const res = (await PATCH(makeRequest({ name: "Updated" }), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Product not found");
    expect(prisma.venueProduct.update).not.toHaveBeenCalled();
  });

  it("updates product name successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
      name: "Old Name",
    });
    const updated = { id: productId, name: "New Name", venueId };
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue(updated);

    const res = (await PATCH(makeRequest({ name: "New Name" }), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.product).toEqual(updated);
    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: { name: "New Name" },
    });
  });

  it("updates product price, stock and isActive successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
    });
    const updated = { id: productId, price: 15, stock: 50, isActive: false };
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue(updated);

    const res = (await PATCH(
      makeRequest({ price: 15, stock: 50, isActive: false }),
      makeParams()
    ))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.product).toEqual(updated);
    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: { price: 15, stock: 50, isActive: false },
    });
  });

  it("returns 400 when price is not a valid positive number", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
    });

    const res = (await PATCH(makeRequest({ price: -5 }), makeParams()))!;
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid price");
  });

  it("returns 400 when price is zero", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
    });

    const res = (await PATCH(makeRequest({ price: 0 }), makeParams()))!;
    expect(res.status).toBe(400);
  });

  it("returns 400 when currency is invalid", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
    });

    const res = (await PATCH(
      makeRequest({ currency: "INVALID" }),
      makeParams()
    ))!;
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBe("Unsupported currency");
  });

  it("returns 400 when stock is negative", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
    });

    const res = (await PATCH(makeRequest({ stock: -1 }), makeParams()))!;
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid stock");
  });

  it("returns 400 when stock is not an integer", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
    });

    const res = (await PATCH(makeRequest({ stock: 1.5 }), makeParams()))!;
    expect(res.status).toBe(400);
  });

  it("does not include undefined fields in update data", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
    });
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue({
      id: productId,
    });

    await PATCH(makeRequest({ name: "Only Name" }), makeParams());

    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: { name: "Only Name" },
    });
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = (await PATCH(makeRequest({ name: "Test" }), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to update product");
  });
});

describe("DELETE /api/venues/[id]/products/[productId]", () => {
  const makeRequest = () =>
    new Request(
      `http://localhost/api/venues/${venueId}/products/${productId}`,
      { method: "DELETE" }
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = (await DELETE(makeRequest(), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 403 when not authorized to manage venue", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: false });

    const res = (await DELETE(makeRequest(), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toBe("Forbidden");
    expect(prisma.venueProduct.findFirst).not.toHaveBeenCalled();
  });

  it("returns 404 when product does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue(null);

    const res = (await DELETE(makeRequest(), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Product not found");
    expect(prisma.venueProduct.update).not.toHaveBeenCalled();
  });

  it("soft-deletes product by marking as inactive", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockResolvedValue({
      id: productId,
      venueId,
      name: "Product",
      isActive: true,
    });
    (prisma.venueProduct.update as jest.Mock).mockResolvedValue({
      id: productId,
      isActive: false,
    });

    const res = (await DELETE(makeRequest(), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prisma.venueProduct.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: { isActive: false },
    });
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: userId } });
    mockCanManageVenue.mockResolvedValue({ authorized: true });
    (prisma.venueProduct.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = (await DELETE(makeRequest(), makeParams()))!;
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Failed to delete product");
  });
});

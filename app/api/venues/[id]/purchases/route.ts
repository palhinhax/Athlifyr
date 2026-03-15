import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";

/**
 * GET /api/venues/[id]/purchases — List recent product purchases (staff only)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = (await params).id;

    const allowed = await canManageVenue(session.user.id, venueId);
    if (!allowed.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "50", 10),
      200
    );
    const ALLOWED_STATUSES = [
      "CREATED",
      "CONFIRMED",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
    ] as const;
    type PurchaseStatus = (typeof ALLOWED_STATUSES)[number];
    const statusParam = searchParams.get("status");

    if (
      statusParam !== null &&
      !ALLOWED_STATUSES.includes(statusParam as PurchaseStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid status parameter" },
        { status: 400 }
      );
    }

    const status = statusParam as PurchaseStatus | null;

    const purchases = await prisma.venueProductPurchase.findMany({
      where: {
        venueId,
        ...(status ? { status } : {}),
      },
      include: {
        product: { select: { name: true } },
        user: { select: { name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Error fetching venue purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}

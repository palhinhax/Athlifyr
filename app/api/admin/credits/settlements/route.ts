import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getVenuePendingBalance,
  getVenueSettlementHistory,
  retrySettlement,
  settleVenueManually,
} from "@/lib/credits";

// GET - Admin: Get venue settlement overview or single venue details
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get("venueId");

    if (venueId) {
      // Single venue details
      const pending = await getVenuePendingBalance(venueId);
      const settlements = await getVenueSettlementHistory(venueId, {
        limit: 20,
      });

      return NextResponse.json({ pending, settlements });
    }

    // Overview: all venues with pending balances
    const venuesWithPending = await prisma.venueLedgerEntry.groupBy({
      by: ["venueId"],
      where: { status: "PENDING" },
      _sum: { amountCents: true },
      _count: { id: true },
    });

    const venueIds = venuesWithPending.map((v) => v.venueId);
    const venues = await prisma.venue.findMany({
      where: { id: { in: venueIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        stripeAccountId: true,
        stripePayoutsEnabled: true,
      },
    });

    const venueMap = new Map(venues.map((v) => [v.id, v]));

    const overview = venuesWithPending.map((vp) => ({
      venueId: vp.venueId,
      venue: venueMap.get(vp.venueId),
      pendingAmountCents: vp._sum.amountCents ?? 0,
      pendingEntriesCount: vp._count.id,
    }));

    // Recent settlement batches
    const recentSettlements = await prisma.venueSettlementBatch.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        venue: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({ overview, recentSettlements });
  } catch (error) {
    console.error("Error fetching admin settlements:", error);
    return NextResponse.json(
      { error: "Failed to fetch settlements" },
      { status: 500 }
    );
  }
}

// POST - Admin: Retry a failed settlement
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { batchId, venueId, action } = body;

    // Manual settlement for a venue
    if (action === "settle" && venueId) {
      await settleVenueManually(venueId);
      return NextResponse.json({ success: true });
    }

    // Retry a failed batch
    if (!batchId) {
      return NextResponse.json(
        { error: "batchId is required" },
        { status: 400 }
      );
    }

    await retrySettlement(batchId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error retrying settlement:", error);
    const message =
      error instanceof Error ? error.message : "Failed to retry settlement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

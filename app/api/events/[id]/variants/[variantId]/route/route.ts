import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { parseGpx, type ParsedGpx } from "@/lib/gpx-parser";

// ─── GET /api/events/[id]/variants/[variantId]/route ─────────────────────────
// Returns the route (GPX + checkpoints) for a specific variant.
// Public — no auth required (used by mobile for live tracking).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { variantId } = await params;

    const route = await prisma.eventRoute.findUnique({
      where: { variantId },
      include: {
        checkpoints: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!route) {
      return NextResponse.json({ route: null }, { status: 200 });
    }

    return NextResponse.json({ route }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/events/[id]/variants/[variantId]/route ─────────────────────────
// Upserts the route for a variant. Accepts either:
//   - { gpxData: string } — parse GPX and extract points + stats
//   - { routePoints: [lat,lng][], distanceKm?, elevationGainM?, elevationLossM? } — manual
// Also accepts { checkpoints: RouteCheckpoint[] } in the same body.
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId, variantId } = await params;

    // Verify user owns / organises this event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        organizers: { select: { userId: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const isOrganizer = event.organizers.some((o) => o.userId === user.id);
    const isAdmin = user.role === "ADMIN" || user.role === "MOD";

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify variant belongs to this event
    const variant = await prisma.eventVariant.findFirst({
      where: { id: variantId, eventId },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      gpxData?: string;
      routePoints?: [number, number][];
      distanceKm?: number | null;
      elevationGainM?: number | null;
      elevationLossM?: number | null;
      checkpoints?: {
        id?: string;
        name: string;
        type: "START" | "FINISH" | "INTERMEDIATE" | "TRANSITION";
        order: number;
        latitude: number;
        longitude: number;
        radiusM?: number;
        cutoffMin?: number | null;
      }[];
    };

    let parsed: ParsedGpx | null = null;

    if (body.gpxData) {
      parsed = parseGpx(body.gpxData);
    }

    const routeData = {
      gpxData: body.gpxData ?? null,
      routePoints: parsed?.routePoints ?? body.routePoints ?? [],
      distanceKm:
        body.distanceKm !== undefined
          ? body.distanceKm
          : (parsed?.distanceKm ?? null),
      elevationGainM:
        body.elevationGainM !== undefined
          ? body.elevationGainM
          : (parsed?.elevationGainM ?? null),
      elevationLossM:
        body.elevationLossM !== undefined
          ? body.elevationLossM
          : (parsed?.elevationLossM ?? null),
    };

    // Upsert the route
    const route = await prisma.eventRoute.upsert({
      where: { variantId },
      create: { variantId, ...routeData },
      update: routeData,
    });

    // Replace checkpoints if provided
    if (body.checkpoints !== undefined) {
      await prisma.routeCheckpoint.deleteMany({
        where: { routeId: route.id },
      });

      if (body.checkpoints.length > 0) {
        await prisma.routeCheckpoint.createMany({
          data: body.checkpoints.map((cp) => ({
            routeId: route.id,
            name: cp.name,
            type: cp.type,
            order: cp.order,
            latitude: cp.latitude,
            longitude: cp.longitude,
            radiusM: cp.radiusM ?? 50,
            cutoffMin: cp.cutoffMin ?? null,
          })),
        });
      }
    }

    // Return full route with checkpoints
    const fullRoute = await prisma.eventRoute.findUnique({
      where: { variantId },
      include: { checkpoints: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({ route: fullRoute }, { status: 200 });
  } catch (error) {
    console.error("Error saving event route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/events/[id]/variants/[variantId]/route ──────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId, variantId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN" || user.role === "MOD";
    if (!isAdmin) {
      // Only admins can delete — organisers use the PUT endpoint to clear
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.eventRoute.delete({ where: { variantId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

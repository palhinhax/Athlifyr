import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── GET /api/events/[id]/route ──────────────────────────────────────────────
// Returns route data for ALL variants of an event.
// Public — no auth required (used by mobile live-race screen).
// Response: { variants: [{ variantId, variantName, routePoints, checkpoints }] }
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    const eventVariants = await prisma.eventVariant.findMany({
      where: { eventId },
      select: {
        id: true,
        name: true,
        route: {
          select: {
            routePoints: true,
            checkpoints: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                name: true,
                type: true,
                latitude: true,
                longitude: true,
                order: true,
                radiusM: true,
                cutoffMin: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const variants = eventVariants
      .filter((v) => v.route !== null)
      .map((v) => ({
        variantId: v.id,
        variantName: v.name,
        routePoints: v.route!.routePoints as [number, number][],
        checkpoints: v.route!.checkpoints,
      }));

    return NextResponse.json({ variants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event routes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

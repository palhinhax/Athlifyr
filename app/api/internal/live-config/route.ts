// ============================================================================
// Internal API: GET /api/internal/live-config?eventId=...
//
// Called by the Live Service to fetch persistent event configuration.
// Authenticated via X-Live-Server header + JWT (or shared secret).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLiveServer } from "@/lib/internal-auth";

export async function GET(request: NextRequest) {
  // Validate caller
  if (!isLiveServer(request)) {
    return NextResponse.json(
      { error: "Forbidden — internal endpoint" },
      { status: 403 }
    );
  }

  const eventId = request.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json(
      { error: "Missing eventId parameter" },
      { status: 400 }
    );
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        endDate: true,
        hasLiveRace: true,
        liveStatus: true,
        city: true,
        country: true,
        variants: {
          select: {
            id: true,
            name: true,
            distanceKm: true,
            elevationGainM: true,
            elevationLossM: true,
            startDate: true,
            startTime: true,
            cutoffTimeHours: true,
            route: {
              select: {
                id: true,
                variantId: true,
                routePoints: true,
                distanceKm: true,
                elevationGainM: true,
                elevationLossM: true,
                checkpoints: {
                  orderBy: { order: "asc" },
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    order: true,
                    latitude: true,
                    longitude: true,
                    radiusM: true,
                    cutoffMin: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.hasLiveRace) {
      return NextResponse.json(
        { error: "LiveRace is not enabled for this event" },
        { status: 400 }
      );
    }

    // Build variant configs (only variants that have a route)
    const variantConfigs = event.variants
      .filter((v) => v.route)
      .map((v) => {
        const route = v.route!;
        const routePoints = route.routePoints as [number, number][];

        return {
          variantId: v.id,
          variantName: v.name,
          distanceKm: route.distanceKm ?? v.distanceKm ?? 0,
          elevationGainM: route.elevationGainM ?? v.elevationGainM ?? 0,
          elevationLossM: route.elevationLossM ?? v.elevationLossM ?? 0,
          startDate: v.startDate ?? event.startDate,
          startTime: v.startTime ?? null,
          cutoffTimeHours: v.cutoffTimeHours ?? null,
          routePoints,
          checkpoints: route.checkpoints.map((cp) => ({
            id: cp.id,
            name: cp.name,
            type: cp.type,
            order: cp.order,
            latitude: cp.latitude,
            longitude: cp.longitude,
            radiusM: cp.radiusM,
            cutoffMin: cp.cutoffMin,
          })),
        };
      });

    return NextResponse.json({
      eventId: event.id,
      title: event.title,
      slug: event.slug,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate?.toISOString() ?? null,
      liveStatus: event.liveStatus,
      city: event.city,
      country: event.country,
      // Default settings (can be stored in DB later)
      settings: {
        deviationThresholdM: 150, // max meters off-route before flagging
        minUpdateFrequencyMs: 3000, // expect GPS updates every 3s
        inactiveTimeoutMs: 30000, // mark athlete inactive after 30s silence
        maxSpeedKmh: 50, // anti-cheat: reject impossible speeds
        leaderboardBroadcastMs: 2000, // broadcast leaderboard every 2s
        positionBroadcastMs: 1000, // broadcast positions every 1s
      },
      variants: variantConfigs,
    });
  } catch (error) {
    console.error("[Internal] Error fetching live config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

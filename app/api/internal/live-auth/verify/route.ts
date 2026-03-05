// ============================================================================
// Internal API: POST /api/internal/live-auth/verify
//
// Called by the Live Service to verify that a user is a registered athlete
// for a specific event/variant.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isLiveServer(request: NextRequest): boolean {
  const liveHeader = request.headers.get("x-live-server");
  if (liveHeader !== "true") return false;
  const secret = request.headers.get("x-live-secret");
  const expectedSecret = process.env.LIVE_INTERNAL_SECRET;
  if (expectedSecret && secret !== expectedSecret) return false;
  return true;
}

interface VerifyBody {
  userId: string;
  eventId: string;
}

export async function POST(request: NextRequest) {
  if (!isLiveServer(request)) {
    return NextResponse.json(
      { error: "Forbidden — internal endpoint" },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as VerifyBody;
    const { userId, eventId } = body;

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "Missing userId or eventId" },
        { status: 400 }
      );
    }

    // Check if user has a paid registration (CONFIRMED status)
    const registration = await prisma.registration.findFirst({
      where: {
        userId,
        eventId,
        status: "CONFIRMED",
      },
      select: {
        id: true,
        variantId: true,
        bibNumber: true,
        variant: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            liveRaceVisibility: true,
          },
        },
      },
    });

    // Also check free participations
    const participation = !registration
      ? await prisma.participation.findFirst({
          where: {
            userId,
            eventId,
            status: "CONFIRMED",
          },
          select: {
            id: true,
            variantId: true,
            variant: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                liveRaceVisibility: true,
              },
            },
          },
        })
      : null;

    const record = registration ?? participation;

    if (!record) {
      return NextResponse.json({
        verified: false,
        reason: "No confirmed registration or participation found",
      });
    }

    return NextResponse.json({
      verified: true,
      athlete: {
        userId: record.user.id,
        name: record.user.name,
        image: record.user.image,
        variantId: record.variantId,
        variantName: record.variant?.name ?? null,
        bibNumber: "bibNumber" in record ? record.bibNumber : null,
        liveRaceVisibility: record.user.liveRaceVisibility ?? "PUBLIC",
      },
    });
  } catch (error) {
    console.error("[Internal] Error verifying athlete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

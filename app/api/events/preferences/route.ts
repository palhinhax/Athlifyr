import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SportType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get("anonymousId");

    const session = await auth();

    if (session?.user?.id) {
      // Get preferences for authenticated user
      const preferences = await prisma.eventsPreferences.findUnique({
        where: { userId: session.user.id },
      });

      return NextResponse.json({ preferences });
    } else if (anonymousId) {
      // Get preferences for anonymous user
      const preferences = await prisma.anonymousEventsPreferences.findUnique({
        where: { anonymousId },
      });

      return NextResponse.json({ preferences });
    }

    return NextResponse.json({ preferences: null });
  } catch (error) {
    console.error("Error fetching events preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sports,
      distanceRadius,
      searchQuery,
      userLat,
      userLng,
      locationEnabled,
      anonymousId,
    } = body;

    const session = await auth();

    if (session?.user?.id) {
      // Save preferences for authenticated user
      const preferences = await prisma.eventsPreferences.upsert({
        where: { userId: session.user.id },
        update: {
          sports: sports as SportType[],
          distanceRadius,
          searchQuery,
          userLat,
          userLng,
          locationEnabled,
        },
        create: {
          userId: session.user.id,
          sports: sports as SportType[],
          distanceRadius,
          searchQuery,
          userLat,
          userLng,
          locationEnabled,
        },
      });

      return NextResponse.json({ preferences });
    } else if (anonymousId) {
      // Save preferences for anonymous user
      const preferences = await prisma.anonymousEventsPreferences.upsert({
        where: { anonymousId },
        update: {
          sports: sports as SportType[],
          distanceRadius,
          searchQuery,
          userLat,
          userLng,
          locationEnabled,
          lastAccessedAt: new Date(),
        },
        create: {
          anonymousId,
          sports: sports as SportType[],
          distanceRadius,
          searchQuery,
          userLat,
          userLng,
          locationEnabled,
        },
      });

      return NextResponse.json({ preferences });
    }

    return NextResponse.json(
      { error: "No user session or anonymous ID" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error saving events preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}

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
      const preferences = await prisma.mapPreferences.findUnique({
        where: { userId: session.user.id },
      });

      return NextResponse.json({ preferences });
    } else if (anonymousId) {
      // Get preferences for anonymous user
      const preferences = await prisma.anonymousMapPreferences.findUnique({
        where: { anonymousId },
      });

      return NextResponse.json({ preferences });
    }

    return NextResponse.json({ preferences: null });
  } catch (error) {
    console.error("Error fetching map preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sports, dateRange, distanceRadius, anonymousId } = body;

    const session = await auth();

    if (session?.user?.id) {
      // Save preferences for authenticated user
      const preferences = await prisma.mapPreferences.upsert({
        where: { userId: session.user.id },
        update: {
          sports: sports as SportType[],
          dateRange,
          distanceRadius,
        },
        create: {
          userId: session.user.id,
          sports: sports as SportType[],
          dateRange,
          distanceRadius,
        },
      });

      return NextResponse.json({ preferences });
    } else if (anonymousId) {
      // Save preferences for anonymous user
      const preferences = await prisma.anonymousMapPreferences.upsert({
        where: { anonymousId },
        update: {
          sports: sports as SportType[],
          dateRange,
          distanceRadius,
          lastAccessedAt: new Date(),
        },
        create: {
          anonymousId,
          sports: sports as SportType[],
          dateRange,
          distanceRadius,
        },
      });

      return NextResponse.json({ preferences });
    }

    return NextResponse.json(
      { error: "No user session or anonymous ID" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error saving map preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}

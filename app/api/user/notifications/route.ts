import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailNotifications } = await request.json();

    if (typeof emailNotifications !== "boolean") {
      return NextResponse.json(
        { error: "Invalid emailNotifications value" },
        { status: 400 }
      );
    }

    // If enabling notifications, check if email is verified
    if (emailNotifications) {
      const userDetails = await prisma.user.findUnique({
        where: { id: user.id },
        select: { emailVerified: true },
      });

      if (!userDetails?.emailVerified) {
        return NextResponse.json(
          { error: "Email must be verified to enable notifications" },
          { status: 400 }
        );
      }
    }

    // Update user notification settings
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailNotifications },
      select: {
        id: true,
        emailNotifications: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSettings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        emailNotifications: true,
        emailVerified: true,
      },
    });

    if (!userSettings) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
      { status: 500 }
    );
  }
}

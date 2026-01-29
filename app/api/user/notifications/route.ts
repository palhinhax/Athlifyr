import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
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
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { emailVerified: true },
      });

      if (!user?.emailVerified) {
        return NextResponse.json(
          { error: "Email must be verified to enable notifications" },
          { status: 400 }
        );
      }
    }

    // Update user notification settings
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
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

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailNotifications: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
      { status: 500 }
    );
  }
}

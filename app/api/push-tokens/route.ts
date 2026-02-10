import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Register a push token
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { token, platform, deviceId } = body;

    // Validate required fields
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    if (!platform || !["android", "ios"].includes(platform)) {
      return NextResponse.json(
        { error: "Platform must be 'android' or 'ios'" },
        { status: 400 }
      );
    }

    // Check if token already exists
    const existingToken = await prisma.pushToken.findUnique({
      where: { token },
    });

    if (existingToken) {
      // Update existing token (e.g., reactivate or update lastSeenAt)
      const updatedToken = await prisma.pushToken.update({
        where: { token },
        data: {
          userId: session.user.id, // Update ownership if user changed
          platform,
          deviceId: deviceId || existingToken.deviceId,
          isActive: true,
          lastSeenAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        token: updatedToken,
        message: "Token updated successfully",
      });
    }

    // Create new token
    const newToken = await prisma.pushToken.create({
      data: {
        userId: session.user.id,
        token,
        platform,
        deviceId,
        isActive: true,
        lastSeenAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      token: newToken,
      message: "Token registered successfully",
    });
  } catch (error) {
    console.error("Error registering push token:", error);
    return NextResponse.json(
      { error: "Failed to register push token" },
      { status: 500 }
    );
  }
}

// GET - Get all push tokens for the authenticated user
export async function GET(_request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokens = await prisma.pushToken.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        lastSeenAt: "desc",
      },
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching push tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch push tokens" },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate all tokens for the authenticated user (logout)
export async function DELETE(_request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Deactivate all tokens for the user
    await prisma.pushToken.updateMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All tokens deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating push tokens:", error);
    return NextResponse.json(
      { error: "Failed to deactivate push tokens" },
      { status: 500 }
    );
  }
}

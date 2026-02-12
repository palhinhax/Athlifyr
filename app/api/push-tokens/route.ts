import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// POST - Register a push token
export async function POST(request: NextRequest) {
  try {
    // Log authentication attempt
    const authHeader = request.headers.get("authorization");
    console.log("🔐 Push token registration attempt:", {
      hasAuthHeader: !!authHeader,
      authHeaderPrefix: authHeader?.substring(0, 20),
      url: request.url,
    });

    const user = await getAuthenticatedUser(request);

    if (!user) {
      console.error(
        "❌ Push token registration failed - No authenticated user",
        {
          hasAuthHeader: !!authHeader,
          cookies: request.cookies.getAll().map((c) => c.name),
        }
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated for push token:", {
      userId: user.id,
      userName: user.name,
      email: user.email,
    });

    const body = await request.json();
    const { token, platform, deviceId, deviceName } = body;

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
          userId: user.id, // Update ownership if user changed
          platform,
          deviceId: deviceId || existingToken.deviceId,
          deviceName: deviceName || existingToken.deviceName,
          isActive: true,
          lastSeenAt: new Date(),
        },
      });

      console.log("🔄 Push token updated:", {
        userId: user.id,
        userName: user.name,
        platform,
        deviceName: deviceName || existingToken.deviceName,
        isActive: true,
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
        userId: user.id,
        token,
        platform,
        deviceId,
        deviceName,
        isActive: true,
        lastSeenAt: new Date(),
      },
    });

    console.log("✅ Push token registered:", {
      userId: user.id,
      userName: user.name,
      platform,
      deviceName,
      isActive: true,
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
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokens = await prisma.pushToken.findMany({
      where: {
        userId: user.id,
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
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Deactivate all tokens for the user
    await prisma.pushToken.updateMany({
      where: {
        userId: user.id,
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

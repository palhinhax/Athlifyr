import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// POST - Subscribe to web push notifications
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscription } = body;

    // Validate subscription object
    if (!subscription || typeof subscription !== "object") {
      return NextResponse.json(
        { error: "Invalid subscription object" },
        { status: 400 }
      );
    }

    if (!subscription.endpoint || typeof subscription.endpoint !== "string") {
      return NextResponse.json(
        { error: "Subscription endpoint is required" },
        { status: 400 }
      );
    }

    // Store subscription in database as a web push token
    // Using the same PushToken model but with platform "web"
    const subscriptionString = JSON.stringify(subscription);

    // Check if this subscription already exists
    const existingToken = await prisma.pushToken.findFirst({
      where: {
        userId: user.id,
        platform: "web",
        token: subscription.endpoint,
      },
    });

    if (existingToken) {
      // Update existing subscription
      const updatedToken = await prisma.pushToken.update({
        where: { id: existingToken.id },
        data: {
          deviceId: subscriptionString,
          isActive: true,
          lastSeenAt: new Date(),
        },
      });

      console.log("🔄 Web push subscription updated:", {
        userId: user.id,
        userName: user.name,
        endpoint: subscription.endpoint.substring(0, 50) + "...",
      });

      return NextResponse.json({
        success: true,
        token: updatedToken,
        message: "Subscription updated successfully",
      });
    }

    // Create new subscription
    const newToken = await prisma.pushToken.create({
      data: {
        userId: user.id,
        token: subscription.endpoint,
        platform: "web",
        deviceId: subscriptionString, // Store full subscription JSON here
        deviceName: "Web Browser",
        isActive: true,
        lastSeenAt: new Date(),
      },
    });

    console.log("✅ Web push subscription created:", {
      userId: user.id,
      userName: user.name,
      endpoint: subscription.endpoint.substring(0, 50) + "...",
    });

    return NextResponse.json({
      success: true,
      token: newToken,
      message: "Subscription registered successfully",
    });
  } catch (error) {
    console.error("❌ Error registering web push subscription:", error);
    return NextResponse.json(
      { error: "Failed to register subscription" },
      { status: 500 }
    );
  }
}

// DELETE - Unsubscribe from web push notifications
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    // Delete subscription
    await prisma.pushToken.deleteMany({
      where: {
        userId: user.id,
        platform: "web",
        token: endpoint,
      },
    });

    console.log("🗑️ Web push subscription deleted:", {
      userId: user.id,
      userName: user.name,
    });

    return NextResponse.json({
      success: true,
      message: "Subscription removed successfully",
    });
  } catch (error) {
    console.error("❌ Error removing web push subscription:", error);
    return NextResponse.json(
      { error: "Failed to remove subscription" },
      { status: 500 }
    );
  }
}

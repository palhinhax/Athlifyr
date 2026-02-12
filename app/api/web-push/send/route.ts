import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// Configure web-push with VAPID details
if (
  !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  !process.env.VAPID_PRIVATE_KEY ||
  !process.env.VAPID_SUBJECT
) {
  console.warn(
    "⚠️ VAPID keys not configured - web push notifications will not work"
  );
} else {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

interface WebPushPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

// POST - Send web push notification to a specific user
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, payload } = body as {
      userId: string;
      payload: WebPushPayload;
    };

    // Validate payload
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!payload.title || typeof payload.title !== "string") {
      return NextResponse.json(
        { error: "Payload must include title" },
        { status: 400 }
      );
    }

    // Get all active web push subscriptions for the user
    const pushTokens = await prisma.pushToken.findMany({
      where: {
        userId,
        platform: "web",
        isActive: true,
      },
    });

    if (pushTokens.length === 0) {
      return NextResponse.json(
        { error: "No active web push subscriptions found for user" },
        { status: 404 }
      );
    }

    console.log(
      `📤 Sending web push to ${pushTokens.length} subscription(s) for user ${userId}`
    );

    // Send notifications to all subscriptions
    const results = await Promise.allSettled(
      pushTokens.map(async (token) => {
        try {
          // Parse the subscription object stored in deviceId
          const subscription = JSON.parse(token.deviceId || "{}");

          if (!subscription.endpoint) {
            throw new Error("Invalid subscription object");
          }

          await webpush.sendNotification(subscription, JSON.stringify(payload));

          console.log(
            `✅ Web push sent to ${subscription.endpoint.substring(0, 50)}...`
          );

          return { success: true, tokenId: token.id };
        } catch (error) {
          console.error(
            `❌ Failed to send web push to token ${token.id}:`,
            error
          );

          // If subscription is no longer valid, mark as inactive
          if (
            error instanceof Error &&
            (error.message.includes("410") || error.message.includes("404"))
          ) {
            await prisma.pushToken.update({
              where: { id: token.id },
              data: { isActive: false },
            });
            console.log(`🔇 Marked token ${token.id} as inactive`);
          }

          return { success: false, tokenId: token.id, error };
        }
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      message: `Sent ${successful} notification(s), ${failed} failed`,
      results: {
        successful,
        failed,
        total: pushTokens.length,
      },
    });
  } catch (error) {
    console.error("❌ Error sending web push notification:", error);
    return NextResponse.json(
      { error: "Failed to send web push notification" },
      { status: 500 }
    );
  }
}

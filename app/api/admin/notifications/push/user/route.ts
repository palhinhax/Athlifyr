import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";

// Configure web-push with VAPID details
if (
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY &&
  process.env.VAPID_SUBJECT
) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
const CHUNK_SIZE = 100;

interface ExpoPushTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: Record<string, unknown>;
}

/**
 * POST /api/admin/notifications/push/user
 * Send push notification to a specific user (admin only)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, title, message, data } = body;

    // Validate required fields
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, pushNotificationsEnabled: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get active push tokens for this user (both mobile and web)
    const tokens = await prisma.pushToken.findMany({
      where: { userId, isActive: true },
    });

    if (tokens.length === 0) {
      // Log the attempt
      await logAdminPush({
        adminId: session.user.id,
        audience: "single",
        targetUserId: userId,
        title: title.trim(),
        body: message.trim(),
        usersTargeted: 1,
        tokensFound: 0,
        sent: 0,
        failed: 0,
      });

      return NextResponse.json({
        success: true,
        data: {
          usersTargeted: 1,
          tokensFound: 0,
          sent: 0,
          failed: 0,
        },
      });
    }

    // Separate mobile and web tokens
    const mobileTokens = tokens.filter((t) => t.platform !== "web");
    const webTokens = tokens.filter((t) => t.platform === "web");

    let totalSent = 0;
    let totalFailed = 0;
    const invalidTokenIds: string[] = [];

    // Send to mobile devices (Expo)
    if (mobileTokens.length > 0) {
      const mobileMessages = mobileTokens.map((t) => ({
        to: t.token,
        title: title.trim(),
        body: message.trim(),
        data: {
          type: "admin_announcement",
          ...data,
        },
        sound: "default" as const,
        priority: "high" as const,
      }));

      const mobileResult = await sendExpoMessages(mobileMessages, mobileTokens);
      totalSent += mobileResult.sent;
      totalFailed += mobileResult.failed;
      invalidTokenIds.push(...mobileResult.invalidTokenIds);
    }

    // Send to web browsers (Web Push)
    if (webTokens.length > 0) {
      const webResult = await sendWebPushMessages(
        {
          title: title.trim(),
          body: message.trim(),
          icon: "/android-chrome-192x192.png",
          tag: "admin_announcement",
          data: {
            type: "admin_announcement",
            ...data,
          },
        },
        webTokens
      );
      totalSent += webResult.sent;
      totalFailed += webResult.failed;
      invalidTokenIds.push(...webResult.invalidTokenIds);
    }

    // Deactivate invalid tokens
    if (invalidTokenIds.length > 0) {
      await prisma.pushToken.updateMany({
        where: { id: { in: invalidTokenIds } },
        data: { isActive: false },
      });
    }

    // Log the send
    await logAdminPush({
      adminId: session.user.id,
      audience: "single",
      targetUserId: userId,
      title: title.trim(),
      body: message.trim(),
      usersTargeted: 1,
      tokensFound: tokens.length,
      sent: totalSent,
      failed: totalFailed,
    });

    return NextResponse.json({
      success: true,
      data: {
        usersTargeted: 1,
        tokensFound: tokens.length,
        sent: totalSent,
        failed: totalFailed,
        mobileTokens: mobileTokens.length,
        webTokens: webTokens.length,
      },
    });
  } catch (error) {
    console.error("Error sending push to user:", error);
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helpers
// ============================================================================

interface TokenRecord {
  id: string;
  token: string;
  deviceId: string | null;
}

// Send to web browsers using Web Push API
async function sendWebPushMessages(
  payload: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    data?: Record<string, unknown>;
  },
  tokens: TokenRecord[]
): Promise<{ sent: number; failed: number; invalidTokenIds: string[] }> {
  let sent = 0;
  let failed = 0;
  const invalidTokenIds: string[] = [];

  for (const token of tokens) {
    try {
      // Parse the subscription object stored in deviceId
      const subscription = JSON.parse(token.deviceId || "{}");

      if (!subscription.endpoint) {
        console.error(`Invalid subscription for token ${token.id}`);
        invalidTokenIds.push(token.id);
        failed++;
        continue;
      }

      await webpush.sendNotification(subscription, JSON.stringify(payload));
      console.log(`✅ Web push sent to token ${token.id}`);
      sent++;
    } catch (error) {
      console.error(`❌ Failed to send web push to token ${token.id}:`, error);
      // Check if it's an invalid subscription error
      if (
        error instanceof Error &&
        (error.message.includes("410") || error.message.includes("expired"))
      ) {
        invalidTokenIds.push(token.id);
      }
      failed++;
    }
  }

  return { sent, failed, invalidTokenIds };
}

// Send to mobile devices using Expo Push API
async function sendExpoMessages(
  messages: Array<{
    to: string;
    title: string;
    body: string;
    data?: Record<string, string | number | boolean>;
    sound: "default";
    priority: "high";
  }>,
  tokens: TokenRecord[]
): Promise<{ sent: number; failed: number; invalidTokenIds: string[] }> {
  let sent = 0;
  let failed = 0;
  const invalidTokenIds: string[] = [];

  // Chunk messages for Expo API (max 100 per request)
  for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
    const chunk = messages.slice(i, i + CHUNK_SIZE);
    const tokenChunk = tokens.slice(i, i + CHUNK_SIZE);

    try {
      const response = await fetch(EXPO_PUSH_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });

      if (!response.ok) {
        failed += chunk.length;
        continue;
      }

      const result: { data: ExpoPushTicket[] } = await response.json();

      for (let j = 0; j < result.data.length; j++) {
        const ticket = result.data[j];
        if (ticket.status === "error") {
          failed++;
          if (
            ticket.message?.includes("DeviceNotRegistered") ||
            ticket.message?.includes("InvalidCredentials")
          ) {
            invalidTokenIds.push(tokenChunk[j].id);
          }
        } else {
          sent++;
        }
      }
    } catch {
      failed += chunk.length;
    }
  }

  return { sent, failed, invalidTokenIds };
}

async function logAdminPush(params: {
  adminId: string;
  audience: string;
  targetUserId?: string;
  title: string;
  body: string;
  usersTargeted: number;
  tokensFound: number;
  sent: number;
  failed: number;
}) {
  try {
    // Log to console for now - can be extended to a dedicated audit table later
    console.log("[ADMIN PUSH LOG]", {
      ...params,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging admin push:", error);
  }
}

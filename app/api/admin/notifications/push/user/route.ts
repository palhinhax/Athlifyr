import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Get active push tokens for this user
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

    // Send push notifications
    const messages = tokens.map((t) => ({
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

    const { sent, failed, invalidTokenIds } = await sendExpoMessages(
      messages,
      tokens
    );

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
      sent,
      failed,
    });

    return NextResponse.json({
      success: true,
      data: {
        usersTargeted: 1,
        tokensFound: tokens.length,
        sent,
        failed,
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
}

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

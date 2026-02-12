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
 * POST /api/admin/notifications/push/broadcast
 * Send push notification to ALL users (admin only)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, data, confirmBroadcast } = body;

    // Safety: require explicit confirmation for broadcast
    if (confirmBroadcast !== true) {
      return NextResponse.json(
        { error: "Broadcast must be explicitly confirmed" },
        { status: 400 }
      );
    }

    // Validate required fields
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

    // Get all active tokens for users with push enabled and not banned
    const tokens = await prisma.pushToken.findMany({
      where: {
        isActive: true,
        user: {
          pushNotificationsEnabled: true,
          isBanned: false,
        },
      },
      select: {
        id: true,
        token: true,
        userId: true,
      },
    });

    if (tokens.length === 0) {
      await logAdminPush({
        adminId: session.user.id,
        audience: "broadcast",
        title: title.trim(),
        body: message.trim(),
        usersTargeted: 0,
        tokensFound: 0,
        sent: 0,
        failed: 0,
      });

      return NextResponse.json({
        success: true,
        data: {
          usersTargeted: 0,
          tokensFound: 0,
          sent: 0,
          failed: 0,
        },
      });
    }

    // Count unique users
    const uniqueUserIds = new Set(tokens.map((t) => t.userId));
    const usersTargeted = uniqueUserIds.size;

    // Build Expo messages
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

    // Send in chunks
    let sent = 0;
    let failed = 0;
    const invalidTokenIds: string[] = [];

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

    // Deactivate invalid tokens
    if (invalidTokenIds.length > 0) {
      await prisma.pushToken.updateMany({
        where: { id: { in: invalidTokenIds } },
        data: { isActive: false },
      });
      console.log(
        `Deactivated ${invalidTokenIds.length} invalid tokens after broadcast`
      );
    }

    // Log the broadcast
    await logAdminPush({
      adminId: session.user.id,
      audience: "broadcast",
      title: title.trim(),
      body: message.trim(),
      usersTargeted,
      tokensFound: tokens.length,
      sent,
      failed,
    });

    return NextResponse.json({
      success: true,
      data: {
        usersTargeted,
        tokensFound: tokens.length,
        sent,
        failed,
      },
    });
  } catch (error) {
    console.error("Error sending broadcast push:", error);
    return NextResponse.json(
      { error: "Failed to send broadcast notification" },
      { status: 500 }
    );
  }
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
    console.log("[ADMIN PUSH BROADCAST LOG]", {
      ...params,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging admin push:", error);
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  getAdminNotificationEmailHtml,
  getAdminNotificationEmailText,
} from "@/lib/email-templates";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_placeholder") {
    throw new Error("RESEND_API_KEY not configured");
  }
  return new Resend(apiKey);
}

/**
 * POST /api/admin/notifications/email/user
 * Send email notification to a specific user or broadcast to all eligible users (admin only)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, broadcast, title, message } = body;

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

    const resend = getResendClient();

    // Broadcast to all users with email notifications enabled
    if (broadcast) {
      const users = await prisma.user.findMany({
        where: {
          emailNotifications: true,
          emailVerified: { not: null },
          email: { not: "" },
          isBanned: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (users.length === 0) {
        return NextResponse.json({
          success: true,
          data: {
            emailsSent: 0,
            emailsFailed: 0,
            usersTargeted: 0,
          },
        });
      }

      let emailsSent = 0;
      let emailsFailed = 0;

      // Send emails in batches (Resend rate limit: ~10/s on free plan)
      for (const user of users) {
        try {
          const html = getAdminNotificationEmailHtml({
            name: user.name || "Atleta",
            title: title.trim(),
            message: message.trim(),
          });

          const text = getAdminNotificationEmailText({
            name: user.name || "Atleta",
            title: title.trim(),
            message: message.trim(),
          });

          await resend.emails.send({
            from: "Athlifyr <hello@athlifyr.com>",
            to: user.email,
            subject: title.trim(),
            html,
            text,
          });

          emailsSent++;
        } catch (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          emailsFailed++;
        }
      }

      // Log the broadcast
      console.log("[ADMIN EMAIL BROADCAST]", {
        adminId: session.user.id,
        title: title.trim(),
        usersTargeted: users.length,
        emailsSent,
        emailsFailed,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        data: {
          emailsSent,
          emailsFailed,
          usersTargeted: users.length,
        },
      });
    }

    // Single user send
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required for single-user send" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!targetUser.email) {
      return NextResponse.json(
        { error: "User has no email address" },
        { status: 400 }
      );
    }

    if (!targetUser.emailVerified) {
      return NextResponse.json(
        { error: "User email is not verified" },
        { status: 400 }
      );
    }

    const html = getAdminNotificationEmailHtml({
      name: targetUser.name || "Atleta",
      title: title.trim(),
      message: message.trim(),
    });

    const text = getAdminNotificationEmailText({
      name: targetUser.name || "Atleta",
      title: title.trim(),
      message: message.trim(),
    });

    await resend.emails.send({
      from: "Athlifyr <hello@athlifyr.com>",
      to: targetUser.email,
      subject: title.trim(),
      html,
      text,
    });

    // Log the send
    console.log("[ADMIN EMAIL SINGLE]", {
      adminId: session.user.id,
      targetUserId: userId,
      title: title.trim(),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: {
        emailsSent: 1,
        emailsFailed: 0,
      },
    });
  } catch (error) {
    console.error("Error sending admin email notification:", error);
    return NextResponse.json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
}

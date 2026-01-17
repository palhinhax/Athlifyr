import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  getContactReplyEmailHtml,
  getContactReplyEmailText,
} from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);
    const { message, adminName } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get contact details
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Send email
    const emailHtml = getContactReplyEmailHtml({
      recipientName: contact.name,
      recipientEmail: contact.email,
      originalSubject: contact.subject,
      replyMessage: message,
      adminName: adminName || session.user.name || "Equipa Athlifyr",
    });

    const emailText = getContactReplyEmailText({
      recipientName: contact.name,
      recipientEmail: contact.email,
      originalSubject: contact.subject,
      replyMessage: message,
      adminName: adminName || session.user.name || "Equipa Athlifyr",
    });

    await resend.emails.send({
      from: "Athlifyr <hello@athlifyr.com>",
      to: contact.email,
      replyTo: "hello@athlifyr.com",
      subject: `Re: ${contact.subject}`,
      html: emailHtml,
      text: emailText,
    });

    // Update contact status to resolved if it was pending or in_progress
    if (contact.status === "pending" || contact.status === "in_progress") {
      await prisma.contact.update({
        where: { id },
        data: { status: "resolved" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("Error sending reply:", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}

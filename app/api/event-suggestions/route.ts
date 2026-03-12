import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { z } from "zod";

const suggestionSchema = z.object({
  title: z.string().min(2).max(200),
  message: z.string().min(5).max(2000),
  location: z.string().max(200).optional(),
  date: z.string().max(100).optional(),
  sportType: z.string().max(50).optional(),
  url: z.string().url().max(500).optional().or(z.literal("")),
});

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

/**
 * POST /api/event-suggestions
 * Submit a public event suggestion (creates AdminNote with type EVENT)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = suggestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, message, location, date, sportType, url } = parsed.data;

    const note = await prisma.adminNote.create({
      data: {
        userId: user.id,
        type: "EVENT",
        title,
        message,
        location: location || null,
        date: date || null,
        sportType: sportType || null,
        url: url || null,
        status: "pending",
      },
    });

    // Send email notification to admin
    try {
      const resend = getResendClient();
      const details = [
        date ? `📅 Data: ${date}` : null,
        sportType ? `🏅 Desporto: ${sportType}` : null,
        location ? `📍 Local: ${location}` : null,
        url ? `🔗 Website: ${url}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await resend.emails.send({
        from: "Athlifyr <hello@athlifyr.com>",
        to: "hello@athlifyr.com",
        subject: `Nova sugestão de evento: ${title}`,
        text: `Nova sugestão de evento submetida por ${user.name || user.email}\n\n📌 Evento: ${title}\n${details}\n\n💬 Mensagem:\n${message}\n\n👤 Utilizador: ${user.name || "N/A"} (${user.email})`,
      });
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error(
        "Failed to send suggestion notification email:",
        emailError
      );
    }

    return NextResponse.json({ success: true, id: note.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating event suggestion:", error);
    return NextResponse.json(
      { error: "Failed to submit suggestion" },
      { status: 500 }
    );
  }
}

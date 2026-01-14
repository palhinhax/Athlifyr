import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ContactRequest {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactRequest = await req.json();

    const { name, email, type, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Store in database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        type: type || "other",
        subject,
        message,
        status: "pending",
      },
    });

    // TODO: Send email notification to admin
    // You can integrate with SendGrid, Resend, or other email service here

    return NextResponse.json(
      {
        success: true,
        message: "Contact message received",
        id: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact:", error);
    return NextResponse.json(
      { error: "Failed to process contact" },
      { status: 500 }
    );
  }
}

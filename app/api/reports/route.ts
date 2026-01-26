import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reportSchema = z.object({
  reportedId: z.string(),
  reason: z.enum([
    "SPAM",
    "HARASSMENT",
    "INAPPROPRIATE_CONTENT",
    "FAKE_ACCOUNT",
    "SCAM",
    "OTHER",
  ]),
  details: z.string().optional(),
});

// Create a new user report
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = reportSchema.parse(body);

    // Can't report yourself
    if (validatedData.reportedId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot report yourself" },
        { status: 400 }
      );
    }

    // Check if reported user exists
    const reportedUser = await prisma.user.findUnique({
      where: { id: validatedData.reportedId },
    });

    if (!reportedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already reported this person recently (prevent spam)
    const existingReport = await prisma.userReport.findFirst({
      where: {
        reporterId: session.user.id,
        reportedId: validatedData.reportedId,
        status: "PENDING",
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this user" },
        { status: 400 }
      );
    }

    // Create the report
    const report = await prisma.userReport.create({
      data: {
        reporterId: session.user.id,
        reportedId: validatedData.reportedId,
        reason: validatedData.reason,
        details: validatedData.details,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

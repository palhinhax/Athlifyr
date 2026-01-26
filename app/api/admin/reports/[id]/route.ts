import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateReportSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "RESOLVED", "DISMISSED"]),
  adminNote: z.string().optional(),
});

// GET - Get single report with conversation details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const report = await prisma.userReport.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reported: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isBanned: true,
            createdAt: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Find conversation between reporter and reported
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: report.reporterId } } },
          { participants: { some: { userId: report.reportedId } } },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 100,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Get other reports about the same user
    const otherReports = await prisma.userReport.findMany({
      where: {
        reportedId: report.reportedId,
        id: { not: report.id },
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      report,
      conversation,
      otherReports,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

// PATCH - Update report status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateReportSchema.parse(body);

    const report = await prisma.userReport.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reported: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

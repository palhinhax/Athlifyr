import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/notes
 * Get all admin notes (submitted via Athli chat)
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.adminNote.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const stats = {
      total: notes.length,
      pending: notes.filter((n) => n.status === "pending").length,
      inProgress: notes.filter((n) => n.status === "in_progress").length,
      resolved: notes.filter((n) => n.status === "resolved").length,
      dismissed: notes.filter((n) => n.status === "dismissed").length,
      byType: {
        event: notes.filter((n) => n.type === "EVENT").length,
        venue: notes.filter((n) => n.type === "VENUE").length,
        other: notes.filter((n) => n.type === "OTHER").length,
      },
    };

    return NextResponse.json({
      notes,
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin notes" },
      { status: 500 }
    );
  }
}

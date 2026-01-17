import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/contacts
 * Get all contacts for admin panel
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: contacts.length,
      pending: contacts.filter((c) => c.status === "pending").length,
      inProgress: contacts.filter((c) => c.status === "in_progress").length,
      resolved: contacts.filter((c) => c.status === "resolved").length,
      closed: contacts.filter((c) => c.status === "closed").length,
      byType: {
        suggestion: contacts.filter((c) => c.type === "suggestion").length,
        bug: contacts.filter((c) => c.type === "bug").length,
        question: contacts.filter((c) => c.type === "question").length,
        feedback: contacts.filter((c) => c.type === "feedback").length,
        other: contacts.filter((c) => c.type === "other").length,
      },
    };

    return NextResponse.json({
      contacts,
      stats,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

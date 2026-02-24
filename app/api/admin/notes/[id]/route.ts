import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateNoteSchema = z.object({
  status: z
    .enum(["pending", "in_progress", "resolved", "dismissed"])
    .optional(),
  adminNotes: z.string().optional(),
});

/**
 * PATCH /api/admin/notes/[id]
 * Update an admin note (status, admin notes)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { status, adminNotes } = parsed.data;

    const note = await prisma.adminNote.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Admin note not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.adminNote.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
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

    return NextResponse.json({ note: updated });
  } catch (error) {
    console.error("Error updating admin note:", error);
    return NextResponse.json(
      { error: "Failed to update admin note" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/notes/[id]
 * Delete an admin note
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const note = await prisma.adminNote.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Admin note not found" },
        { status: 404 }
      );
    }

    await prisma.adminNote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin note:", error);
    return NextResponse.json(
      { error: "Failed to delete admin note" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FormStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** GET /api/admin/forms/[id] — Get form with fields and submissions */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        fields: { orderBy: { order: "asc" } },
        submissions: {
          orderBy: { createdAt: "desc" },
          include: {
            values: { include: { field: true } },
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        _count: { select: { submissions: true } },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}

/** PATCH /api/admin/forms/[id] — Update form (title, description, status, fields) */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, status, closesAt, maxSubmissions, fields } =
      body as {
        title?: string;
        description?: string;
        status?: FormStatus;
        closesAt?: string | null;
        maxSubmissions?: number | null;
        fields?: Array<{
          id?: string;
          label: string;
          placeholder?: string;
          type: string;
          required?: boolean;
          order: number;
          options?: string[];
          section?: string;
        }>;
      };

    const existing = await prisma.form.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Update fields if provided: delete all existing, recreate
    if (fields) {
      await prisma.formField.deleteMany({ where: { formId: id } });
      await prisma.formField.createMany({
        data: fields.map((f, idx) => ({
          formId: id,
          label: f.label,
          placeholder: f.placeholder || null,
          type: f.type as never,
          required: f.required ?? false,
          order: f.order ?? idx,
          options: f.options || [],
          section: f.section || null,
        })),
      });
    }

    const form = await prisma.form.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(status !== undefined && { status }),
        ...(closesAt !== undefined && {
          closesAt: closesAt ? new Date(closesAt) : null,
        }),
        ...(maxSubmissions !== undefined && { maxSubmissions }),
      },
      include: {
        fields: { orderBy: { order: "asc" } },
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/forms/[id] — Delete a form and all its data */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.form.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    await prisma.form.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Failed to delete form" },
      { status: 500 }
    );
  }
}

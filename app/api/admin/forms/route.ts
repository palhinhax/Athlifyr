import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateSlug(): string {
  return Math.random().toString(36).substring(2, 10);
}

/** GET /api/admin/forms — List all forms */
export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forms = await prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { submissions: true, fields: true } },
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

/** POST /api/admin/forms — Create a new form with fields */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, fields, closesAt, maxSubmissions } = body as {
      title: string;
      description?: string;
      closesAt?: string;
      maxSubmissions?: number | null;
      fields: Array<{
        label: string;
        placeholder?: string;
        type: string;
        required?: boolean;
        order: number;
        options?: string[];
        section?: string;
      }>;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!fields || fields.length === 0) {
      return NextResponse.json(
        { error: "At least one field is required" },
        { status: 400 }
      );
    }

    // Generate a unique slug
    let slug = generateSlug();
    let exists = await prisma.form.findUnique({ where: { slug } });
    while (exists) {
      slug = generateSlug();
      exists = await prisma.form.findUnique({ where: { slug } });
    }

    const form = await prisma.form.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        slug,
        createdById: session.user.id,
        closesAt: closesAt ? new Date(closesAt) : null,
        maxSubmissions: maxSubmissions ?? null,
        fields: {
          create: fields.map((f, idx) => ({
            label: f.label,
            placeholder: f.placeholder || null,
            type: f.type as never,
            required: f.required ?? false,
            order: f.order ?? idx,
            options: f.options || [],
            section: f.section || null,
          })),
        },
      },
      include: {
        fields: { orderBy: { order: "asc" } },
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/** GET /api/forms/[slug] — Public: get form by slug for filling in */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const form = await prisma.form.findUnique({
      where: { slug },
      include: {
        fields: { orderBy: { order: "asc" } },
        _count: { select: { submissions: true } },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "This form is not available" },
        { status: 403 }
      );
    }

    if (form.closesAt && new Date(form.closesAt) < new Date()) {
      return NextResponse.json(
        { error: "This form is closed" },
        { status: 403 }
      );
    }

    // Check max submissions
    if (
      form.maxSubmissions !== null &&
      form._count.submissions >= form.maxSubmissions
    ) {
      return NextResponse.json(
        { error: "This form has reached its maximum number of submissions" },
        { status: 403 }
      );
    }

    // Return only public data (no internal IDs for createdBy, etc.)
    return NextResponse.json({
      id: form.id,
      title: form.title,
      description: form.description,
      slug: form.slug,
      closesAt: form.closesAt,
      maxSubmissions: form.maxSubmissions,
      submissionCount: form._count.submissions,
      fields: form.fields.map((f) => ({
        id: f.id,
        label: f.label,
        placeholder: f.placeholder,
        type: f.type,
        required: f.required,
        order: f.order,
        options: f.options,
        section: f.section,
      })),
    });
  } catch (error) {
    console.error("Error fetching public form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}

interface FormField {
  id: string;
  label: string;
  required: boolean;
}

function validateFormFields(
  fields: FormField[],
  values: Record<string, string>
): string | null {
  const fieldMap = new Map(fields.map((f) => [f.id, f]));

  for (const field of fields) {
    if (field.required) {
      const val = values[field.id];
      if (!val || (typeof val === "string" && !val.trim())) {
        return `Field "${field.label}" is required`;
      }
    }
  }

  for (const fieldId of Object.keys(values)) {
    if (!fieldMap.has(fieldId)) {
      return `Unknown field: ${fieldId}`;
    }
  }

  return null;
}

/** POST /api/forms/[slug] — Public: submit form data */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const form = await prisma.form.findUnique({
      where: { slug },
      include: {
        fields: true,
        _count: { select: { submissions: true } },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "This form is not accepting submissions" },
        { status: 403 }
      );
    }

    if (form.closesAt && new Date(form.closesAt) < new Date()) {
      return NextResponse.json(
        { error: "This form is closed" },
        { status: 403 }
      );
    }

    // Check max submissions
    if (
      form.maxSubmissions !== null &&
      form._count.submissions >= form.maxSubmissions
    ) {
      return NextResponse.json(
        { error: "This form has reached its maximum number of submissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { values, name, email } = body as {
      values: Record<string, string>;
      name?: string;
      email?: string;
    };

    if (!values || typeof values !== "object") {
      return NextResponse.json(
        { error: "Values are required" },
        { status: 400 }
      );
    }

    const validationError = validateFormFields(form.fields, values);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        name: name?.trim() || null,
        email: email?.trim().toLowerCase() || null,
        values: {
          create: Object.entries(values)
            .filter(([, val]) => val !== undefined && val !== null)
            .map(([fieldId, value]) => ({
              fieldId,
              value: String(value),
            })),
        },
      },
      include: {
        values: true,
      },
    });

    return NextResponse.json(
      { success: true, submissionId: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface CustomFieldAnswer {
  customFieldId: string;
  value: string;
  participantIndex?: number; // 0 = main, 1+ = team members
}

/** Returns the first missing-field error message, or null when all OK */
function findMissingRequiredField(
  requiredFields: { id: string; label: string }[],
  answersByParticipant: Map<number, CustomFieldAnswer[]>
): string | null {
  for (const [participantIdx, participantAnswers] of answersByParticipant) {
    for (const rf of requiredFields) {
      const answer = participantAnswers.find((a) => a.customFieldId === rf.id);
      if (!answer || !answer.value.trim()) {
        return `Required field "${rf.label}" is missing for participant ${participantIdx + 1}`;
      }
    }
  }
  return null;
}

// POST /api/events/[id]/custom-field-responses
// Save custom field responses for a registration or participation
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = (await request.json()) as {
      answers: CustomFieldAnswer[];
      registrationId?: string;
      participationId?: string;
    };

    if (!body.answers || body.answers.length === 0) {
      return NextResponse.json({ success: true }); // Nothing to save
    }

    // Validate that all custom fields belong to this event
    const fieldIds = [...new Set(body.answers.map((a) => a.customFieldId))];
    const fields = await prisma.eventCustomField.findMany({
      where: { id: { in: fieldIds }, eventId },
    });

    if (fields.length !== fieldIds.length) {
      return NextResponse.json(
        { error: "Invalid custom field IDs" },
        { status: 400 }
      );
    }

    // Group answers by participantIndex for validation
    const answersByParticipant = new Map<number, CustomFieldAnswer[]>();
    for (const answer of body.answers) {
      const idx = answer.participantIndex ?? 0;
      const existing = answersByParticipant.get(idx) ?? [];
      existing.push(answer);
      answersByParticipant.set(idx, existing);
    }

    // Validate required fields have values for each participant
    const requiredFields = fields.filter((f) => f.required);
    const missingField = findMissingRequiredField(
      requiredFields,
      answersByParticipant
    );
    if (missingField) {
      return NextResponse.json({ error: missingField }, { status: 400 });
    }

    // Upsert responses
    for (const answer of body.answers) {
      if (!answer.value.trim()) continue; // skip empty optional answers
      const participantIndex = answer.participantIndex ?? 0;

      if (body.registrationId) {
        await prisma.customFieldResponse.upsert({
          where: {
            customFieldId_registrationId_participantIndex: {
              customFieldId: answer.customFieldId,
              registrationId: body.registrationId,
              participantIndex,
            },
          },
          create: {
            customFieldId: answer.customFieldId,
            registrationId: body.registrationId,
            userId: user.id,
            participantIndex,
            value: answer.value,
          },
          update: {
            value: answer.value,
          },
        });
      } else if (body.participationId) {
        await prisma.customFieldResponse.upsert({
          where: {
            customFieldId_participationId_participantIndex: {
              customFieldId: answer.customFieldId,
              participationId: body.participationId,
              participantIndex,
            },
          },
          create: {
            customFieldId: answer.customFieldId,
            participationId: body.participationId,
            userId: user.id,
            participantIndex,
            value: answer.value,
          },
          update: {
            value: answer.value,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving custom field responses:", error);
    return NextResponse.json(
      { error: "Failed to save responses" },
      { status: 500 }
    );
  }
}

// GET /api/events/[id]/custom-field-responses
// Organizer fetches all responses for their event (for the registrations tab)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Check organizer permission
    const isAdmin = user.role === "ADMIN";
    const organizer = !isAdmin
      ? await prisma.eventOrganizer.findFirst({
          where: {
            eventId,
            userId: user.id,
            role: { in: ["OWNER", "ADMIN"] },
          },
        })
      : null;

    if (!isAdmin && !organizer) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const responses = await prisma.customFieldResponse.findMany({
      where: {
        customField: { eventId },
      },
      include: {
        customField: {
          select: { id: true, label: true, type: true, options: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching custom field responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}

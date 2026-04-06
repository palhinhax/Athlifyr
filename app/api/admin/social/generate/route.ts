import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  generateEventDrafts,
  generateWeeklyRoundupDraft,
  generateLastCallDrafts,
} from "@/lib/social/draft-generator";
import { generateWeeklyCompilation } from "@/lib/social/compilation-generator";

type GenerateType = "events" | "weekly" | "lastcall" | "compilation";

const VALID_TYPES: GenerateType[] = [
  "events",
  "weekly",
  "lastcall",
  "compilation",
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      type: GenerateType;
      days?: number;
      sport?: string;
      lang?: string;
      maxEvents?: number;
      daysUntilDeadline?: number;
      scheduledFor?: string;
      country?: string;
      customTitle?: string;
    };

    if (!body.type || !VALID_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const scheduledFor = body.scheduledFor
      ? new Date(body.scheduledFor)
      : undefined;

    switch (body.type) {
      case "events": {
        const result = await generateEventDrafts({
          days: body.days ?? 7,
          sport: body.sport,
          lang: body.lang,
          userId,
          scheduledFor,
        });
        return NextResponse.json({
          message: `Generated ${result.created} event drafts`,
          ...result,
        });
      }

      case "weekly": {
        const result = await generateWeeklyRoundupDraft({
          days: body.days ?? 7,
          sport: body.sport ?? "TRAIL",
          maxEvents: body.maxEvents ?? 5,
          lang: body.lang,
          userId,
          scheduledFor,
        });

        if (!result) {
          return NextResponse.json({
            message: "No events found for weekly roundup",
            created: 0,
          });
        }

        return NextResponse.json({
          message: `Created weekly roundup with ${result.eventCount} events`,
          id: result.id,
          title: result.title,
          eventCount: result.eventCount,
        });
      }

      case "lastcall": {
        const result = await generateLastCallDrafts({
          daysUntilDeadline: body.daysUntilDeadline ?? 3,
          lang: body.lang,
          userId,
          scheduledFor,
        });
        return NextResponse.json({
          message: `Generated ${result.created} last-call drafts`,
          ...result,
        });
      }

      case "compilation": {
        const result = await generateWeeklyCompilation({
          days: body.days ?? 7,
          sport: body.sport,
          country: body.country,
          customTitle: body.customTitle,
          userId,
          scheduledFor,
        });

        if (!result) {
          return NextResponse.json({
            message: "No events found for weekly compilation",
            created: 0,
          });
        }

        return NextResponse.json({
          message: `Created weekly compilation with ${result.eventCount} events (${result.pages} page${result.pages > 1 ? "s" : ""})`,
          created: result.pages,
          id: result.id,
          title: result.title,
          imageUrl: result.imageUrl,
          eventCount: result.eventCount,
          pages: result.pages,
        });
      }
    }
  } catch (error) {
    console.error("Error generating social drafts:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate drafts",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/uploads/presign
 *
 * Returns a short-lived presigned PUT URL so the client can upload a
 * video directly to Backblaze B2 — bypassing Vercel's 4.5 MB body limit.
 *
 * Request body (JSON):
 * {
 *   "contentType": "video/mp4",   // MIME type
 *   "fileExt": "mp4"              // file extension (without dot)
 * }
 *
 * Response 200:
 * {
 *   "uploadUrl": "https://s3.us-east-005.backblazeb2.com/...",
 *   "key": "uploads/<userId>/<uuid>.mp4",
 *   "expiresIn": 300
 * }
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { createPresignedUploadUrl } from "@/lib/b2-s3";

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
]);

const ALLOWED_EXTENSIONS = new Set(["mp4", "mov", "avi", "mkv", "webm"]);

export async function POST(request: Request) {
  try {
    // ── Auth check (supports both web session and mobile Bearer token) ────
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse body ─────────────────────────────────────────────────────────
    const body = (await request.json()) as {
      contentType?: string;
      fileExt?: string;
    };

    const { contentType, fileExt } = body;

    if (!contentType || !fileExt) {
      return NextResponse.json(
        { error: "contentType and fileExt are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_VIDEO_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Unsupported video type" },
        { status: 400 }
      );
    }

    const normalizedExt = fileExt.replace(/^\./, "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(normalizedExt)) {
      return NextResponse.json(
        { error: "Unsupported file extension" },
        { status: 400 }
      );
    }

    // ── Generate presigned URL ─────────────────────────────────────────────
    const result = await createPresignedUploadUrl(
      user.id,
      contentType,
      normalizedExt,
      300 // 5 minutes
    );

    console.log("[Presign] Generated upload URL:", {
      userId: user.id,
      key: result.key,
      contentType,
      expiresIn: result.expiresIn,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Presign] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate upload URL",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lift-analysis/process-b2
 *
 * Thin JSON proxy that accepts a B2 object key, generates a presigned
 * download URL, and sends it (along with analysis parameters) to the
 * Railway barbell-path-tracker service.
 *
 * **Railway downloads the video directly from B2** — Vercel never touches
 * the raw bytes, which avoids memory / body-size limits entirely.
 *
 * Body (JSON):
 * {
 *   "key":              "uploads/<userId>/<uuid>.mp4",
 *   "contentType":      "video/mp4",
 *   "seed_x":           0.52,
 *   "seed_y":           0.38,
 *   "seed_frame":       0,
 *   "show_angles":      true,
 *   "show_body":        true,
 *   "max_duration_sec":  30,
 *   "auto_detect":      true,
 *   "enable_ai":        false,
 *   "language":         "en",
 *   "trim_start_sec":   null,
 *   "trim_end_sec":     null
 * }
 */

import { NextResponse } from "next/server";
import { MAX_DURATION_LIFT_SEC } from "@/lib/video-limits";
import { getAuthUser } from "@/lib/auth-utils";
import { checkAiRateLimit, recordAiUsage } from "@/lib/ai-rate-limit";
import {
  createPresignedDownloadUrl,
  createPresignedResultUploadUrl,
  getB2PublicUrl,
} from "@/lib/b2-s3";
import {
  type PoseAngles,
  type ExternalSkeletonFrame,
  type ExternalAIAnalysis,
  transformSkeletonFrames,
  transformAiAnalysis,
  transformAverageAngles,
  parseRailwayErrorResponse,
  callRailwayWithRetry,
} from "@/lib/analysis-transforms";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes — Railway does the heavy lifting

const BARBELL_API_URL =
  "https://barbell-path-tracker-production.up.railway.app";

// ── Types (Railway response) ──────────────────────────────────────────────

interface ExternalApiResponse {
  success: boolean;
  message: string;
  video_url?: string;
  /** true when Railway uploaded the processed video directly to B2 */
  video_uploaded_to_b2?: boolean;
  tracking_success: boolean;
  auto_detected?: boolean;
  detected_center_x?: number;
  detected_center_y?: number;
  detected_radius?: number;
  total_travel_px?: number;
  max_vertical_displacement_px?: number;
  max_horizontal_displacement_px?: number;
  frames_processed: number;
  frames_with_pose: number;
  pose_detection_rate: number;
  duration_sec: number;
  average_angles?: PoseAngles;
  skeleton_frames?: ExternalSkeletonFrame[];
  ai_analysis?: ExternalAIAnalysis | null;
  error?: string;
}

// ── Request body schema ───────────────────────────────────────────────────

interface ProcessB2Body {
  key: string;
  contentType: string;
  seed_x: number;
  seed_y: number;
  seed_frame?: number;
  show_angles?: boolean;
  show_body?: boolean;
  max_duration_sec?: number;
  auto_detect?: boolean;
  enable_ai?: boolean;
  language?: string;
  trim_start_sec?: number | null;
  trim_end_sec?: number | null;
}

// ─── Helper functions ───────────────────────────────────────────────────────

function validateProcessB2Request(
  body: ProcessB2Body,
  userId: string
): NextResponse | null {
  if (!body.key || !body.contentType) {
    return NextResponse.json(
      { error: "key and contentType are required" },
      { status: 400 }
    );
  }
  if (!body.key.startsWith(`uploads/${userId}/`)) {
    return NextResponse.json(
      { error: "Unauthorized: key does not belong to you" },
      { status: 403 }
    );
  }
  if (body.seed_x === undefined || body.seed_y === undefined) {
    return NextResponse.json(
      { error: "seed_x and seed_y are required" },
      { status: 400 }
    );
  }
  if (!Number.isFinite(body.seed_x) || !Number.isFinite(body.seed_y)) {
    return NextResponse.json(
      { error: "seed_x and seed_y must be valid numbers" },
      { status: 400 }
    );
  }
  return null;
}

async function resolveAiPermission(
  enableAi: boolean | undefined,
  userId: string
): Promise<boolean> {
  if (!enableAi) return false;
  const rateCheck = await checkAiRateLimit(userId);
  if (rateCheck.allowed) {
    console.log(`[LiftB2] AI enabled for user ${userId}`);
    return true;
  }
  console.log(
    `[LiftB2] AI rate-limited — next at ${rateCheck.nextAvailableAt?.toISOString()}`
  );
  return false;
}

function resolveVideoUrl(
  result: ExternalApiResponse,
  resultKey: string
): string | null {
  if (result.video_uploaded_to_b2) return getB2PublicUrl(resultKey);
  if (result.video_url) return `${BARBELL_API_URL}${result.video_url}`;
  return null;
}

function buildSuccessResponse(
  result: ExternalApiResponse,
  videoUrl: string | null,
  skeletonFrames: ReturnType<typeof transformSkeletonFrames>,
  aiAnalysis: ReturnType<typeof transformAiAnalysis>
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message: result.message,
      videoUrl,
      tracking: {
        success: result.tracking_success,
        autoDetected: result.auto_detected ?? false,
        detectedCenter: {
          x: result.detected_center_x ?? null,
          y: result.detected_center_y ?? null,
        },
        detectedRadius: result.detected_radius ?? null,
        totalTravelPx: result.total_travel_px ?? null,
        maxVerticalDisplacementPx: result.max_vertical_displacement_px ?? null,
        maxHorizontalDisplacementPx:
          result.max_horizontal_displacement_px ?? null,
      },
      pose: {
        framesProcessed: result.frames_processed,
        framesWithPose: result.frames_with_pose,
        detectionRate: result.pose_detection_rate,
        durationSec: result.duration_sec,
        averageAngles: transformAverageAngles(result.average_angles),
      },
      skeletonFrames,
      aiAnalysis,
    },
    { status: 200 }
  );
}

function logUnexpectedError(error: unknown): void {
  console.error("[LiftB2] Unexpected error:", {
    name: error instanceof Error ? error.name : "unknown",
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
  });
}

export async function POST(request: Request) {
  try {
    // ── Auth (supports both web session and mobile Bearer token) ──────────
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse & validate JSON body ─────────────────────────────────────────
    const body = (await request.json()) as ProcessB2Body;
    const validationError = validateProcessB2Request(body, user.id);
    if (validationError) return validationError;

    const { key, contentType, seed_x: seedX, seed_y: seedY } = body;

    // ── Generate presigned URLs for Railway ────────────────────────────────
    const videoDownloadUrl = await createPresignedDownloadUrl(key, 900);
    const { uploadUrl: resultUploadUrl, key: resultKey } =
      await createPresignedResultUploadUrl(user.id, 900);

    console.log("[LiftB2] Delegating to Railway with video_url:", {
      key,
      contentType,
      seed_x: seedX,
      seed_y: seedY,
      resultKey,
    });

    // ── AI rate limiting ───────────────────────────────────────────────────
    const aiAllowed = await resolveAiPermission(body.enable_ai, user.id);

    // ── Build JSON payload for Railway /analyze/full/url ───────────────────
    const railwayPayload = {
      video_url: videoDownloadUrl,
      content_type: contentType,
      seed_x: seedX,
      seed_y: seedY,
      seed_frame: body.seed_frame ?? 0,
      show_angles: body.show_angles ?? true,
      show_body: body.show_body ?? true,
      max_duration_sec: body.max_duration_sec ?? MAX_DURATION_LIFT_SEC,
      auto_detect: body.auto_detect ?? true,
      enable_ai: aiAllowed,
      language: body.language ?? "en",
      trim_start_sec: body.trim_start_sec ?? null,
      trim_end_sec: body.trim_end_sec ?? null,
      result_upload_url: resultUploadUrl,
    };

    // ── Call Railway (with retry) ──────────────────────────────────────────
    const railwayResult = await callRailwayWithRetry(
      `${BARBELL_API_URL}/analyze/full/url`,
      JSON.stringify(railwayPayload),
      2,
      "LiftB2",
      { "Content-Type": "application/json" }
    );
    if (railwayResult instanceof NextResponse) return railwayResult;
    const response = railwayResult;

    // ── Parse response ─────────────────────────────────────────────────────
    console.log("[LiftB2] Railway response:", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[LiftB2] Railway error:",
        response.status,
        errorText.substring(0, 500)
      );
      return parseRailwayErrorResponse(errorText, response.status);
    }

    const result: ExternalApiResponse = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || result.message || "Processing failed" },
        { status: 400 }
      );
    }

    // ── Build & return success response ────────────────────────────────────
    const videoUrl = resolveVideoUrl(result, resultKey);
    const skeletonFrames = transformSkeletonFrames(
      result.skeleton_frames ?? []
    );
    const aiAnalysis = transformAiAnalysis(result.ai_analysis);

    if (aiAnalysis && aiAllowed) {
      await recordAiUsage(user.id, "lift");
    }

    return buildSuccessResponse(result, videoUrl, skeletonFrames, aiAnalysis);
  } catch (error) {
    logUnexpectedError(error);
    return NextResponse.json(
      { error: "Video processing failed" },
      { status: 500 }
    );
  }
}

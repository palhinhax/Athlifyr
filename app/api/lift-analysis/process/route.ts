/**
 * POST /api/lift-analysis/process
 *
 * Centralized lift analysis endpoint that calls the external barbell-path-tracker API.
 * Combines barbell tracking + pose estimation in a single request.
 *
 * This endpoint can be called by both mobile and web clients.
 *
 * Body: multipart/form-data
 *   - video            : file (mp4, mov, avi, mkv, webm) ≤ 500MB
 *   - seed_x           : string (number) — X coordinate where user clicked
 *   - seed_y           : string (number) — Y coordinate where user clicked
 *   - seed_frame       : string (number) — Frame where point was selected (default: 0)
 *   - show_angles      : string (boolean) — Show angles in video (default: true)
 *   - max_duration_sec : string (number) — Max video duration (default: 60, max: 120)
 *   - auto_detect      : string (boolean) — Auto-detect disc center (default: true)
 *
 * Response 200:
 * {
 *   success: true,
 *   message: "Full analysis complete!",
 *   videoUrl: string,
 *   tracking: {
 *     success: boolean,
 *     autoDetected: boolean,
 *     detectedCenter: { x: number, y: number },
 *     detectedRadius: number,
 *     totalTravelPx: number,
 *     maxVerticalDisplacementPx: number,
 *     maxHorizontalDisplacementPx: number
 *   },
 *   pose: {
 *     framesProcessed: number,
 *     framesWithPose: number,
 *     detectionRate: number,
 *     durationSec: number,
 *     averageAngles: { ... }
 *   },
 *   skeletonFrames: SkeletonFrame[]  // 3D landmark data per frame
 * }
 *
 * Response 400: { error: string }
 * Response 500: { error: string }
 */

import { NextResponse } from "next/server";
import { transcodeToH264, trimVideoStreamCopy } from "@/lib/ffmpeg-utils";
import { MAX_DURATION_LIFT_SEC } from "@/lib/video-limits";
import { auth } from "@/lib/auth";
import { checkAiRateLimit, recordAiUsage } from "@/lib/ai-rate-limit";
import {
  type PoseAngles,
  type ExternalSkeletonFrame,
  type ExternalAIAnalysis,
  transformSkeletonFrames,
  transformAiAnalysis,
  transformAverageAngles,
  parseRailwayErrorResponse,
  callRailwayWithRetry,
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_BYTES,
  getVideoExtension,
  buildTranscodeErrorResponse,
} from "@/lib/analysis-transforms";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for video processing

const BARBELL_API_URL =
  "https://barbell-path-tracker-production.up.railway.app";

interface ExternalApiResponse {
  success: boolean;
  message: string;
  video_url?: string;
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

// ── Helpers ────────────────────────────────────────────────────────────────

function validateVideoFile(
  formData: FormData
): NextResponse | { videoFile: File; seedX: string; seedY: string } {
  const videoFile = formData.get("video");
  if (!videoFile || !(videoFile instanceof File)) {
    return NextResponse.json(
      { error: "video file is required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
    return NextResponse.json(
      { error: "Only mp4, mov, avi, mkv, and webm videos are supported" },
      { status: 400 }
    );
  }

  if (videoFile.size > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      { error: "Video exceeds 500 MB limit" },
      { status: 400 }
    );
  }

  const seedX = formData.get("seed_x");
  const seedY = formData.get("seed_y");
  if (!seedX || !seedY) {
    return NextResponse.json(
      { error: "seed_x and seed_y are required" },
      { status: 400 }
    );
  }

  const seedXNum = Number(seedX);
  const seedYNum = Number(seedY);
  if (!Number.isFinite(seedXNum) || !Number.isFinite(seedYNum)) {
    return NextResponse.json(
      { error: "seed_x and seed_y must be valid numbers" },
      { status: 400 }
    );
  }

  return { videoFile, seedX: seedX.toString(), seedY: seedY.toString() };
}

async function trimAndTranscodeVideo(
  videoFile: File,
  formData: FormData
): Promise<NextResponse | File> {
  let finalVideoFile: File = videoFile;
  const baseType = videoFile.type.split(";")[0].trim();

  const trimStartRaw = formData.get("trim_start_sec");
  const trimEndRaw = formData.get("trim_end_sec");
  const trimStartSec = trimStartRaw ? Number(trimStartRaw) : null;
  const trimEndSec = trimEndRaw ? Number(trimEndRaw) : null;

  let didTrim = false;

  if (
    trimStartSec !== null &&
    trimEndSec !== null &&
    Number.isFinite(trimStartSec) &&
    Number.isFinite(trimEndSec) &&
    trimEndSec > trimStartSec
  ) {
    try {
      const ext = getVideoExtension(baseType);
      console.log(
        `[LiftAnalysis] Trimming video: ${trimStartSec.toFixed(2)}s–${trimEndSec.toFixed(2)}s`
      );
      const inputBuffer = Buffer.from(await finalVideoFile.arrayBuffer());
      const trimmedBuffer = await trimVideoStreamCopy(
        inputBuffer,
        trimStartSec,
        trimEndSec,
        ext
      );
      finalVideoFile = new File(
        [new Uint8Array(trimmedBuffer)],
        finalVideoFile.name.replace(/\.[^.]+$/, ".mp4"),
        { type: "video/mp4" }
      );
      didTrim = true;
      console.log(
        `[LiftAnalysis] Trimmed ${inputBuffer.length} → ${trimmedBuffer.length} bytes (H.264 MP4)`
      );
    } catch (err) {
      console.error("[LiftAnalysis] Trim failed:", err);
    }
  }

  if (!didTrim && baseType === "video/webm") {
    try {
      console.log("[LiftAnalysis] WebM detected — transcoding to H.264 MP4...");
      const inputBuffer = Buffer.from(await finalVideoFile.arrayBuffer());
      const mp4Buffer = await transcodeToH264(inputBuffer);
      finalVideoFile = new File(
        [new Uint8Array(mp4Buffer)],
        videoFile.name.replace(/\.[^.]+$/, ".mp4"),
        { type: "video/mp4" }
      );
      console.log(
        `[LiftAnalysis] Transcoded ${inputBuffer.length} → ${mp4Buffer.length} bytes`
      );
    } catch (err) {
      return buildTranscodeErrorResponse(err, "LiftAnalysis");
    }
  }

  return finalVideoFile;
}

async function resolveAiPermission(
  formData: FormData,
  externalFormData: FormData
): Promise<boolean> {
  const enableAi = formData.get("enable_ai");
  if (enableAi?.toString() !== "true") return false;

  const session = await auth();
  if (!session?.user?.id) {
    console.log("[LiftAnalysis] AI requested but user not authenticated");
    return false;
  }

  const rateCheck = await checkAiRateLimit(session.user.id);
  if (!rateCheck.allowed) {
    console.log(
      `[LiftAnalysis] AI rate-limited for user ${session.user.id} — next available at ${rateCheck.nextAvailableAt?.toISOString()}`
    );
    return false;
  }

  externalFormData.append("enable_ai", "true");
  console.log(`[LiftAnalysis] AI enabled for user ${session.user.id}`);
  return true;
}

export async function POST(request: Request) {
  try {
    // ── Debug: Log incoming request details ─────────────────────────────────
    const contentLength = request.headers.get("content-length");
    const contentType = request.headers.get("content-type");
    console.log("[LiftAnalysis] ── Incoming request ──", {
      method: request.method,
      url: request.url,
      contentLength: contentLength
        ? `${contentLength} bytes (${(Number(contentLength) / (1024 * 1024)).toFixed(2)} MB)`
        : "not set",
      contentType: contentType?.substring(0, 80),
      userAgent: request.headers.get("user-agent")?.substring(0, 100),
      xForwardedFor: request.headers.get("x-forwarded-for"),
      xVercelId: request.headers.get("x-vercel-id"),
    });

    // ── Parse multipart form data ──────────────────────────────────────────
    let formData: FormData;
    try {
      console.log("[LiftAnalysis] Parsing formData...");
      formData = await request.formData();
      console.log("[LiftAnalysis] formData parsed successfully");
    } catch (parseError) {
      console.error("[LiftAnalysis] formData parse FAILED:", parseError);
      return NextResponse.json(
        { error: "Invalid multipart body" },
        { status: 400 }
      );
    }

    // ── Validate video file and seed coordinates ──────────────────────────
    const validation = validateVideoFile(formData);
    if (validation instanceof NextResponse) return validation;
    const { videoFile, seedX, seedY } = validation;

    console.log("[LiftAnalysis] Received file:", {
      name: videoFile.name,
      type: videoFile.type,
      sizeMB: (videoFile.size / (1024 * 1024)).toFixed(2) + " MB",
    });

    // ── Trim and/or transcode video ───────────────────────────────────────
    const videoResult = await trimAndTranscodeVideo(videoFile, formData);
    if (videoResult instanceof NextResponse) return videoResult;
    const finalVideoFile = videoResult;

    // ── Prepare form data for external API ────────────────────────────────
    const externalFormData = new FormData();
    const safeFilename = finalVideoFile.name || "video.mp4";
    externalFormData.append("video", finalVideoFile, safeFilename);
    externalFormData.append("seed_x", seedX);
    externalFormData.append("seed_y", seedY);

    const seedFrame = formData.get("seed_frame") || "0";
    const showAngles = formData.get("show_angles") || "true";
    const showBody = formData.get("show_body") || "true";
    const maxDurationSec =
      formData.get("max_duration_sec") || String(MAX_DURATION_LIFT_SEC);
    const autoDetect = formData.get("auto_detect") || "true";

    externalFormData.append("seed_frame", seedFrame.toString());
    externalFormData.append("show_angles", showAngles.toString());
    externalFormData.append("show_body", showBody.toString());
    externalFormData.append("max_duration_sec", maxDurationSec.toString());
    externalFormData.append("auto_detect", autoDetect.toString());

    // ── AI rate limiting ──────────────────────────────────────────────────
    const aiAllowed = await resolveAiPermission(formData, externalFormData);
    const language = formData.get("language");
    if (language) {
      externalFormData.append("language", language.toString());
    }

    console.log("[LiftAnalysis] Forwarding to Railway:", {
      filename: safeFilename,
      type: finalVideoFile.type,
      sizeMB: (finalVideoFile.size / (1024 * 1024)).toFixed(2) + " MB",
      seed_x: seedX,
      seed_y: seedY,
      max_duration_sec: maxDurationSec,
      enable_ai: aiAllowed ? "true" : "false (rate-limited or not requested)",
      language: language?.toString() ?? "not set",
    });

    // ── Call external API (with retry on ECONNRESET) ──────────────────────
    const railwayResponse = await callRailwayWithRetry(
      `${BARBELL_API_URL}/analyze/full`,
      externalFormData,
      2,
      "LiftAnalysis"
    );
    if (railwayResponse instanceof NextResponse) return railwayResponse;

    // ── Parse response ─────────────────────────────────────────────────────
    console.log("[LiftAnalysis] ── Railway response ──", {
      status: railwayResponse.status,
      statusText: railwayResponse.statusText,
      contentType: railwayResponse.headers.get("content-type"),
      contentLength: railwayResponse.headers.get("content-length"),
      server: railwayResponse.headers.get("server"),
    });

    if (!railwayResponse.ok) {
      const errorText = await railwayResponse.text();
      console.error(
        "[LiftAnalysis] External API error:",
        railwayResponse.status,
        errorText.substring(0, 500)
      );
      return parseRailwayErrorResponse(errorText, railwayResponse.status);
    }

    const result: ExternalApiResponse = await railwayResponse.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || result.message || "Processing failed" },
        { status: 400 }
      );
    }

    // ── Transform and return response ──────────────────────────────────────
    const videoUrl = result.video_url
      ? `${BARBELL_API_URL}${result.video_url}`
      : null;

    const skeletonFrames = transformSkeletonFrames(
      result.skeleton_frames ?? []
    );
    const aiAnalysis = transformAiAnalysis(result.ai_analysis);

    console.log("[LiftAnalysis] AI analysis from Railway:", {
      hasAiAnalysis: !!aiAnalysis,
      exercise: result.ai_analysis?.exercise ?? null,
      overallScore: result.ai_analysis?.overall_score ?? null,
      totalReps: result.ai_analysis?.total_reps ?? null,
      repsCount: result.ai_analysis?.reps?.length ?? 0,
    });

    // Record AI usage if AI was actually returned
    if (aiAnalysis && aiAllowed) {
      const session = await auth();
      if (session?.user?.id) {
        await recordAiUsage(session.user.id, "lift");
      }
    }

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
          maxVerticalDisplacementPx:
            result.max_vertical_displacement_px ?? null,
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
  } catch (error) {
    console.error("[LiftAnalysis] ── Unexpected top-level error ──", {
      name: error instanceof Error ? error.name : "unknown",
      message: error instanceof Error ? error.message : String(error),
      stack:
        error instanceof Error ? error.stack?.substring(0, 500) : undefined,
      cause:
        error instanceof Error && "cause" in error
          ? String(error.cause)
          : undefined,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

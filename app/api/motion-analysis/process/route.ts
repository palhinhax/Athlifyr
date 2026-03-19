/**
 * POST /api/motion-analysis/process
 *
 * Centralized motion analysis endpoint that calls the external barbell-path-tracker API.
 * Provides full body pose estimation without barbell tracking.
 *
 * This endpoint can be called by both mobile and web clients.
 *
 * Body: multipart/form-data
 *   - video            : file (mp4, mov, avi, mkv, webm) ≤ 500MB
 *   - show_angles      : string (boolean) — Show angles in video (default: true)
 *   - max_duration_sec : string (number) — Max video duration (default: 30, max: 30)
 *
 * Response 200:
 * {
 *   success: true,
 *   message: "Body analysis complete!",
 *   videoUrl: string,
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
import { MAX_DURATION_LIFT_SEC } from "@/lib/video-limits";
import { auth } from "@/lib/auth";
import { recordAiUsage } from "@/lib/ai-rate-limit";
import {
  type PoseAngles,
  type ExternalSkeletonFrame,
  type ExternalAIAnalysis,
  transformSkeletonFrames,
  transformAiAnalysis,
  transformAverageAngles,
  parseRailwayErrorResponse,
  trimAndTranscodeVideo,
  resolveAiPermission,
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_BYTES,
} from "@/lib/analysis-transforms";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for video processing

const BARBELL_API_URL =
  "https://barbell-path-tracker-production.up.railway.app";

interface ExternalApiResponse {
  success: boolean;
  message: string;
  video_url?: string;
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
): NextResponse | { videoFile: File } {
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

  return { videoFile };
}

export async function POST(request: Request) {
  try {
    // ── Debug: Log incoming request details ─────────────────────────────────
    const contentLength = request.headers.get("content-length");
    const contentType = request.headers.get("content-type");
    console.log("[MotionAnalysis] ── Incoming request ──", {
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
      console.log("[MotionAnalysis] Parsing formData...");
      formData = await request.formData();
      console.log("[MotionAnalysis] formData parsed successfully");
    } catch (parseError) {
      console.error("[MotionAnalysis] formData parse FAILED:", parseError);
      return NextResponse.json(
        { error: "Invalid multipart body" },
        { status: 400 }
      );
    }

    // ── Validate video file ────────────────────────────────────────────────
    const validation = validateVideoFile(formData);
    if (validation instanceof NextResponse) return validation;
    const { videoFile } = validation;

    console.log("[MotionAnalysis] Received file:", {
      name: videoFile.name,
      type: videoFile.type,
      sizeMB: (videoFile.size / (1024 * 1024)).toFixed(2) + " MB",
      sizeBytes: videoFile.size,
    });

    // ── Trim and/or transcode video ───────────────────────────────────────
    const videoResult = await trimAndTranscodeVideo(
      videoFile,
      formData,
      "MotionAnalysis"
    );
    if (videoResult instanceof NextResponse) return videoResult;
    const finalVideoFile = videoResult;

    // ── Prepare form data for external API ────────────────────────────────
    const externalFormData = new FormData();
    const safeFilename = finalVideoFile.name || "video.mp4";
    externalFormData.append("video", finalVideoFile, safeFilename);

    const showAngles = formData.get("show_angles") || "true";
    const showBody = formData.get("show_body") || "true";
    const maxDurationSec =
      formData.get("max_duration_sec") || String(MAX_DURATION_LIFT_SEC);

    externalFormData.append("show_angles", showAngles.toString());
    externalFormData.append("show_body", showBody.toString());
    externalFormData.append("max_duration_sec", maxDurationSec.toString());

    // ── AI rate limiting ──────────────────────────────────────────────────
    const aiAllowed = await resolveAiPermission(
      formData,
      externalFormData,
      "MotionAnalysis"
    );
    const language = formData.get("language");
    if (language) {
      externalFormData.append("language", language.toString());
    }

    console.log("[MotionAnalysis] Forwarding to Railway:", {
      filename: safeFilename,
      type: finalVideoFile.type,
      sizeMB: (finalVideoFile.size / (1024 * 1024)).toFixed(2) + " MB",
      show_angles: showAngles,
      max_duration_sec: maxDurationSec,
      enable_ai: aiAllowed ? "true" : "false (rate-limited or not requested)",
      language: language?.toString() ?? "not set",
    });

    // ── Call external API ──────────────────────────────────────────────────
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 270_000);

    let response: Response;
    try {
      response = await fetch(`${BARBELL_API_URL}/analyze/body`, {
        method: "POST",
        body: externalFormData,
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("[MotionAnalysis] External API request failed:", error);

      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timeout. Video processing took too long." },
          { status: 504 }
        );
      }

      return NextResponse.json(
        { error: "Failed to connect to video processing service" },
        { status: 503 }
      );
    }

    clearTimeout(timeout);

    // ── Parse response ─────────────────────────────────────────────────────
    console.log("[MotionAnalysis] ── Railway response ──", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
      server: response.headers.get("server"),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[MotionAnalysis] External API error:",
        response.status,
        errorText.slice(0, 500)
      );
      return parseRailwayErrorResponse(errorText, response.status);
    }

    const result: ExternalApiResponse = await response.json();

    console.log("[MotionAnalysis] External API response:", {
      success: result.success,
      message: result.message,
      frames_processed: result.frames_processed,
      frames_with_pose: result.frames_with_pose,
      pose_detection_rate: result.pose_detection_rate,
      duration_sec: result.duration_sec,
      video_url: result.video_url,
      skeleton_frames_count: result.skeleton_frames?.length ?? 0,
    });

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

    console.log("[MotionAnalysis] AI analysis from Railway:", {
      hasAiAnalysis: !!aiAnalysis,
      exercise: result.ai_analysis?.exercise ?? null,
      overallScore: result.ai_analysis?.overall_score ?? null,
      totalReps: result.ai_analysis?.total_reps ?? null,
      repsCount: result.ai_analysis?.reps?.length ?? 0,
    });

    if (aiAnalysis && aiAllowed) {
      const session = await auth();
      if (session?.user?.id) {
        await recordAiUsage(session.user.id, "motion");
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        videoUrl,
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
    console.error("[MotionAnalysis] ── Unexpected top-level error ──", {
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

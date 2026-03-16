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

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes — Railway does the heavy lifting

const BARBELL_API_URL =
  "https://barbell-path-tracker-production.up.railway.app";

// ── Types (Railway response) ──────────────────────────────────────────────

interface PoseAngles {
  left_knee?: number;
  right_knee?: number;
  left_hip?: number;
  right_hip?: number;
  left_elbow?: number;
  right_elbow?: number;
  left_shoulder?: number;
  right_shoulder?: number;
  left_ankle?: number;
  right_ankle?: number;
  torso_inclination?: number;
  back_angle?: number;
}

interface ExternalLandmark {
  name: string;
  index: number;
  x: number;
  y: number;
  z: number;
  visibility: number;
  pixel_x: number;
  pixel_y: number;
  world_x: number | null;
  world_y: number | null;
  world_z: number | null;
}

interface ExternalBone {
  start_index: number;
  end_index: number;
  start_name: string;
  end_name: string;
}

interface ExternalSkeletonFrame {
  landmarks: ExternalLandmark[];
  bones: ExternalBone[];
  frame_width: number;
  frame_height: number;
}

interface ExternalRepAnalysis {
  rep_number: number;
  start_frame: number | null;
  end_frame: number | null;
  phase_eccentric_frames: [number, number] | null;
  phase_concentric_frames: [number, number] | null;
  min_knee_angle: number | null;
  min_hip_angle: number | null;
  rom_degrees: number | null;
  form_score: number | null;
  notes: string[];
}

interface ExternalAIAnalysis {
  exercise: string | null;
  exercise_en: string | null;
  confidence: number | null;
  total_reps: number | null;
  duration_sec: number | null;
  tempo_avg_sec: number | null;
  overall_score: number | null;
  overall_notes: string | null;
  reps: ExternalRepAnalysis[];
  strengths: string[];
  improvements: string[];
  safety_flags: string[];
}

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

function parseRailwayErrorResponse(
  errorText: string,
  status: number
): NextResponse {
  try {
    const errorJson = JSON.parse(errorText);
    let errorMessage: string;
    if (Array.isArray(errorJson.detail)) {
      errorMessage = errorJson.detail
        .map((e: { msg?: string; loc?: string[] }) =>
          e.loc
            ? `${e.loc.join(".")} — ${e.msg}`
            : (e.msg ?? "Validation error")
        )
        .join("; ");
    } else {
      errorMessage =
        typeof errorJson.detail === "string"
          ? errorJson.detail
          : errorJson.error || "Processing failed";
    }
    return NextResponse.json({ error: errorMessage }, { status });
  } catch {
    return NextResponse.json(
      { error: `Processing failed: ${errorText}` },
      { status }
    );
  }
}

async function callRailwayWithRetry(
  url: string,
  body: string,
  maxRetries: number,
  headers?: Record<string, string>
): Promise<NextResponse | Response> {
  let response: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 270_000);

    try {
      console.log(`[LiftB2] Attempt ${attempt}/${maxRetries} → ${url}`);
      response = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      break;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;

      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timeout. Video processing took too long." },
          { status: 504 }
        );
      }

      const isConnReset =
        error instanceof Error &&
        ("cause" in error
          ? (error.cause as NodeJS.ErrnoException)?.code === "ECONNRESET"
          : error.message.includes("ECONNRESET"));

      console.error(`[LiftB2] Attempt ${attempt} failed:`, error);
      if (!isConnReset || attempt === maxRetries) break;
      await new Promise((resolve) => setTimeout(resolve, 2_000 * attempt));
    }
  }

  if (!response) {
    console.error("[LiftB2] All attempts failed:", lastError);
    return NextResponse.json(
      { error: "Failed to connect to video processing service" },
      { status: 503 }
    );
  }

  return response;
}

function transformSkeletonFrames(frames: ExternalSkeletonFrame[]) {
  return frames.map((frame) => ({
    frameWidth: frame.frame_width,
    frameHeight: frame.frame_height,
    landmarks: frame.landmarks.map((lm) => ({
      name: lm.name,
      index: lm.index,
      x: lm.x,
      y: lm.y,
      z: lm.z,
      visibility: lm.visibility,
      pixelX: lm.pixel_x,
      pixelY: lm.pixel_y,
      worldX: lm.world_x,
      worldY: lm.world_y,
      worldZ: lm.world_z,
    })),
    bones: frame.bones.map((bone) => ({
      startIndex: bone.start_index,
      endIndex: bone.end_index,
      startName: bone.start_name,
      endName: bone.end_name,
    })),
  }));
}

function transformAiAnalysis(ai: ExternalAIAnalysis | null | undefined) {
  if (!ai) return null;
  return {
    exercise: ai.exercise ?? null,
    exerciseEn: ai.exercise_en ?? null,
    confidence: ai.confidence ?? null,
    totalReps: ai.total_reps ?? null,
    durationSec: ai.duration_sec ?? null,
    tempoAvgSec: ai.tempo_avg_sec ?? null,
    overallScore: ai.overall_score ?? null,
    overallNotes: ai.overall_notes ?? null,
    reps: (ai.reps ?? []).map((rep) => ({
      repNumber: rep.rep_number,
      startFrame: rep.start_frame ?? null,
      endFrame: rep.end_frame ?? null,
      phaseEccentricFrames: rep.phase_eccentric_frames ?? null,
      phaseConcentricFrames: rep.phase_concentric_frames ?? null,
      minKneeAngle: rep.min_knee_angle ?? null,
      minHipAngle: rep.min_hip_angle ?? null,
      romDegrees: rep.rom_degrees ?? null,
      formScore: rep.form_score ?? null,
      notes: rep.notes ?? [],
    })),
    strengths: ai.strengths ?? [],
    improvements: ai.improvements ?? [],
    safetyFlags: ai.safety_flags ?? [],
  };
}

function transformAverageAngles(angles: PoseAngles | undefined) {
  if (!angles) return null;
  return {
    leftKnee: angles.left_knee ?? null,
    rightKnee: angles.right_knee ?? null,
    leftHip: angles.left_hip ?? null,
    rightHip: angles.right_hip ?? null,
    leftElbow: angles.left_elbow ?? null,
    rightElbow: angles.right_elbow ?? null,
    leftShoulder: angles.left_shoulder ?? null,
    rightShoulder: angles.right_shoulder ?? null,
    leftAnkle: angles.left_ankle ?? null,
    rightAnkle: angles.right_ankle ?? null,
    torsoInclination: angles.torso_inclination ?? angles.back_angle ?? null,
  };
}

export async function POST(request: Request) {
  try {
    // ── Auth (supports both web session and mobile Bearer token) ──────────
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse JSON body (tiny — no video) ──────────────────────────────────
    const body = (await request.json()) as ProcessB2Body;

    const { key, contentType } = body;
    if (!key || !contentType) {
      return NextResponse.json(
        { error: "key and contentType are required" },
        { status: 400 }
      );
    }

    // Validate the key belongs to this user
    if (!key.startsWith(`uploads/${user.id}/`)) {
      return NextResponse.json(
        { error: "Unauthorized: key does not belong to you" },
        { status: 403 }
      );
    }

    const seedX = body.seed_x;
    const seedY = body.seed_y;
    if (seedX === undefined || seedY === undefined) {
      return NextResponse.json(
        { error: "seed_x and seed_y are required" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(seedX) || !Number.isFinite(seedY)) {
      return NextResponse.json(
        { error: "seed_x and seed_y must be valid numbers" },
        { status: 400 }
      );
    }

    // ── Generate presigned download URL for Railway ────────────────────────
    // Railway will download the video directly from B2 — Vercel never
    // touches the raw bytes.
    const videoDownloadUrl = await createPresignedDownloadUrl(key, 900); // 15 min

    // ── Generate presigned upload URL for the processed result video ──────
    // Railway will upload the output video directly to B2, so the result
    // video also never flows through Vercel.
    const { uploadUrl: resultUploadUrl, key: resultKey } =
      await createPresignedResultUploadUrl(user.id, 900); // 15 min

    console.log("[LiftB2] Delegating to Railway with video_url:", {
      key,
      contentType,
      seed_x: seedX,
      seed_y: seedY,
      resultKey,
    });

    // ── AI rate limiting ───────────────────────────────────────────────────
    let aiAllowed = false;
    if (body.enable_ai) {
      const rateCheck = await checkAiRateLimit(user.id);
      if (rateCheck.allowed) {
        aiAllowed = true;
        console.log(`[LiftB2] AI enabled for user ${user.id}`);
      } else {
        console.log(
          `[LiftB2] AI rate-limited — next at ${rateCheck.nextAvailableAt?.toISOString()}`
        );
      }
    }

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
      // Railway uploads the processed video directly to B2 via this URL
      result_upload_url: resultUploadUrl,
    };

    // ── Call Railway (with retry) ──────────────────────────────────────────
    const railwayResult = await callRailwayWithRetry(
      `${BARBELL_API_URL}/analyze/full/url`,
      JSON.stringify(railwayPayload),
      2,
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

    const videoUrl = result.video_uploaded_to_b2
      ? getB2PublicUrl(resultKey)
      : result.video_url
        ? `${BARBELL_API_URL}${result.video_url}`
        : null;

    const skeletonFrames = transformSkeletonFrames(
      result.skeleton_frames ?? []
    );
    const aiAnalysis = transformAiAnalysis(result.ai_analysis);

    if (aiAnalysis && aiAllowed) {
      await recordAiUsage(user.id, "lift");
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
    console.error("[LiftB2] Unexpected error:", {
      name: error instanceof Error ? error.name : "unknown",
      message: error instanceof Error ? error.message : String(error),
      stack:
        error instanceof Error ? error.stack?.substring(0, 500) : undefined,
    });
    return NextResponse.json(
      { error: "Video processing failed" },
      { status: 500 }
    );
  }
}

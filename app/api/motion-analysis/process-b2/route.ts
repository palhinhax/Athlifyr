/**
 * POST /api/motion-analysis/process-b2
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
 *   "show_angles":      true,
 *   "show_body":        true,
 *   "max_duration_sec":  30,
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
  frames_processed: number;
  frames_with_pose: number;
  pose_detection_rate: number;
  duration_sec: number;
  average_angles?: PoseAngles;
  skeleton_frames?: ExternalSkeletonFrame[];
  ai_analysis?: ExternalAIAnalysis | null;
  error?: string;
}

// ── Request body ──────────────────────────────────────────────────────────

interface ProcessB2Body {
  key: string;
  contentType: string;
  show_angles?: boolean;
  show_body?: boolean;
  max_duration_sec?: number;
  enable_ai?: boolean;
  language?: string;
  trim_start_sec?: number | null;
  trim_end_sec?: number | null;
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

    // Validate key belongs to this user
    if (!key.startsWith(`uploads/${user.id}/`)) {
      return NextResponse.json(
        { error: "Unauthorized: key does not belong to you" },
        { status: 403 }
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

    console.log("[MotionB2] Delegating to Railway with video_url:", {
      key,
      contentType,
      resultKey,
    });

    // ── AI rate limiting ───────────────────────────────────────────────────
    let aiAllowed = false;
    if (body.enable_ai) {
      const rateCheck = await checkAiRateLimit(user.id);
      if (rateCheck.allowed) {
        aiAllowed = true;
        console.log(`[MotionB2] AI enabled for user ${user.id}`);
      }
    }

    // ── Build JSON payload for Railway /analyze/body/url ──────────────────
    const railwayPayload = {
      video_url: videoDownloadUrl,
      content_type: contentType,
      show_angles: body.show_angles ?? true,
      show_body: body.show_body ?? true,
      max_duration_sec: body.max_duration_sec ?? MAX_DURATION_LIFT_SEC,
      enable_ai: aiAllowed,
      language: body.language ?? "en",
      trim_start_sec: body.trim_start_sec ?? null,
      trim_end_sec: body.trim_end_sec ?? null,
      // Railway uploads the processed video directly to B2 via this URL
      result_upload_url: resultUploadUrl,
    };

    // ── Call Railway ───────────────────────────────────────────────────────
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 270_000);

    let response: Response;
    try {
      console.log(`[MotionB2] → ${BARBELL_API_URL}/analyze/body/url`);
      response = await fetch(`${BARBELL_API_URL}/analyze/body/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(railwayPayload),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      console.error("[MotionB2] External API request failed:", error);

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
    console.log("[MotionB2] Railway response:", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[MotionB2] Railway error:",
        response.status,
        errorText.substring(0, 500)
      );

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
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: `Processing failed: ${errorText}` },
          { status: response.status }
        );
      }
    }

    const result: ExternalApiResponse = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || result.message || "Processing failed" },
        { status: 400 }
      );
    }

    // ── Transform & return ─────────────────────────────────────────────────
    // Railway uploaded the processed video directly to B2 — use the B2 URL
    // instead of a Railway download URL.
    const videoUrl = result.video_uploaded_to_b2
      ? getB2PublicUrl(resultKey)
      : result.video_url
        ? `${BARBELL_API_URL}${result.video_url}`
        : null;

    const skeletonFrames = (result.skeleton_frames ?? []).map((frame) => ({
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

    const aiAnalysis = result.ai_analysis
      ? {
          exercise: result.ai_analysis.exercise ?? null,
          exerciseEn: result.ai_analysis.exercise_en ?? null,
          confidence: result.ai_analysis.confidence ?? null,
          totalReps: result.ai_analysis.total_reps ?? null,
          durationSec: result.ai_analysis.duration_sec ?? null,
          tempoAvgSec: result.ai_analysis.tempo_avg_sec ?? null,
          overallScore: result.ai_analysis.overall_score ?? null,
          overallNotes: result.ai_analysis.overall_notes ?? null,
          reps: (result.ai_analysis.reps ?? []).map((rep) => ({
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
          strengths: result.ai_analysis.strengths ?? [],
          improvements: result.ai_analysis.improvements ?? [],
          safetyFlags: result.ai_analysis.safety_flags ?? [],
        }
      : null;

    if (aiAnalysis && aiAllowed) {
      await recordAiUsage(user.id, "motion");
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
          averageAngles: result.average_angles
            ? {
                leftKnee: result.average_angles.left_knee ?? null,
                rightKnee: result.average_angles.right_knee ?? null,
                leftHip: result.average_angles.left_hip ?? null,
                rightHip: result.average_angles.right_hip ?? null,
                leftElbow: result.average_angles.left_elbow ?? null,
                rightElbow: result.average_angles.right_elbow ?? null,
                leftShoulder: result.average_angles.left_shoulder ?? null,
                rightShoulder: result.average_angles.right_shoulder ?? null,
                leftAnkle: result.average_angles.left_ankle ?? null,
                rightAnkle: result.average_angles.right_ankle ?? null,
                torsoInclination:
                  result.average_angles.torso_inclination ??
                  result.average_angles.back_angle ??
                  null,
              }
            : null,
        },
        skeletonFrames,
        aiAnalysis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[MotionB2] Unexpected error:", {
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

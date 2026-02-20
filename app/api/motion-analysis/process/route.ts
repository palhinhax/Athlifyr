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
import { transcodeToH264, trimVideoStreamCopy } from "@/lib/ffmpeg-utils";
import { MAX_DURATION_LIFT_SEC } from "@/lib/video-limits";
import { auth } from "@/lib/auth";
import { checkAiRateLimit, recordAiUsage } from "@/lib/ai-rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for video processing

const BARBELL_API_URL =
  "https://barbell-path-tracker-production.up.railway.app";

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

export async function POST(request: Request) {
  try {
    // ── Parse multipart form data ──────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid multipart body" },
        { status: 400 }
      );
    }

    // ── Validate video file ────────────────────────────────────────────────
    const videoFile = formData.get("video");
    if (!videoFile || !(videoFile instanceof File)) {
      return NextResponse.json(
        { error: "video file is required" },
        { status: 400 }
      );
    }

    console.log("[MotionAnalysis] Received file:", {
      name: videoFile.name,
      type: videoFile.type,
      sizeMB: (videoFile.size / (1024 * 1024)).toFixed(2) + " MB",
      sizeBytes: videoFile.size,
    });

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
    ];
    if (!allowedTypes.includes(videoFile.type)) {
      console.warn(
        "[MotionAnalysis] Rejected — unsupported type:",
        videoFile.type
      );
      return NextResponse.json(
        { error: "Only mp4, mov, avi, mkv, and webm videos are supported" },
        { status: 400 }
      );
    }

    const maxBytes = 500 * 1024 * 1024; // 500 MB
    if (videoFile.size > maxBytes) {
      console.warn(
        "[MotionAnalysis] Rejected — file too large:",
        videoFile.size
      );
      return NextResponse.json(
        { error: "Video exceeds 500 MB limit" },
        { status: 400 }
      );
    }

    // ── Transcode WebM → MP4 if needed ────────────────────────────────────
    // Railway's ffmpeg may not process WebM reliably, so we transcode
    // to H.264 MP4 on the server before forwarding.
    let finalVideoFile: File = videoFile;
    const baseType = videoFile.type.split(";")[0].trim();

    // ── Server-side trim (optional) ───────────────────────────────────────
    // Mobile clients can send trim_start_sec and trim_end_sec to trim the
    // video before forwarding to the Railway API. This avoids requiring
    // native FFmpeg on the mobile side.
    const trimStartRaw = formData.get("trim_start_sec");
    const trimEndRaw = formData.get("trim_end_sec");
    const trimStartSec = trimStartRaw ? Number(trimStartRaw) : null;
    const trimEndSec = trimEndRaw ? Number(trimEndRaw) : null;

    if (
      trimStartSec !== null &&
      trimEndSec !== null &&
      Number.isFinite(trimStartSec) &&
      Number.isFinite(trimEndSec) &&
      trimEndSec > trimStartSec
    ) {
      try {
        const ext =
          baseType === "video/webm"
            ? ".webm"
            : baseType === "video/quicktime"
              ? ".mov"
              : ".mp4";
        console.log(
          `[MotionAnalysis] Trimming video: ${trimStartSec.toFixed(2)}s–${trimEndSec.toFixed(2)}s`
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
          finalVideoFile.name,
          { type: finalVideoFile.type }
        );
        console.log(
          `[MotionAnalysis] Trimmed ${inputBuffer.length} → ${trimmedBuffer.length} bytes`
        );
      } catch (err) {
        console.error("[MotionAnalysis] Trim failed:", err);
        // Continue with untrimmed video — Railway will handle max_duration_sec
      }
    }

    if (baseType === "video/webm") {
      try {
        console.log(
          "[MotionAnalysis] WebM detected — transcoding to H.264 MP4..."
        );
        const inputBuffer = Buffer.from(await videoFile.arrayBuffer());
        const mp4Buffer = await transcodeToH264(inputBuffer);
        finalVideoFile = new File(
          [new Uint8Array(mp4Buffer)],
          finalVideoFile.name.replace(/\.[^.]+$/, ".mp4"),
          { type: "video/mp4" }
        );
        console.log(
          `[MotionAnalysis] Transcoded ${(inputBuffer.length / (1024 * 1024)).toFixed(2)} MB → ${(mp4Buffer.length / (1024 * 1024)).toFixed(2)} MB`
        );
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("[MotionAnalysis] Transcode failed:", errMsg);
        const isOom =
          errMsg.includes("OOM") ||
          errMsg.includes("-9") ||
          errMsg.includes("137");
        return NextResponse.json(
          {
            error: isOom
              ? "Video resolution is too high to process. Please record in 1080p or lower."
              : "Failed to convert video. Please try uploading an MP4 file.",
          },
          { status: 400 }
        );
      }
    } else {
      console.log("[MotionAnalysis] No transcode needed — type:", baseType);
    }

    // ── Prepare form data for external API ────────────────────────────────
    const externalFormData = new FormData();

    // Add video file — always supply an explicit filename so the multipart
    // Content-Disposition header includes `filename=...`, which FastAPI
    // requires to accept the upload (missing filename → 422).
    const safeFilename = finalVideoFile.name || "video.mp4";
    externalFormData.append("video", finalVideoFile, safeFilename);

    // Add optional parameters with defaults
    const showAngles = formData.get("show_angles") || "true";
    const maxDurationSec =
      formData.get("max_duration_sec") || String(MAX_DURATION_LIFT_SEC);

    externalFormData.append("show_angles", showAngles.toString());
    externalFormData.append("max_duration_sec", maxDurationSec.toString());

    // Forward AI parameters — enforce server-side rate limit (1 per 24h)
    const enableAi = formData.get("enable_ai");
    const language = formData.get("language");
    let aiAllowed = false;

    if (enableAi?.toString() === "true") {
      const session = await auth();
      if (session?.user?.id) {
        const rateCheck = await checkAiRateLimit(session.user.id);
        if (rateCheck.allowed) {
          aiAllowed = true;
          externalFormData.append("enable_ai", "true");
          console.log(
            `[MotionAnalysis] AI enabled for user ${session.user.id}`
          );
        } else {
          console.log(
            `[MotionAnalysis] AI rate-limited for user ${session.user.id} — next available at ${rateCheck.nextAvailableAt?.toISOString()}`
          );
        }
      } else {
        console.log(
          "[MotionAnalysis] AI requested but user not authenticated"
        );
      }
    }
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
    // 4.5 minute timeout (slightly less than maxDuration)
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
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[MotionAnalysis] External API error:",
        response.status,
        errorText.slice(0, 500)
      );

      try {
        const errorJson = JSON.parse(errorText);
        // FastAPI 422 returns { detail: [{ loc, msg, type }] } — flatten to a readable string
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

    // ── Transform and return response ──────────────────────────────────────
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || result.message || "Processing failed" },
        { status: 400 }
      );
    }

    // Build full video URL if available
    const videoUrl = result.video_url
      ? `${BARBELL_API_URL}${result.video_url}`
      : null;

    // Transform skeleton_frames from snake_case to camelCase
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

    // Transform ai_analysis from snake_case to camelCase
    console.log("[MotionAnalysis] AI analysis from Railway:", {
      hasAiAnalysis: !!result.ai_analysis,
      exercise: result.ai_analysis?.exercise ?? null,
      overallScore: result.ai_analysis?.overall_score ?? null,
      totalReps: result.ai_analysis?.total_reps ?? null,
      repsCount: result.ai_analysis?.reps?.length ?? 0,
    });

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

    // Record AI usage if AI was actually returned
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
    console.error("[MotionAnalysis] Unexpected error:", error);
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

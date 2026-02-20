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

    console.log("[LiftAnalysis] Received file:", {
      name: videoFile.name,
      type: videoFile.type,
      sizeMB: (videoFile.size / (1024 * 1024)).toFixed(2) + " MB",
    });

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
    ];
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { error: "Only mp4, mov, avi, mkv, and webm videos are supported" },
        { status: 400 }
      );
    }

    const maxBytes = 500 * 1024 * 1024; // 500 MB
    if (videoFile.size > maxBytes) {
      return NextResponse.json(
        { error: "Video exceeds 500 MB limit" },
        { status: 400 }
      );
    }

    // ── Validate required parameters ───────────────────────────────────────
    const seedX = formData.get("seed_x");
    const seedY = formData.get("seed_y");

    if (!seedX || !seedY) {
      return NextResponse.json(
        { error: "seed_x and seed_y are required" },
        { status: 400 }
      );
    }

    // Validate that seed coordinates are numbers
    const seedXNum = Number(seedX);
    const seedYNum = Number(seedY);
    if (!Number.isFinite(seedXNum) || !Number.isFinite(seedYNum)) {
      return NextResponse.json(
        { error: "seed_x and seed_y must be valid numbers" },
        { status: 400 }
      );
    }

    // ── Transcode WebM → MP4 if needed ────────────────────────────────────
    // MediaRecorder (client-side trim) always produces WebM/VP9. Railway's
    // ffmpeg cannot reliably process canvas-captured WebM streams, so we
    // transcode to H.264 MP4 on the server before forwarding.
    let finalVideoFile: File = videoFile;
    const baseType = videoFile.type.split(";")[0].trim();

    // ── Server-side trim (optional) ───────────────────────────────────────
    // Mobile clients send trim_start_sec + trim_end_sec so the server crops
    // the clip before forwarding to Railway.
    //
    // trimVideoStreamCopy now does a frame-accurate re-encode with libx264
    // (ultrafast) so the output always starts on a clean intra-frame and is
    // already H.264 MP4 — no further transcode step needed after trimming.
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
        const ext =
          baseType === "video/webm"
            ? ".webm"
            : baseType === "video/quicktime"
              ? ".mov"
              : ".mp4";
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
        // trimVideoStreamCopy now always outputs H.264 MP4
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
        // Continue with untrimmed video — Railway will handle max_duration_sec
      }
    }

    // ── Transcode WebM → MP4 if needed (only when no trim was done) ───────
    // MediaRecorder (client-side) always produces WebM/VP9. If the clip was
    // already trimmed above it is already H.264 MP4 — skip this block.
    if (!didTrim && baseType === "video/webm") {
      try {
        console.log(
          "[LiftAnalysis] WebM detected — transcoding to H.264 MP4..."
        );
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
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error("[LiftAnalysis] Transcode failed:", errMsg);
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
    }

    // ── Prepare form data for external API ────────────────────────────────
    const externalFormData = new FormData();

    // Add video file — always supply an explicit filename so the multipart
    // Content-Disposition header includes `filename=...`, which FastAPI
    // requires to accept the upload (missing filename → 422).
    const safeFilename = finalVideoFile.name || "video.mp4";
    externalFormData.append("video", finalVideoFile, safeFilename);

    // Add required parameters
    externalFormData.append("seed_x", seedX.toString());
    externalFormData.append("seed_y", seedY.toString());

    // Add optional parameters with defaults
    const seedFrame = formData.get("seed_frame") || "0";
    const showAngles = formData.get("show_angles") || "true";
    const maxDurationSec =
      formData.get("max_duration_sec") || String(MAX_DURATION_LIFT_SEC);
    const autoDetect = formData.get("auto_detect") || "true";

    externalFormData.append("seed_frame", seedFrame.toString());
    externalFormData.append("show_angles", showAngles.toString());
    externalFormData.append("max_duration_sec", maxDurationSec.toString());
    externalFormData.append("auto_detect", autoDetect.toString());

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
            `[LiftAnalysis] AI enabled for user ${session.user.id}`
          );
        } else {
          console.log(
            `[LiftAnalysis] AI rate-limited for user ${session.user.id} — next available at ${rateCheck.nextAvailableAt?.toISOString()}`
          );
        }
      } else {
        console.log("[LiftAnalysis] AI requested but user not authenticated");
      }
    }
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
    const MAX_RETRIES = 2;
    let response: Response | null = null;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      // 4.5 minute timeout (slightly less than maxDuration)
      const timeout = setTimeout(() => controller.abort(), 270_000);

      try {
        console.log(
          `[LiftAnalysis] Attempt ${attempt}/${MAX_RETRIES} → ${BARBELL_API_URL}/analyze/full`
        );
        response = await fetch(`${BARBELL_API_URL}/analyze/full`, {
          method: "POST",
          body: externalFormData,
          signal: controller.signal,
        });
        clearTimeout(timeout);
        break; // success — exit retry loop
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;

        const isConnReset =
          error instanceof Error &&
          ("cause" in error
            ? (error.cause as NodeJS.ErrnoException)?.code === "ECONNRESET"
            : error.message.includes("ECONNRESET"));

        const isAbort = error instanceof Error && error.name === "AbortError";

        if (isAbort) {
          console.error("[LiftAnalysis] Request timed out on attempt", attempt);
          return NextResponse.json(
            { error: "Request timeout. Video processing took too long." },
            { status: 504 }
          );
        }

        console.error(
          `[LiftAnalysis] External API request failed (attempt ${attempt}/${MAX_RETRIES}):`,
          error
        );

        if (!isConnReset || attempt === MAX_RETRIES) {
          break; // non-retryable error or max retries reached
        }

        // Brief back-off before retrying
        await new Promise((resolve) => setTimeout(resolve, 2_000 * attempt));
      }
    }

    if (!response) {
      console.error("[LiftAnalysis] All attempts failed:", lastError);
      return NextResponse.json(
        { error: "Failed to connect to video processing service" },
        { status: 503 }
      );
    }

    // ── Parse response ─────────────────────────────────────────────────────
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[LiftAnalysis] External API error:",
        response.status,
        errorText
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
    console.log("[LiftAnalysis] AI analysis from Railway:", {
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
    console.error("[LiftAnalysis] Unexpected error:", error);
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

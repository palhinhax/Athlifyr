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

// ── Helpers ────────────────────────────────────────────────────────────────

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
];

const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

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
    console.log("[MotionAnalysis] AI requested but user not authenticated");
    return false;
  }

  const rateCheck = await checkAiRateLimit(session.user.id);
  if (!rateCheck.allowed) {
    console.log(
      `[MotionAnalysis] AI rate-limited for user ${session.user.id} — next available at ${rateCheck.nextAvailableAt?.toISOString()}`
    );
    return false;
  }

  externalFormData.append("enable_ai", "true");
  console.log(`[MotionAnalysis] AI enabled for user ${session.user.id}`);
  return true;
}

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
    const videoResult = await trimAndTranscodeVideo(videoFile, formData);
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
    const aiAllowed = await resolveAiPermission(formData, externalFormData);
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

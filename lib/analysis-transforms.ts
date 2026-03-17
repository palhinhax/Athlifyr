import { NextResponse } from "next/server";

// ── External API types (Railway barbell-path-tracker) ─────────────────────

export interface PoseAngles {
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

export interface ExternalLandmark {
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

export interface ExternalBone {
  start_index: number;
  end_index: number;
  start_name: string;
  end_name: string;
}

export interface ExternalSkeletonFrame {
  landmarks: ExternalLandmark[];
  bones: ExternalBone[];
  frame_width: number;
  frame_height: number;
}

export interface ExternalRepAnalysis {
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

export interface ExternalAIAnalysis {
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

// ── Transform functions ───────────────────────────────────────────────────

export function transformSkeletonFrames(frames: ExternalSkeletonFrame[]) {
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

export function transformAiAnalysis(ai: ExternalAIAnalysis | null | undefined) {
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

export function transformAverageAngles(angles: PoseAngles | undefined) {
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

// ── Railway error parsing ─────────────────────────────────────────────────

export function parseRailwayErrorResponse(
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

// ── Railway retry helper ──────────────────────────────────────────────────

function isConnectionResetError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if ("cause" in error) {
    return (error.cause as NodeJS.ErrnoException)?.code === "ECONNRESET";
  }
  return error.message.includes("ECONNRESET");
}

export async function callRailwayWithRetry(
  url: string,
  body: FormData | string,
  maxRetries: number,
  tag: string,
  headers?: Record<string, string>
): Promise<NextResponse | Response> {
  let response: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 270_000);

    try {
      console.log(`[${tag}] Attempt ${attempt}/${maxRetries} → ${url}`);
      response = await fetch(url, {
        method: "POST",
        body,
        signal: controller.signal,
        ...(headers ? { headers } : {}),
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

      const isConnReset = isConnectionResetError(error);

      console.error(
        `[${tag}] External API request failed (attempt ${attempt}/${maxRetries}):`,
        error
      );

      if (!isConnReset || attempt === maxRetries) break;
      await new Promise((resolve) => setTimeout(resolve, 2_000 * attempt));
    }
  }

  if (!response) {
    console.error(`[${tag}] All attempts failed:`, lastError);
    return NextResponse.json(
      { error: "Failed to connect to video processing service" },
      { status: 503 }
    );
  }

  return response;
}

// ── Video validation helpers ──────────────────────────────────────────────

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
];

export const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

export function getVideoExtension(mimeType: string): string {
  if (mimeType === "video/webm") return ".webm";
  if (mimeType === "video/quicktime") return ".mov";
  return ".mp4";
}

export function buildTranscodeErrorResponse(
  err: unknown,
  tag: string
): NextResponse {
  const errMsg = err instanceof Error ? err.message : String(err);
  console.error(`[${tag}] Transcode failed:`, errMsg);
  const isOom =
    errMsg.includes("OOM") || errMsg.includes("-9") || errMsg.includes("137");
  return NextResponse.json(
    {
      error: isOom
        ? "Video resolution is too high to process. Please record in 1080p or lower."
        : "Failed to convert video. Please try uploading an MP4 file.",
    },
    { status: 400 }
  );
}

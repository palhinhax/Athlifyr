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
 *   - max_duration_sec : string (number) — Max video duration (default: 60, max: 120)
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
 *     averageAngles: {
 *       leftKnee?: number,
 *       rightKnee?: number,
 *       leftHip?: number,
 *       rightHip?: number,
 *       leftElbow?: number,
 *       rightElbow?: number,
 *       leftShoulder?: number,
 *       rightShoulder?: number,
 *       leftAnkle?: number,
 *       rightAnkle?: number,
 *       torsoInclination?: number
 *     }
 *   }
 * }
 *
 * Response 400: { error: string }
 * Response 500: { error: string }
 */

import { NextResponse } from "next/server";

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
  error?: string;
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

    // ── Prepare form data for external API ────────────────────────────────
    const externalFormData = new FormData();

    // Add video file
    externalFormData.append("video", videoFile);

    // Add optional parameters with defaults
    const showAngles = formData.get("show_angles") || "true";
    const maxDurationSec = formData.get("max_duration_sec") || "60";

    externalFormData.append("show_angles", showAngles.toString());
    externalFormData.append("max_duration_sec", maxDurationSec.toString());

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
        errorText
      );

      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorJson.detail || errorJson.error || "Processing failed" },
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
                  result.average_angles.torso_inclination ?? null,
              }
            : null,
        },
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

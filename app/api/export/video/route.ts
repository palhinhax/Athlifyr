import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  createJob,
  processExportJob,
  cleanupJobs,
  type MotionOverlayData,
  type LiftOverlayData,
} from "@/lib/video-export";

// Next.js App Router — allow up to 100MB body & 5 min execution
export const maxDuration = 300; // 5 min
export const dynamic = "force-dynamic";

/**
 * POST /api/export/video
 *
 * Accepts multipart/form-data with a video file + overlay metadata.
 * Returns 202 { jobId } immediately and processes in background.
 * No auth required — the video belongs to the user's local device.
 */
export async function POST(request: Request) {
  try {
    // ── Parse form data ──────────────────────────────────────────
    const formData = await request.formData();

    const videoFile = formData.get("video") as File | null;
    const type = formData.get("type") as string | null;

    if (!videoFile) {
      return NextResponse.json(
        { error: "Missing 'video' file" },
        { status: 400 }
      );
    }

    if (!type || (type !== "motion" && type !== "lift")) {
      return NextResponse.json(
        { error: "Missing or invalid 'type' (must be 'motion' or 'lift')" },
        { status: 400 }
      );
    }

    // Validate video size (max 100MB)
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
    if (videoFile.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "Video exceeds 100MB limit" },
        { status: 400 }
      );
    }

    // Validate content type
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { error: `Unsupported video type: ${videoFile.type}` },
        { status: 400 }
      );
    }

    // ── Parse overlay data ───────────────────────────────────────
    let overlay: MotionOverlayData | LiftOverlayData;

    if (type === "motion") {
      const segmentStr = formData.get("segment") as string | null;
      const videoMetaStr = formData.get("videoMeta") as string | null;
      const poseFramesStr = formData.get("poseFrames") as string | null;
      const metricsStr = formData.get("metrics") as string | null;

      if (!segmentStr || !poseFramesStr) {
        return NextResponse.json(
          { error: "Motion export requires 'segment' and 'poseFrames'" },
          { status: 400 }
        );
      }

      try {
        const segment = JSON.parse(segmentStr) as {
          startMs: number;
          endMs: number;
        };
        const videoMeta = videoMetaStr
          ? (JSON.parse(videoMetaStr) as {
              videoWidth: number;
              videoHeight: number;
            })
          : { videoWidth: 0, videoHeight: 0 };
        const poseFrames = JSON.parse(poseFramesStr) as Array<{
          t: number;
          keypoints: Array<{
            name: string;
            x: number;
            y: number;
            score: number;
          }>;
        }>;
        const metrics = metricsStr
          ? (JSON.parse(metricsStr) as Record<string, unknown>)
          : {};

        overlay = {
          type: "motion",
          segment,
          videoMeta,
          poseFrames,
          metrics,
        };
      } catch (parseErr) {
        return NextResponse.json(
          {
            error: "Failed to parse motion overlay JSON fields",
            details:
              parseErr instanceof Error ? parseErr.message : "Invalid JSON",
          },
          { status: 400 }
        );
      }
    } else {
      // lift
      const durationMsStr = formData.get("durationMs") as string | null;
      const barPathStr = formData.get("barPath") as string | null;

      if (!barPathStr) {
        return NextResponse.json(
          { error: "Lift export requires 'barPath'" },
          { status: 400 }
        );
      }

      try {
        const barPath = JSON.parse(barPathStr) as Array<{
          t: number;
          x: number;
          y: number;
        }>;
        const durationMs = durationMsStr ? parseInt(durationMsStr, 10) : 0;

        overlay = {
          type: "lift",
          durationMs,
          barPath,
        };
      } catch (parseErr) {
        return NextResponse.json(
          {
            error: "Failed to parse lift overlay JSON fields",
            details:
              parseErr instanceof Error ? parseErr.message : "Invalid JSON",
          },
          { status: 400 }
        );
      }
    }

    // ── Create job & start processing ────────────────────────────
    const jobId = randomUUID();
    createJob(jobId);

    // Read video into buffer
    const videoBytes = await videoFile.arrayBuffer();
    const videoBuffer = Buffer.from(videoBytes);

    // Start processing in background (fire and forget)
    // The client will poll GET /api/export/video/:jobId for status
    processExportJob(jobId, videoBuffer, overlay).catch((err) => {
      console.error(`[export/video] Background processing failed:`, err);
    });

    // Cleanup old jobs periodically
    cleanupJobs();

    return NextResponse.json({ jobId }, { status: 202 });
  } catch (error) {
    console.error("[export/video] POST error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

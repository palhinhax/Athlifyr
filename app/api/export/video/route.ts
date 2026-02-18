import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  createJob,
  getJob,
  processExportJob,
  type MotionOverlayData,
  type LiftOverlayData,
} from "@/lib/video-export";

// Next.js App Router — allow up to 5 min execution (video rendering is slow)
export const maxDuration = 300;
export const dynamic = "force-dynamic";

/**
 * POST /api/export/video
 *
 * Accepts multipart/form-data with either:
 *   - `video` (File) — uploaded directly from the client device, OR
 *   - `videoUrl` (string) — a URL the server will fetch (avoids browser CORS)
 * Plus overlay metadata fields.
 *
 * Processes synchronously and returns { downloadUrl } when done.
 * (Fire-and-forget + poll was unreliable across serverless instances.)
 */
export async function POST(request: Request) {
  try {
    // ── Parse form data ──────────────────────────────────────────
    const formData = await request.formData();

    const videoFile = formData.get("video") as File | null;
    const videoUrl = formData.get("videoUrl") as string | null;
    const type = formData.get("type") as string | null;

    if (!videoFile && !videoUrl) {
      return NextResponse.json(
        { error: "Missing 'video' file or 'videoUrl'" },
        { status: 400 }
      );
    }

    if (!type || (type !== "motion" && type !== "lift")) {
      return NextResponse.json(
        { error: "Missing or invalid 'type' (must be 'motion' or 'lift')" },
        { status: 400 }
      );
    }

    // ── Resolve video buffer ─────────────────────────────────────
    let videoBuffer: Buffer;

    if (videoFile) {
      const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
      if (videoFile.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { error: "Video exceeds 100MB limit" },
          { status: 400 }
        );
      }
      const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
      if (!validTypes.includes(videoFile.type)) {
        return NextResponse.json(
          { error: `Unsupported video type: ${videoFile.type}` },
          { status: 400 }
        );
      }
      videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    } else {
      // Fetch from URL server-side — no browser CORS restrictions here
      let fetchRes: Response;
      try {
        fetchRes = await fetch(videoUrl!);
      } catch (fetchErr) {
        return NextResponse.json(
          {
            error: "Failed to fetch video from URL",
            details:
              fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
          },
          { status: 400 }
        );
      }
      if (!fetchRes.ok) {
        return NextResponse.json(
          {
            error: `Failed to fetch video from URL: HTTP ${fetchRes.status}`,
          },
          { status: 400 }
        );
      }
      videoBuffer = Buffer.from(await fetchRes.arrayBuffer());
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
        overlay = {
          type: "motion",
          segment: JSON.parse(segmentStr) as { startMs: number; endMs: number },
          videoMeta: videoMetaStr
            ? (JSON.parse(videoMetaStr) as {
                videoWidth: number;
                videoHeight: number;
              })
            : { videoWidth: 0, videoHeight: 0 },
          poseFrames: JSON.parse(poseFramesStr) as Array<{
            t: number;
            keypoints: Array<{
              name: string;
              x: number;
              y: number;
              score: number;
            }>;
          }>,
          metrics: metricsStr
            ? (JSON.parse(metricsStr) as Record<string, unknown>)
            : {},
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
      const durationMsStr = formData.get("durationMs") as string | null;
      const barPathStr = formData.get("barPath") as string | null;

      if (!barPathStr) {
        return NextResponse.json(
          { error: "Lift export requires 'barPath'" },
          { status: 400 }
        );
      }

      try {
        overlay = {
          type: "lift",
          durationMs: durationMsStr ? parseInt(durationMsStr, 10) : 0,
          barPath: JSON.parse(barPathStr) as Array<{
            t: number;
            x: number;
            y: number;
          }>,
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

    // ── Process synchronously and return result ──────────────────
    // We await the full pipeline here — maxDuration = 300s keeps this alive.
    // In-memory jobs across serverless instances are unreliable, so we return
    // the downloadUrl directly instead of using a job-poll pattern.
    const jobId = randomUUID();
    createJob(jobId); // register job in store so updateJob/getJob work
    await processExportJob(jobId, videoBuffer, overlay);

    // processExportJob writes the result into the in-memory job store
    const job = getJob(jobId);

    if (!job || job.status === "error") {
      return NextResponse.json(
        { error: job?.error ?? "Export processing failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ downloadUrl: job.downloadUrl }, { status: 200 });
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

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { getJob, cleanupJobs } from "@/lib/video-export";

export const dynamic = "force-dynamic";

/**
 * GET /api/export/video/:jobId
 *
 * Poll endpoint for video export job status.
 * Returns: { status, progress, downloadUrl?, error? }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // ── Auth ──────────────────────────────────────────────────────
    const user = await getAuthUser(request);
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json(
        { error: "Missing jobId parameter" },
        { status: 400 }
      );
    }

    // ── Look up job ──────────────────────────────────────────────
    // Clean up stale jobs while we're at it
    cleanupJobs();

    const job = getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or expired" },
        { status: 404 }
      );
    }

    // ── Return status ────────────────────────────────────────────
    const response: {
      status: string;
      progress: number;
      downloadUrl?: string;
      error?: string;
    } = {
      status: job.status,
      progress: job.progress,
    };

    if (job.status === "done" && job.downloadUrl) {
      response.downloadUrl = job.downloadUrl;
    }

    if (job.status === "error" && job.error) {
      response.error = job.error;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[export/video/:jobId] GET error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

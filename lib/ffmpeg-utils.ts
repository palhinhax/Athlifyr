/**
 * FFmpeg utilities for server-side video processing.
 *
 * Uses ffmpeg-static (bundled binary) to run video processing operations
 * entirely via temp files, without requiring a system ffmpeg.
 */

import { spawn } from "child_process";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile, readFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";

/**
 * Transcode a video buffer to H.264 + AAC MP4 with moov atom at the start.
 *
 * This fixes two common issues with videos coming from the Railway API:
 *   1. Codec is MPEG-4 Part 2 (`mp4v`) — not supported by browsers (need H.264)
 *   2. moov atom at end of file — prevents browsers from reading duration
 *
 * Uses ffmpeg-static (no system dependency required).
 *
 * @param inputBuffer  Raw video bytes (MP4 from Railway or user upload)
 * @returns            H.264 MP4 bytes ready for upload and browser playback
 */
export async function transcodeToH264(inputBuffer: Buffer): Promise<Buffer> {
  // Dynamic import — keeps ffmpeg-static out of the client bundle
  const ffmpegPath = (await import("ffmpeg-static")).default as string;

  const id = randomUUID();
  const tmpIn = join(tmpdir(), `athlifyr_in_${id}.mp4`);
  const tmpOut = join(tmpdir(), `athlifyr_out_${id}.mp4`);

  try {
    await writeFile(tmpIn, inputBuffer);

    // Transcode to H.264 baseline, move moov to start for instant browser playback.
    // Downscale to max 1080p to avoid OOM on 4K videos in serverless/container
    // environments.  The scale filter keeps the original aspect ratio and
    // ensures both dimensions are divisible by 2 (required by libx264).
    await runFfmpeg(ffmpegPath, [
      "-y",
      "-i",
      tmpIn,
      "-vf",
      "scale='min(1080,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:v",
      "libx264", // H.264 — universally supported by browsers
      "-profile:v",
      "baseline", // max compatibility (iOS, Android, older browsers)
      "-level",
      "3.1",
      "-pix_fmt",
      "yuv420p", // required for broad playback compatibility
      "-preset",
      "ultrafast", // minimise memory & CPU (speed > compression)
      "-crf",
      "28", // slightly lower quality is fine for analysis
      "-threads",
      "2", // limit threads to reduce peak memory
      "-an", // no audio track (analysis videos have none)
      "-movflags",
      "+faststart", // moov atom at start
      tmpOut,
    ]);

    const outputBuffer = await readFile(tmpOut);
    console.log(
      `[ffmpeg] Transcoded ${inputBuffer.length} → ${outputBuffer.length} bytes (H.264)`
    );
    return outputBuffer;
  } finally {
    await unlink(tmpIn).catch(() => undefined);
    await unlink(tmpOut).catch(() => undefined);
  }
}

/**
 * Trim a video to [startSec, endSec] with frame-accurate re-encode.
 *
 * Stream-copy (`-c copy`) cuts at the nearest keyframe, which causes black
 * frames at the start of the clip whenever the cut point falls between
 * keyframes (very common on mobile-recorded videos with GOP sizes of 1–3s).
 *
 * This function re-encodes the trimmed segment with libx264 (ultrafast) so the
 * output always starts on a clean intra-frame. The re-encode is fast because
 * only the short sub-clip is processed, and the ultrafast preset keeps CPU/RAM
 * usage low enough for a serverless environment.
 *
 * @param inputBuffer  Raw video bytes
 * @param startSec     Trim start in seconds (0-based)
 * @param endSec       Trim end in seconds
 * @param ext          File extension including dot, e.g. ".mp4" or ".mov"
 *                     (only used to choose the input demuxer — output is always MP4)
 * @returns            Trimmed MP4 bytes starting on a clean keyframe
 */
export async function trimVideoStreamCopy(
  inputBuffer: Buffer,
  startSec: number,
  endSec: number,
  ext: string = ".mp4"
): Promise<Buffer> {
  const ffmpegPath = (await import("ffmpeg-static")).default as string;

  const id = randomUUID();
  const tmpIn = join(tmpdir(), `athlifyr_trim_in_${id}${ext}`);
  // Output is always MP4 regardless of input container
  const tmpOut = join(tmpdir(), `athlifyr_trim_out_${id}.mp4`);

  try {
    await writeFile(tmpIn, inputBuffer);

    // -ss BEFORE -i:  fast keyframe seek to the nearest keyframe before startSec
    // -to after -i:   duration measured from the decoded position (frame-accurate)
    // Re-encode with libx264 ultrafast so the output starts on a real intra-frame
    // and has no dependency on frames from before the cut point.
    // Without re-encode, delta frames at the start of the clip render as black.
    await runFfmpeg(ffmpegPath, [
      "-y",
      "-ss",
      String(startSec), // fast input seek (keyframe-aligned)
      "-i",
      tmpIn,
      "-t",
      String(endSec - startSec), // duration of the output clip
      "-vf",
      // Downscale to max 1080p, keep aspect ratio, ensure even dimensions
      "scale='min(1080,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:v",
      "libx264",
      "-profile:v",
      "baseline",
      "-level",
      "3.1",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "ultrafast",
      "-crf",
      "28",
      "-threads",
      "2",
      "-an", // no audio (analysis only)
      "-movflags",
      "+faststart",
      tmpOut,
    ]);

    const outputBuffer = await readFile(tmpOut);
    console.log(
      `[ffmpeg] Trimmed+re-encoded ${inputBuffer.length} → ${outputBuffer.length} bytes ` +
        `(${startSec.toFixed(2)}s–${endSec.toFixed(2)}s, libx264 ultrafast)`
    );
    return outputBuffer;
  } finally {
    await unlink(tmpIn).catch(() => undefined);
    await unlink(tmpOut).catch(() => undefined);
  }
}

/**
 * Remux-only (no re-encode): just moves the moov atom to the start.
 * Use this when the input is already H.264 but needs faststart.
 *
 * @param inputBuffer  Raw MP4 bytes already in H.264
 * @returns            Remuxed MP4 bytes with moov at start
 */
export async function remuxMp4Faststart(inputBuffer: Buffer): Promise<Buffer> {
  const ffmpegPath = (await import("ffmpeg-static")).default as string;

  const id = randomUUID();
  const tmpIn = join(tmpdir(), `athlifyr_in_${id}.mp4`);
  const tmpOut = join(tmpdir(), `athlifyr_out_${id}.mp4`);

  try {
    await writeFile(tmpIn, inputBuffer);

    await runFfmpeg(ffmpegPath, [
      "-y",
      "-i",
      tmpIn,
      "-c",
      "copy",
      "-movflags",
      "+faststart",
      tmpOut,
    ]);

    return await readFile(tmpOut);
  } finally {
    await unlink(tmpIn).catch(() => undefined);
    await unlink(tmpOut).catch(() => undefined);
  }
}

/**
 * Spawn ffmpeg and wait for it to finish.
 * Rejects if the process exits with a non-zero code.
 */
function runFfmpeg(ffmpegBin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegBin, args, { stdio: ["ignore", "pipe", "pipe"] });

    const stderrChunks: Buffer[] = [];
    proc.stderr?.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

    proc.on("close", (code) => {
      const stderr = Buffer.concat(stderrChunks).toString("utf8");
      if (code === 0) {
        // Log last 500 chars on success for observability
        console.log("[ffmpeg] finished OK. Tail:", stderr.slice(-500));
        resolve();
      } else {
        const exitReason =
          code === null
            ? "killed by signal"
            : code === -9 || code === 137
              ? `OOM killed (exit ${code}) — video may be too large to re-encode`
              : `exit ${code}`;
        reject(
          new Error(
            `ffmpeg re-encode failed (${exitReason}):\n${stderr.slice(-1500)}`
          )
        );
      }
    });

    proc.on("error", reject);
  });
}

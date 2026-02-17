/**
 * FrameExtractor – Extracts video frames as images at regular intervals.
 *
 * Uses expo-video-thumbnails to generate JPEG thumbnails from the video
 * at specified timestamps, then converts them to base64 for processing
 * by the pose estimation WebView.
 */

import * as VideoThumbnails from "expo-video-thumbnails";
import { File } from "expo-file-system";

/** A single extracted frame with its image data. */
export interface ExtractedFrame {
  /** Sequential frame index. */
  index: number;
  /** Timestamp in milliseconds relative to video start. */
  tMs: number;
  /** Local file URI of the extracted thumbnail. */
  uri: string;
  /** Base64-encoded JPEG image data. */
  base64: string;
}

/** Convert an ArrayBuffer to a base64 string. */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Extract frames from a video at a given FPS rate.
 *
 * @param videoUri  URI of the source video file.
 * @param durationMs  Total video duration in milliseconds.
 * @param fps  Frames per second to extract (default: 5).
 * @param onProgress  Optional callback with progress percentage (0–100).
 * @returns Array of extracted frames with base64 image data.
 */
export async function extractFrames(
  videoUri: string,
  durationMs: number,
  fps: number = 5,
  onProgress?: (progress: number) => void
): Promise<ExtractedFrame[]> {
  if (durationMs <= 0) {
    throw new Error("Video duration must be positive");
  }

  const intervalMs = 1000 / fps;
  const totalFrames = Math.max(1, Math.ceil(durationMs / intervalMs));
  const frames: ExtractedFrame[] = [];

  for (let i = 0; i < totalFrames; i++) {
    const tMs = Math.min(Math.round(i * intervalMs), durationMs - 1);

    try {
      const thumbnail = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: tMs,
        quality: 0.7,
      });

      const file = new File(thumbnail.uri);
      const buffer = await file.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);

      frames.push({ index: i, tMs, uri: thumbnail.uri, base64 });
    } catch (error) {
      // Skip frames that fail to extract (e.g., before first keyframe)
      console.warn(`Frame extraction failed at ${tMs}ms:`, error);
    }

    onProgress?.(((i + 1) / totalFrames) * 100);
  }

  return frames;
}

/**
 * Clean up temporary thumbnail files after processing.
 */
export async function cleanupFrames(frames: ExtractedFrame[]): Promise<void> {
  for (const frame of frames) {
    try {
      const file = new File(frame.uri);
      if (file.exists) {
        file.delete();
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

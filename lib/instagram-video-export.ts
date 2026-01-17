import { type InstagramFormat } from "@/types/instagram";
import { toPng } from "html-to-image";

// Video export constants - Optimized for smaller file sizes and better performance
const VIDEO_BITRATE_BASE = 2_000_000; // 2 Mbps base bitrate - much lower for smaller files
const TIMESLICE_INTERVAL = 100; // ms - collect chunks every 100ms
const URL_CLEANUP_DELAY = 1000; // ms - delay before revoking blob URL
const MAX_DURATION = 15; // Maximum allowed duration in seconds
const MIN_DURATION = 1; // Minimum allowed duration in seconds
const DEFAULT_FPS = 24; // 24 FPS default - lower than 30 for smaller files
const MAX_FILE_SIZE_MB = 50; // Estimated max file size in MB

interface ExportVideoOptions {
  element: HTMLElement;
  filename: string;
  format: InstagramFormat;
  duration?: number; // duration in seconds
  fps?: number; // frames per second
  onProgress?: (progress: number) => void; // Progress callback (0-100)
}

/**
 * Calculate adaptive bitrate based on duration
 * Longer videos get lower bitrate to keep file size manageable
 */
function getAdaptiveBitrate(duration: number): number {
  if (duration <= 5) {
    return VIDEO_BITRATE_BASE; // 2 Mbps for short videos
  } else if (duration <= 10) {
    return Math.floor(VIDEO_BITRATE_BASE * 0.75); // 1.5 Mbps for medium videos
  } else {
    return Math.floor(VIDEO_BITRATE_BASE * 0.5); // 1 Mbps for long videos
  }
}

/**
 * Calculate adaptive FPS based on duration
 * Longer videos get lower FPS to reduce processing and file size
 */
function getAdaptiveFPS(duration: number, requestedFps?: number): number {
  // If user specified FPS, respect it but cap at 30
  if (requestedFps) {
    return Math.min(requestedFps, 30);
  }

  // Auto-adjust FPS based on duration
  if (duration <= 5) {
    return 30; // Smooth for short videos
  } else if (duration <= 10) {
    return DEFAULT_FPS; // 24 FPS for medium videos
  } else {
    return 20; // Lower FPS for long videos
  }
}

/**
 * Validates video duration parameters
 */
function validateDuration(duration: number): void {
  if (duration < MIN_DURATION) {
    throw new Error(
      `Duration must be at least ${MIN_DURATION} second${MIN_DURATION > 1 ? "s" : ""}`
    );
  }
  if (duration > MAX_DURATION) {
    throw new Error(
      `Duration cannot exceed ${MAX_DURATION} seconds to ensure optimal performance`
    );
  }
}

/**
 * Export an HTML element as a video file (WebM)
 * This captures the ENTIRE element (video + text + logo) at specified FPS and duration
 *
 * Optimized strategy:
 * 1. Adaptive bitrate and FPS based on duration for smaller file sizes
 * 2. Stream directly to MediaRecorder for better memory management
 * 3. Lower quality settings to reduce file size
 * 4. Progress feedback to the user
 */
export async function exportToVideo({
  element,
  filename,
  format,
  duration = 5, // default 5 seconds
  fps, // optional - will be auto-calculated if not provided
  onProgress,
}: ExportVideoOptions): Promise<void> {
  try {
    // Validate duration
    validateDuration(duration);

    // Check if MediaRecorder is supported
    if (!window.MediaRecorder) {
      throw new Error("MediaRecorder API is not supported in this browser");
    }

    // Calculate adaptive settings
    const adaptiveFps = getAdaptiveFPS(duration, fps);
    const adaptiveBitrate = getAdaptiveBitrate(duration);

    console.log(
      `Video settings: ${duration}s @ ${adaptiveFps} FPS, ${Math.round(adaptiveBitrate / 1_000_000)}Mbps`
    );

    // Set canvas dimensions based on format
    const formatSizes = {
      SQUARE: { width: 1080, height: 1080 },
      PORTRAIT: { width: 1080, height: 1350 },
      STORY: { width: 1080, height: 1920 },
    };
    const { width, height } = formatSizes[format];

    // Calculate total frames needed
    const totalFrames = duration * adaptiveFps;
    console.log(`Starting video export: ${totalFrames} frames`);

    // Report initial progress
    onProgress?.(0);

    // Create canvas and context early
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Try to get context with optimizations, fall back to basic context if unsupported
    let ctx: CanvasRenderingContext2D | null;
    try {
      ctx = canvas.getContext("2d", {
        alpha: false, // Optimize for opaque content
        desynchronized: true, // Better performance for animations (may not be supported in all browsers)
      });
    } catch {
      // Fallback for browsers that don't support desynchronized option
      ctx = canvas.getContext("2d", { alpha: false });
    }

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Setup MediaRecorder with fallback mimeType
    const stream = canvas.captureStream(adaptiveFps);

    // Try to find a supported mimeType with best quality/performance balance
    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      console.warn("VP9 codec not supported, trying VP8");
      mimeType = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn("VP8 codec not supported, using default webm");
        mimeType = "video/webm";
      }
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: adaptiveBitrate,
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event);
      throw new Error("Video encoding failed. Please try a shorter duration.");
    };

    // Get video element if present
    const videoElement = element.querySelector("video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = 0;
      videoElement.pause(); // Pause during frame capture
    }

    // STEP 1: Stream frames directly to MediaRecorder
    let currentFrame = 0;
    const frameInterval = 1000 / adaptiveFps;

    await new Promise<void>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        console.log("Recording stopped. Total chunks:", chunks.length);

        if (chunks.length === 0) {
          reject(new Error("Video recording failed - no data captured"));
          return;
        }

        const blob = new Blob(chunks, { type: mimeType });
        const fileSizeMB = blob.size / (1024 * 1024);
        console.log(`Final video size: ${fileSizeMB.toFixed(2)} MB`);

        if (blob.size === 0) {
          reject(new Error("Video recording failed - empty file"));
          return;
        }

        // Warn if file is large
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          console.warn(`Large file size: ${fileSizeMB.toFixed(2)} MB`);
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.webm`;
        document.body.appendChild(link);
        console.log("Triggering download:", link.download);
        link.click();

        // Keep the link in the DOM longer and delay URL revocation
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log("Download link cleaned up");
        }, URL_CLEANUP_DELAY);

        onProgress?.(100);
        resolve();
      };

      console.log("Starting MediaRecorder with mimeType:", mimeType);
      mediaRecorder.start(TIMESLICE_INTERVAL);

      // Capture and draw frames on-the-fly
      const captureAndDrawFrame = async () => {
        if (currentFrame >= totalFrames) {
          console.log("All frames captured. Stopping recorder...");
          mediaRecorder.stop();
          return;
        }

        try {
          // Update video element time for video backgrounds
          if (videoElement) {
            const videoTime = Math.min(
              currentFrame / adaptiveFps,
              videoElement.duration
            );
            videoElement.currentTime = videoTime;

            // Optimized seek with shorter timeout
            await new Promise<void>((resolve) => {
              if (Math.abs(videoElement.currentTime - videoTime) < 0.1) {
                resolve();
              } else {
                const onSeeked = () => {
                  videoElement.removeEventListener("seeked", onSeeked);
                  resolve();
                };
                videoElement.addEventListener("seeked", onSeeked);
                setTimeout(() => {
                  videoElement.removeEventListener("seeked", onSeeked);
                  resolve();
                }, 100);
              }
            });
          }

          // Capture frame directly to canvas
          // Note: cacheBust is disabled for better performance
          // This is acceptable since we control the timing and the element content
          const dataUrl = await toPng(element, {
            width,
            height,
            pixelRatio: 1,
            cacheBust: false, // Intentionally disabled for performance
          });

          // Load and draw to canvas
          const img = new Image();
          await new Promise<void>((resolve) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, width, height);
              resolve();
            };
            img.onerror = () => {
              console.warn(
                `Failed to load frame ${currentFrame}, using previous frame`
              );
              resolve(); // Continue with previous frame data
            };
            img.src = dataUrl;
          });

          // Update progress
          const progress = Math.round(((currentFrame + 1) / totalFrames) * 100);
          if (currentFrame % 10 === 0 || currentFrame === totalFrames - 1) {
            console.log(
              `Processing: ${currentFrame + 1}/${totalFrames} (${progress}%)`
            );
            onProgress?.(progress);
          }

          currentFrame++;
          setTimeout(captureAndDrawFrame, frameInterval);
        } catch (error) {
          console.error(`Error processing frame ${currentFrame}:`, error);
          // Try to continue with next frame
          currentFrame++;
          setTimeout(captureAndDrawFrame, frameInterval);
        }
      };

      // Start frame capture
      captureAndDrawFrame().catch(reject);
    });

    console.log("Video export complete!");
  } catch (error) {
    console.error("Error exporting video:", error);
    throw error;
  }
}

/**
 * Simpler approach: Just download the video file that's being used as background
 * This is more reliable than trying to capture and re-encode
 */
export async function downloadBackgroundVideo(
  videoUrl: string,
  filename: string
): Promise<void> {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading video:", error);
    throw error;
  }
}

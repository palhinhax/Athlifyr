import { type InstagramFormat } from "@/types/instagram";
import { toPng } from "html-to-image";

// Video export constants
const VIDEO_BITRATE = 8_000_000; // 8 Mbps
const TIMESLICE_INTERVAL = 100; // ms - collect chunks every 100ms
const URL_CLEANUP_DELAY = 1000; // ms - delay before revoking blob URL

interface ExportVideoOptions {
  element: HTMLElement;
  filename: string;
  format: InstagramFormat;
  duration?: number; // duration in seconds
  fps?: number; // frames per second
}

/**
 * Export an HTML element as a video file (WebM)
 * This captures the ENTIRE element (video + text + logo) at specified FPS and duration
 *
 * Strategy: Pre-render all frames first, then play them back at correct FPS to MediaRecorder
 */
export async function exportToVideo({
  element,
  filename,
  format,
  duration = 5, // default 5 seconds
  fps = 30, // default 30 fps
}: ExportVideoOptions): Promise<void> {
  try {
    // Check if MediaRecorder is supported
    if (!window.MediaRecorder) {
      throw new Error("MediaRecorder API is not supported in this browser");
    }

    // Set canvas dimensions based on format
    const formatSizes = {
      SQUARE: { width: 1080, height: 1080 },
      PORTRAIT: { width: 1080, height: 1350 },
      STORY: { width: 1080, height: 1920 },
    };
    const { width, height } = formatSizes[format];

    // Get video element
    const videoElement = element.querySelector("video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = 0;
      videoElement.pause(); // Pause during frame capture
    }

    // Calculate total frames needed
    const totalFrames = duration * fps;
    console.log(`Pre-rendering ${totalFrames} frames at ${fps} FPS...`);
    console.log("This may take a while, please wait...");

    // STEP 1: Pre-render all frames (this is the slow part)
    const frames: ImageBitmap[] = [];
    for (let i = 0; i < totalFrames; i++) {
      try {
        // Update video element time for video backgrounds
        if (videoElement) {
          // Clamp video time to duration to avoid unexpected looping
          const videoTime = Math.min(i / fps, duration);
          videoElement.currentTime = videoTime;

          // Wait for video to seek to the correct time
          await new Promise<void>((resolve) => {
            if (Math.abs(videoElement.currentTime - videoTime) < 0.1) {
              resolve();
            } else {
              const onSeeked = () => {
                videoElement.removeEventListener("seeked", onSeeked);
                resolve();
              };
              videoElement.addEventListener("seeked", onSeeked);
              // Timeout to prevent hanging and clean up event listener
              setTimeout(() => {
                videoElement.removeEventListener("seeked", onSeeked);
                resolve();
              }, 200);
            }
          });
        }

        // Capture frame as PNG
        const dataUrl = await toPng(element, {
          width,
          height,
          pixelRatio: 1,
          cacheBust: true,
        });

        // Convert to ImageBitmap for faster drawing later
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        frames.push(bitmap);

        // Progress logging
        if ((i + 1) % 30 === 0 || i === 0 || i === totalFrames - 1) {
          console.log(
            `Pre-rendered ${i + 1}/${totalFrames} frames (${Math.round(((i + 1) / totalFrames) * 100)}%)`
          );
        }
      } catch (error) {
        console.error(`Error capturing frame ${i}:`, error);
        // Duplicate previous frame to maintain smooth playback rather than showing black
        // This is preferred for video exports where continuity is important
        if (frames.length > 0) {
          frames.push(frames[frames.length - 1]);
        }
      }
    }

    console.log(
      `All ${frames.length} frames pre-rendered! Now encoding video...`
    );

    // STEP 2: Create canvas and MediaRecorder
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Setup MediaRecorder with fallback mimeType
    const stream = canvas.captureStream(fps);

    // Try to find a supported mimeType
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
      videoBitsPerSecond: VIDEO_BITRATE,
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event);
      throw new Error("MediaRecorder encountered an error during recording");
    };

    // STEP 3: Play back frames at correct FPS
    const frameInterval = 1000 / fps;
    let currentFrame = 0;

    try {
      await new Promise<void>((resolve, reject) => {
        mediaRecorder.onstop = () => {
          console.log("Recording stopped. Total chunks:", chunks.length);

          if (chunks.length === 0) {
            reject(new Error("Video recording failed - no data captured"));
            return;
          }

          const blob = new Blob(chunks, { type: mimeType });
          console.log("Final video blob size:", blob.size, "bytes");

          if (blob.size === 0) {
            reject(new Error("Video recording failed - empty file"));
            return;
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

          resolve();
        };

        console.log("Starting MediaRecorder with mimeType:", mimeType);
        mediaRecorder.start(TIMESLICE_INTERVAL);

        // Draw frames at correct intervals
        const drawFrame = () => {
          if (currentFrame >= frames.length) {
            console.log("All frames played. Stopping recorder...");
            mediaRecorder.stop();
            return;
          }

          // Draw current frame to canvas
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(frames[currentFrame], 0, 0, width, height);

          if (currentFrame % 30 === 0) {
            console.log(
              `Encoding: ${currentFrame}/${frames.length} frames (${Math.round((currentFrame / frames.length) * 100)}%)`
            );
          }

          currentFrame++;
          setTimeout(drawFrame, frameInterval);
        };

        // Start playback
        console.log("Starting frame playback...");
        drawFrame();
      });

      console.log("Video export complete!");
    } finally {
      // Always clean up ImageBitmap resources to prevent memory leaks
      frames.forEach((frame) => frame.close());
      console.log("Cleaned up frame resources");
    }
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

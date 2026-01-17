import { type InstagramFormat } from "@/types/instagram";
import { toPng } from "html-to-image";

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

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Get video element to ensure it's playing
    const videoElement = element.querySelector("video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = 0;
      await videoElement.play();
    }

    // Setup MediaRecorder
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 8000000, // 8 Mbps
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log("Video chunk received:", event.data.size, "bytes");
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      console.log("Recording stopped. Total chunks:", chunks.length);
      const blob = new Blob(chunks, { type: "video/webm" });
      console.log("Final video blob size:", blob.size, "bytes");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.webm`;
      document.body.appendChild(link);
      console.log("Triggering download:", link.download);
      link.click();
      document.body.removeChild(link);

      // Wait a bit before revoking URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      // Stop video
      if (videoElement) {
        videoElement.pause();
      }
    };

    console.log("Starting MediaRecorder...");
    mediaRecorder.start();

    const totalFrames = duration * fps;
    let currentFrame = 0;
    const frameInterval = 1000 / fps;

    console.log(`Capturing ${totalFrames} frames at ${fps} FPS...`);

    // Capture frames using html-to-image
    const captureFrame = async () => {
      if (currentFrame >= totalFrames) {
        console.log("All frames captured. Stopping recorder...");
        mediaRecorder.stop();
        return;
      }

      try {
        // Capture the ENTIRE element as PNG (includes video + text + logo)
        const dataUrl = await toPng(element, {
          width,
          height,
          pixelRatio: 1,
          cacheBust: true,
        });

        // Draw captured image to canvas
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          currentFrame++;
          if (currentFrame % 30 === 0) {
            console.log(`Progress: ${currentFrame}/${totalFrames} frames`);
          }

          // Schedule next frame
          setTimeout(captureFrame, frameInterval);
        };
        img.onerror = (error) => {
          console.error("Error loading frame image:", error);
          currentFrame++;
          setTimeout(captureFrame, frameInterval);
        };
        img.src = dataUrl;
      } catch (error) {
        console.error("Error capturing frame:", error);
        // Continue anyway
        currentFrame++;
        setTimeout(captureFrame, frameInterval);
      }
    };

    // Start capturing
    console.log("Starting frame capture...");
    captureFrame();
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

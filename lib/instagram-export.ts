import { toPng, toJpeg } from "html-to-image";

export type ExportFormat = "png" | "jpeg";

interface ExportOptions {
  element: HTMLElement;
  filename: string;
  format?: ExportFormat;
  quality?: number; // 0-1 for JPEG
}

/**
 * Export an HTML element to an image file
 * Ensures high quality by using proper pixel ratio
 */
export async function exportToImage({
  element,
  filename,
  format = "png",
  quality = 0.95,
}: ExportOptions): Promise<void> {
  // Ensure fonts are loaded before export
  await document.fonts.ready;

  // Wait a bit for images to fully render
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    let dataUrl: string;

    const options = {
      quality,
      pixelRatio: 2, // High quality export
      cacheBust: true,
      style: {
        // Ensure element is properly sized
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    };

    if (format === "jpeg") {
      dataUrl = await toJpeg(element, options);
    } else {
      dataUrl = await toPng(element, options);
    }

    // Trigger download
    const link = document.createElement("a");
    link.download = `${filename}.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error exporting image:", error);
    throw new Error("Failed to export image. Please try again.");
  }
}

/**
 * Validate character limits for template fields
 */
export function validateFieldLength(
  value: string,
  maxLength: number,
  fieldName: string
): { valid: boolean; error?: string } {
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be ${maxLength} characters or less (current: ${value.length})`,
    };
  }
  return { valid: true };
}

/**
 * Auto-scale font size based on text length
 * Returns a scale factor (0.6 - 1.0)
 */
export function getAutoFontScale(
  textLength: number,
  maxLength: number
): number {
  if (textLength <= maxLength * 0.7) return 1.0;
  if (textLength <= maxLength * 0.85) return 0.9;
  if (textLength <= maxLength) return 0.8;
  return 0.7; // Minimum scale
}

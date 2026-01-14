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

// Font scaling thresholds and scale factors
const FONT_SCALE_THRESHOLDS = {
  SHORT: 0.7, // 0-70% of max length
  MEDIUM: 0.85, // 70-85% of max length
  LONG: 1.0, // 85-100% of max length
} as const;

const FONT_SCALE_FACTORS = {
  SHORT: 1.0,
  MEDIUM: 0.9,
  LONG: 0.8,
  VERY_LONG: 0.7, // >100% of max length (minimum)
} as const;

/**
 * Auto-scale font size based on text length
 * Returns a scale factor (0.7 - 1.0)
 */
export function getAutoFontScale(
  textLength: number,
  maxLength: number
): number {
  const ratio = textLength / maxLength;

  if (ratio <= FONT_SCALE_THRESHOLDS.SHORT) return FONT_SCALE_FACTORS.SHORT;
  if (ratio <= FONT_SCALE_THRESHOLDS.MEDIUM) return FONT_SCALE_FACTORS.MEDIUM;
  if (ratio <= FONT_SCALE_THRESHOLDS.LONG) return FONT_SCALE_FACTORS.LONG;
  return FONT_SCALE_FACTORS.VERY_LONG; // Minimum scale
}

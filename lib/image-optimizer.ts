import sharp from "sharp";

interface OptimizeImageOptions {
  buffer: Buffer;
  contentType: string;
  /** Max width in pixels. Default: 1920 */
  maxWidth?: number;
  /** Max height in pixels. Default: 1920 */
  maxHeight?: number;
  /** Quality 1-100. Default: 80 */
  quality?: number;
}

export interface OptimizeImageResult {
  buffer: Buffer;
  contentType: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savedPercent: number;
}

/**
 * Optimize an image using sharp:
 * - Resize if larger than max dimensions (preserving aspect ratio)
 * - Convert to WebP for best compression (except GIFs which stay as-is)
 * - Strip EXIF metadata to reduce size
 * - Apply quality compression
 */
export async function optimizeImage({
  buffer,
  contentType,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 80,
}: OptimizeImageOptions): Promise<OptimizeImageResult> {
  const originalSize = buffer.length;

  // Skip optimization for GIFs (animated) and very small files (< 10KB)
  if (contentType === "image/gif" || originalSize < 10 * 1024) {
    return {
      buffer,
      contentType,
      originalSize,
      optimizedSize: originalSize,
      savedBytes: 0,
      savedPercent: 0,
    };
  }

  let pipeline = sharp(buffer);

  // Get image metadata to check dimensions
  const metadata = await pipeline.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  // Auto-rotate based on EXIF after getting metadata
  pipeline = pipeline.rotate();

  // Only resize if image exceeds max dimensions
  if (width > maxWidth || height > maxHeight) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Convert to WebP for best size/quality ratio
  pipeline = pipeline.webp({ quality, effort: 4 });

  const optimizedBuffer = await pipeline.toBuffer();

  // Only use optimized version if it's actually smaller
  if (optimizedBuffer.length >= originalSize) {
    return {
      buffer,
      contentType,
      originalSize,
      optimizedSize: originalSize,
      savedBytes: 0,
      savedPercent: 0,
    };
  }

  const savedBytes = originalSize - optimizedBuffer.length;
  const savedPercent = Math.round((savedBytes / originalSize) * 100);

  return {
    buffer: optimizedBuffer,
    contentType: "image/webp",
    originalSize,
    optimizedSize: optimizedBuffer.length,
    savedBytes,
    savedPercent,
  };
}

/**
 * Generate a thumbnail version of an image
 * Used for list views, cards, avatars where full-size is wasteful
 */
export async function generateThumbnail(
  buffer: Buffer,
  contentType: string,
  size: number = 400
): Promise<OptimizeImageResult> {
  // Skip for GIFs
  if (contentType === "image/gif") {
    return {
      buffer,
      contentType,
      originalSize: buffer.length,
      optimizedSize: buffer.length,
      savedBytes: 0,
      savedPercent: 0,
    };
  }

  const originalSize = buffer.length;

  const optimizedBuffer = await sharp(buffer)
    .rotate()
    .resize(size, size, {
      fit: "cover",
      position: "centre",
    })
    .webp({ quality: 75, effort: 4 })
    .toBuffer();

  const savedBytes = originalSize - optimizedBuffer.length;
  const savedPercent = Math.round((savedBytes / originalSize) * 100);

  return {
    buffer: optimizedBuffer,
    contentType: "image/webp",
    originalSize,
    optimizedSize: optimizedBuffer.length,
    savedBytes,
    savedPercent,
  };
}

/** Profile-specific optimization: smaller max size, square-friendly */
export function optimizeProfileImage(buffer: Buffer, contentType: string) {
  return optimizeImage({
    buffer,
    contentType,
    maxWidth: 800,
    maxHeight: 800,
    quality: 80,
  });
}

/** Event image optimization: wider for banner/cards */
export function optimizeEventImage(buffer: Buffer, contentType: string) {
  return optimizeImage({
    buffer,
    contentType,
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 82,
  });
}

/** Post image optimization */
export function optimizePostImage(buffer: Buffer, contentType: string) {
  return optimizeImage({
    buffer,
    contentType,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
  });
}

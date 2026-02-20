/**
 * POST /api/lift-analysis/debug-detect
 *
 * Proxy endpoint for the barbell-path-tracker debug/detect API.
 * Receives a video frame image + seed coordinates and returns
 * detection information about the disc/plate at that position.
 *
 * Body: multipart/form-data
 *   - image   : file (jpg, jpeg, png, bmp, webp) ≤ 20 MB
 *   - seed_x  : string (number) — X coordinate in % (0–100)
 *   - seed_y  : string (number) — Y coordinate in % (0–100)
 *
 * Response 200: DebugDetectResponse
 * Response 400: { error: string }
 * Response 500: { error: string }
 */

import { NextResponse } from "next/server";
import type { DebugDetectResponse } from "@/types/lift-analysis";

export const dynamic = "force-dynamic";

const BARBELL_API_URL =
  "https://barbell-path-tracker-production.up.railway.app";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");
    const seedX = formData.get("seed_x");
    const seedY = formData.get("seed_y");

    console.log("[DebugDetect] Received request:", {
      hasImage: !!image,
      imageType: image instanceof Blob ? "Blob" : typeof image,
      imageSize:
        image instanceof Blob ? `${(image.size / 1024).toFixed(1)} KB` : "N/A",
      imageName: image instanceof File ? image.name : "N/A",
      imageContentType: image instanceof Blob ? image.type : "N/A",
      seedX,
      seedY,
      seedXType: typeof seedX,
      seedYType: typeof seedY,
    });

    if (!image || !(image instanceof Blob)) {
      console.error("[DebugDetect] No image or not a Blob");
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    if (!seedX || !seedY) {
      console.error("[DebugDetect] Missing seed_x or seed_y");
      return NextResponse.json(
        { error: "seed_x and seed_y are required" },
        { status: 400 }
      );
    }

    // Build the form data for the external API.
    // FastAPI expects `image` as an UploadFile (with filename), and
    // `seed_x` / `seed_y` as form fields parseable as float.
    const externalFormData = new FormData();

    // Ensure the image has a proper filename and content type
    const imageFile = new File(
      [image],
      image instanceof File ? image.name : "frame.jpg",
      { type: image.type || "image/jpeg" }
    );
    externalFormData.append("image", imageFile);
    externalFormData.append("seed_x", String(parseFloat(seedX.toString())));
    externalFormData.append("seed_y", String(parseFloat(seedY.toString())));

    const externalUrl = `${BARBELL_API_URL}/debug/detect`;
    console.log("[DebugDetect] Forwarding to:", externalUrl, {
      imageFileName: imageFile.name,
      imageFileType: imageFile.type,
      imageFileSize: `${(imageFile.size / 1024).toFixed(1)} KB`,
      seed_x: String(parseFloat(seedX.toString())),
      seed_y: String(parseFloat(seedY.toString())),
    });

    const response = await fetch(externalUrl, {
      method: "POST",
      body: externalFormData,
    });

    const responseText = await response.text();

    console.log("[DebugDetect] External API response:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      bodyLength: responseText.length,
      bodyPreview: responseText.substring(0, 500),
    });

    if (!response.ok) {
      console.error(
        `[DebugDetect] External API error: ${response.status}`,
        responseText
      );
      return NextResponse.json(
        {
          error: `Detection API error: ${response.status}`,
          detail: responseText,
        },
        { status: response.status }
      );
    }

    const result: DebugDetectResponse = JSON.parse(responseText);
    console.log("[DebugDetect] Success:", {
      detected: result.detected,
      circle: result.circle
        ? {
            center: `(${result.circle.center_x}, ${result.circle.center_y})`,
            radius: result.circle.radius,
            confidence: result.circle.confidence,
          }
        : null,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[DebugDetect] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

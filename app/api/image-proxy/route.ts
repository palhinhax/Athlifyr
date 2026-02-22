import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy to bypass CORS restrictions when rendering
 * external images (e.g. Backblaze B2) on canvas for export.
 *
 * GET /api/image-proxy?url=https://f003.backblazeb2.com/file/...
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  // Only allow proxying from our B2 bucket domain
  const allowedDomains = ["f003.backblazeb2.com", "f004.backblazeb2.com"];
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!allowedDomains.some((d) => parsedUrl.hostname === d)) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 });
  }
}

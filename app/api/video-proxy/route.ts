import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/video-proxy?url=<encoded-video-url>
 *
 * Server-side proxy for B2/external video files.
 * Forwards Range headers so the browser can seek and the <video> element
 * works correctly. Avoids CORS issues since the browser fetches from the
 * same origin (Next.js server), and the server fetches B2 without CORS restrictions.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  // Only proxy known trusted domains (B2 / backblazeb2.com)
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(videoUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const allowedHosts = [
    "backblazeb2.com",
    "f001.backblazeb2.com",
    "f002.backblazeb2.com",
    "f003.backblazeb2.com",
    "f004.backblazeb2.com",
    "barbell-path-tracker-production.up.railway.app",
  ];

  const isAllowed = allowedHosts.some(
    (host) =>
      parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
  );

  if (!isAllowed) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
  }

  // Forward Range header from the browser so seeking works
  const rangeHeader = req.headers.get("range");
  const upstreamHeaders: HeadersInit = {
    "User-Agent": "Athlifyr/1.0",
  };
  if (rangeHeader) {
    upstreamHeaders["Range"] = rangeHeader;
  }

  let upstream: Response;
  try {
    upstream = await fetch(videoUrl, {
      headers: upstreamHeaders,
    });
  } catch (err) {
    console.error("[video-proxy] Failed to fetch upstream:", err);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 502 }
    );
  }

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: `Upstream returned ${upstream.status}` },
      { status: upstream.status }
    );
  }

  // Build response headers — forward content-type, content-length, content-range
  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type") ?? "video/mp4";
  responseHeaders.set("Content-Type", contentType);

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) responseHeaders.set("Content-Length", contentLength);

  const contentRange = upstream.headers.get("content-range");
  if (contentRange) responseHeaders.set("Content-Range", contentRange);

  const acceptRanges = upstream.headers.get("accept-ranges");
  if (acceptRanges) responseHeaders.set("Accept-Ranges", acceptRanges);
  else responseHeaders.set("Accept-Ranges", "bytes");

  // Cache the proxied video for 1 hour on the CDN / browser
  responseHeaders.set("Cache-Control", "public, max-age=3600, immutable");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

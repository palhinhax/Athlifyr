import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SCRAPING_API_URL =
  process.env.SCRAPING_API_URL || "http://localhost:8000/api/v1";
const SCRAPING_API_KEY = process.env.SCRAPING_API_KEY || "";

/**
 * Proxy all requests to the Python scraping service.
 * Adds X-API-Key header server-side so the secret never reaches the browser.
 * Only ADMIN users can access this.
 */
async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const targetPath = path.join("/");
  const url = new URL(req.url);
  const queryString = url.search;

  const targetUrl = `${SCRAPING_API_URL}/${targetPath}${queryString}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (SCRAPING_API_KEY) {
    headers["X-API-Key"] = SCRAPING_API_KEY;
  }

  try {
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    // Scraping runs can take several minutes — use a generous timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5 * 60 * 1000);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Scraping API proxy error:", error);
    return NextResponse.json(
      { error: "Scraping API unavailable" },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;

// Scraping runs can take several minutes
export const maxDuration = 300;

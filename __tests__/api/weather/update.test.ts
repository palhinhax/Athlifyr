/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/weather/update
 *
 * Covers secret validation (fail-closed) for the weather update endpoint.
 */

export {};

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(authHeader?: string): Request {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authHeader !== undefined) {
    headers["authorization"] = authHeader;
  }
  return new Request("http://localhost/api/weather/update", {
    method: "POST",
    headers,
  });
}

/** Re-import the route after resetting modules so module-level env vars are re-read. */
async function importRoute() {
  jest.resetModules();
  jest.doMock("@/lib/prisma", () => ({
    prisma: {
      event: { findMany: jest.fn().mockResolvedValue([]) },
      eventWeather: { upsert: jest.fn() },
    },
  }));
  return import("@/app/api/weather/update/route");
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/weather/update", () => {
  const originalSecret = process.env.WEATHER_UPDATE_SECRET;

  afterEach(() => {
    if (originalSecret !== undefined) {
      process.env.WEATHER_UPDATE_SECRET = originalSecret;
    } else {
      delete process.env.WEATHER_UPDATE_SECRET;
    }
  });

  it("returns 401 when WEATHER_UPDATE_SECRET is not configured", async () => {
    delete process.env.WEATHER_UPDATE_SECRET;
    const { POST } = await importRoute();

    const res = await POST(makeRequest("Bearer anything"));

    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is missing", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";
    const { POST } = await importRoute();

    const res = await POST(makeRequest());

    expect(res.status).toBe(401);
  });

  it("returns 401 when secret is wrong", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";
    const { POST } = await importRoute();

    const res = await POST(makeRequest("Bearer wrong-secret"));

    expect(res.status).toBe(401);
  });

  it("returns 500 when OPENWEATHER_API_KEY is not configured", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";
    delete process.env.OPENWEATHER_API_KEY;
    const { POST } = await importRoute();

    const res = await POST(makeRequest("Bearer test-secret"));

    expect(res.status).toBe(500);
  });

  it("succeeds with valid secret and API key", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";
    process.env.OPENWEATHER_API_KEY = "fake-api-key";
    const { POST } = await importRoute();

    const res = await POST(makeRequest("Bearer test-secret"));

    expect(res.status).toBe(200);
  });
});

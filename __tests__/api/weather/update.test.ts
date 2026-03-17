/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/weather/update
 *
 * Covers secret validation (fail-closed) for the weather update endpoint.
 */

export {};

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findMany: jest.fn().mockResolvedValue([]) },
    eventWeather: { upsert: jest.fn() },
  },
}));

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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/weather/update", () => {
  const originalSecret = process.env.WEATHER_UPDATE_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (originalSecret !== undefined) {
      process.env.WEATHER_UPDATE_SECRET = originalSecret;
    } else {
      delete process.env.WEATHER_UPDATE_SECRET;
    }
  });

  it("returns 401 when WEATHER_UPDATE_SECRET is not configured", async () => {
    delete process.env.WEATHER_UPDATE_SECRET;

    jest.resetModules();
    jest.mock("@/lib/prisma", () => ({
      prisma: {
        event: { findMany: jest.fn().mockResolvedValue([]) },
        eventWeather: { upsert: jest.fn() },
      },
    }));
    const { POST } = await import("@/app/api/weather/update/route");

    const res = await POST(makeRequest("Bearer anything"));

    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is missing", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";

    jest.resetModules();
    jest.mock("@/lib/prisma", () => ({
      prisma: {
        event: { findMany: jest.fn().mockResolvedValue([]) },
        eventWeather: { upsert: jest.fn() },
      },
    }));
    const { POST } = await import("@/app/api/weather/update/route");

    const res = await POST(makeRequest());

    expect(res.status).toBe(401);
  });

  it("returns 401 when secret is wrong", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";

    jest.resetModules();
    jest.mock("@/lib/prisma", () => ({
      prisma: {
        event: { findMany: jest.fn().mockResolvedValue([]) },
        eventWeather: { upsert: jest.fn() },
      },
    }));
    const { POST } = await import("@/app/api/weather/update/route");

    const res = await POST(makeRequest("Bearer wrong-secret"));

    expect(res.status).toBe(401);
  });

  it("returns 500 when OPENWEATHER_API_KEY is not configured", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";
    delete process.env.OPENWEATHER_API_KEY;

    jest.resetModules();
    jest.mock("@/lib/prisma", () => ({
      prisma: {
        event: { findMany: jest.fn().mockResolvedValue([]) },
        eventWeather: { upsert: jest.fn() },
      },
    }));
    const { POST } = await import("@/app/api/weather/update/route");

    const res = await POST(makeRequest("Bearer test-secret"));

    expect(res.status).toBe(500);
  });

  it("succeeds with valid secret and API key", async () => {
    process.env.WEATHER_UPDATE_SECRET = "test-secret";
    process.env.OPENWEATHER_API_KEY = "fake-api-key";

    jest.resetModules();
    jest.mock("@/lib/prisma", () => ({
      prisma: {
        event: { findMany: jest.fn().mockResolvedValue([]) },
        eventWeather: { upsert: jest.fn() },
      },
    }));
    const { POST } = await import("@/app/api/weather/update/route");

    const res = await POST(makeRequest("Bearer test-secret"));

    expect(res.status).toBe(200);
  });
});

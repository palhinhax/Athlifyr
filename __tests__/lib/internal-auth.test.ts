/**
 * @jest-environment node
 */

/**
 * Tests for lib/internal-auth.ts
 *
 * Covers:
 * - Returns true with valid credentials
 * - Returns false when LIVE_INTERNAL_SECRET is not configured (fail closed)
 * - Returns false when x-live-server header is missing
 * - Returns false when x-live-secret header is missing
 * - Returns false when secret is wrong
 * - Returns false when secret has a different length (buffer mismatch)
 */

import { NextRequest } from "next/server";
import { isLiveServer } from "@/lib/internal-auth";

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_SECRET = "test-internal-secret-32chars!!";

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new Request("http://localhost/api/internal/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  }) as unknown as NextRequest;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("isLiveServer", () => {
  const originalEnv = process.env.LIVE_INTERNAL_SECRET;

  afterEach(() => {
    // Restore original env
    if (originalEnv !== undefined) {
      process.env.LIVE_INTERNAL_SECRET = originalEnv;
    } else {
      delete process.env.LIVE_INTERNAL_SECRET;
    }
  });

  it("returns true with valid credentials", () => {
    process.env.LIVE_INTERNAL_SECRET = VALID_SECRET;

    const req = makeRequest({
      "x-live-server": "true",
      "x-live-secret": VALID_SECRET,
    });

    expect(isLiveServer(req)).toBe(true);
  });

  it("returns false when LIVE_INTERNAL_SECRET is not configured (fail closed)", () => {
    delete process.env.LIVE_INTERNAL_SECRET;

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const req = makeRequest({
      "x-live-server": "true",
      "x-live-secret": "any-secret",
    });

    expect(isLiveServer(req)).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("LIVE_INTERNAL_SECRET is not configured")
    );

    consoleSpy.mockRestore();
  });

  it("returns false when x-live-server header is missing", () => {
    process.env.LIVE_INTERNAL_SECRET = VALID_SECRET;

    const req = makeRequest({
      "x-live-secret": VALID_SECRET,
    });

    expect(isLiveServer(req)).toBe(false);
  });

  it("returns false when x-live-server header is not 'true'", () => {
    process.env.LIVE_INTERNAL_SECRET = VALID_SECRET;

    const req = makeRequest({
      "x-live-server": "false",
      "x-live-secret": VALID_SECRET,
    });

    expect(isLiveServer(req)).toBe(false);
  });

  it("returns false when x-live-secret header is missing", () => {
    process.env.LIVE_INTERNAL_SECRET = VALID_SECRET;

    const req = makeRequest({
      "x-live-server": "true",
    });

    expect(isLiveServer(req)).toBe(false);
  });

  it("returns false when secret is wrong", () => {
    process.env.LIVE_INTERNAL_SECRET = VALID_SECRET;

    const req = makeRequest({
      "x-live-server": "true",
      "x-live-secret": "wrong-secret-value-here!!!!!!",
    });

    expect(isLiveServer(req)).toBe(false);
  });

  it("returns false when secret has a different length (buffer mismatch)", () => {
    process.env.LIVE_INTERNAL_SECRET = VALID_SECRET;

    const req = makeRequest({
      "x-live-server": "true",
      "x-live-secret": "short",
    });

    expect(isLiveServer(req)).toBe(false);
  });

  it("returns false when LIVE_INTERNAL_SECRET is empty string", () => {
    process.env.LIVE_INTERNAL_SECRET = "";

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const req = makeRequest({
      "x-live-server": "true",
      "x-live-secret": "",
    });

    expect(isLiveServer(req)).toBe(false);

    consoleSpy.mockRestore();
  });
});

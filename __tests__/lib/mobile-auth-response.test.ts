/**
 * @jest-environment node
 */

jest.mock("@/lib/jwt", () => ({
  generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
  generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
}));

import { buildAuthResponse, bannedResponse } from "@/lib/mobile-auth-response";
import type { MobileAuthUser } from "@/lib/mobile-auth-response";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("mobile-auth-response", () => {
  const mockUser: MobileAuthUser = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    role: "USER" as MobileAuthUser["role"],
    image: "https://example.com/photo.jpg",
  };

  describe("buildAuthResponse", () => {
    it("returns JSON response with tokens and user data", async () => {
      const response = buildAuthResponse(mockUser);
      const body = await response.json();

      expect(body.token).toBe("mock-access-token");
      expect(body.refreshToken).toBe("mock-refresh-token");
      expect(body.user).toEqual({
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
        image: "https://example.com/photo.jpg",
      });
    });

    it("returns 200 status", () => {
      const response = buildAuthResponse(mockUser);
      expect(response.status).toBe(200);
    });

    it("handles null name and image", async () => {
      const userNoName: MobileAuthUser = {
        ...mockUser,
        name: null,
        image: null,
      };

      const response = buildAuthResponse(userNoName);
      const body = await response.json();

      expect(body.user.name).toBeNull();
      expect(body.user.image).toBeNull();
    });
  });

  describe("bannedResponse", () => {
    it("returns 403 status with error message", async () => {
      const response = bannedResponse();

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.error).toBe("Account is banned");
    });
  });
});

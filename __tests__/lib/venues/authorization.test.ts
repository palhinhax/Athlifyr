import {
  hasVenueRole,
  isVenueOwner,
  isVenueAdmin,
  isVenueCoach,
  isVenueMember,
  getUserVenueRole,
  canManageVenue,
  canManageSessions,
  canViewBookings,
} from "@/lib/venues/authorization";
import { prisma } from "@/lib/prisma";
import { VenueRole, MemberStatus } from "@prisma/client";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    venueMember: {
      findUnique: jest.fn(),
    },
  },
}));

describe("authorization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = "user-1";
  const venueId = "venue-1";

  describe("hasVenueRole", () => {
    it("should return false if member not found", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await hasVenueRole(userId, venueId, VenueRole.CLIENT);

      expect(result).toBe(false);
    });

    it("should return false if member is not active", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.SUSPENDED,
      });

      const result = await hasVenueRole(userId, venueId, VenueRole.CLIENT);

      expect(result).toBe(false);
    });

    it("should return true for exact role match", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.ACTIVE,
      });

      const result = await hasVenueRole(userId, venueId, VenueRole.COACH);

      expect(result).toBe(true);
    });

    it("should return true for higher role (owner checking for admin)", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.OWNER,
        status: MemberStatus.ACTIVE,
      });

      const result = await hasVenueRole(userId, venueId, VenueRole.ADMIN);

      expect(result).toBe(true);
    });

    it("should return false for lower role (client checking for coach)", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.ACTIVE,
      });

      const result = await hasVenueRole(userId, venueId, VenueRole.COACH);

      expect(result).toBe(false);
    });
  });

  describe("isVenueOwner", () => {
    it("should return true for owner", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.OWNER,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueOwner(userId, venueId);

      expect(result).toBe(true);
    });

    it("should return false for non-owner", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.ADMIN,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueOwner(userId, venueId);

      expect(result).toBe(false);
    });
  });

  describe("isVenueAdmin", () => {
    it("should return true for admin", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.ADMIN,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueAdmin(userId, venueId);

      expect(result).toBe(true);
    });

    it("should return true for owner", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.OWNER,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueAdmin(userId, venueId);

      expect(result).toBe(true);
    });

    it("should return false for coach", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueAdmin(userId, venueId);

      expect(result).toBe(false);
    });
  });

  describe("isVenueCoach", () => {
    it("should return true for coach", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueCoach(userId, venueId);

      expect(result).toBe(true);
    });

    it("should return true for admin", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.ADMIN,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueCoach(userId, venueId);

      expect(result).toBe(true);
    });

    it("should return false for client", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueCoach(userId, venueId);

      expect(result).toBe(false);
    });
  });

  describe("isVenueMember", () => {
    it("should return true for active member", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.ACTIVE,
      });

      const result = await isVenueMember(userId, venueId);

      expect(result).toBe(true);
    });

    it("should return false for non-active member", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.SUSPENDED,
      });

      const result = await isVenueMember(userId, venueId);

      expect(result).toBe(false);
    });

    it("should return false for non-member", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await isVenueMember(userId, venueId);

      expect(result).toBe(false);
    });
  });

  describe("getUserVenueRole", () => {
    it("should return role for active member", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.ACTIVE,
      });

      const result = await getUserVenueRole(userId, venueId);

      expect(result).toBe(VenueRole.COACH);
    });

    it("should return null for non-active member", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.LEFT,
      });

      const result = await getUserVenueRole(userId, venueId);

      expect(result).toBeNull();
    });

    it("should return null for non-member", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserVenueRole(userId, venueId);

      expect(result).toBeNull();
    });
  });

  describe("canManageVenue", () => {
    it("should allow owner to manage venue", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.OWNER,
        status: MemberStatus.ACTIVE,
      });

      const result = await canManageVenue(userId, venueId);

      expect(result.authorized).toBe(true);
    });

    it("should allow admin to manage venue", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.ADMIN,
        status: MemberStatus.ACTIVE,
      });

      const result = await canManageVenue(userId, venueId);

      expect(result.authorized).toBe(true);
    });

    it("should not allow coach to manage venue", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.ACTIVE,
      });

      const result = await canManageVenue(userId, venueId);

      expect(result.authorized).toBe(false);
      expect(result.reason).toBe("INSUFFICIENT_PERMISSIONS");
    });
  });

  describe("canManageSessions", () => {
    it("should allow coach to manage sessions", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.ACTIVE,
      });

      const result = await canManageSessions(userId, venueId);

      expect(result.authorized).toBe(true);
    });

    it("should allow admin to manage sessions", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.ADMIN,
        status: MemberStatus.ACTIVE,
      });

      const result = await canManageSessions(userId, venueId);

      expect(result.authorized).toBe(true);
    });

    it("should not allow client to manage sessions", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.ACTIVE,
      });

      const result = await canManageSessions(userId, venueId);

      expect(result.authorized).toBe(false);
      expect(result.reason).toBe("INSUFFICIENT_PERMISSIONS");
    });
  });

  describe("canViewBookings", () => {
    it("should allow owner to view all bookings", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.OWNER,
        status: MemberStatus.ACTIVE,
      });

      const result = await canViewBookings(userId, venueId);

      expect(result.authorized).toBe(true);
    });

    it("should allow coach to view their session bookings", async () => {
      const coachId = userId;
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.COACH,
        status: MemberStatus.ACTIVE,
      });

      const result = await canViewBookings(userId, venueId, undefined, coachId);

      expect(result.authorized).toBe(true);
    });

    it("should allow user to view their own bookings", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.ACTIVE,
      });

      const result = await canViewBookings(userId, venueId, userId);

      expect(result.authorized).toBe(true);
    });

    it("should not allow client to view other users bookings", async () => {
      (prisma.venueMember.findUnique as jest.Mock).mockResolvedValue({
        id: "member-1",
        role: VenueRole.CLIENT,
        status: MemberStatus.ACTIVE,
      });

      const result = await canViewBookings(userId, venueId, "other-user");

      expect(result.authorized).toBe(false);
      expect(result.reason).toBe("INSUFFICIENT_PERMISSIONS");
    });
  });
});

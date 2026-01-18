import { prisma } from "@/lib/prisma";
import { VenueRole, MemberStatus } from "@prisma/client";

/**
 * Check if user has a specific role or higher in a venue
 */
export async function hasVenueRole(
  userId: string,
  venueId: string,
  requiredRole: VenueRole
): Promise<boolean> {
  const member = await prisma.venueMember.findUnique({
    where: {
      venueId_userId: {
        venueId,
        userId,
      },
    },
  });

  if (!member || member.status !== MemberStatus.ACTIVE) {
    return false;
  }

  // Role hierarchy: OWNER > ADMIN > COACH > CLIENT
  const roleHierarchy: Record<VenueRole, number> = {
    [VenueRole.OWNER]: 4,
    [VenueRole.ADMIN]: 3,
    [VenueRole.COACH]: 2,
    [VenueRole.CLIENT]: 1,
  };

  return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
}

/**
 * Check if user is venue owner
 */
export async function isVenueOwner(
  userId: string,
  venueId: string
): Promise<boolean> {
  return hasVenueRole(userId, venueId, VenueRole.OWNER);
}

/**
 * Check if user is venue admin or owner
 */
export async function isVenueAdmin(
  userId: string,
  venueId: string
): Promise<boolean> {
  return hasVenueRole(userId, venueId, VenueRole.ADMIN);
}

/**
 * Check if user is venue coach, admin, or owner
 */
export async function isVenueCoach(
  userId: string,
  venueId: string
): Promise<boolean> {
  return hasVenueRole(userId, venueId, VenueRole.COACH);
}

/**
 * Check if user is an active member of the venue (any role)
 */
export async function isVenueMember(
  userId: string,
  venueId: string
): Promise<boolean> {
  const member = await prisma.venueMember.findUnique({
    where: {
      venueId_userId: {
        venueId,
        userId,
      },
    },
  });

  return member !== null && member.status === MemberStatus.ACTIVE;
}

/**
 * Get user's role in a venue
 */
export async function getUserVenueRole(
  userId: string,
  venueId: string
): Promise<VenueRole | null> {
  const member = await prisma.venueMember.findUnique({
    where: {
      venueId_userId: {
        venueId,
        userId,
      },
    },
  });

  if (!member || member.status !== MemberStatus.ACTIVE) {
    return null;
  }

  return member.role;
}

/**
 * Authorization result with reason
 */
export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
}

/**
 * Check if user can manage venue (owner or admin only)
 */
export async function canManageVenue(
  userId: string,
  venueId: string
): Promise<AuthorizationResult> {
  const isAdmin = await isVenueAdmin(userId, venueId);

  if (!isAdmin) {
    return {
      authorized: false,
      reason: "INSUFFICIENT_PERMISSIONS",
    };
  }

  return {
    authorized: true,
  };
}

/**
 * Check if user can manage sessions (owner, admin, or coach)
 */
export async function canManageSessions(
  userId: string,
  venueId: string
): Promise<AuthorizationResult> {
  const isCoach = await isVenueCoach(userId, venueId);

  if (!isCoach) {
    return {
      authorized: false,
      reason: "INSUFFICIENT_PERMISSIONS",
    };
  }

  return {
    authorized: true,
  };
}

/**
 * Check if user can view bookings
 * - Owners and admins can view all bookings
 * - Coaches can view their own session bookings
 * - Clients can only view their own bookings
 */
export async function canViewBookings(
  userId: string,
  venueId: string,
  targetUserId?: string,
  sessionCoachId?: string
): Promise<AuthorizationResult> {
  const role = await getUserVenueRole(userId, venueId);

  if (!role) {
    return {
      authorized: false,
      reason: "NOT_A_MEMBER",
    };
  }

  // Owners and admins can view all bookings
  if (role === VenueRole.OWNER || role === VenueRole.ADMIN) {
    return {
      authorized: true,
    };
  }

  // Coaches can view bookings for their sessions
  if (role === VenueRole.COACH && sessionCoachId === userId) {
    return {
      authorized: true,
    };
  }

  // Users can view their own bookings
  if (targetUserId === userId) {
    return {
      authorized: true,
    };
  }

  return {
    authorized: false,
    reason: "INSUFFICIENT_PERMISSIONS",
  };
}

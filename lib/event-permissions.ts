import { prisma } from "@/lib/prisma";
import { EventOrganizerRole, EventStaffRole } from "@prisma/client";

export type EventPermission =
  | "manage_event" // edit event details
  | "manage_team" // add/remove organizers & staff
  | "manage_stripe" // configure Stripe Connect
  | "view_registrations" // view registration list
  | "manage_registrations" // confirm/cancel registrations, assign bibs
  | "checkin" // check in participants
  | "manage_liverace" // control live race (Platform Admin only)
  | "stream"; // manage live stream

interface UserEventContext {
  userId: string;
  userRole: string; // "ADMIN" | "USER"
  organizerRole?: EventOrganizerRole | null;
  staffRole?: EventStaffRole | null;
}

export async function getUserEventContext(
  userId: string,
  userRole: string,
  eventId: string
): Promise<UserEventContext> {
  const [organizer, staff] = await Promise.all([
    prisma.eventOrganizer.findUnique({
      where: { eventId_userId: { eventId, userId } },
    }),
    prisma.eventStaffMember.findUnique({
      where: { eventId_userId: { eventId, userId } },
    }),
  ]);

  return {
    userId,
    userRole,
    organizerRole: organizer?.role ?? null,
    staffRole: staff?.role ?? null,
  };
}

export function hasEventPermission(
  ctx: UserEventContext,
  permission: EventPermission
): boolean {
  const isPlatformAdmin = ctx.userRole === "ADMIN";
  const { organizerRole, staffRole } = ctx;

  switch (permission) {
    case "manage_liverace":
      return isPlatformAdmin;

    case "manage_stripe":
      return isPlatformAdmin || organizerRole === EventOrganizerRole.OWNER;

    case "manage_team":
      return (
        isPlatformAdmin ||
        organizerRole === EventOrganizerRole.OWNER ||
        organizerRole === EventOrganizerRole.ADMIN
      );

    case "manage_event":
      return (
        isPlatformAdmin ||
        organizerRole === EventOrganizerRole.OWNER ||
        organizerRole === EventOrganizerRole.ADMIN
      );

    case "view_registrations":
      return isPlatformAdmin || organizerRole != null || staffRole != null;

    case "manage_registrations":
      return (
        isPlatformAdmin ||
        organizerRole === EventOrganizerRole.OWNER ||
        organizerRole === EventOrganizerRole.ADMIN ||
        staffRole === EventStaffRole.STAFF
      );

    case "checkin":
      return (
        isPlatformAdmin ||
        organizerRole != null ||
        staffRole === EventStaffRole.STAFF ||
        staffRole === EventStaffRole.CHECKIN_ONLY
      );

    case "stream":
      return (
        isPlatformAdmin ||
        organizerRole != null ||
        staffRole === EventStaffRole.STAFF ||
        staffRole === EventStaffRole.STREAM_ONLY
      );

    default:
      return false;
  }
}

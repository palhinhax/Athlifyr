import { EventOrganizerRole, EventStaffRole } from "@prisma/client";
import type { RegistrationFieldSettings } from "@/types/registration-fields";

export interface EventDetails {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sportTypes: string[];
  startDate: string;
  endDate: string | null;
  city: string;
  country: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  externalUrl: string | null;
  stravaRouteEmbed: string | null;
  hasRegistrations: boolean;
  hasLiveRace: boolean;
  stripeOnboardingStatus: string;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  stripeAccountId: string | null;
  commissionPercent: number;
  refundDeadline: string | null;
  checkInOpensAt: string | null;
  checkInClosesAt: string | null;
  cancelled: boolean;
  cancellationReason: string | null;
  registrationFieldSettings: RegistrationFieldSettings;
  variants: EventVariant[];
}

export interface EventVariant {
  id: string;
  name: string;
  distanceKm: number | null;
  elevationGainM: number | null;
  startDate: string | null;
  startTime: string | null;
  price: number | null;
  maxParticipants: number | null;
  teamSize: number;
}

export interface PricingPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  discountPercent: number | null;
  note: string | null;
  variantId: string | null;
}

export interface OrganizerMember {
  id: string;
  role: EventOrganizerRole;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  addedBy: { id: string; name: string | null; email: string };
}

export interface StaffMember {
  id: string;
  role: EventStaffRole;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  addedBy: { id: string; name: string | null; email: string };
}

export interface UserSearchResult {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export const ORGANIZER_ROLE_COLORS: Record<EventOrganizerRole, string> = {
  OWNER:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  FINANCE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export const STAFF_ROLE_COLORS: Record<EventStaffRole, string> = {
  STAFF:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  CHECKIN_ONLY:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  STREAM_ONLY:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};

export function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export function toDateOnly(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

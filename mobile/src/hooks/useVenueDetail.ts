import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";

export interface VenueMember {
  id: string;
  role: "OWNER" | "ADMIN" | "COACH" | "CLIENT";
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface VenuePlanPolicy {
  type?: string;
  maxBookingsPerWeek?: number;
  maxBookingsPerMonth?: number;
  maxTotalBookings?: number;
  durationDays?: number;
}

export interface VenuePlanSubscription {
  id: string;
  status: string;
  paymentStatus: string;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  totalBookingsUsed?: number;
}

export interface VenuePlan {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
  policy?: VenuePlanPolicy | null;
  isActive: boolean;
  includedVenues?: Array<{
    venue: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
      logo: string | null;
    };
  }>;
  subscriptions?: VenuePlanSubscription[];
}

export interface VenueDetail {
  id: string;
  slug: string;
  name: string;
  type: string;
  services: string[];
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  logo: string | null;
  coverImage: string | null;
  isVerified?: boolean;
  defaultSessionCapacity: number | null;
  defaultBookingAdvanceDays: number;
  defaultBookingDeadlineMinutes: number;
  defaultCancellationDeadlineMinutes: number;
  requiresPlanToBook: boolean;
  paymentMode: "IN_APP" | "EXTERNAL" | "MIXED";
  externalPaymentInstructions: string | null;
  enableTrialBooking: boolean;
  visibleTabs?: string[];
  members: VenueMember[];
  plans: VenuePlan[];
  _count: {
    sessions: number;
    bookings: number;
    subscriptions: number;
  };
  crossVenueSubscriptions?: Array<{
    id: string;
    status: string;
    paymentStatus: string;
    startsAt: string;
    endsAt: string | null;
    createdAt: string;
    totalBookingsUsed?: number;
    plan: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      currency: string;
      policy?: VenuePlanPolicy | null;
      venue: {
        id: string;
        name: string;
        slug: string;
        city: string | null;
        logo: string | null;
      };
    };
  }>;
}

async function fetchVenueDetail(slug: string): Promise<VenueDetail> {
  const response = await api.get<VenueDetail>(`/venues/${slug}`);
  return response.data;
}

export function useVenueDetail(slug: string) {
  const query = useQuery<VenueDetail>({
    queryKey: ["venue", slug],
    queryFn: () => fetchVenueDetail(slug),
    enabled: !!slug,
  });

  return {
    venue: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

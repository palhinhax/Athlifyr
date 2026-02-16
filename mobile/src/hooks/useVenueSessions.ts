import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { startOfMonth, endOfMonth, format } from "date-fns";

// ── Types ──────────────────────────────────────────────────────────────

export interface SessionCoach {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface SessionBooking {
  id: string;
  status: string;
  guestName?: string | null;
  guestEmail?: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface VenueSession {
  id: string;
  venueId: string;
  type: "CLASS" | "APPOINTMENT";
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  coachId: string | null;
  coach?: SessionCoach | null;
  tags: string[];
  recurringSessionId: string | null;
  recurringSession?: {
    id: string;
    isActive: boolean;
  } | null;
  bookings?: SessionBooking[];
  workouts?: Array<{
    id: string;
    workout: {
      id: string;
      name: string;
      description: string | null;
    };
  }>;
  _count: {
    bookings: number;
  };
  // Added by client after merging booking data
  isBooked?: boolean;
  userBookingId?: string;
  // Booking time defaults from venue
  bookingAdvanceDays?: number;
  bookingDeadlineMinutes?: number;
  cancellationDeadlineMinutes?: number;
}

// ── Hook ───────────────────────────────────────────────────────────────

export function useVenueSessions(venueId: string, month: Date) {
  const monthKey = format(month, "yyyy-MM");
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const query = useQuery<VenueSession[]>({
    queryKey: ["venueSessions", venueId, monthKey],
    queryFn: async () => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);

      // Fetch sessions and user bookings in parallel (like web)
      const sessionsPromise = api.get(`/venues/${venueId}/sessions`, {
        params: { from: start.toISOString(), to: end.toISOString() },
      });
      const bookingsPromise = userId
        ? api.get(`/venues/${venueId}/bookings/user`).catch(() => null)
        : null;

      const [sessionsRes, bookingsRes] = await Promise.all([
        sessionsPromise,
        bookingsPromise,
      ]);

      const raw = sessionsRes.data;
      let sessions: VenueSession[] = [];
      if (Array.isArray(raw)) {
        sessions = raw;
      } else if (
        raw &&
        typeof raw === "object" &&
        Array.isArray(raw.sessions)
      ) {
        sessions = raw.sessions;
      }

      // Merge booking status into sessions
      if (userId && bookingsRes?.data?.bookings) {
        const activeBookings = bookingsRes.data.bookings.filter(
          (b: { status: string }) =>
            b.status === "BOOKED" || b.status === "ATTENDED"
        );
        const bookedSessionIds = new Set(
          activeBookings.map((b: { sessionId: string }) => b.sessionId)
        );
        const sessionBookingMap = new Map<string, string>(
          activeBookings.map((b: { id: string; sessionId: string }) => [
            b.sessionId,
            b.id,
          ])
        );

        sessions = sessions.map((session) => ({
          ...session,
          isBooked: bookedSessionIds.has(session.id),
          userBookingId: sessionBookingMap.get(session.id),
        }));
      }

      return sessions;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Optimistic book — update cache instantly
  const optimisticBook = (sessionId: string, bookingId: string) => {
    queryClient.setQueryData<VenueSession[]>(
      ["venueSessions", venueId, monthKey],
      (old) =>
        old?.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                isBooked: true,
                userBookingId: bookingId,
                _count: { bookings: s._count.bookings + 1 },
              }
            : s
        )
    );
  };

  // Optimistic cancel — update cache instantly
  const optimisticCancelBooking = (sessionId: string) => {
    queryClient.setQueryData<VenueSession[]>(
      ["venueSessions", venueId, monthKey],
      (old) =>
        old?.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                isBooked: false,
                userBookingId: undefined,
                _count: { bookings: Math.max(0, s._count.bookings - 1) },
              }
            : s
        )
    );
  };

  // Optimistic delete — remove from cache instantly
  const optimisticDelete = (sessionId: string) => {
    queryClient.setQueryData<VenueSession[]>(
      ["venueSessions", venueId, monthKey],
      (old) => old?.filter((s) => s.id !== sessionId)
    );
  };

  return {
    sessions: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    optimisticBook,
    optimisticCancelBooking,
    optimisticDelete,
  };
}

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import type { AppStateStatus } from "react-native";
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

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: {
    name: string;
  };
  prescribedReps: number | null;
  prescribedWeight: number | null;
  prescribedWeightUnit: string | null;
  prescribedDistance: number | null;
  prescribedDistanceUnit: string | null;
  prescribedTime: number | null;
  prescribedCalories: number | null;
  prescribedSets: number | null;
  notes: string | null;
}

export interface WorkoutBlock {
  id: string;
  type: string;
  name: string | null;
  rounds: number | null;
  timeCap: number | null;
  notes: string | null;
  exercises: WorkoutExercise[];
}

export interface SessionWorkout {
  id: string;
  workout: {
    id: string;
    name: string;
    description: string | null;
    estimatedTime: number | null;
    difficulty: string | null;
    blocks?: WorkoutBlock[];
  };
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
  workouts?: SessionWorkout[];
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
    staleTime: 10 * 1000, // Consider data stale after 10 seconds
    gcTime: 10 * 60 * 1000,
    refetchOnMount: "always", // Always refetch when component mounts (e.g. navigating back)
    refetchOnWindowFocus: "always", // Always refetch when app comes back to foreground
    refetchInterval: 15 * 1000, // Auto-refetch every 15 seconds for near-real-time sync
    refetchIntervalInBackground: true, // Keep polling even when app is backgrounded
  });

  // ── Foreground refetch safety net ────────────────────────────────────
  // React Query's refetchOnWindowFocus relies on the global focusManager,
  // which may not always fire in React Native. This listener guarantees
  // an immediate refetch + cache invalidation when the app returns to foreground.
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // App came back to foreground — force fresh data
          queryClient.invalidateQueries({
            queryKey: ["venueSessions", venueId, monthKey],
          });
        }
        appState.current = nextAppState;
      }
    );
    return () => subscription.remove();
  }, [venueId, monthKey, queryClient]);

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

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, addDays } from "date-fns";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

interface SessionBooking {
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

interface SessionCoach {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface VenueSession {
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
  _count: {
    bookings: number;
  };
  isBooked?: boolean;
  userBookingId?: string;
}

interface UseVenueSessionsParams {
  venueId: string;
  userId?: string;
  monthStart: Date;
  monthEnd: Date;
}

export function useVenueSessions({
  venueId,
  userId,
  monthStart,
  monthEnd,
}: UseVenueSessionsParams) {
  const t = useTranslations("venues.sessions");
  const { toast } = useToast();

  const [sessions, setSessions] = useState<VenueSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStartISO = useMemo(() => monthStart.toISOString(), [monthStart]);
  const fetchEndISO = useMemo(
    () => addDays(monthEnd, 1).toISOString(),
    [monthEnd]
  );

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("from", fetchStartISO);
      params.set("to", fetchEndISO);

      const response = await fetch(
        `/api/venues/${venueId}/sessions?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();

      // Check user bookings
      let sessionsWithBookingStatus = data.sessions;
      if (userId) {
        const bookingsResponse = await fetch(
          `/api/venues/${venueId}/bookings/user`
        );
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const activeBookings = bookingsData.bookings.filter(
            (b: { status: string }) =>
              b.status === "BOOKED" || b.status === "ATTENDED"
          );
          const bookedSessionIds = new Set(
            activeBookings.map((b: { sessionId: string }) => b.sessionId)
          );
          // Map sessionId → bookingId for cancel operations
          const sessionBookingMap = new Map<string, string>(
            activeBookings.map((b: { id: string; sessionId: string }) => [
              b.sessionId,
              b.id,
            ])
          );
          sessionsWithBookingStatus = data.sessions.map(
            (session: VenueSession) => ({
              ...session,
              isBooked: bookedSessionIds.has(session.id),
              userBookingId: sessionBookingMap.get(session.id),
            })
          );
        }
      }

      setSessions(sessionsWithBookingStatus);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: t("loadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [venueId, fetchStartISO, fetchEndISO, userId, t, toast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Get sessions for a specific day
  const getSessionsForDay = useCallback(
    (day: Date) => {
      const dayKey = format(day, "yyyy-MM-dd");
      return sessions.filter((session) => {
        const sessionDate = format(new Date(session.startsAt), "yyyy-MM-dd");
        return sessionDate === dayKey;
      });
    },
    [sessions]
  );

  // Sessions count by day for calendar indicators
  const sessionsByDay = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach((session) => {
      const dayKey = format(new Date(session.startsAt), "yyyy-MM-dd");
      map[dayKey] = (map[dayKey] || 0) + 1;
    });
    return map;
  }, [sessions]);

  return {
    sessions,
    loading,
    fetchSessions,
    getSessionsForDay,
    sessionsByDay,
  };
}

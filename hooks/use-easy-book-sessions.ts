import { useState, useEffect, useCallback, useMemo } from "react";
import { format, addDays } from "date-fns";

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
  tags: string[];
  _count: {
    bookings: number;
  };
}

interface UseEasyBookSessionsParams {
  venueId: string;
  monthStart: Date;
  monthEnd: Date;
}

export function useEasyBookSessions({
  venueId,
  monthStart,
  monthEnd,
}: UseEasyBookSessionsParams) {
  const [sessions, setSessions] = useState<VenueSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStartISO = useMemo(() => monthStart.toISOString(), [monthStart]);
  const fetchEndISO = useMemo(
    () => addDays(monthEnd, 1).toISOString(),
    [monthEnd]
  );

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
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

      // Filter to only show CLASS type sessions (not appointments)
      // and only future sessions
      const now = new Date();
      const filteredSessions = data.sessions.filter(
        (session: VenueSession) =>
          session.type === "CLASS" && new Date(session.startsAt) > now
      );

      setSessions(filteredSessions);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [venueId, fetchStartISO, fetchEndISO]);

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
    error,
    fetchSessions,
    getSessionsForDay,
    sessionsByDay,
  };
}

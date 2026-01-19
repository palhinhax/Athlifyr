"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface UserVenue {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  type: string;
  role: "OWNER" | "ADMIN" | "COACH" | "CLIENT";
}

/**
 * Hook to fetch user's venues (where they are members)
 * Caches the result to avoid repeated API calls
 */
export function useUserVenues() {
  const { data: session, status } = useSession();
  const [venues, setVenues] = useState<UserVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if user is not authenticated
    if (status === "loading") {
      return;
    }

    if (!session?.user) {
      setVenues([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchVenues() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/venues");

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();

        if (isMounted) {
          setVenues(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setVenues([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchVenues();

    return () => {
      isMounted = false;
    };
  }, [session, status]);

  return { venues, isLoading, error };
}

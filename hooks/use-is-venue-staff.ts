"use client";

import { useUserVenues } from "@/hooks/use-user-venues";

/**
 * Hook to check if the current user is a staff member (OWNER, ADMIN, or COACH)
 * at any venue. Used to conditionally show the "My Schedule" menu item.
 */
export function useIsVenueStaff() {
  const { venues, isLoading } = useUserVenues();

  const isStaff = venues.some((v) =>
    ["OWNER", "ADMIN", "COACH"].includes(v.role)
  );

  return { isStaff, isLoading };
}

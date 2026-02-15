import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";

export interface ActiveVenue {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  role: string | null;
  subscriptionEndsAt: string | null;
}

async function fetchActiveVenues(): Promise<ActiveVenue[]> {
  const { data } = await api.get<ActiveVenue[]>("/user/active-venues");
  return data;
}

export function useActiveVenues() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<ActiveVenue[]>({
    queryKey: ["activeVenues"],
    queryFn: fetchActiveVenues,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

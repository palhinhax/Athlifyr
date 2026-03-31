import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";

// ============================================================================
// Types
// ============================================================================

export interface ProfileEvent {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  city: string | null;
  country: string | null;
  sportTypes: string[];
}

export interface ProfileVariant {
  name: string;
  distanceKm: number | null;
}

export interface ProfileParticipation {
  id: string;
  status: string;
  event: ProfileEvent;
  variant: ProfileVariant | null;
}

export interface ProfileStats {
  upcomingEvents: number;
  pastEvents: number;
  followersCount: number;
  followingCount: number;
}

export interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface ProfileData {
  user: ProfileUser;
  stats: ProfileStats;
  participations: ProfileParticipation[];
  isFollowing: boolean;
  isOwnProfile: boolean;
}

// ============================================================================
// Fetch Function
// ============================================================================

async function fetchProfile(userId: string): Promise<ProfileData> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = await SecureStore.getItemAsync("auth-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/users/${userId}`, { headers });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json() as Promise<ProfileData>;
}

// ============================================================================
// Hook
// ============================================================================

export function useProfile(userId: string | undefined) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });

  const now = new Date();

  const upcomingEvents =
    data?.participations.filter(
      (p) => new Date(p.event.startDate) > now && p.status === "going"
    ) ?? [];

  const pastEvents =
    data?.participations.filter(
      (p) => new Date(p.event.startDate) <= now && p.status === "going"
    ) ?? [];

  return {
    profile: data,
    stats: data?.stats ?? {
      upcomingEvents: 0,
      pastEvents: 0,
      followersCount: 0,
      followingCount: 0,
    },
    upcomingEvents,
    pastEvents,
    isLoading,
    error,
    refetch,
  };
}

// ============================================================================
// Athlifyr Mobile — Follow API
//
// Fetches the user's following/followers list from the Next.js API.
// ============================================================================

import { api } from "../lib/api";

export interface FollowUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

// Keep Friend alias for backward compat with chat NewConversationModal
export type Friend = FollowUser;

/**
 * Fetch people the current user follows.
 */
export async function fetchFollowing(): Promise<FollowUser[]> {
  const { data } = await api.get<FollowUser[]>("/follow?type=following");
  return data || [];
}

/**
 * Fetch people who follow the current user.
 */
export async function fetchFollowers(): Promise<FollowUser[]> {
  const { data } = await api.get<FollowUser[]>("/follow?type=followers");
  return data || [];
}

/**
 * Follow a user.
 */
export async function followUser(userId: string): Promise<void> {
  await api.post("/follow", { userId });
}

/**
 * Unfollow a user.
 */
export async function unfollowUser(userId: string): Promise<void> {
  await api.delete(`/follow/${userId}`);
}

/**
 * Check if the current user follows a given user.
 */
export async function checkFollowStatus(
  userId: string
): Promise<{ isFollowing: boolean }> {
  const { data } = await api.get<{ isFollowing: boolean }>(`/follow/${userId}`);
  return data;
}

// Backward compat: fetchFriends returns following list
export const fetchFriends = fetchFollowing;

// ============================================================================
// Athlifyr Mobile — Friends API
//
// Fetches the user's accepted friends list from the Next.js API.
// ============================================================================

import { api } from "../lib/api";

export interface Friend {
  friendshipId: string;
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  since: string;
}

/**
 * Fetch all accepted friends for the current user.
 */
export async function fetchFriends(): Promise<Friend[]> {
  const { data } = await api.get<Friend[]>("/friends");
  return data || [];
}

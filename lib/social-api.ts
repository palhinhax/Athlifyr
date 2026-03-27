// ============================================================================
// Social Service API Client — used server-side by Next.js API routes
// ============================================================================

const SOCIAL_API_URL = process.env.SOCIAL_API_URL || "http://localhost:4100";
const SOCIAL_API_SECRET = process.env.SOCIAL_API_SECRET || "";

interface FetchOptions {
  method?: string;
  body?: unknown;
}

async function socialFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${SOCIAL_API_URL}${path}`;

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SOCIAL_API_SECRET}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(error.error || `Social API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SocialAccount {
  id: string;
  platform: "INSTAGRAM" | "FACEBOOK" | "TIKTOK";
  accountName: string;
  platformAccountId: string;
  accessTokenExpiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { posts: number };
}

export interface SocialPost {
  id: string;
  accountId: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
  caption: string | null;
  imageUrl: string | null;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL" | "REEL" | "STORY";
  scheduledAt: string | null;
  publishedAt: string | null;
  platformPostId: string | null;
  platformPermalink: string | null;
  error: string | null;
  retryCount: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  account?: {
    id: string;
    accountName: string;
    platform: string;
  };
}

// ─── Accounts ──────────────────────────────────────────────────────────────

export async function getAccounts(): Promise<SocialAccount[]> {
  const data = await socialFetch<{ accounts: SocialAccount[] }>(
    "/api/accounts"
  );
  return data.accounts;
}

export async function getAccount(
  id: string
): Promise<SocialAccount & { posts: SocialPost[] }> {
  const data = await socialFetch<{
    account: SocialAccount & { posts: SocialPost[] };
  }>(`/api/accounts/${encodeURIComponent(id)}`);
  return data.account;
}

export async function disconnectAccount(id: string): Promise<void> {
  await socialFetch(`/api/accounts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getAuthUrl(userId: string): Promise<string> {
  const data = await socialFetch<{ authUrl: string }>(
    `/api/auth/instagram?userId=${encodeURIComponent(userId)}`
  );
  return data.authUrl;
}

// ─── Posts ──────────────────────────────────────────────────────────────────

export async function getPosts(params?: {
  status?: string;
  accountId?: string;
  limit?: number;
  offset?: number;
}): Promise<{ posts: SocialPost[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.accountId) searchParams.set("accountId", params.accountId);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));

  const query = searchParams.toString();
  return socialFetch<{ posts: SocialPost[]; total: number }>(
    `/api/posts${query ? `?${query}` : ""}`
  );
}

export async function createPost(data: {
  accountId: string;
  caption?: string;
  imageUrl?: string;
  mediaType?: string;
  scheduledAt?: string;
  metadata?: Record<string, unknown>;
}): Promise<SocialPost> {
  const result = await socialFetch<{ post: SocialPost }>("/api/posts", {
    method: "POST",
    body: data,
  });
  return result.post;
}

export async function updatePost(
  id: string,
  data: {
    caption?: string;
    imageUrl?: string;
    scheduledAt?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<SocialPost> {
  const result = await socialFetch<{ post: SocialPost }>(
    `/api/posts/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: data,
    }
  );
  return result.post;
}

export async function deletePost(id: string): Promise<void> {
  await socialFetch(`/api/posts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function publishPost(
  id: string
): Promise<{ platformPostId?: string; permalink?: string }> {
  return socialFetch<{ platformPostId?: string; permalink?: string }>(
    `/api/posts/${encodeURIComponent(id)}/publish`,
    { method: "POST" }
  );
}

// ─── Generate ──────────────────────────────────────────────────────────────

export interface GenerateResult {
  message: string;
  created: number;
  posts: Array<{
    id: string;
    eventTitle: string;
    imageUrl: string | null;
    status: string;
    scheduledAt: string | null;
  }>;
}

export async function generateWeeklyEvents(data: {
  accountId: string;
  events: Array<{
    id: string;
    slug: string;
    title: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string | null;
    imageUrl: string | null;
    sportTypes: string[];
    variants: Array<{
      name: string;
      distanceKm: number | null;
      elevationGainM: number | null;
    }>;
  }>;
  scheduleInterval?: number;
}): Promise<GenerateResult> {
  return socialFetch<GenerateResult>("/api/generate/weekly-events", {
    method: "POST",
    body: data,
  });
}

export async function generateCompilation(data: {
  accountId: string;
  mode: "weekly" | "monthly";
  events: Array<{
    id: string;
    slug: string;
    title: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string | null;
    imageUrl: string | null;
    sportTypes: string[];
    variants: Array<{
      name: string;
      distanceKm: number | null;
      elevationGainM: number | null;
    }>;
  }>;
  scheduledAt?: string;
}): Promise<GenerateResult> {
  return socialFetch<GenerateResult>("/api/generate/compilation", {
    method: "POST",
    body: data,
  });
}

// ─── Health ────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<{
  status: string;
  timestamp: string;
  uptime: number;
}> {
  // Health check doesn't require auth
  const url = `${SOCIAL_API_URL}/health`;
  const response = await fetch(url);
  return response.json() as Promise<{
    status: string;
    timestamp: string;
    uptime: number;
  }>;
}

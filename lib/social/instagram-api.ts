// ============================================================================
// Instagram Graph API Client
//
// Uses Instagram API with Instagram Login for content publishing.
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
//
// Publishing flow:
//   1. Create container: POST /{ig-user-id}/media
//   2. Publish: POST /{ig-user-id}/media_publish
// ============================================================================

const GRAPH_API_VERSION = "v21.0";
const GRAPH_BASE_URL = `https://graph.instagram.com/${GRAPH_API_VERSION}`;

// ─── Config ────────────────────────────────────────────────────────────────

function getConfig() {
  const igUserId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!igUserId || !accessToken) {
    throw new Error(
      "Missing INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN environment variables"
    );
  }

  return { igUserId, accessToken };
}

// ─── Error Class ───────────────────────────────────────────────────────────

export class InstagramApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public type: string,
    public fbtraceId?: string
  ) {
    super(message);
    this.name = "InstagramApiError";
  }
}

// ─── Internal Helpers ──────────────────────────────────────────────────────

interface IGErrorResponse {
  error?: {
    message: string;
    type: string;
    code: number;
    fbtrace_id?: string;
  };
}

async function igFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = (await response.json()) as T & IGErrorResponse;

  if (data.error) {
    throw new InstagramApiError(
      data.error.message,
      data.error.code,
      data.error.type,
      data.error.fbtrace_id
    );
  }

  return data;
}

// ─── Publishing ────────────────────────────────────────────────────────────

/**
 * Create an image media container.
 * The image must be publicly accessible via URL.
 */
async function createImageContainer(
  igUserId: string,
  imageUrl: string,
  caption: string,
  accessToken: string
): Promise<string> {
  const params = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });

  const data = await igFetch<{ id: string }>(
    `${GRAPH_BASE_URL}/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );

  return data.id;
}

/**
 * Create a carousel item container (no caption).
 * Each item is an image that will be part of a carousel post.
 */
async function createCarouselItemContainer(
  igUserId: string,
  imageUrl: string,
  accessToken: string
): Promise<string> {
  const params = new URLSearchParams({
    image_url: imageUrl,
    is_carousel_item: "true",
    access_token: accessToken,
  });

  const data = await igFetch<{ id: string }>(
    `${GRAPH_BASE_URL}/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );

  return data.id;
}

/**
 * Create a carousel container from child item IDs.
 * Caption goes on the carousel, not on individual items.
 */
async function createCarouselContainer(
  igUserId: string,
  childrenIds: string[],
  caption: string,
  accessToken: string
): Promise<string> {
  const params = new URLSearchParams({
    media_type: "CAROUSEL",
    children: childrenIds.join(","),
    caption,
    access_token: accessToken,
  });

  const data = await igFetch<{ id: string }>(
    `${GRAPH_BASE_URL}/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );

  return data.id;
}

/**
 * Publish a media container.
 */
async function publishContainer(
  igUserId: string,
  containerId: string,
  accessToken: string
): Promise<{ id: string; permalink?: string }> {
  const params = new URLSearchParams({
    creation_id: containerId,
    access_token: accessToken,
  });

  const data = await igFetch<{ id: string }>(
    `${GRAPH_BASE_URL}/${igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );

  // Fetch permalink of published post
  try {
    const media = await igFetch<{ id: string; permalink: string }>(
      `${GRAPH_BASE_URL}/${data.id}?fields=id,permalink&access_token=${accessToken}`
    );
    return { id: media.id, permalink: media.permalink };
  } catch {
    return { id: data.id };
  }
}

/**
 * Check the status of a media container.
 * Images usually process quickly, but we need to wait for FINISHED.
 */
async function getContainerStatus(
  containerId: string,
  accessToken: string
): Promise<{ status_code: string; status?: string }> {
  const params = new URLSearchParams({
    fields: "id,status_code,status",
    access_token: accessToken,
  });

  return igFetch<{ status_code: string; status?: string }>(
    `${GRAPH_BASE_URL}/${containerId}?${params}`
  );
}

/**
 * Wait for a container to finish processing (without publishing).
 * Used for carousel item containers that need to be ready before
 * creating the carousel container.
 */
async function waitForContainer(
  containerId: string,
  accessToken: string,
  maxWaitMs: number = 120_000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const status = await getContainerStatus(containerId, accessToken);

    if (status.status_code === "FINISHED") return;

    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(
        `Media container failed: ${status.status_code} — ${status.status ?? "unknown"}`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  throw new Error(`Media container timed out after ${maxWaitMs / 1000}s`);
}

/**
 * Wait for a container to finish processing, then publish.
 * Polls every 3 seconds up to maxWaitMs (default 2 min).
 */
async function waitForContainerAndPublish(
  igUserId: string,
  containerId: string,
  accessToken: string,
  maxWaitMs: number = 120_000
): Promise<{ id: string; permalink?: string }> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const status = await getContainerStatus(containerId, accessToken);

    if (status.status_code === "FINISHED") {
      return publishContainer(igUserId, containerId, accessToken);
    }

    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(
        `Media container failed: ${status.status_code} — ${status.status ?? "unknown"}`
      );
    }

    // IN_PROGRESS — wait 3 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  throw new Error(`Media container timed out after ${maxWaitMs / 1000}s`);
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface PublishImageResult {
  success: boolean;
  externalPostId?: string;
  externalUrl?: string;
  error?: string;
}

/**
 * Publish a single image post to Instagram.
 * Builds the full caption from caption text + hashtags.
 */
export async function publishImageToInstagram(params: {
  imageUrl: string;
  caption: string;
  hashtags?: string[];
}): Promise<PublishImageResult> {
  const { igUserId, accessToken } = getConfig();

  // Build caption with hashtags
  let fullCaption = params.caption;
  if (params.hashtags && params.hashtags.length > 0) {
    const hashtagString = params.hashtags
      .map((tag) => `#${tag.replace(/^#/, "")}`)
      .join(" ");
    fullCaption = `${fullCaption}\n\n${hashtagString}`;
  }

  // Step 1: Create media container
  const containerId = await createImageContainer(
    igUserId,
    params.imageUrl,
    fullCaption,
    accessToken
  );

  // Step 2: Wait for processing + publish
  const result = await waitForContainerAndPublish(
    igUserId,
    containerId,
    accessToken
  );

  return {
    success: true,
    externalPostId: result.id,
    externalUrl: result.permalink,
  };
}

/**
 * Publish a carousel post to Instagram (2–10 images).
 * Instagram carousel flow:
 *   1. Create item containers (is_carousel_item=true) for each image
 *   2. Wait for all items to finish processing
 *   3. Create carousel container with children IDs + caption
 *   4. Wait for carousel to finish processing
 *   5. Publish the carousel
 */
export async function publishCarouselToInstagram(params: {
  imageUrls: string[];
  caption: string;
  hashtags?: string[];
}): Promise<PublishImageResult> {
  if (params.imageUrls.length < 2) {
    return publishImageToInstagram({
      imageUrl: params.imageUrls[0],
      caption: params.caption,
      hashtags: params.hashtags,
    });
  }

  if (params.imageUrls.length > 10) {
    return {
      success: false,
      error: "Instagram carousels support a maximum of 10 images",
    };
  }

  const { igUserId, accessToken } = getConfig();

  // Build caption with hashtags
  let fullCaption = params.caption;
  if (params.hashtags && params.hashtags.length > 0) {
    const hashtagString = params.hashtags
      .map((tag) => `#${tag.replace(/^#/, "")}`)
      .join(" ");
    fullCaption = `${fullCaption}\n\n${hashtagString}`;
  }

  // Step 1: Create item containers for each image
  const childIds: string[] = [];
  for (const imageUrl of params.imageUrls) {
    const itemId = await createCarouselItemContainer(
      igUserId,
      imageUrl,
      accessToken
    );
    childIds.push(itemId);
  }

  // Step 2: Wait for all items to finish processing
  for (const childId of childIds) {
    await waitForContainer(childId, accessToken);
  }

  // Step 3: Create carousel container
  const carouselId = await createCarouselContainer(
    igUserId,
    childIds,
    fullCaption,
    accessToken
  );

  // Step 4: Wait for carousel processing + publish
  const result = await waitForContainerAndPublish(
    igUserId,
    carouselId,
    accessToken
  );

  return {
    success: true,
    externalPostId: result.id,
    externalUrl: result.permalink,
  };
}

/**
 * Verify the Instagram token is still valid by making a simple API call.
 */
export async function verifyInstagramToken(): Promise<{
  valid: boolean;
  username?: string;
  error?: string;
}> {
  try {
    const { accessToken } = getConfig();

    const data = await igFetch<{ id: string; username: string }>(
      `${GRAPH_BASE_URL}/me?fields=id,username&access_token=${accessToken}`
    );

    return { valid: true, username: data.username };
  } catch (error) {
    if (error instanceof InstagramApiError) {
      return { valid: false, error: error.message };
    }
    if (error instanceof Error) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: "Unknown error" };
  }
}

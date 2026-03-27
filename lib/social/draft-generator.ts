import { prisma } from "@/lib/prisma";
import type { SocialPostType } from "@prisma/client";
import {
  generateEventCaption,
  generateWeeklyRoundupCaptionAI,
  generateLastCallCaption,
} from "./caption-generator";

interface EventForDraft {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  startDate: Date;
  endDate: Date | null;
  imageUrl: string | null;
  sportTypes: string[];
  registrationDeadline: Date | null;
  variants: Array<{
    name: string;
    distanceKm: number | null;
    elevationGainM: number | null;
  }>;
}

// ─── Fetch Events Helper ─────────────────────────────────────────────────────

async function fetchUpcomingEvents(params: {
  days: number;
  sport?: string;
  limit?: number;
  lang?: string;
}): Promise<EventForDraft[]> {
  const { days, sport, limit = 20, lang = "pt" } = params;
  const now = new Date();
  const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const events = await prisma.event.findMany({
    where: {
      startDate: { gte: now, lte: endDate },
      cancelled: false,
      ...(sport ? { sportTypes: { has: sport as never } } : {}),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      startDate: true,
      endDate: true,
      city: true,
      country: true,
      imageUrl: true,
      sportTypes: true,
      registrationDeadline: true,
      translations: {
        where: { language: lang as never },
        select: { title: true, city: true },
      },
      variants: {
        select: { name: true, distanceKm: true, elevationGainM: true },
        orderBy: { distanceKm: "desc" },
      },
    },
    orderBy: { startDate: "asc" },
    take: Math.min(limit, 50),
  });

  return events.map((e) => {
    const t = e.translations[0];
    return {
      id: e.id,
      slug: e.slug,
      title: t?.title || e.title,
      city: t?.city || e.city,
      country: e.country,
      startDate: e.startDate,
      endDate: e.endDate,
      imageUrl: e.imageUrl,
      sportTypes: e.sportTypes,
      registrationDeadline: e.registrationDeadline,
      variants: e.variants,
    };
  });
}

// ─── Check Duplicates ────────────────────────────────────────────────────────

async function getExistingEventPostIds(
  type: SocialPostType
): Promise<Set<string>> {
  const posts = await prisma.socialPost.findMany({
    where: {
      type,
      status: { notIn: ["CANCELLED"] },
    },
    select: { metadata: true },
  });

  const ids = new Set<string>();
  for (const p of posts) {
    const meta = p.metadata as Record<string, unknown> | null;
    if (meta?.eventId) ids.add(meta.eventId as string);
    if (Array.isArray(meta?.eventIds)) {
      for (const id of meta.eventIds as string[]) ids.add(id);
    }
  }
  return ids;
}

// ─── Generate Event Drafts ───────────────────────────────────────────────────

export async function generateEventDrafts(params: {
  days?: number;
  sport?: string;
  lang?: string;
  userId?: string;
  scheduledFor?: Date;
}): Promise<{ created: number; posts: Array<{ id: string; title: string }> }> {
  const events = await fetchUpcomingEvents({
    days: params.days ?? 7,
    sport: params.sport,
    lang: params.lang,
  });

  if (events.length === 0) {
    return { created: 0, posts: [] };
  }

  const existingIds = await getExistingEventPostIds("EVENT");
  const newEvents = events.filter((e) => !existingIds.has(e.id));

  if (newEvents.length === 0) {
    return { created: 0, posts: [] };
  }

  const created: Array<{ id: string; title: string }> = [];

  for (const event of newEvents) {
    const { title, caption, hashtags } = generateEventCaption({
      ...event,
      startDate: event.startDate.toISOString(),
    });

    const post = await prisma.socialPost.create({
      data: {
        type: "EVENT",
        title,
        caption,
        hashtags,
        callToAction: "Mais info em athlifyr.com",
        imageUrl: event.imageUrl,
        status: params.scheduledFor ? "SCHEDULED" : "DRAFT",
        scheduledFor: params.scheduledFor ?? null,
        metadata: {
          eventId: event.id,
          eventSlug: event.slug,
          source: "auto-generate",
        },
        createdById: params.userId,
      },
    });

    await prisma.socialPostLog.create({
      data: {
        postId: post.id,
        action: params.scheduledFor ? "auto-scheduled" : "created",
        details: { source: "auto-generate", eventId: event.id },
        userId: params.userId,
      },
    });

    created.push({ id: post.id, title: post.title });
  }

  return { created: created.length, posts: created };
}

// ─── Generate Weekly Roundup Draft ───────────────────────────────────────────

export async function generateWeeklyRoundupDraft(params: {
  days?: number;
  sport?: string;
  lang?: string;
  maxEvents?: number;
  userId?: string;
  scheduledFor?: Date;
}): Promise<{ id: string; title: string; eventCount: number } | null> {
  const events = await fetchUpcomingEvents({
    days: params.days ?? 7,
    sport: params.sport ?? "TRAIL",
    limit: params.maxEvents ?? 5,
    lang: params.lang,
  });

  if (events.length === 0) return null;

  // Pick top events (prioritize those with images, more variants)
  const scored = events
    .map((e) => ({
      event: e,
      score: (e.imageUrl ? 10 : 0) + e.variants.length * 2,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, params.maxEvents ?? 5);

  const selected = scored.map((s) => s.event);

  const { title, caption, hashtags } = await generateWeeklyRoundupCaptionAI(
    selected.map((e) => ({
      ...e,
      startDate: e.startDate.toISOString(),
    }))
  );

  const post = await prisma.socialPost.create({
    data: {
      type: "WEEKLY_ROUNDUP",
      title,
      caption,
      hashtags,
      callToAction: "Mais info em athlifyr.com",
      imageUrl: selected[0]?.imageUrl || null,
      status: params.scheduledFor ? "SCHEDULED" : "DRAFT",
      scheduledFor: params.scheduledFor ?? null,
      metadata: {
        eventIds: selected.map((e) => e.id),
        source: "auto-generate-weekly",
      },
      createdById: params.userId,
    },
  });

  await prisma.socialPostLog.create({
    data: {
      postId: post.id,
      action: params.scheduledFor ? "auto-scheduled" : "created",
      details: {
        source: "auto-generate-weekly",
        eventCount: selected.length,
        eventIds: selected.map((e) => e.id),
      },
      userId: params.userId,
    },
  });

  return { id: post.id, title: post.title, eventCount: selected.length };
}

// ─── Generate Last Call Drafts ───────────────────────────────────────────────

export async function generateLastCallDrafts(params: {
  daysUntilDeadline?: number;
  lang?: string;
  userId?: string;
  scheduledFor?: Date;
}): Promise<{ created: number; posts: Array<{ id: string; title: string }> }> {
  const threshold = params.daysUntilDeadline ?? 3;
  const now = new Date();
  const deadlineCutoff = new Date(
    now.getTime() + threshold * 24 * 60 * 60 * 1000
  );

  const events = await prisma.event.findMany({
    where: {
      registrationDeadline: { gte: now, lte: deadlineCutoff },
      cancelled: false,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      startDate: true,
      endDate: true,
      city: true,
      country: true,
      imageUrl: true,
      sportTypes: true,
      registrationDeadline: true,
      translations: {
        where: { language: (params.lang ?? "pt") as never },
        select: { title: true, city: true },
      },
      variants: {
        select: { name: true, distanceKm: true, elevationGainM: true },
        orderBy: { distanceKm: "desc" },
      },
    },
    orderBy: { registrationDeadline: "asc" },
    take: 10,
  });

  if (events.length === 0) return { created: 0, posts: [] };

  const existingIds = await getExistingEventPostIds("LAST_CALL");
  const created: Array<{ id: string; title: string }> = [];

  for (const e of events) {
    if (existingIds.has(e.id)) continue;

    const t = e.translations[0];
    const { title, caption, hashtags } = generateLastCallCaption({
      id: e.id,
      slug: e.slug,
      title: t?.title || e.title,
      city: t?.city || e.city,
      country: e.country,
      startDate: e.startDate.toISOString(),
      sportTypes: e.sportTypes,
      registrationDeadline: e.registrationDeadline?.toISOString(),
      variants: e.variants,
    });

    const post = await prisma.socialPost.create({
      data: {
        type: "LAST_CALL",
        title,
        caption,
        hashtags,
        callToAction: "Não percas — mais info em athlifyr.com",
        imageUrl: e.imageUrl,
        status: params.scheduledFor ? "SCHEDULED" : "DRAFT",
        scheduledFor: params.scheduledFor ?? null,
        metadata: { eventId: e.id, source: "auto-generate-lastcall" },
        createdById: params.userId,
      },
    });

    await prisma.socialPostLog.create({
      data: {
        postId: post.id,
        action: params.scheduledFor ? "auto-scheduled" : "created",
        details: { source: "auto-generate-lastcall", eventId: e.id },
        userId: params.userId,
      },
    });

    created.push({ id: post.id, title: post.title });
  }

  return { created: created.length, posts: created };
}

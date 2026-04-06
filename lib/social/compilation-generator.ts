// ============================================================================
// Weekly Compilation Generator
//
// Fetches upcoming events, generates a visual compilation image,
// uploads it to B2, and creates a SocialPost draft ready for review.
// ============================================================================

import { prisma } from "@/lib/prisma";
import { uploadToB2 } from "@/lib/b2-storage";
import {
  composeCompilationImages,
  type EventForImage,
} from "@/lib/social/image-composer";
import { generateWeeklyRoundupCaptionAI } from "@/lib/social/caption-generator";
import type { Prisma, SportType } from "@prisma/client";

interface CompilationResult {
  id: string;
  title: string;
  imageUrl: string;
  eventCount: number;
  pages: number;
}

/**
 * Generate a weekly compilation post with a visual image.
 * 1. Fetches events for the next N days
 * 2. Generates a compilation image (1080x1350)
 * 3. Uploads image to B2
 * 4. Creates a DRAFT SocialPost
 */
export async function generateWeeklyCompilation(params: {
  days?: number;
  sport?: string;
  country?: string;
  customTitle?: string;
  userId?: string;
  /** If set, auto-schedule the post for this date instead of DRAFT */
  scheduledFor?: Date;
}): Promise<CompilationResult | null> {
  const {
    days = 7,
    sport,
    country,
    customTitle,
    userId,
    scheduledFor,
  } = params;

  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // Fetch upcoming events with translations and variants
  const events = await prisma.event.findMany({
    where: {
      startDate: { gte: now, lte: futureDate },
      cancelled: false,
      ...(sport ? { sportTypes: { has: sport as SportType } } : {}),
      ...(country ? { country } : {}),
    },
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      startDate: true,
      imageUrl: true,
      sportTypes: true,
      translations: {
        where: { language: "pt" as never },
        select: { title: true, city: true },
      },
      variants: {
        select: { name: true, distanceKm: true, elevationGainM: true },
        orderBy: { distanceKm: "desc" as const },
      },
    },
    orderBy: { startDate: "asc" },
  });

  if (events.length === 0) return null;

  // Map to image composer format
  const eventsForImage: EventForImage[] = events.map((e) => ({
    title: e.translations[0]?.title || e.title,
    city: e.translations[0]?.city || e.city,
    startDate: e.startDate.toISOString(),
    imageUrl: e.imageUrl,
    sportTypes: e.sportTypes,
    variants: e.variants.map((v) => ({
      name: v.name,
      distanceKm: v.distanceKm,
    })),
  }));

  // Generate compilation images (may produce multiple pages)
  const imageBuffers = await composeCompilationImages(
    "weekly",
    eventsForImage,
    days,
    customTitle
  );
  if (imageBuffers.length === 0) return null;

  // Upload all pages to B2
  const timestamp = Date.now();
  const uploadResults = await Promise.all(
    imageBuffers.map((buf, i) =>
      uploadToB2({
        file: buf,
        fileName: `weekly-compilation-${timestamp}-p${i + 1}.jpg`,
        contentType: "image/jpeg",
        folder: "instagram",
      })
    )
  );

  // Generate caption via AI (falls back to static if OpenAI unavailable)
  const captionData = await generateWeeklyRoundupCaptionAI(
    events.map((e) => ({
      title: e.translations[0]?.title || e.title,
      city: e.translations[0]?.city || e.city,
      country: e.country,
      startDate: e.startDate.toISOString(),
      sportTypes: e.sportTypes,
      variants: e.variants.map((v) => ({
        name: v.name,
        distanceKm: v.distanceKm,
        elevationGainM: v.elevationGainM,
      })),
    }))
  );

  // Create a single SocialPost with all images (carousel if multiple pages)
  const postStatus = scheduledFor ? "SCHEDULED" : "DRAFT";
  const allUrls = uploadResults.map((r) => r.url);
  const post = await prisma.socialPost.create({
    data: {
      type: "WEEKLY_ROUNDUP",
      title: captionData.title,
      caption: captionData.caption,
      hashtags: captionData.hashtags,
      imageUrl: allUrls[0],
      mediaUrls: allUrls.length > 1 ? allUrls : [],
      status: postStatus,
      scheduledFor: scheduledFor ?? null,
      createdById: userId ?? null,
      metadata: {
        source: "compilation-weekly",
        eventCount: events.length,
        eventIds: events.map((e) => e.id),
        pages: allUrls.length,
        generatedAt: new Date().toISOString(),
        ...(scheduledFor
          ? { autoScheduled: true, scheduledFor: scheduledFor.toISOString() }
          : {}),
      },
    },
  });

  await prisma.socialPostLog.create({
    data: {
      postId: post.id,
      action: scheduledFor ? "auto-scheduled" : "created",
      details: {
        source: "weekly-compilation",
        eventCount: events.length,
        imageUrls: allUrls,
        pages: allUrls.length,
        ...(scheduledFor ? { scheduledFor: scheduledFor.toISOString() } : {}),
      } as Prisma.InputJsonValue,
      userId: userId ?? undefined,
    },
  });

  return {
    id: post.id,
    title: captionData.title,
    imageUrl: allUrls[0],
    eventCount: events.length,
    pages: allUrls.length,
  };
}

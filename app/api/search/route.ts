import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SportType, Language } from "@prisma/client";
import { isOfficialAthlifyrAccount } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface SearchResult {
  type: "event" | "venue" | "user";
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  href: string;
  sportTypes?: SportType[];
  date?: string;
  isOfficial?: boolean;
}

// Helper to validate language
function isValidLanguage(lang: string): lang is Language {
  return ["pt", "en", "es", "fr", "de", "it"].includes(lang);
}

// GET /api/search - Global search for events, venues, and users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const locale = searchParams.get("locale") || "en";
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const normalizedSearch = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Search events with fuzzy matching
    const fuzzyEvents = await prisma.$queryRaw<
      { id: string; max_similarity: number }[]
    >`
      SELECT DISTINCT e.id,
        GREATEST(
          similarity(
            LOWER(
              translate(
                e.title,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ),
          similarity(
            LOWER(
              translate(
                e.city,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ),
          similarity(
            LOWER(e.slug),
            ${normalizedSearch}
          )
        ) AS max_similarity
      FROM "Event" e
      WHERE
        similarity(
          LOWER(
            translate(
              e.title,
              'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
              'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
            )
          ),
          ${normalizedSearch}
        ) > 0.2
        OR similarity(
          LOWER(
            translate(
              e.city,
              'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
              'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
            )
          ),
          ${normalizedSearch}
        ) > 0.2
        OR similarity(
          LOWER(e.slug),
          ${normalizedSearch}
        ) > 0.2
      ORDER BY max_similarity DESC
      LIMIT ${limit}
    `;

    const eventIds = fuzzyEvents.map((e) => e.id);

    // Validate language for translations
    const validLanguage: Language = isValidLanguage(locale)
      ? (locale as Language)
      : "en";

    // Fetch full event data
    const events =
      eventIds.length > 0
        ? await prisma.event.findMany({
            where: { id: { in: eventIds } },
            select: {
              id: true,
              slug: true,
              title: true,
              city: true,
              imageUrl: true,
              sportTypes: true,
              startDate: true,
              translations: {
                where: { language: validLanguage },
                select: { title: true, city: true },
              },
            },
          })
        : [];

    // Sort events by similarity order
    const eventOrderMap = new Map(eventIds.map((id, index) => [id, index]));
    const sortedEvents = events.sort(
      (a, b) =>
        (eventOrderMap.get(a.id) ?? Infinity) -
        (eventOrderMap.get(b.id) ?? Infinity)
    );

    // Search venues with fuzzy matching
    const fuzzyVenues = await prisma.$queryRaw<
      { id: string; max_similarity: number }[]
    >`
      SELECT DISTINCT v.id,
        GREATEST(
          similarity(
            LOWER(
              translate(
                v.name,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ),
          similarity(
            LOWER(
              translate(
                v.city,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ),
          similarity(
            LOWER(v.slug),
            ${normalizedSearch}
          )
        ) AS max_similarity
      FROM "Venue" v
      WHERE v."isActive" = true
        AND (
          similarity(
            LOWER(
              translate(
                v.name,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ) > 0.2
          OR similarity(
            LOWER(
              translate(
                v.city,
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ) > 0.2
          OR similarity(
            LOWER(v.slug),
            ${normalizedSearch}
          ) > 0.2
        )
      ORDER BY max_similarity DESC
      LIMIT ${limit}
    `;

    const venueIds = fuzzyVenues.map((v) => v.id);

    // Fetch full venue data
    const venues =
      venueIds.length > 0
        ? await prisma.venue.findMany({
            where: { id: { in: venueIds } },
            select: {
              id: true,
              slug: true,
              name: true,
              city: true,
              logo: true,
              sportTypes: true,
            },
          })
        : [];

    // Sort venues by similarity order
    const venueOrderMap = new Map(venueIds.map((id, index) => [id, index]));
    const sortedVenues = venues.sort(
      (a, b) =>
        (venueOrderMap.get(a.id) ?? Infinity) -
        (venueOrderMap.get(b.id) ?? Infinity)
    );

    // Search users with fuzzy matching
    const fuzzyUsers = await prisma.$queryRaw<
      { id: string; max_similarity: number }[]
    >`
      SELECT DISTINCT u.id,
        GREATEST(
          similarity(
            LOWER(
              translate(
                COALESCE(u.name, ''),
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          ),
          similarity(
            LOWER(
              translate(
                COALESCE(u.email, ''),
                'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
                'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
              )
            ),
            ${normalizedSearch}
          )
        ) AS max_similarity
      FROM "User" u
      WHERE
        similarity(
          LOWER(
            translate(
              COALESCE(u.name, ''),
              'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
              'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
            )
          ),
          ${normalizedSearch}
        ) > 0.25
        OR similarity(
          LOWER(
            translate(
              COALESCE(u.email, ''),
              'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭİÍÌÎÏĨĪĬıóòôõöōŏőÓÒÔÕÖŌŎŐúùûüũūŭůÚÙÛÜŨŪŬŮçÇñÑ',
              'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiIIIIIIIioooooooOOOOOOOuuuuuuuuUUUUUUUUcCnN'
            )
          ),
          ${normalizedSearch}
        ) > 0.25
      ORDER BY max_similarity DESC
      LIMIT ${limit}
    `;

    const userIds = fuzzyUsers.map((u) => u.id);

    // Fetch full user data
    const users =
      userIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          })
        : [];

    // Sort users by similarity order
    const userOrderMap = new Map(userIds.map((id, index) => [id, index]));
    const sortedUsers = users.sort(
      (a, b) =>
        (userOrderMap.get(a.id) ?? Infinity) -
        (userOrderMap.get(b.id) ?? Infinity)
    );

    // Transform results to unified format
    const results: SearchResult[] = [
      ...sortedEvents.map((event) => ({
        type: "event" as const,
        id: event.id,
        title: event.translations[0]?.title || event.title,
        subtitle: event.translations[0]?.city || event.city,
        image: event.imageUrl,
        href: `/events/${event.slug}`,
        sportTypes: event.sportTypes,
        date: event.startDate.toISOString(),
      })),
      ...sortedVenues.map((venue) => ({
        type: "venue" as const,
        id: venue.id,
        title: venue.name,
        subtitle: venue.city,
        image: venue.logo,
        href: `/venues/${venue.slug}`,
        sportTypes: venue.sportTypes,
      })),
      ...sortedUsers.map((user) => ({
        type: "user" as const,
        id: user.id,
        title: user.name || "User",
        subtitle: user.email?.split("@")[0] || undefined,
        image: user.image,
        href: `/user/${user.id}`,
        isOfficial: isOfficialAthlifyrAccount(user.email),
      })),
    ];

    return NextResponse.json({
      results,
      counts: {
        events: sortedEvents.length,
        venues: sortedVenues.length,
        users: sortedUsers.length,
      },
    });
  } catch (error) {
    console.error("Error in global search:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}

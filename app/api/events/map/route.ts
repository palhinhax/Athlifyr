import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma, SportType } from "@prisma/client";

// Query params schema
const mapEventsSchema = z.object({
  // Bounding box (para viewport do mapa)
  north: z.string().optional(),
  south: z.string().optional(),
  east: z.string().optional(),
  west: z.string().optional(),
  // Ou raio circular
  lat: z.string().optional(),
  lng: z.string().optional(),
  radiusKm: z.string().optional(),
  // Filtros adicionais
  sportType: z.string().optional(),
  startDate: z.string().optional(),
});

/**
 * GET /api/events/map
 * Retorna eventos com coordenadas para mostrar no mapa
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = mapEventsSchema.parse({
      north: searchParams.get("north") ?? undefined,
      south: searchParams.get("south") ?? undefined,
      east: searchParams.get("east") ?? undefined,
      west: searchParams.get("west") ?? undefined,
      lat: searchParams.get("lat") ?? undefined,
      lng: searchParams.get("lng") ?? undefined,
      radiusKm: searchParams.get("radiusKm") ?? undefined,
      sportType: searchParams.get("sportType") ?? undefined,
      startDate: searchParams.get("startDate") ?? undefined,
    });

    // Construir where clause
    const where: Prisma.EventWhereInput = {
      // Apenas eventos com coordenadas
      latitude: { not: null },
      longitude: { not: null },
      // Eventos futuros ou recentes (últimos 7 dias)
      startDate: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    };

    // Filtro por bounding box (viewport do mapa)
    if (params.north && params.south && params.east && params.west) {
      const north = parseFloat(params.north);
      const south = parseFloat(params.south);
      const east = parseFloat(params.east);
      const west = parseFloat(params.west);

      where.latitude = {
        gte: south,
        lte: north,
      };
      where.longitude = {
        gte: west,
        lte: east,
      };
    }

    // Filtro por raio (alternativa ao bounding box)
    // Nota: Para precisão melhor, usar PostGIS, mas para MVP é suficiente
    if (params.lat && params.lng && params.radiusKm) {
      const centerLat = parseFloat(params.lat);
      const centerLng = parseFloat(params.lng);
      const radiusKm = parseFloat(params.radiusKm);

      // Aproximação simplificada (1 grau ≈ 111km)
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));

      where.latitude = {
        gte: centerLat - latDelta,
        lte: centerLat + latDelta,
      };
      where.longitude = {
        gte: centerLng - lngDelta,
        lte: centerLng + lngDelta,
      };
    }

    // Filtro por tipo de desporto
    if (
      params.sportType &&
      Object.values(SportType).includes(params.sportType as SportType)
    ) {
      where.sportTypes = {
        has: params.sportType as SportType,
      };
    }

    // Filtro por data
    if (params.startDate) {
      where.startDate = {
        gte: new Date(params.startDate),
      };
    }

    // Buscar eventos
    const events = await prisma.event.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        sportTypes: true,
        startDate: true,
        city: true,
        latitude: true,
        longitude: true,
        imageUrl: true,
      },
      orderBy: {
        startDate: "asc",
      },
      take: 500, // Limite para performance
    });

    return NextResponse.json({
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        sportTypes: event.sportTypes,
        startDate: event.startDate.toISOString(),
        city: event.city,
        latitude: event.latitude,
        longitude: event.longitude,
        imageUrl: event.imageUrl,
      })),
      count: events.length,
    });
  } catch (error) {
    console.error("Error fetching map events:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

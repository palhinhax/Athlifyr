import { z } from "zod";
import { SportType } from "@prisma/client";

/**
 * Map filter data structures and validation schemas
 */

// Date range mode options
export const DateRangeMode = z.enum([
  "all",
  "today",
  "this_week",
  "this_month",
  "custom",
]);
export type DateRangeMode = z.infer<typeof DateRangeMode>;

// Date range schema
export const DateRangeSchema = z.object({
  mode: DateRangeMode,
  start: z.string().optional(), // ISO date string (YYYY-MM-DD)
  end: z.string().optional(), // ISO date string (YYYY-MM-DD)
});
export type DateRange = z.infer<typeof DateRangeSchema>;

// Price filter options
export const PriceFilter = z.enum(["all", "free", "paid"]);
export type PriceFilter = z.infer<typeof PriceFilter>;

// Sort options
export const SortOption = z.enum(["recommended", "date_asc", "distance_asc"]);
export type SortOption = z.infer<typeof SortOption>;

// Main filters schema
export const MapFiltersSchema = z.object({
  version: z.literal(1).default(1),
  sportIds: z.array(z.nativeEnum(SportType)).default([]),
  dateRange: DateRangeSchema.default({
    mode: "this_month",
  }),
  distanceKm: z.number().min(1).max(500).optional().default(50),
  showPastEvents: z.boolean().default(false),
  textSearch: z.string().optional(),
  price: PriceFilter.default("all"),
  sort: SortOption.default("recommended"),
});

export type MapFilters = z.infer<typeof MapFiltersSchema>;

// Default filters
export const DEFAULT_MAP_FILTERS: MapFilters = {
  version: 1,
  sportIds: [],
  dateRange: {
    mode: "this_month",
  },
  distanceKm: 50,
  showPastEvents: false,
  price: "all",
  sort: "recommended",
};

// API request/response schemas
export const GetMapFiltersResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      filters: MapFiltersSchema,
      updatedAt: z.string(),
    })
    .nullable(),
});

export const PutMapFiltersRequestSchema = z.object({
  deviceId: z.string().uuid().optional(),
  filters: MapFiltersSchema,
  updatedAtClient: z.string().optional(),
});

export const PutMapFiltersResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    filters: MapFiltersSchema,
    updatedAt: z.string(),
  }),
});

export const MigrateMapFiltersRequestSchema = z.object({
  deviceId: z.string().uuid(),
});

export const MigrateMapFiltersResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    filters: MapFiltersSchema,
    updatedAt: z.string(),
  }),
});

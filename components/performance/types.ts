export interface EventResultInfo {
  eventId: string;
  eventSlug: string;
  eventTitle: string | null;
  eventCity: string | null;
  eventDate: string;
  variantName: string | null;
  variantDistanceKm: number | null;
  position: number | null;
  categoryPosition: number | null;
}

export interface PerformanceEntry {
  id: string;
  type: "RUN" | "TRAIL" | "STRENGTH" | "HYROX";
  performedAt: string;
  distanceKm?: number | null;
  timeSeconds?: number | null;
  elevationGainM?: number | null;
  exerciseId?: string | null;
  exerciseName?: string | null;
  weightKg?: number | null;
  reps?: number | null;
  hyroxCategory?: HyroxCategory | null;
  eventResult?: EventResultInfo | null;
}

// HYROX Categories
export type HyroxCategory =
  | "OPEN_MEN"
  | "OPEN_WOMEN"
  | "PRO_MEN"
  | "PRO_WOMEN"
  | "ELITE_15_MEN"
  | "ELITE_15_WOMEN"
  | "DOUBLES_MEN"
  | "DOUBLES_WOMEN"
  | "DOUBLES_MIXED"
  | "RELAY_MEN"
  | "RELAY_WOMEN"
  | "RELAY_MIXED"
  | "AGE_GROUP_16_29_MEN"
  | "AGE_GROUP_16_29_WOMEN"
  | "AGE_GROUP_30_34_MEN"
  | "AGE_GROUP_30_34_WOMEN"
  | "AGE_GROUP_35_39_MEN"
  | "AGE_GROUP_35_39_WOMEN"
  | "AGE_GROUP_40_44_MEN"
  | "AGE_GROUP_40_44_WOMEN"
  | "AGE_GROUP_45_49_MEN"
  | "AGE_GROUP_45_49_WOMEN"
  | "AGE_GROUP_50_54_MEN"
  | "AGE_GROUP_50_54_WOMEN"
  | "AGE_GROUP_55_59_MEN"
  | "AGE_GROUP_55_59_WOMEN"
  | "AGE_GROUP_60_64_MEN"
  | "AGE_GROUP_60_64_WOMEN"
  | "AGE_GROUP_65_69_MEN"
  | "AGE_GROUP_65_69_WOMEN"
  | "AGE_GROUP_70_PLUS_MEN"
  | "AGE_GROUP_70_PLUS_WOMEN"
  | "ADAPTIVE";

export interface HyroxEntry {
  id: string;
  type: "HYROX";
  performedAt: string;
  timeSeconds: number;
  hyroxCategory: HyroxCategory;
  eventName?: string | null;
  location?: string | null;
}

// Category groupings for UI
export const HYROX_CATEGORY_GROUPS = {
  individual: [
    "OPEN_MEN",
    "OPEN_WOMEN",
    "PRO_MEN",
    "PRO_WOMEN",
    "ELITE_15_MEN",
    "ELITE_15_WOMEN",
  ],
  doubles: ["DOUBLES_MEN", "DOUBLES_WOMEN", "DOUBLES_MIXED"],
  relay: ["RELAY_MEN", "RELAY_WOMEN", "RELAY_MIXED"],
  ageGroup: [
    "AGE_GROUP_16_29_MEN",
    "AGE_GROUP_16_29_WOMEN",
    "AGE_GROUP_30_34_MEN",
    "AGE_GROUP_30_34_WOMEN",
    "AGE_GROUP_35_39_MEN",
    "AGE_GROUP_35_39_WOMEN",
    "AGE_GROUP_40_44_MEN",
    "AGE_GROUP_40_44_WOMEN",
    "AGE_GROUP_45_49_MEN",
    "AGE_GROUP_45_49_WOMEN",
    "AGE_GROUP_50_54_MEN",
    "AGE_GROUP_50_54_WOMEN",
    "AGE_GROUP_55_59_MEN",
    "AGE_GROUP_55_59_WOMEN",
    "AGE_GROUP_60_64_MEN",
    "AGE_GROUP_60_64_WOMEN",
    "AGE_GROUP_65_69_MEN",
    "AGE_GROUP_65_69_WOMEN",
    "AGE_GROUP_70_PLUS_MEN",
    "AGE_GROUP_70_PLUS_WOMEN",
  ],
  adaptive: ["ADAPTIVE"],
} as const;

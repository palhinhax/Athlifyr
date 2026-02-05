/**
 * Training Plan Types
 *
 * Types for structured workout programs (training plans)
 */

import type { Prisma } from "@prisma/client";

// ============================================================================
// Training Plan with all relations
// ============================================================================

export type TrainingPlanWithDetails = Prisma.TrainingPlanGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    venue: {
      select: {
        id: true;
        name: true;
        slug: true;
        logo: true;
      };
    };
    weeks: {
      include: {
        workouts: {
          include: {
            workout: {
              include: {
                blocks: {
                  orderBy: {
                    orderIndex: "asc";
                  };
                };
              };
            };
          };
          orderBy: {
            dayOfWeek: "asc";
            orderIndex: "asc";
          };
        };
      };
      orderBy: {
        orderIndex: "asc";
      };
    };
    _count: {
      select: {
        assignedToUsers: true;
      };
    };
  };
}>;

// ============================================================================
// Training Plan Week with Workouts
// ============================================================================

export type TrainingPlanWeekWithWorkouts = Prisma.TrainingPlanWeekGetPayload<{
  include: {
    workouts: {
      include: {
        workout: {
          include: {
            blocks: {
              orderBy: {
                orderIndex: "asc";
              };
            };
          };
        };
      };
      orderBy: {
        dayOfWeek: "asc";
        orderIndex: "asc";
      };
    };
  };
}>;

// ============================================================================
// User Training Plan with Progress
// ============================================================================

export type UserTrainingPlanWithDetails = Prisma.UserTrainingPlanGetPayload<{
  include: {
    plan: {
      include: {
        createdBy: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
        weeks: {
          include: {
            workouts: {
              include: {
                workout: true;
              };
            };
          };
          orderBy: {
            orderIndex: "asc";
          };
        };
      };
    };
    assignedBy: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
  };
}>;

// ============================================================================
// Helper Types
// ============================================================================

export interface TrainingPlanFormData {
  name: string;
  description?: string;
  imageUrl?: string;
  duration?: number; // weeks
  difficulty?: number; // 1-5
  tags: string[];
  isTemplate: boolean;
  isPublic: boolean;
  isPremium: boolean;
  category?: string;
  targetAudience?: string;
  goals: string[];
  requirements: string[];
  venueId?: string;
}

export interface TrainingPlanWeekFormData {
  weekNumber: number;
  name?: string;
  description?: string;
  orderIndex: number;
}

export interface TrainingPlanWorkoutFormData {
  workoutId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  orderIndex: number;
  notes?: string;
}

// ============================================================================
// Calendar/Schedule View Types
// ============================================================================

export interface TrainingPlanDaySchedule {
  dayOfWeek: number;
  dayName: string;
  workouts: Array<{
    id: string;
    workoutId: string;
    workoutName: string;
    estimatedTime?: number;
    difficulty?: number;
    notes?: string;
    orderIndex: number;
  }>;
}

export interface TrainingPlanWeekSchedule {
  weekNumber: number;
  weekName?: string;
  weekDescription?: string;
  days: TrainingPlanDaySchedule[];
}

// ============================================================================
// Progress Tracking Types
// ============================================================================

export interface UserTrainingPlanProgress {
  planId: string;
  planName: string;
  currentWeek: number;
  totalWeeks?: number;
  startDate: Date;
  endDate?: Date;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  completedWorkouts: number;
  totalWorkouts: number;
  completionPercentage: number;
}

// ============================================================================
// Constants
// ============================================================================

export const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const DAY_NAMES_SHORT: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

export const PLAN_CATEGORIES = [
  "CrossFit",
  "Strength",
  "Hypertrophy",
  "Running",
  "Hybrid",
  "Conditioning",
  "Powerlifting",
  "Olympic Weightlifting",
  "Bodybuilding",
  "General Fitness",
] as const;

export const TARGET_AUDIENCES = [
  "Beginners",
  "Intermediate",
  "Advanced",
  "Elite",
  "All Levels",
] as const;

export const COMMON_GOALS = [
  "Lose Weight",
  "Build Muscle",
  "Increase Strength",
  "Improve Endurance",
  "Athletic Performance",
  "General Health",
  "Mobility",
  "Rehabilitation",
] as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate the end date of a training plan based on start date and duration
 */
export function calculatePlanEndDate(
  startDate: Date,
  durationWeeks: number
): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationWeeks * 7);
  return endDate;
}

/**
 * Calculate completion percentage of a training plan
 */
export function calculateCompletionPercentage(
  currentWeek: number,
  totalWeeks?: number
): number {
  if (!totalWeeks || totalWeeks === 0) return 0;
  return Math.min(Math.round((currentWeek / totalWeeks) * 100), 100);
}

/**
 * Get day name from day of week number
 */
export function getDayName(dayOfWeek: number, short: boolean = false): string {
  return short ? DAY_NAMES_SHORT[dayOfWeek] : DAY_NAMES[dayOfWeek];
}

/**
 * Format training plan duration
 */
export function formatPlanDuration(weeks?: number): string {
  if (!weeks) return "Duration not specified";
  if (weeks === 1) return "1 week";
  return `${weeks} weeks`;
}

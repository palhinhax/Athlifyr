// Venue Plan Policy Types

export type PlanDuration =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "ONE_TIME";

export interface VenuePlanPolicy {
  // Duration
  duration: PlanDuration;
  durationValue?: number; // e.g., 3 for 3 months, 6 for 6 months

  // Access Limits
  maxBookingsPerDay?: number; // null = unlimited
  maxBookingsPerWeek?: number; // null = unlimited
  maxBookingsPerMonth?: number; // null = unlimited

  // Time Restrictions
  allowedDays?: string[]; // ["MONDAY", "TUESDAY", ...] null = all days
  allowedStartTimeFrom?: string; // "08:00"
  allowedStartTimeTo?: string; // "22:00"

  // Additional restrictions
  requiresAdvanceBooking?: boolean; // Must book X hours/days in advance
  advanceBookingHours?: number; // e.g., 24 hours
  allowCancellation?: boolean;
  cancellationHours?: number; // Must cancel X hours before
}

// Helper function to calculate end date based on duration
export function calculatePlanEndDate(
  startDate: Date,
  duration: PlanDuration,
  durationValue?: number
): Date {
  const endDate = new Date(startDate);

  switch (duration) {
    case "DAILY":
      endDate.setDate(endDate.getDate() + (durationValue || 1));
      break;
    case "WEEKLY":
      endDate.setDate(endDate.getDate() + 7 * (durationValue || 1));
      break;
    case "MONTHLY":
      endDate.setMonth(endDate.getMonth() + (durationValue || 1));
      break;
    case "QUARTERLY":
      endDate.setMonth(endDate.getMonth() + 3 * (durationValue || 1));
      break;
    case "YEARLY":
      endDate.setFullYear(endDate.getFullYear() + (durationValue || 1));
      break;
    case "ONE_TIME":
      // One-time plans never expire (or set to 100 years)
      endDate.setFullYear(endDate.getFullYear() + 100);
      break;
  }

  return endDate;
}

// Default policy for new plans
export const DEFAULT_PLAN_POLICY: VenuePlanPolicy = {
  duration: "MONTHLY",
  durationValue: 1,
  maxBookingsPerDay: undefined,
  maxBookingsPerWeek: undefined,
  maxBookingsPerMonth: undefined,
  allowedDays: undefined,
  allowedStartTimeFrom: undefined,
  allowedStartTimeTo: undefined,
  requiresAdvanceBooking: false,
  advanceBookingHours: 0,
  allowCancellation: true,
  cancellationHours: 24,
};

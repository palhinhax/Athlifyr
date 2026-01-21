/**
 * Vercel Web Analytics - Custom Events Wrapper
 *
 * This module provides a unified interface for tracking custom events
 * in both client and server environments using Vercel Analytics.
 *
 * Naming Convention: <Category>_<Action>[_<Context>]
 * Examples:
 *   - Signup_Start
 *   - Signup_Completed
 *   - Booking_Completed
 *   - Purchase_Completed
 *
 * Data Constraints:
 *   - Only primitive types: string, number, boolean, null
 *   - No nested objects
 *   - Max 255 characters per value
 *   - Available only on Vercel Pro/Enterprise plans
 */

import { track as trackClient } from "@vercel/analytics";
import { track as trackServer } from "@vercel/analytics/server";

/**
 * List of emails to exclude from analytics tracking
 * Add internal/developer emails here to avoid skewing data
 */
const EXCLUDED_EMAILS = [
  "joao.mduart@gmail.com", // Developer account
];

/**
 * Check if the current user should be excluded from analytics
 * Returns true if user should be excluded
 */
function isExcludedFromAnalytics(): boolean {
  // Client-side: check localStorage for user email
  if (typeof window !== "undefined") {
    try {
      // Check if user email is stored (e.g., from session)
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail && EXCLUDED_EMAILS.includes(userEmail.toLowerCase())) {
        return true;
      }
    } catch {
      // localStorage might not be available
    }
  }

  return false;
}

/**
 * Supported event data types
 */
export type EventData = Record<string, string | number | boolean | null>;

/**
 * Event categories for better organization
 */
export enum EventCategory {
  SIGNUP = "Signup",
  BOOKING = "Booking",
  PURCHASE = "Purchase",
  EVENT = "Event",
  VENUE = "Venue",
  PROFILE = "Profile",
  SOCIAL = "Social",
}

/**
 * Track a custom event in client components
 *
 * @param eventName - Name of the event following naming convention
 * @param data - Optional event data (primitives only, max 255 chars)
 *
 * @example
 * ```tsx
 * import { analyticsEvent } from '@/lib/analytics';
 *
 * function SignupButton() {
 *   return (
 *     <button onClick={() => analyticsEvent('Signup_Click', { location: 'hero' })}>
 *       Sign Up
 *     </button>
 *   );
 * }
 * ```
 */
export function analyticsEvent(eventName: string, data?: EventData): void {
  if (typeof window === "undefined") {
    console.warn(
      "analyticsEvent() called on server. Use trackServerEvent() instead."
    );
    return;
  }

  // Skip tracking for excluded users
  if (isExcludedFromAnalytics()) {
    return;
  }

  try {
    // Validate data constraints
    if (data) {
      validateEventData(data);
    }

    trackClient(eventName, data);
  } catch (error) {
    console.error(`Failed to track event "${eventName}":`, error);
  }
}

/**
 * Track a custom event in server components or API routes
 *
 * @param eventName - Name of the event following naming convention
 * @param data - Optional event data (primitives only, max 255 chars)
 * @param userEmail - Optional user email to check exclusion list (server-side)
 *
 * @example
 * ```tsx
 * import { trackServerEvent } from '@/lib/analytics';
 *
 * export async function POST(request: Request) {
 *   const session = await auth();
 *   // ... signup logic
 *   await trackServerEvent('Signup_Completed', {
 *     method: 'email',
 *     referrer: 'homepage'
 *   }, session?.user?.email);
 * }
 * ```
 */
export async function trackServerEvent(
  eventName: string,
  data?: EventData,
  userEmail?: string | null
): Promise<void> {
  // Skip tracking for excluded users
  if (userEmail && EXCLUDED_EMAILS.includes(userEmail.toLowerCase())) {
    return;
  }

  try {
    // Validate data constraints
    if (data) {
      validateEventData(data);
    }

    await trackServer(eventName, data);
  } catch (error) {
    console.error(`Failed to track server event "${eventName}":`, error);
  }
}

/**
 * Validate event data against Vercel Analytics constraints
 */
function validateEventData(data: EventData): void {
  for (const [key, value] of Object.entries(data)) {
    // Check for null (allowed)
    if (value === null) {
      continue;
    }

    // Check type
    const type = typeof value;
    if (!["string", "number", "boolean"].includes(type)) {
      throw new Error(
        `Invalid data type for key "${key}": ${type}. Only string, number, boolean, and null are allowed.`
      );
    }

    // Check string length
    if (type === "string") {
      const stringValue = value as string;
      if (stringValue.length > 255) {
        throw new Error(
          `Value for key "${key}" exceeds 255 characters (${stringValue.length} chars)`
        );
      }
    }
  }
}

/**
 * Pre-defined event names for common actions
 * Use these constants to ensure consistency across the app
 */
export const ANALYTICS_EVENTS = {
  // Signup events
  SIGNUP_START: "Signup_Start",
  SIGNUP_COMPLETED: "Signup_Completed",
  SIGNUP_FAILED: "Signup_Failed",

  // Booking events
  BOOKING_START: "Booking_Start",
  BOOKING_COMPLETED: "Booking_Completed",
  BOOKING_CANCELLED: "Booking_Cancelled",
  BOOKING_FAILED: "Booking_Failed",

  // Purchase events
  PURCHASE_START: "Purchase_Start",
  PURCHASE_COMPLETED: "Purchase_Completed",
  PURCHASE_FAILED: "Purchase_Failed",

  // Event participation
  EVENT_VIEW: "Event_View",
  EVENT_REGISTER: "Event_Register",
  EVENT_SHARE: "Event_Share",

  // Venue interactions
  VENUE_VIEW: "Venue_View",
  VENUE_JOIN: "Venue_Join",
  VENUE_SUBSCRIBE: "Venue_Subscribe",

  // Profile actions
  PROFILE_UPDATE: "Profile_Update",
  PROFILE_VIEW: "Profile_View",

  // Social interactions
  SOCIAL_FOLLOW: "Social_Follow",
  SOCIAL_POST: "Social_Post",
  SOCIAL_COMMENT: "Social_Comment",
  SOCIAL_LIKE: "Social_Like",

  // Navigation & Homepage interactions
  NAVIGATION_CLICK: "Navigation_Click",
  LOGO_CLICK: "Logo_Click",
  HOMEPAGE_CTA_CLICK: "Homepage_CTA_Click",
  HOMEPAGE_SEEALL_CLICK: "Homepage_SeeAll_Click",
} as const;

/**
 * Type-safe event names
 */
export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Application Constants
 *
 * Centralized constants for the Athlifyr application
 */

/**
 * Official Athlifyr account email
 * This account represents the app itself and has a special profile page
 */
export const ATHLIFYR_OFFICIAL_EMAIL = "hello@athlifyr.com";

/**
 * Check if a user is the official Athlifyr account
 */
export function isOfficialAthlifyrAccount(
  email: string | null | undefined
): boolean {
  if (!email) return false;
  return email.toLowerCase() === ATHLIFYR_OFFICIAL_EMAIL.toLowerCase();
}

/**
 * App store download URLs
 */
export const APP_STORE_URL =
  "https://apps.apple.com/pt/app/athlifyr/id6759297452";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.athlifyr.app";

/** Set to true once the Android app is deployed to Google Play */
export const GOOGLE_PLAY_ENABLED = false;

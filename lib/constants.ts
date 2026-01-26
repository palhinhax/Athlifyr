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

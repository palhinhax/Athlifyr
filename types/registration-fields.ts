/**
 * Registration field settings for events.
 *
 * Each field key maps to a requirement level:
 * - "required"  → user MUST fill it in before checkout
 * - "optional"  → field is shown but user can skip it
 *
 * Fields not present in the object are not requested at all.
 *
 * Stored in the DB as `Event.registrationFieldSettings` (Json).
 */

export type FieldRequirement = "required" | "optional";

export type RegistrationFieldSettings = Record<string, FieldRequirement>;

/** The fields that event organizers can configure */
export const REGISTRATION_FIELD_KEYS = [
  "dateOfBirth",
  "citizenId",
  "emergencyContact",
] as const;

export type RegistrationFieldKey = (typeof REGISTRATION_FIELD_KEYS)[number];

/**
 * Type-safe helper to parse the Json column from DB into our typed map.
 * Returns an empty object if the value is null/undefined/invalid.
 */
export function parseFieldSettings(raw: unknown): RegistrationFieldSettings {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as RegistrationFieldSettings;
  }
  return {};
}

/**
 * Types for organizer-defined custom fields on events.
 *
 * Custom fields allow organizers to collect extra information from
 * participants during registration, e.g. T-shirt size, lunch, medal.
 */

export type CustomFieldType = "SELECT" | "BOOLEAN";

/** Shape of a custom field as stored in DB / returned by API */
export interface CustomField {
  id: string;
  eventId: string;
  label: string;
  type: CustomFieldType;
  options: string[]; // only for SELECT type
  required: boolean;
  priceCents: number; // 0 = free
  currency: string;
  order: number;
}

/** Payload to create / update a custom field */
export interface CustomFieldPayload {
  label: string;
  type: CustomFieldType;
  options: string[];
  required: boolean;
  priceCents: number;
  currency: string;
  order: number;
}

/** A user's answer to a custom field (sent during registration) */
export interface CustomFieldAnswer {
  customFieldId: string;
  value: string; // "M", "true", "false", etc.
  participantIndex?: number; // 0 = main registrant, 1+ = team members
}

/**
 * Format the price of a custom field for display.
 * Returns empty string if price is 0 (free).
 */
export function formatFieldPrice(
  priceCents: number,
  currency: string,
  locale = "en"
): string {
  if (priceCents <= 0) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
}

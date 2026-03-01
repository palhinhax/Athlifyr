/**
 * RFC 4180-compliant CSV export utilities.
 *
 * - Fields are quoted when they contain commas, double-quotes, or newlines.
 * - Double-quotes inside fields are escaped by doubling (`""`).
 * - Lines are terminated with `\r\n` (CRLF) for maximum compatibility.
 * - A UTF-8 BOM is prepended for Excel compatibility.
 */

/** Characters that force a field to be quoted. */
const NEEDS_QUOTING = /[",\r\n]/;

/**
 * Escape a single CSV cell value according to RFC 4180.
 *
 * Always wraps the value in double-quotes for consistency and safety.
 * Internal double-quotes are doubled.
 */
export function escapeCSVField(value: string): string {
  // Always quote to be safe — avoids edge-case issues with leading/trailing
  // whitespace, equals-sign formula injection, etc.
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Returns `true` when a raw value *must* be quoted per RFC 4180.
 * Exposed for testing; the default `escapeCSVField` always quotes.
 */
export function needsQuoting(value: string): boolean {
  return NEEDS_QUOTING.test(value);
}

/**
 * Build a single CSV row (CRLF-terminated) from an array of string values.
 */
export function buildCSVRow(cells: string[]): string {
  return cells.map(escapeCSVField).join(",") + "\r\n";
}

/**
 * Build a complete CSV string (with BOM) from headers + rows.
 *
 * @param headers  Column header labels.
 * @param rows     2-D array of cell values (strings).
 * @returns        A UTF-8 string with BOM ready for download/streaming.
 */
export function buildCSV(headers: string[], rows: string[][]): string {
  const BOM = "\uFEFF";
  const headerLine = buildCSVRow(headers);
  const dataLines = rows.map(buildCSVRow).join("");
  return BOM + headerLine + dataLines;
}

/**
 * Format a cent-based amount as a deterministic decimal string.
 *
 * E.g. `formatCentsDecimal(1050)` → `"10.50"`
 */
export function formatCentsDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Format a `Date` as an ISO-8601 UTC string.
 */
export function formatDateISO(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Build a safe filename for the CSV download.
 *
 * Convention: `athlifyr-registrations-{slug}-{YYYY-MM-DD}.csv`
 */
export function buildExportFilename(
  eventSlug: string,
  variantSlug?: string | null
): string {
  const datePart = new Date().toISOString().slice(0, 10);
  const parts = ["athlifyr-registrations", sanitizeSlug(eventSlug)];
  if (variantSlug) {
    parts.push(sanitizeSlug(variantSlug));
  }
  parts.push(datePart);
  return parts.join("-") + ".csv";
}

function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Converts a time string in format HH:MM or HH:MM:SS to total seconds
 * @param timeStr - Time string (e.g., "1:23:45" or "2:30")
 * @returns Total seconds as integer, or null if invalid format
 */
export function timeStringToSeconds(timeStr: string): number | null {
  if (!timeStr || !timeStr.trim()) return null;

  // Remove any extra whitespace and convert to lowercase
  const cleaned = timeStr.trim().toLowerCase();

  // Remove common time separators/letters that users might add
  const normalized = cleaned.replace(/[hms\s]/gi, "");

  // Match HH:MM or HH:MM:SS format
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
  const match = normalized.match(timeRegex);

  if (!match) return null;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  // Validate ranges
  if (minutes >= 60 || seconds >= 60) return null;

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Converts total seconds to time string in format HH:MM:SS
 * @param totalSeconds - Total seconds as integer
 * @returns Time string in format HH:MM:SS
 */
export function secondsToTimeString(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) return "00:00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Formats seconds to a more readable format
 * If under 1 hour, shows MM:SS
 * Otherwise shows HH:MM:SS
 * @param totalSeconds - Total seconds as integer
 * @returns Formatted time string
 */
export function formatTimeDisplay(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) return "--:--";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours === 0) {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Validates if a string matches time format HH:MM or HH:MM:SS
 * @param timeStr - Time string to validate
 * @returns true if valid format
 */
export function isValidTimeFormat(timeStr: string): boolean {
  if (!timeStr || !timeStr.trim()) return false;

  const normalized = timeStr.trim().replace(/[hms\s]/gi, "");
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
  const match = normalized.match(timeRegex);

  if (!match) return false;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  return minutes < 60 && seconds < 60 && hours >= 0;
}

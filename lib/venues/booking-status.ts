import {
  differenceInMinutes,
  differenceInDays,
  differenceInHours,
  addDays,
  startOfDay,
  parseISO,
} from "date-fns";

export interface BookingTimeStatus {
  // Can the user book this session right now?
  canBook: boolean;
  // Can the user cancel this booking right now?
  canCancel: boolean;
  // Is the session in the past?
  isPast: boolean;
  // Is booking not yet available (too far in advance)?
  isNotYetBookable: boolean;
  // Is it too late to book (within booking deadline)?
  isTooLateToBook: boolean;
  // Is it too late to cancel (within cancellation deadline)?
  isTooLateToCancel: boolean;
  // Message key to display (for translations)
  bookingMessage?: string;
  // When booking becomes available (for countdown)
  bookingAvailableAt?: Date;
  // Time until booking is available (human readable)
  timeUntilBookable?: {
    days?: number;
    hours?: number;
    minutes?: number;
  };
}

export interface BookingTimeStatusParams {
  sessionStartsAt: Date | string;
  bookingAdvanceDays: number; // How many days in advance users can book
  bookingDeadlineMinutes: number; // How many minutes before session booking closes (0 = book until session starts)
  cancellationDeadlineMinutes: number; // How many minutes before session users can cancel
  isBooked?: boolean;
}

/**
 * Calculate the booking time status for a session.
 * This determines whether a user can book/cancel and what message to show.
 *
 * IMPORTANT: Booking and cancellation have different deadlines:
 * - Booking: Cannot book within bookingDeadlineMinutes of session start (0 = book until session starts)
 * - Cancellation: Cannot cancel within cancellationDeadlineMinutes of session start
 */
export function getBookingTimeStatus({
  sessionStartsAt,
  bookingAdvanceDays,
  bookingDeadlineMinutes,
  cancellationDeadlineMinutes,
  isBooked = false,
}: BookingTimeStatusParams): BookingTimeStatus {
  const now = new Date();
  const sessionStart =
    typeof sessionStartsAt === "string"
      ? parseISO(sessionStartsAt)
      : sessionStartsAt;

  // Check if session is in the past
  const isPast = sessionStart <= now;

  // Calculate when booking becomes available
  // If bookingAdvanceDays is 4, then a session on Friday can be booked starting Monday
  const bookingAvailableAt = startOfDay(
    addDays(sessionStart, -bookingAdvanceDays)
  );
  const isNotYetBookable = now < bookingAvailableAt;

  // Calculate minutes until session for deadline checks
  const minutesUntilSession = differenceInMinutes(sessionStart, now);

  // Too late to book if within booking deadline (0 = no deadline, can book until session starts)
  const isTooLateToBook =
    bookingDeadlineMinutes > 0 && minutesUntilSession <= bookingDeadlineMinutes;

  // Too late to cancel if within cancellation deadline
  const isTooLateToCancel = minutesUntilSession <= cancellationDeadlineMinutes;

  // Determine if user can book:
  // - Session not in past
  // - Booking window is open (not too far in advance)
  // - Not within booking deadline
  // - User hasn't already booked
  const canBook = !isPast && !isNotYetBookable && !isTooLateToBook && !isBooked;

  // Determine if user can cancel:
  // - Session not in past
  // - Outside cancellation deadline
  // - User has a booking
  const canCancel = !isPast && !isTooLateToCancel && isBooked;

  // Calculate time until bookable (for display)
  let timeUntilBookable: BookingTimeStatus["timeUntilBookable"];
  if (isNotYetBookable) {
    const daysUntil = differenceInDays(bookingAvailableAt, now);
    const hoursUntil = differenceInHours(bookingAvailableAt, now) % 24;
    const minutesUntil = differenceInMinutes(bookingAvailableAt, now) % 60;

    timeUntilBookable = {
      days: daysUntil,
      hours: hoursUntil,
      minutes: minutesUntil,
    };
  }

  // Determine message key
  let bookingMessage: string | undefined;
  if (isPast) {
    bookingMessage = "sessionPast";
  } else if (isNotYetBookable) {
    bookingMessage = "bookingAvailableIn";
  } else if (isTooLateToBook && !isBooked) {
    // Booking deadline has passed
    bookingMessage = "bookingClosed";
  } else if (isTooLateToCancel && isBooked) {
    // Cancellation deadline has passed
    bookingMessage = "cancellationClosed";
  }

  return {
    canBook,
    canCancel,
    isPast,
    isNotYetBookable,
    isTooLateToBook,
    isTooLateToCancel,
    bookingMessage,
    bookingAvailableAt: isNotYetBookable ? bookingAvailableAt : undefined,
    timeUntilBookable,
  };
}

/**
 * Format the time until booking is available for display
 */
export function formatTimeUntilBookable(
  timeUntilBookable: BookingTimeStatus["timeUntilBookable"],
  translations: {
    days: (count: number) => string;
    hours: (count: number) => string;
    minutes: (count: number) => string;
  }
): string {
  if (!timeUntilBookable) return "";

  const parts: string[] = [];

  if (timeUntilBookable.days && timeUntilBookable.days > 0) {
    parts.push(translations.days(timeUntilBookable.days));
  }

  if (timeUntilBookable.hours && timeUntilBookable.hours > 0) {
    parts.push(translations.hours(timeUntilBookable.hours));
  }

  // Only show minutes if less than 1 day away
  if (
    (!timeUntilBookable.days || timeUntilBookable.days === 0) &&
    timeUntilBookable.minutes &&
    timeUntilBookable.minutes > 0
  ) {
    parts.push(translations.minutes(timeUntilBookable.minutes));
  }

  return parts.join(" ");
}

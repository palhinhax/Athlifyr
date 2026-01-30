import { getRequestConfig } from "next-intl/server";
import { IntlErrorCode } from "next-intl";
import { routing } from "./routing";

/**
 * Load and merge all translation files for a given locale.
 * Uses dynamic imports instead of filesystem operations for serverless compatibility.
 */
async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const messages: Record<string, unknown> = {};

  try {
    // Import all message files for the locale
    const admin = (await import(`@/messages/${locale}/admin.json`)).default;
    const auth = (await import(`@/messages/${locale}/auth.json`)).default;
    const common = (await import(`@/messages/${locale}/common.json`)).default;
    const events = (await import(`@/messages/${locale}/events.json`)).default;
    const feed = (await import(`@/messages/${locale}/feed.json`)).default;
    const home = (await import(`@/messages/${locale}/home.json`)).default;
    const legal = (await import(`@/messages/${locale}/legal.json`)).default;
    const navigation = (await import(`@/messages/${locale}/navigation.json`))
      .default;
    const sports = (await import(`@/messages/${locale}/sports.json`)).default;
    const venues = (await import(`@/messages/${locale}/venues.json`)).default;
    const chat = (await import(`@/messages/${locale}/chat.json`)).default;
    const performance = (await import(`@/messages/${locale}/performance.json`))
      .default;
    const workouts = (await import(`@/messages/${locale}/workouts.json`))
      .default;

    // Merge all messages
    Object.assign(
      messages,
      admin,
      auth,
      common,
      events,
      feed,
      home,
      legal,
      navigation,
      sports,
      venues,
      chat,
      performance,
      workouts
    );
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error);
    throw new Error(
      `Failed to load translation files for locale "${locale}". ` +
        `Please ensure all required message files exist.`
    );
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const requested = await requestLocale;

  // Ensure that the incoming locale is valid
  const locale = routing.locales.includes(
    requested as (typeof routing.locales)[number]
  )
    ? (requested as string)
    : routing.defaultLocale;

  // Load messages using dynamic imports (serverless-compatible)
  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
    // Error handling to prevent infinite re-render loops when a translation key is missing
    onError(error) {
      // In development, log errors to console (but only once per error)
      if (process.env.NODE_ENV === "development") {
        // Only log MISSING_MESSAGE errors once to avoid spam
        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
          console.warn(`[next-intl] Missing translation: ${error.message}`);
        } else {
          console.error("[next-intl] Error:", error);
        }
      }
      // In production, silently handle errors (could send to Sentry if needed)
    },
    // Return the key as fallback when a translation is missing
    getMessageFallback({ namespace, key }) {
      return namespace ? `${namespace}.${key}` : key;
    },
  };
});

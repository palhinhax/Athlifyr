import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export default getRequestConfig(async () => {
  // Try to get locale from cookie first (faster)
  let locale: Locale = defaultLocale;

  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

    if (localeCookie && locales.includes(localeCookie as Locale)) {
      locale = localeCookie as Locale;
    }
  } catch (error) {
    console.error("Error reading locale cookie:", error);
  }

  // Load messages for the determined locale
  try {
    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default,
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    // Fallback to default locale
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default,
    };
  }
});

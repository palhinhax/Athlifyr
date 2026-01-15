import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Our supported locales
export const locales = ["pt", "en", "es", "fr", "de", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

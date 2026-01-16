import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["pt", "en", "es", "fr", "de", "it"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "pt",
  localePrefix: "always",
});

// Navigation APIs that consider routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

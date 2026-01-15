import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use prefix for default locale too (/pt/...)
  localePrefix: "always",
});

export const config = {
  // Match only internationalized pathnames, exclude /promo
  matcher: ["/((?!api|promo|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

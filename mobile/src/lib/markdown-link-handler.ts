import { Linking } from "react-native";
import { router } from "expo-router";

const APP_DOMAINS = ["athlifyr.com", "www.athlifyr.com"];

// Route patterns: maps URL path patterns to expo-router paths
const ROUTE_PATTERNS: Array<{
  pattern: RegExp;
  toRoute: (match: RegExpMatchArray) => string;
}> = [
  {
    // /[locale]/events/[slug] or /events/[slug]
    pattern: /^(?:\/[a-z]{2})?\/events\/([^/?#]+)/,
    toRoute: (match) => `/events/${match[1]}`,
  },
  {
    // /[locale]/user/[id] or /user/[id]
    pattern: /^(?:\/[a-z]{2})?\/user\/([^/?#]+)/,
    toRoute: (match) => `/profile/${match[1]}`,
  },
  {
    // /[locale]/venues/[slug] or /venues/[slug]
    pattern: /^(?:\/[a-z]{2})?\/venues\/([^/?#]+)/,
    toRoute: (match) => `/venues/${match[1]}`,
  },
];

export function handleMarkdownLinkPress(url: string): boolean {
  try {
    const parsed = new URL(url);
    const isAppUrl = APP_DOMAINS.includes(parsed.hostname);

    if (isAppUrl) {
      for (const { pattern, toRoute } of ROUTE_PATTERNS) {
        const match = parsed.pathname.match(pattern);
        if (match) {
          router.push(toRoute(match) as Parameters<typeof router.push>[0]);
          return true;
        }
      }

      // Known app domain but unknown route — still open in-app via Linking
      // to avoid leaving to browser for our own domain
      Linking.openURL(url);
      return true;
    }

    // External URL — open in browser
    Linking.openURL(url);
    return true;
  } catch {
    // Relative URL or invalid — try Linking as fallback
    Linking.openURL(url).catch(() => {});
    return true;
  }
}

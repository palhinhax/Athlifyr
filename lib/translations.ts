/**
 * This file is deprecated.
 * We now use next-intl for translations.
 * Translation files are located in /messages/{locale}/ folders.
 */

export function getTranslations(_locale: string = "pt") {
  console.warn("getTranslations is deprecated. Use next-intl instead.");
  return function t(key: string): string {
    return key;
  };
}

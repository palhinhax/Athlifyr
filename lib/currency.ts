/**
 * Currency formatting utilities
 */

export type Currency = "EUR" | "GBP" | "USD" | "CHF";

const currencySymbols: Record<Currency, string> = {
  EUR: "€",
  GBP: "£",
  USD: "$",
  CHF: "CHF",
};

const currencyLocales: Record<Currency, string> = {
  EUR: "de-DE", // Euro uses comma as decimal separator
  GBP: "en-GB",
  USD: "en-US",
  CHF: "de-CH",
};

/**
 * Format a price with the appropriate currency symbol
 * @param price - The price value
 * @param currency - The currency code (defaults to EUR)
 * @returns Formatted price string with currency symbol
 */
export function formatPrice(price: number, currency: Currency = "EUR"): string {
  const symbol = currencySymbols[currency];
  const locale = currencyLocales[currency];

  // Format the number with 2 decimal places
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  // Position symbol based on currency convention
  if (currency === "EUR") {
    return `${formattedNumber}${symbol}`;
  } else if (currency === "CHF") {
    return `${symbol} ${formattedNumber}`;
  } else {
    return `${symbol}${formattedNumber}`;
  }
}

/**
 * Get the currency symbol for a currency code
 * @param currency - The currency code
 * @returns The currency symbol
 */
export function getCurrencySymbol(currency: Currency = "EUR"): string {
  return currencySymbols[currency];
}

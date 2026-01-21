import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import fs from "fs";
import path from "path";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const requested = await requestLocale;

  // Ensure that the incoming locale is valid
  const locale = routing.locales.includes(
    requested as (typeof routing.locales)[number]
  )
    ? (requested as string)
    : routing.defaultLocale;

  // Load messages from modular structure
  const localeDir = path.join(process.cwd(), "messages", locale);

  // Ensure the locale directory exists
  if (!fs.existsSync(localeDir) || !fs.statSync(localeDir).isDirectory()) {
    throw new Error(
      `Messages directory not found for locale "${locale}". ` +
        `Expected directory at: ${localeDir}`
    );
  }

  // Load all JSON files from the locale folder and merge them
  const files = fs
    .readdirSync(localeDir)
    .filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    throw new Error(
      `No translation files found for locale "${locale}" in ${localeDir}`
    );
  }

  const messages = {};
  for (const file of files) {
    const fileMessages = JSON.parse(
      fs.readFileSync(path.join(localeDir, file), "utf-8")
    );
    Object.assign(messages, fileMessages);
  }

  return {
    locale,
    messages,
  };
});

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

  // Check if modular structure exists
  const localeDir = path.join(process.cwd(), "messages", locale);
  const hasModularStructure =
    fs.existsSync(localeDir) && fs.statSync(localeDir).isDirectory();

  let messages;

  if (hasModularStructure) {
    // Load all JSON files from the locale folder and merge them
    const files = fs
      .readdirSync(localeDir)
      .filter((file) => file.endsWith(".json"));

    messages = {};
    for (const file of files) {
      const fileMessages = JSON.parse(
        fs.readFileSync(path.join(localeDir, file), "utf-8")
      );
      Object.assign(messages, fileMessages);
    }
  } else {
    // Fallback to monolithic file (backwards compatibility)
    messages = (await import(`../messages/${locale}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});

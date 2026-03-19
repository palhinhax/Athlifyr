"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";
import { analyticsEvent } from "@/lib/analytics";

const SUPPORTED_BADGE_LOCALES = ["pt", "en", "es", "fr", "de", "it"] as const;
const FALLBACK_LOCALE = "en";

function getBadgeLocale(locale: string): string {
  if (
    SUPPORTED_BADGE_LOCALES.includes(
      locale as (typeof SUPPORTED_BADGE_LOCALES)[number]
    )
  ) {
    return locale;
  }
  return FALLBACK_LOCALE;
}

const STORE_BADGES = [
  {
    key: "appStore" as const,
    folder: "app-store",
    url: APP_STORE_URL,
    altKey: "appStoreAlt" as const,
  },
  {
    key: "googlePlay" as const,
    folder: "google-play",
    url: GOOGLE_PLAY_URL,
    altKey: "googlePlayAlt" as const,
  },
] as const;

export function AppDownloadSection() {
  const locale = useLocale();
  const t = useTranslations("home");
  const badgeLocale = getBadgeLocale(locale);

  return (
    <section className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl"
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {STORE_BADGES.map((badge) => (
            <motion.a
              key={badge.key}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="transition-opacity hover:opacity-90"
              onClick={() =>
                analyticsEvent("Homepage_AppDownload_Click", {
                  store: badge.key,
                })
              }
            >
              <Image
                src={`/badges/${badge.folder}/${badgeLocale}.svg`}
                alt={t(badge.altKey)}
                width={180}
                height={60}
                className="h-[50px] w-auto sm:h-[55px] md:h-[60px]"
                unoptimized
              />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

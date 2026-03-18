"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
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
    <section className="container py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-gradient-to-br from-accent/5 via-background to-accent/10 p-8 shadow-sm md:p-12"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Smartphone className="h-6 w-6 text-accent" />
          </div>

          <h2 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
            {t("appDownloadTitle")}
          </h2>

          <p className="mb-8 max-w-lg text-muted-foreground md:text-lg">
            {t("appDownloadDescription")}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
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
        </div>
      </motion.div>
    </section>
  );
}

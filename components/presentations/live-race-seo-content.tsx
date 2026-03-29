"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Trophy,
  Users,
  Bell,
  Route,
  ClipboardList,
  Radio,
} from "lucide-react";

export function LiveRaceSEOContent() {
  const t = useTranslations("liveRacePresentation.seoContent");

  const highlights = [
    { icon: MapPin, title: "GPS Tracking" },
    { icon: Trophy, title: "Live Leaderboard" },
    { icon: ClipboardList, title: "Registration" },
    { icon: Users, title: "Spectator Experience" },
    { icon: Bell, title: "Real-time Alerts" },
    { icon: Route, title: "Route Editor" },
    { icon: Radio, title: "Live Updates" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4" variant="secondary">
            {t("badge")}
          </Badge>
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">
            {t("title")}
          </h2>
        </motion.div>

        {/* SEO paragraphs — server-rendered, visible, crawlable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-4xl"
        >
          <div className="prose prose-lg mx-auto dark:prose-invert">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("paragraph1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("paragraph2")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("paragraph3")}
            </p>
          </div>
        </motion.div>

        {/* Feature icon row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {highlights.map((h, i) => {
            const HIcon = h.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                  <HIcon className="h-4 w-4 text-orange-500" />
                </div>
                <span className="font-medium text-muted-foreground">
                  {h.title}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

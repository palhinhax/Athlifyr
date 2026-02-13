"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  CreditCard,
  Dumbbell,
  Globe,
  BarChart3,
  Bell,
  Trophy,
} from "lucide-react";

export function VenueSEOContent() {
  const t = useTranslations("presentation.seoContent");

  const features = [
    {
      icon: Calendar,
      title: t("feature1Title"),
      description: t("feature1Desc"),
    },
    {
      icon: Users,
      title: t("feature2Title"),
      description: t("feature2Desc"),
    },
    {
      icon: CreditCard,
      title: t("feature3Title"),
      description: t("feature3Desc"),
    },
    {
      icon: Dumbbell,
      title: t("feature4Title"),
      description: t("feature4Desc"),
    },
    {
      icon: Globe,
      title: t("feature5Title"),
      description: t("feature5Desc"),
    },
    {
      icon: BarChart3,
      title: t("feature6Title"),
      description: t("feature6Desc"),
    },
    {
      icon: Bell,
      title: t("feature7Title"),
      description: t("feature7Desc"),
    },
    {
      icon: Trophy,
      title: t("feature8Title"),
      description: t("feature8Desc"),
    },
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

        {/* Main SEO content paragraph - server-rendered, visible, crawlable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-4xl"
        >
          <div className="prose prose-lg dark:prose-invert mx-auto">
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

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional SEO paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("paragraph4")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("paragraph5")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

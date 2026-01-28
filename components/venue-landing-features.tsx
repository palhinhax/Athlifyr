"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Users,
  Calendar,
  CreditCard,
  UserPlus,
  Globe,
  Wallet,
} from "lucide-react";

export function VenueLandingFeatures() {
  const t = useTranslations("venues.landing.features");

  const features = [
    {
      icon: Users,
      title: t("clients.title"),
      description: t("clients.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: t("schedule.title"),
      description: t("schedule.description"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: CreditCard,
      title: t("subscriptions.title"),
      description: t("subscriptions.description"),
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: UserPlus,
      title: t("team.title"),
      description: t("team.description"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Wallet,
      title: t("payments.title"),
      description: t("payments.description"),
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Globe,
      title: t("community.title"),
      description: t("community.description"),
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
            />

            {/* Icon */}
            <div
              className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white`}
            >
              <feature.icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

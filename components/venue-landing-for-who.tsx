"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Building2,
  Dumbbell,
  Heart,
  User,
  Sparkles,
  Users,
} from "lucide-react";

export function VenueLandingForWho() {
  const t = useTranslations("venues.landing.forWho");

  const categories = [
    {
      icon: Building2,
      title: t("gyms.title"),
      description: t("gyms.description"),
      color: "bg-blue-500",
    },
    {
      icon: Dumbbell,
      title: t("crossfit.title"),
      description: t("crossfit.description"),
      color: "bg-orange-500",
    },
    {
      icon: Heart,
      title: t("studios.title"),
      description: t("studios.description"),
      color: "bg-pink-500",
    },
    {
      icon: User,
      title: t("personalTrainers.title"),
      description: t("personalTrainers.description"),
      color: "bg-green-500",
    },
    {
      icon: Sparkles,
      title: t("massage.title"),
      description: t("massage.description"),
      color: "bg-purple-500",
    },
    {
      icon: Users,
      title: t("clubs.title"),
      description: t("clubs.description"),
      color: "bg-indigo-500",
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group flex items-start gap-4 rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color} text-white transition-transform group-hover:scale-110`}
            >
              <category.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-1 font-bold">{category.title}</h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

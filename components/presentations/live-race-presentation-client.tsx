"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Trophy,
  Users,
  Bell,
  Route,
  Radio,
  ClipboardList,
  Video,
  Check,
  ArrowRight,
  Zap,
  Globe,
  Heart,
  Shield,
  Mountain,
  Bike,
  Timer,
  Waves,
  Target,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Link from "next/link";

/* -------------------------------------------------------------------------
   Animated counter for the stats section
   ------------------------------------------------------------------------- */
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className="tabular-nums">
      {isInView ? `${prefix}${end.toLocaleString()}${suffix}` : "0"}
    </span>
  );
}

/* -------------------------------------------------------------------------
   Feature section — alternating layout (image-left / image-right)
   ------------------------------------------------------------------------- */
function FeatureSection({
  badge,
  title,
  description,
  points,
  icon: Icon,
  index,
  comingSoon,
}: {
  badge: string;
  title: string;
  description: string;
  points: string[];
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  index: number;
  comingSoon?: boolean;
}) {
  const isEven = index % 2 === 0;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col items-center gap-12 lg:flex-row ${isEven ? "" : "lg:flex-row-reverse"}`}
        >
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <Badge
              className="mb-4 gap-1"
              variant={comingSoon ? "outline" : "secondary"}
            >
              <Icon className="h-3 w-3" />
              {badge}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
            <p className="mb-8 text-lg text-muted-foreground">{description}</p>

            <div className="space-y-4">
              {points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-sm sm:text-base">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Illustration card */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-1 justify-center"
          >
            <div className="relative flex h-[320px] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-muted/60 to-muted/30 shadow-lg">
              {comingSoon && (
                <div className="absolute right-4 top-4 z-10">
                  <Badge variant="outline" className="animate-pulse">
                    Coming Soon
                  </Badge>
                </div>
              )}
              <Icon
                className="h-24 w-24 text-muted-foreground/30"
                strokeWidth={1}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Main presentation client
   ------------------------------------------------------------------------- */
export function LiveRacePresentationClient() {
  const t = useTranslations("liveRacePresentation");

  const scrollToContent = () => {
    const element = document.getElementById("why-athlifyr");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ------ Feature definitions ------ */
  const features = [
    {
      key: "liveTracking",
      icon: MapPin,
    },
    {
      key: "leaderboard",
      icon: Trophy,
    },
    {
      key: "registration",
      icon: ClipboardList,
    },
    {
      key: "spectators",
      icon: Users,
    },
    {
      key: "alerts",
      icon: Bell,
    },
    {
      key: "routeEditor",
      icon: Route,
    },
    {
      key: "liveStream",
      icon: Video,
      comingSoon: true,
    },
  ];

  /* ------ Event type definitions ------ */
  const eventTypes = [
    { key: "trail", icon: Mountain, color: "from-green-500 to-emerald-600" },
    { key: "road", icon: Timer, color: "from-blue-500 to-cyan-600" },
    { key: "btt", icon: Bike, color: "from-amber-500 to-orange-600" },
    { key: "cycling", icon: Bike, color: "from-red-500 to-rose-600" },
    { key: "ocr", icon: Target, color: "from-purple-500 to-violet-600" },
    { key: "triathlon", icon: Waves, color: "from-teal-500 to-cyan-600" },
  ];

  /* ------ Why free reasons ------ */
  const whyFreeReasons = [
    { key: "reason1", icon: Heart },
    { key: "reason2", icon: Users },
    { key: "reason3", icon: Shield },
    { key: "reason4", icon: Globe },
  ];

  /* ------ Steps ------ */
  const steps = [
    { key: "step1", step: 1 },
    { key: "step2", step: 2 },
    { key: "step3", step: 3 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 gap-1 border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20">
              <Radio className="h-3 w-3 animate-pulse" />
              {t("hero.badge")}
            </Badge>

            <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-white">{t("hero.h1Primary")}</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t("hero.h1Secondary")}
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl px-4 text-base text-zinc-300 sm:text-xl">
              {t("hero.description")}
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                asChild
              >
                <Link href="/events/create">
                  {t("hero.cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/20 text-white hover:bg-white/10"
                onClick={scrollToContent}
              >
                {t("hero.ctaSecondary")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-6 text-sm font-medium text-orange-400">
              <Zap className="mb-0.5 mr-1 inline-block h-4 w-4" />
              {t("hero.free")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          STATS BAR
          ================================================================ */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: 250, suffix: "+", label: t("stats.events") },
              { value: 15000, suffix: "+", label: t("stats.athletes") },
              { value: 6, suffix: "", label: t("stats.countries") },
              {
                value: 99.9,
                suffix: "%",
                label: t("stats.uptime"),
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl font-bold md:text-3xl">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          WHY ATHLIFYR — overview
          ================================================================ */}
      <section id="why-athlifyr" className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <Zap className="h-3 w-3" />
              {t("whyAthlifyr.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("whyAthlifyr.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {t("whyAthlifyr.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          FEATURE SECTIONS — alternating left/right
          ================================================================ */}
      {features.map((feat, idx) => (
        <FeatureSection
          key={feat.key}
          badge={t(`features.${feat.key}.badge`)}
          title={t(`features.${feat.key}.title`)}
          description={t(`features.${feat.key}.description`)}
          points={[
            t(`features.${feat.key}.point1`),
            t(`features.${feat.key}.point2`),
            t(`features.${feat.key}.point3`),
            t(`features.${feat.key}.point4`),
          ]}
          icon={feat.icon}
          index={idx}
          comingSoon={feat.comingSoon}
        />
      ))}

      {/* ================================================================
          EVENT TYPES
          ================================================================ */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <Globe className="h-3 w-3" />
              {t("eventTypes.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("eventTypes.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("eventTypes.description")}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((ev, i) => {
              const EvIcon = ev.icon;
              return (
                <motion.div
                  key={ev.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div
                        className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${ev.color} p-3`}
                      >
                        <EvIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold">
                        {t(`eventTypes.${ev.key}`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`eventTypes.${ev.key}Desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <ArrowRight className="h-3 w-3" />
              {t("howItWorks.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("howItWorks.description")}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-2xl font-black text-white shadow-lg shadow-orange-500/25">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-bold">
                  {t(`howItWorks.${s.key}Title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`howItWorks.${s.key}Desc`)}
                </p>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-[calc(100%-4rem)] translate-x-1/2 bg-gradient-to-r from-orange-500/30 to-transparent md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          WHY FREE
          ================================================================ */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <Zap className="h-3 w-3" />
              {t("whyFree.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("whyFree.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("whyFree.description")}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {whyFreeReasons.map((r, i) => {
              const RIcon = r.icon;
              return (
                <motion.div
                  key={r.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                        <RIcon className="h-5 w-5 text-orange-500" />
                      </div>
                      <h3 className="mb-2 font-bold">
                        {t(`whyFree.${r.key}Title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`whyFree.${r.key}Desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA
          ================================================================ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
              {t("cta.description")}
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="gap-2 bg-white text-orange-600 shadow-lg hover:bg-white/90"
                asChild
              >
                <Link href="/events/create">
                  {t("cta.button")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">{t("cta.secondary")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

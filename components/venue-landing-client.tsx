"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Instagram,
  Mail,
  Eye,
  Settings2,
} from "lucide-react";
import { VenueLandingFAQ } from "@/components/venue-landing-faq";
import { VenueLandingFeatures } from "@/components/venue-landing-features";
import { VenueLandingForWho } from "@/components/venue-landing-for-who";
import { useRef, useEffect } from "react";

interface VenueLandingClientProps {
  locale: string;
}

export function VenueLandingClient({
  locale: _locale,
}: VenueLandingClientProps) {
  const t = useTranslations("venues.landing");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, probably due to browser policy
        // Video will remain paused
      });
    }
  }, []);

  const scrollToContent = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/promo/crossfit-workout.mp4"
            muted
            loop
            playsInline
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Title */}
            <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t("hero.title")}
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl md:text-2xl">
              {t("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="min-w-[200px] gap-2 text-lg font-bold"
              >
                <Link href="/auth/signup">
                  {t("cta.primary")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={scrollToContent}
          >
            <ChevronDown className="h-8 w-8 text-white/70" />
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              {t("mission.title")}
            </h2>
            <p className="mb-4 text-lg text-muted-foreground md:text-xl">
              {t("mission.description")}
            </p>
            <p className="text-lg font-semibold text-primary">
              {t("mission.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Choose Your Path Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("choosePath.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("choosePath.subtitle")}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {/* Simple Profile Option */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3 text-white">
                  <Eye className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-2xl font-bold">
                  {t("choosePath.simple.title")}
                </h3>
                <p className="mb-6 text-muted-foreground">
                  {t("choosePath.simple.description")}
                </p>

                <ul className="mb-8 space-y-3">
                  {[
                    t("choosePath.simple.point1"),
                    t("choosePath.simple.point2"),
                    t("choosePath.simple.point3"),
                    t("choosePath.simple.point4"),
                  ].map((point, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="w-full gap-2">
                  <Link href="/auth/signup">
                    {t("choosePath.simple.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Full Management Option */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border-2 border-primary bg-card p-8 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-primary to-primary/60 p-3 text-white">
                  <Settings2 className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-2xl font-bold">
                  {t("choosePath.full.title")}
                </h3>
                <p className="mb-6 text-muted-foreground">
                  {t("choosePath.full.description")}
                </p>

                <ul className="mb-8 space-y-3">
                  {[
                    t("choosePath.full.point1"),
                    t("choosePath.full.point2"),
                    t("choosePath.full.point3"),
                    t("choosePath.full.point4"),
                    t("choosePath.full.point5"),
                  ].map((point, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full gap-2">
                  <Link href="/auth/signup">
                    {t("choosePath.full.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-20">
        <VenueLandingFeatures />
      </section>

      {/* For Who Section */}
      <section className="bg-muted/30 py-20">
        <VenueLandingForWho />
      </section>

      {/* Why Free Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
              <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">
                {t("whyFree.title")}
              </h2>
              <p className="mb-8 text-center text-lg text-muted-foreground">
                {t("whyFree.description")}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  t("whyFree.point1"),
                  t("whyFree.point2"),
                  t("whyFree.point3"),
                  t("whyFree.point4"),
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 rounded-lg bg-background/50 p-4"
                  >
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="font-medium">{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Temporarily hidden until we have accurate data */}
      {/* <section className="border-y bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "100+", label: t("stats.venues") },
              { value: "5,000+", label: t("stats.athletes") },
              { value: "10,000+", label: t("stats.sessions") },
              { value: "6", label: t("stats.countries") },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-black text-primary md:text-4xl lg:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-20">
        <VenueLandingFAQ />
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              {t("finalCta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
              {t("finalCta.subtitle")}
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="gap-2 text-lg font-bold"
            >
              <Link href="/auth/signup">
                {t("finalCta.button")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            {/* Contact Info */}
            <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/20 pt-8 sm:flex-row sm:justify-center sm:gap-8">
              <p className="text-sm opacity-80">{t("finalCta.questions")}</p>
              <div className="flex items-center gap-6">
                <a
                  href="https://instagram.com/athlifyr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                >
                  <Instagram className="h-5 w-5" />
                  @athlifyr
                </a>
                <a
                  href="mailto:hello@athlifyr.com"
                  className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                >
                  <Mail className="h-5 w-5" />
                  hello@athlifyr.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

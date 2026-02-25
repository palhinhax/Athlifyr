"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Camera,
  Activity,
  Dumbbell,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp,
  Play,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoAnalysisUpload } from "@/components/video-analysis-upload";
import { analyticsEvent } from "@/lib/analytics";
import * as Sentry from "@sentry/nextjs";

type AnalysisType = "motion" | "lift";

export function VideoAnalysisPageClient() {
  const t = useTranslations("videoAnalysisPage");
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSelectType = (type: AnalysisType) => {
    setAnalysisType(type);
    analyticsEvent("VideoAnalysisPage_Type_Selected", { type });
    Sentry.metrics.count("analysis_type_selected", 1, {
      attributes: { type, source: "page" },
    });
  };

  const faqItems = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 pb-16 pt-12 md:pb-24 md:pt-20">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="default"
            className="mb-6 gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md"
          >
            <Zap className="h-3 w-3" />
            {t("hero.badge")}
          </Badge>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t("hero.title")}
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t("hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => handleSelectType("motion")}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 px-8 text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
            >
              <Activity className="h-5 w-5" />
              {t("hero.ctaMotion")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleSelectType("lift")}
              className="gap-2 border-orange-300 px-8 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30"
            >
              <Dumbbell className="h-5 w-5" />
              {t("hero.ctaLift")}
            </Button>
          </div>

          {/* Trust signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-500" />
              {t("hero.trustFree")}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-500" />
              {t("hero.trustLanguages")}
            </span>
            <span className="flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-purple-500" />
              {t("hero.trustFormats")}
            </span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              {t("howItWorks.description")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(["step1", "step2", "step3"] as const).map((step, i) => (
              <div
                key={step}
                className="relative flex flex-col items-center rounded-2xl border border-border/60 bg-background p-6 text-center shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-md">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {t(`howItWorks.${step}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`howItWorks.${step}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYSIS TYPES ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("types.title")}
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              {t("types.description")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Motion Analysis Card */}
            <div className="group flex flex-col rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-8 shadow-sm transition-all hover:shadow-md dark:border-blue-900 dark:from-blue-950/40 dark:to-indigo-950/20">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <Activity className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-100">
                {t("types.motion.title")}
              </h3>
              <p className="mb-5 flex-1 text-sm text-blue-700 dark:text-blue-300">
                {t("types.motion.description")}
              </p>
              <ul className="mb-6 space-y-2 text-sm text-blue-700 dark:text-blue-300">
                {[
                  t("types.motion.f1"),
                  t("types.motion.f2"),
                  t("types.motion.f3"),
                  t("types.motion.f4"),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelectType("motion")}
                className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Play className="h-4 w-4" />
                {t("types.motion.cta")}
              </Button>
            </div>

            {/* Lift Analysis Card */}
            <div className="group flex flex-col rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/80 to-red-50/50 p-8 shadow-sm transition-all hover:shadow-md dark:border-orange-900 dark:from-orange-950/40 dark:to-red-950/20">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                <Dumbbell className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-orange-900 dark:text-orange-100">
                {t("types.lift.title")}
              </h3>
              <p className="mb-5 flex-1 text-sm text-orange-700 dark:text-orange-300">
                {t("types.lift.description")}
              </p>
              <ul className="mb-6 space-y-2 text-sm text-orange-700 dark:text-orange-300">
                {[
                  t("types.lift.f1"),
                  t("types.lift.f2"),
                  t("types.lift.f3"),
                  t("types.lift.f4"),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelectType("lift")}
                variant="outline"
                className="w-full gap-2 border-orange-400 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950"
              >
                <Play className="h-4 w-4" />
                {t("types.lift.cta")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPORTS ── */}
      <section className="bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("sports.title")}
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              {t("sports.description")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              t("sports.crossfit"),
              t("sports.weightlifting"),
              t("sports.powerlifting"),
              t("sports.running"),
              t("sports.swimming"),
              t("sports.cycling"),
              t("sports.gymnastics"),
              t("sports.football"),
              t("sports.basketball"),
              t("sports.tennis"),
              t("sports.yoga"),
              t("sports.martialArts"),
            ].map((sport) => (
              <span
                key={sport}
                className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                {sport}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("faq.title")}
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-foreground hover:bg-muted/30"
                >
                  {item.q}
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="border-t border-border/40 px-6 py-4 text-sm text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-16 text-white md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Camera className="mx-auto mb-4 h-12 w-12 opacity-90" />
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mb-8 text-lg text-blue-100">{t("cta.description")}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => handleSelectType("motion")}
              className="gap-2 bg-white px-8 text-blue-700 hover:bg-blue-50"
            >
              <Activity className="h-5 w-5" />
              {t("cta.ctaMotion")}
            </Button>
            <Button
              size="lg"
              onClick={() => handleSelectType("lift")}
              variant="outline"
              className="gap-2 border-white/60 px-8 text-white hover:bg-white/10"
            >
              <Dumbbell className="h-5 w-5" />
              {t("cta.ctaLift")}
            </Button>
          </div>
        </div>
      </section>

      {/* ── VIDEO ANALYSIS DIALOG ── */}
      {analysisType && (
        <VideoAnalysisUpload
          type={analysisType}
          open={!!analysisType}
          onOpenChange={(open) => {
            if (!open) setAnalysisType(null);
          }}
          onSuccess={() => {
            analyticsEvent("VideoAnalysisPage_Success", {
              type: analysisType,
            });
            Sentry.metrics.count("analysis_completed", 1, {
              attributes: { type: analysisType, source: "page" },
            });
          }}
        />
      )}
    </main>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Users,
  Dumbbell,
  Clock,
  Check,
  Smartphone,
  Monitor,
  Instagram,
  ArrowRight,
  Timer,
  Trophy,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Flag,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WallClock } from "@/components/wall-clock/wall-clock";
import { HyroxEventCardDemo } from "@/components/featured-event-card";
import { useTranslations } from "next-intl";
import Link from "next/link";

// Tabata timer hook
function useTabataTimer(isVisible: boolean) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [seconds, setSeconds] = useState(20);
  const [status, setStatus] = useState<
    "idle" | "running" | "paused" | "done" | "preparing"
  >("idle");

  const totalRounds = 8;
  const workTime = 20;
  const restTime = 10;

  useEffect(() => {
    if (isVisible && !hasStarted) {
      const timeout = setTimeout(() => {
        setHasStarted(true);
        setIsRunning(true);
        setStatus("running");
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, hasStarted]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (phase === "work") {
            setPhase("rest");
            return restTime;
          } else {
            if (currentRound >= totalRounds) {
              setIsRunning(false);
              setStatus("done");
              return 0;
            } else {
              setCurrentRound(currentRound + 1);
              setPhase("work");
              return workTime;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, currentRound]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setHasStarted(false);
    setCurrentRound(1);
    setPhase("work");
    setSeconds(20);
    setStatus("idle");
  }, []);

  const restart = useCallback(() => {
    reset();
    setTimeout(() => {
      setHasStarted(true);
      setIsRunning(true);
      setStatus("running");
    }, 100);
  }, [reset]);

  return {
    currentRound,
    totalRounds,
    phase,
    seconds,
    status,
    isRunning,
    restart,
    isWarning: seconds <= 3 && isRunning,
  };
}

// Tabata Timer Section Component with WallClock
function TabataTimerSection() {
  const t = useTranslations("presentation.timer");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const timer = useTabataTimer(isInView);

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 gap-1" variant="secondary">
            <Timer className="h-3 w-3" />
            {t("title")}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative flex h-[120px] w-full items-center justify-center sm:h-[150px] md:h-[180px] lg:h-[210px]">
            <div className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100">
              <WallClock
                size="xl"
                timerMode={{
                  seconds: timer.seconds,
                  status: timer.status,
                  phase: timer.phase,
                  modeLabel: `TABATA x${timer.totalRounds}`,
                  leftDisplayValue: timer.currentRound,
                  isWarning: timer.isWarning,
                }}
              />
            </div>
          </div>

          {timer.status === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button
                onClick={timer.restart}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t("restart")}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function VenuePresentationClient() {
  const t = useTranslations("presentation");

  const scrollToContent = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0 bg-zinc-900">
          {/* Desktop video (landscape) */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hidden h-full w-full object-cover md:block"
          >
            <source src="/promo/crossfit-workout.mp4" type="video/mp4" />
          </video>
          {/* Mobile video (portrait) */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="block h-full w-full object-cover md:hidden"
          >
            <source src="/promo/crossfit-workout.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="min-w-[200px] gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-lg font-bold hover:from-orange-600 hover:to-red-600"
                onClick={scrollToContent}
              >
                {t("hero.cta")}
                <Play className="h-5 w-5" />
              </Button>
              <Badge
                variant="outline"
                className="border-green-500/50 bg-green-500/10 px-4 py-2 text-green-400"
              >
                <Check className="mr-1 h-4 w-4" />
                {t("hero.free")}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Athlifyr Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge className="mb-4" variant="secondary">
              {t("whatIs.badge")}
            </Badge>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              {t("whatIs.title")}
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              {t("whatIs.description")}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Calendar,
                title: t("whatIs.scheduling"),
                description: t("whatIs.schedulingDesc"),
                color: "bg-blue-500",
              },
              {
                icon: Users,
                title: t("whatIs.community"),
                description: t("whatIs.communityDesc"),
                color: "bg-purple-500",
              },
              {
                icon: Dumbbell,
                title: t("whatIs.exercises"),
                description: t("whatIs.exercisesDesc"),
                color: "bg-orange-500",
              },
              {
                icon: Zap,
                title: t("whatIs.easyBook"),
                description: t("whatIs.easyBookDesc"),
                color: "bg-green-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none bg-gradient-to-br from-muted/50 to-muted/30 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} text-white`}
                    >
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Booking Demo */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <Smartphone className="h-3 w-3" />
                {t("mobileBooking.badge")}
              </Badge>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {t("mobileBooking.title", {
                  seconds: t("mobileBooking.seconds"),
                })}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {t("mobileBooking.description")}
              </p>

              <div className="space-y-4">
                {[
                  t("mobileBooking.point1"),
                  t("mobileBooking.point2"),
                  t("mobileBooking.point3"),
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-sm sm:text-base">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="relative mx-auto w-[280px] overflow-hidden rounded-[3rem] border-[12px] border-zinc-900 bg-zinc-900 shadow-2xl">
                  <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />

                  <div className="relative h-[580px] overflow-hidden bg-background">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 pb-6 pt-10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                          <span className="text-lg font-bold text-white">
                            🏋️
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">
                            {t("mobileBooking.phoneName")}
                          </h3>
                          <p className="text-xs text-white/80">
                            {t("mobileBooking.phoneLocation")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                        {[
                          t("mobileBooking.dayMon"),
                          t("mobileBooking.dayTue"),
                          t("mobileBooking.dayWed"),
                          t("mobileBooking.dayThu"),
                          t("mobileBooking.dayFri"),
                        ].map((day, i) => (
                          <div
                            key={i}
                            className={`flex shrink-0 flex-col items-center rounded-xl px-3 py-2 ${i === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            <span className="text-[10px]">{day}</span>
                            <span className="text-sm font-bold">{5 + i}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        {[
                          { time: "07:00", title: "WOD", spots: 3, total: 15 },
                          { time: "09:30", title: "WOD", spots: 8, total: 15 },
                          {
                            time: "12:00",
                            title: "Open Gym",
                            spots: 12,
                            total: 20,
                          },
                          { time: "18:30", title: "WOD", spots: 2, total: 15 },
                          { time: "19:30", title: "WOD", spots: 0, total: 15 },
                        ].map((session, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between rounded-xl border p-3 ${session.spots === 0 ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <Clock className="mx-auto h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium">
                                  {session.time}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{session.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {session.spots > 0
                                    ? t("mobileBooking.spots", {
                                        count: session.spots,
                                      })
                                    : t("mobileBooking.full")}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={
                                session.spots === 0 ? "outline" : "default"
                              }
                              disabled={session.spots === 0}
                              className="h-8 text-xs"
                            >
                              {session.spots === 0
                                ? t("mobileBooking.full")
                                : t("mobileBooking.book")}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[3rem] bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Desktop Dashboard Demo */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <Monitor className="h-3 w-3" />
              {t("desktop.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("desktop.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("desktop.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl"
          >
            <div className="overflow-hidden rounded-xl border bg-background shadow-2xl">
              {/* Browser Header */}
              <div className="flex items-center gap-2 border-b bg-muted/50 px-2 py-3 sm:px-4">
                <div className="flex shrink-0 gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-2 min-w-0 flex-1 truncate rounded-md bg-background/50 px-2 py-1 text-center text-xs text-muted-foreground sm:ml-4 sm:px-3">
                  {t("desktop.url")}
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex">
                {/* Sidebar */}
                <div className="hidden w-56 shrink-0 border-r bg-muted/20 p-4 md:block">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white">
                      {t("desktop.venueAbbr")}
                    </div>
                    <span className="text-sm font-semibold">
                      {t("desktop.venueName")}
                    </span>
                  </div>
                  <nav className="space-y-1">
                    {[
                      {
                        icon: "📊",
                        label: t("desktop.dashboard"),
                        active: true,
                      },
                      {
                        icon: "📅",
                        label: t("desktop.sessions"),
                        active: false,
                      },
                      {
                        icon: "👥",
                        label: t("desktop.members"),
                        active: false,
                      },
                      {
                        icon: "💳",
                        label: t("desktop.plans"),
                        active: false,
                      },
                      { icon: "📝", label: t("desktop.feed"), active: false },
                      {
                        icon: "⚙️",
                        label: t("desktop.settings"),
                        active: false,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-3 sm:p-4 md:p-6">
                  {/* Stats */}
                  <div className="mb-4 grid gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    {[
                      {
                        label: t("desktop.activeMembers"),
                        value: "87",
                        change: "+12%",
                        icon: Users,
                      },
                      {
                        label: t("desktop.sessionsToday"),
                        value: "8",
                        change: "",
                        icon: Calendar,
                      },
                      {
                        label: t("desktop.bookingsToday"),
                        value: "64",
                        change: "+8%",
                        icon: Check,
                      },
                      {
                        label: t("desktop.occupancyRate"),
                        value: "82%",
                        change: "+5%",
                        icon: Trophy,
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-lg border bg-card p-3 shadow-sm sm:rounded-xl sm:p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground sm:text-xs">
                            {stat.label}
                          </span>
                          <stat.icon className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
                        </div>
                        <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2 sm:gap-2">
                          <span className="text-xl font-bold sm:text-2xl">
                            {stat.value}
                          </span>
                          {stat.change && (
                            <span className="text-[10px] text-green-500 sm:text-xs">
                              {stat.change}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sessions Table Preview */}
                  <div className="rounded-lg border bg-card shadow-sm sm:rounded-xl">
                    <div className="border-b p-3 sm:p-4">
                      <h3 className="text-sm font-semibold sm:text-base">
                        {t("desktop.todaySessions")}
                      </h3>
                    </div>
                    <div className="p-3 sm:p-4">
                      {/* Mobile: Card layout */}
                      <div className="space-y-3 sm:hidden">
                        {[
                          {
                            time: "07:00",
                            type: "WOD",
                            coach: t("desktop.coachA"),
                            spots: "12/15",
                            status: t("desktop.completed"),
                          },
                          {
                            time: "09:30",
                            type: "WOD",
                            coach: t("desktop.coachB"),
                            spots: "7/15",
                            status: t("desktop.ongoing"),
                          },
                          {
                            time: "12:00",
                            type: "Open Gym",
                            coach: "—",
                            spots: "8/20",
                            status: t("desktop.next"),
                          },
                          {
                            time: "18:30",
                            type: "WOD",
                            coach: t("desktop.coachA"),
                            spots: "13/15",
                            status: t("desktop.next"),
                          },
                        ].map((row, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                  {row.time}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {row.type}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {row.spots}
                              </span>
                            </div>
                            <Badge
                              variant={
                                row.status === t("desktop.completed")
                                  ? "secondary"
                                  : row.status === t("desktop.ongoing")
                                    ? "default"
                                    : "outline"
                              }
                              className="whitespace-nowrap text-xs"
                            >
                              {row.status}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Desktop/Tablet: Table layout */}
                      <div className="hidden sm:block">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-muted-foreground">
                              <th className="pb-3">{t("desktop.time")}</th>
                              <th className="pb-3">{t("desktop.type")}</th>
                              <th className="hidden pb-3 md:table-cell">
                                {t("desktop.coach")}
                              </th>
                              <th className="pb-3">{t("desktop.occupancy")}</th>
                              <th className="pb-3">{t("desktop.status")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                time: "07:00",
                                type: "WOD",
                                coach: t("desktop.coachA"),
                                spots: "12/15",
                                status: t("desktop.completed"),
                              },
                              {
                                time: "09:30",
                                type: "WOD",
                                coach: t("desktop.coachB"),
                                spots: "7/15",
                                status: t("desktop.ongoing"),
                              },
                              {
                                time: "12:00",
                                type: "Open Gym",
                                coach: "—",
                                spots: "8/20",
                                status: t("desktop.next"),
                              },
                              {
                                time: "18:30",
                                type: "WOD",
                                coach: t("desktop.coachA"),
                                spots: "13/15",
                                status: t("desktop.next"),
                              },
                            ].map((row, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-3 font-medium">{row.time}</td>
                                <td className="py-3">{row.type}</td>
                                <td className="hidden py-3 md:table-cell">
                                  {row.coach}
                                </td>
                                <td className="py-3">{row.spots}</td>
                                <td className="py-3">
                                  <Badge
                                    variant={
                                      row.status === t("desktop.completed")
                                        ? "secondary"
                                        : row.status === t("desktop.ongoing")
                                          ? "default"
                                          : "outline"
                                    }
                                    className="whitespace-nowrap text-xs"
                                  >
                                    {row.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WOD Example Section */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* WOD Card Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="mx-auto max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl">
                {/* Post Header */}
                <div className="flex items-center gap-2 border-b p-3 sm:gap-3 sm:p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                    🏋️
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold sm:text-base">
                      {t("mobileBooking.phoneName")}
                    </p>
                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                      {t("wod.postedAgo")}
                    </p>
                  </div>
                </div>

                {/* WOD Content */}
                <div className="p-3 sm:p-4">
                  <div className="mb-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Timer className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                      <span className="text-sm font-bold sm:text-base">
                        AMRAP 20 min
                      </span>
                    </div>
                    <div className="space-y-1 font-mono text-xs sm:space-y-2 sm:text-sm">
                      <p>5 Pull-ups</p>
                      <p>10 Push-ups</p>
                      <p>15 Air Squats</p>
                    </div>
                    <div className="mt-3 border-t border-orange-500/20 pt-2 sm:mt-4 sm:pt-3">
                      <p className="text-[10px] text-muted-foreground sm:text-xs">
                        <strong>Rx:</strong> {t("wod.rxNote")}
                      </p>
                      <p className="text-[10px] text-muted-foreground sm:text-xs">
                        <strong>Scale:</strong> {t("wod.scaleNote")}
                      </p>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button className="flex items-center gap-1 hover:text-red-500">
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs sm:text-sm">24</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary">
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs sm:text-sm">8</span>
                      </button>
                      <button className="hover:text-primary">
                        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-[10px] sm:h-8 sm:text-xs"
                    >
                      <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t("wod.score")}
                    </Button>
                  </div>
                </div>

                {/* Comments Preview */}
                <div className="border-t bg-muted/30 p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 sm:h-8 sm:w-8" />
                    <div className="min-w-0 rounded-xl bg-background px-2 py-1.5 sm:px-3 sm:py-2">
                      <p className="text-[10px] font-semibold sm:text-xs">
                        {t("wod.commentUser")}
                      </p>
                      <p className="text-xs sm:text-sm">
                        {t("wod.commentText")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <Dumbbell className="h-3 w-3" />
                {t("wod.badge")}
              </Badge>
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">
                {t("wod.title")}
              </h2>
              <p className="mb-8 text-base text-muted-foreground sm:text-lg">
                {t("wod.description")}
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[t("wod.point1"), t("wod.point2"), t("wod.point3")].map(
                  (point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 sm:items-center sm:gap-3"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 sm:h-6 sm:w-6">
                        <Check className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
                      </div>
                      <span className="text-sm sm:text-base">{point}</span>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timer Section - Tabata Demo */}
      <TabataTimerSection />

      {/* Workout Builder Section */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <Dumbbell className="h-3 w-3" />
                {t("workoutBuilder.badge")}
              </Badge>
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">
                {t("workoutBuilder.title")}
              </h2>
              <p className="mb-8 text-base text-muted-foreground sm:text-lg">
                {t("workoutBuilder.description")}
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  t("workoutBuilder.point1"),
                  t("workoutBuilder.point2"),
                  t("workoutBuilder.point3"),
                  t("workoutBuilder.point4"),
                  t("workoutBuilder.point5"),
                ].map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 sm:items-center sm:gap-3"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 sm:h-6 sm:w-6">
                      <Check className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-sm sm:text-base">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Workout Builder Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md space-y-4">
                {/* AMRAP Block */}
                <div className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-card shadow-lg">
                  <div className="flex items-center justify-between border-b p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        🔄 AMRAP
                      </Badge>
                      <span className="text-sm font-medium">20 min</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="text-xs">☰</span>
                    </div>
                  </div>
                  <div className="space-y-2 p-3">
                    {[
                      { name: "Pull-ups", reps: "5" },
                      { name: "Push-ups", reps: "10" },
                      { name: "Air Squats", reps: "15" },
                    ].map((ex, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            ☰
                          </span>
                          <span className="text-sm font-medium">{ex.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {ex.reps} reps
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strength Block */}
                <div className="overflow-hidden rounded-xl border-l-4 border-l-red-500 bg-card shadow-lg">
                  <div className="flex items-center justify-between border-b p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                        💪 {t("workoutBuilder.strength")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="text-xs">☰</span>
                    </div>
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          ☰
                        </span>
                        <span className="text-sm font-medium">Back Squat</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        5x5 @ 80%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Add Block Button */}
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    {
                      type: "EMOM",
                      icon: "⏱️",
                    },
                    {
                      type: "Tabata",
                      icon: "🎯",
                    },
                    {
                      type: "For Time",
                      icon: "⚡",
                    },
                  ].map((block) => (
                    <Badge
                      key={block.type}
                      variant="outline"
                      className="cursor-pointer gap-1 transition-colors hover:bg-muted"
                    >
                      <span>{block.icon}</span>+ {block.type}
                    </Badge>
                  ))}
                </div>

                {/* Comparison: Text vs Builder */}
                <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-2 dark:border-red-900 dark:bg-red-950/30 sm:p-3">
                    <p className="mb-2 text-[10px] font-medium text-red-600 dark:text-red-400 sm:text-xs">
                      ❌ {t("workoutBuilder.plainText")}
                    </p>
                    <div className="space-y-1 font-mono text-[9px] text-muted-foreground sm:text-[10px]">
                      <p>AMRAP 20</p>
                      <p>5 pull ups</p>
                      <p>10 pushups</p>
                      <p>15 squats</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-2 dark:border-green-900 dark:bg-green-950/30 sm:p-3">
                    <p className="mb-2 text-[10px] font-medium text-green-600 dark:text-green-400 sm:text-xs">
                      ✅ {t("workoutBuilder.athlifyr")}
                    </p>
                    <div className="space-y-1 text-[9px] sm:text-[10px]">
                      <p>• {t("workoutBuilder.visualStructure")}</p>
                      <p>• {t("workoutBuilder.integratedTimer")}</p>
                      <p>• {t("workoutBuilder.results")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Athlete Progress Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 gap-1" variant="secondary">
                <TrendingUp className="h-3 w-3" />
                {t("athleteProgress.badge")}
              </Badge>
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">
                {t("athleteProgress.title")}
              </h2>
              <p className="mb-8 text-base text-muted-foreground sm:text-lg">
                {t("athleteProgress.description")}
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  t("athleteProgress.point1"),
                  t("athleteProgress.point2"),
                  t("athleteProgress.point3"),
                  t("athleteProgress.point4"),
                ].map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 sm:items-center sm:gap-3"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 sm:h-6 sm:w-6">
                      <Check className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-sm sm:text-base">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progress Chart Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl">
                {/* Header */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold sm:text-base">
                        Back Squat
                      </h3>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        {t("athleteProgress.last6Months")}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-primary sm:text-2xl">
                        125 kg
                      </p>
                      <p className="text-[10px] text-green-500 sm:text-xs">
                        +15 kg
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chart Mockup */}
                <div className="p-3 sm:p-4">
                  <div className="relative h-36 sm:h-48">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[140, 130, 120, 110, 100].map((val, i) => (
                        <div key={i} className="flex items-center">
                          <span className="w-8 text-right text-xs text-muted-foreground">
                            {val}
                          </span>
                          <div className="ml-2 flex-1 border-t border-dashed border-muted-foreground/20" />
                        </div>
                      ))}
                    </div>

                    <svg
                      className="absolute inset-0 ml-10"
                      viewBox="0 0 300 180"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="venueChartGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M 0 140 L 50 130 L 100 125 L 150 110 L 200 90 L 250 70 L 300 40 L 300 180 L 0 180 Z"
                        fill="url(#venueChartGradient)"
                      />

                      <path
                        d="M 0 140 L 50 130 L 100 125 L 150 110 L 200 90 L 250 70 L 300 40"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {[
                        [0, 140],
                        [50, 130],
                        [100, 125],
                        [150, 110],
                        [200, 90],
                        [250, 70],
                        [300, 40],
                      ].map(([x, y], i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="hsl(var(--background))"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="ml-10 mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{t("athleteProgress.monthSep")}</span>
                    <span>{t("athleteProgress.monthOct")}</span>
                    <span>{t("athleteProgress.monthNov")}</span>
                    <span>{t("athleteProgress.monthDec")}</span>
                    <span>{t("athleteProgress.monthJan")}</span>
                    <span>{t("athleteProgress.monthFeb")}</span>
                  </div>
                </div>

                {/* PR History */}
                <div className="border-t bg-muted/30 p-3 sm:p-4">
                  <p className="mb-2 text-[10px] font-medium text-muted-foreground sm:text-xs">
                    {t("athleteProgress.lastPRs")}
                  </p>
                  <div className="space-y-1.5 sm:space-y-2">
                    {[
                      {
                        date: "5 Feb 2026",
                        weight: "125 kg",
                        badge: t("athleteProgress.newPR"),
                      },
                      { date: "15 Jan 2026", weight: "120 kg", badge: null },
                      { date: "20 Dec 2025", weight: "117.5 kg", badge: null },
                    ].map((pr, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{pr.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pr.weight}</span>
                          {pr.badge && (
                            <Badge className="bg-green-500/20 text-[10px] text-green-600">
                              {pr.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 gap-1" variant="secondary">
              <Flag className="h-3 w-3" />
              {t("events.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("events.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("events.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <HyroxEventCardDemo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground">{t("events.moreEvents")}</p>
          </motion.div>
        </div>
      </section>

      {/* Exercise Database Section */}
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
              {t("exerciseDb.badge")}
            </Badge>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              {t("exerciseDb.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("exerciseDb.description")}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {[
              {
                name: "Clean & Jerk",
                category: "Weightlifting",
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Muscle-up",
                category: "Gymnastics",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Double Under",
                category: "Cardio",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Thruster",
                category: "Functional",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Handstand Walk",
                category: "Gymnastics",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Box Jump",
                category: "Plyometric",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={`flex h-24 items-center justify-center bg-gradient-to-br sm:h-32 ${exercise.color}`}
                >
                  <Dumbbell className="h-8 w-8 text-white/80 transition-transform group-hover:scale-110 sm:h-12 sm:w-12" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-bold sm:text-base">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {exercise.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge className="mb-4 gap-1 bg-green-500/20" variant="secondary">
              <Shield className="h-3 w-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                {t("whyFree.badge")}
              </span>
            </Badge>
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">
              {t("whyFree.title")}
            </h2>
            <p className="mb-8 text-base text-muted-foreground sm:mb-12 sm:text-lg">
              {t("whyFree.description")}
            </p>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {[
                {
                  icon: Users,
                  title: t("whyFree.noLimits"),
                  description: t("whyFree.noLimitsDesc"),
                },
                {
                  icon: Shield,
                  title: t("whyFree.noCosts"),
                  description: t("whyFree.noCostsDesc"),
                },
                {
                  icon: Globe,
                  title: t("whyFree.forever"),
                  description: t("whyFree.foreverDesc"),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border bg-background p-4 shadow-sm sm:p-6"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 sm:mb-4 sm:h-12 sm:w-12">
                    <item.icon className="h-5 w-5 text-green-500 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold sm:mb-2 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl px-4 text-base text-zinc-400 sm:text-lg">
              {t("cta.description")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="min-w-[200px] gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-lg font-bold hover:from-orange-600 hover:to-red-600"
              >
                <Link href="/auth/signup">
                  {t("cta.button")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Contact */}
            <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-center sm:gap-8">
              <p className="text-sm text-zinc-500">{t("cta.questions")}</p>
              <div className="flex flex-col items-center gap-3 text-zinc-400 sm:flex-row sm:gap-6">
                <a
                  href="https://instagram.com/athlifyr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                  @athlifyr
                </a>
                <a
                  href="mailto:hello@athlifyr.com"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                >
                  hello@athlifyr.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}

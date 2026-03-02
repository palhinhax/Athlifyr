"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Clock,
  Route,
  Gauge,
  Mountain,
  TrendingUp,
  Activity,
  Wifi,
  Radio,
  ChevronLeft,
  Bell,
  Eye,
  Flag,
  CreditCard,
  Star,
  ArrowRight,
  Check,
  Pencil,
} from "lucide-react";
import { useTranslations } from "next-intl";

/* =========================================================================
   Phone Mockup Shell — realistic iPhone-like frame
   ========================================================================= */
function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-[280px] rounded-[2.5rem] border-[6px] border-zinc-800 bg-zinc-900 p-1 shadow-2xl dark:border-zinc-700 ${className}`}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-800 dark:bg-zinc-700" />
      {/* Screen */}
      <div className="relative h-[560px] overflow-hidden rounded-[2rem] bg-zinc-950">
        {children}
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-zinc-600" />
    </div>
  );
}

/* =========================================================================
   Desktop/Browser Mockup Shell
   ========================================================================= */
function BrowserFrame({
  children,
  url = "athlifyr.com",
  className = "",
}: {
  children: React.ReactNode;
  url?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-100 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 rounded-md bg-white px-3 py-0.5 text-center text-[10px] text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
          {url}
        </div>
      </div>
      {/* Page content */}
      <div className="relative h-[340px] overflow-hidden">{children}</div>
    </div>
  );
}

/* =========================================================================
   1) Mobile: Live Tracking Map Screen
   ========================================================================= */
export function MobileLiveTrackingMockup() {
  const t = useTranslations("liveRacePresentation.mockups");

  return (
    <PhoneFrame>
      {/* Status bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 pt-8 text-[10px] font-semibold text-white">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-2 bg-zinc-900/90 px-4 pb-2 pt-12 backdrop-blur-sm">
        <ChevronLeft className="h-4 w-4 text-white" />
        <Radio className="h-3.5 w-3.5 text-red-500" />
        <span className="text-xs font-bold text-white">
          {t("liveTracking")}
        </span>
        <div className="ml-auto rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
          LIVE
        </div>
      </div>

      {/* Map area */}
      <div className="absolute inset-0 top-[72px] bg-gradient-to-b from-emerald-900/40 via-emerald-800/20 to-zinc-900">
        {/* Terrain texture */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(34,197,94,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(34,197,94,0.2) 0%, transparent 40%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.15) 0%, transparent 40%)",
            }}
          />
        </div>

        {/* Route polyline mockup */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 280 480"
          fill="none"
        >
          {/* Route path */}
          <path
            d="M 40 420 C 60 380, 90 340, 120 300 C 150 260, 100 220, 140 180 C 180 140, 200 160, 220 120 C 240 80, 200 60, 180 40"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="6 3"
            opacity="0.8"
          />
          {/* Completed portion */}
          <path
            d="M 40 420 C 60 380, 90 340, 120 300 C 150 260, 100 220, 140 180"
            stroke="#f97316"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Start point */}
          <circle
            cx="40"
            cy="420"
            r="6"
            fill="#22c55e"
            stroke="white"
            strokeWidth="2"
          />
          {/* Checkpoint markers */}
          <circle
            cx="120"
            cy="300"
            r="5"
            fill="#f59e0b"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="220"
            cy="120"
            r="5"
            fill="#f59e0b"
            stroke="white"
            strokeWidth="2"
          />
          {/* Finish */}
          <circle
            cx="180"
            cy="40"
            r="6"
            fill="#ef4444"
            stroke="white"
            strokeWidth="2"
          />
          {/* Current position - athlete */}
          <circle
            cx="140"
            cy="180"
            r="8"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="3"
            opacity="1"
          >
            <animate
              attributeName="r"
              values="8;11;8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="140" cy="180" r="16" fill="#3b82f6" opacity="0.2">
            <animate
              attributeName="r"
              values="16;22;16"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.05;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Other athletes */}
          <circle
            cx="100"
            cy="250"
            r="4"
            fill="#8b5cf6"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <circle
            cx="80"
            cy="350"
            r="4"
            fill="#8b5cf6"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <circle
            cx="155"
            cy="220"
            r="4"
            fill="#8b5cf6"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.7"
          />
        </svg>

        {/* Checkpoint labels */}
        <div className="absolute left-[102px] top-[278px] rounded bg-amber-500 px-1 py-0.5 text-[8px] font-bold text-white shadow">
          B1 {t("checkpoint")}
        </div>
        <div className="absolute left-[196px] top-[98px] rounded bg-amber-500 px-1 py-0.5 text-[8px] font-bold text-white shadow">
          B2 {t("water")}
        </div>
        <div className="absolute left-[12px] top-[408px] rounded bg-green-500 px-1 py-0.5 text-[8px] font-bold text-white shadow">
          P {t("start")}
        </div>
        <div className="absolute left-[158px] top-[22px] rounded bg-red-500 px-1 py-0.5 text-[8px] font-bold text-white shadow">
          C {t("finish")}
        </div>
      </div>

      {/* HUD overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 rounded-t-2xl bg-zinc-900/95 p-3 backdrop-blur-sm">
        {/* Connection bar */}
        <div className="mb-2 flex items-center gap-1 rounded bg-green-500/20 px-2 py-0.5">
          <Wifi className="h-2.5 w-2.5 text-green-400" />
          <span className="text-[9px] font-semibold text-green-400">
            {t("connected")}
          </span>
          <span className="ml-auto text-[9px] text-zinc-500">
            👁 24 {t("watching")}
          </span>
        </div>

        {/* Timer */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-white" />
          <span className="text-2xl font-extrabold tabular-nums tracking-wider text-white">
            01:42:18
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-1">
          {[
            {
              icon: <Route className="h-3 w-3 text-orange-400" />,
              label: t("dist"),
              value: "14.2km",
            },
            {
              icon: <Gauge className="h-3 w-3 text-orange-400" />,
              label: t("pace"),
              value: "7:12/km",
            },
            {
              icon: <Activity className="h-3 w-3 text-orange-400" />,
              label: t("speed"),
              value: "8.3 km/h",
            },
            {
              icon: <Trophy className="h-3 w-3 text-amber-400" />,
              label: t("position"),
              value: "12/148",
            },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center py-1">
              {stat.icon}
              <span className="text-[7px] uppercase tracking-wide text-zinc-500">
                {stat.label}
              </span>
              <span className="text-[11px] font-bold tabular-nums text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1">
          {[
            {
              icon: <TrendingUp className="h-3 w-3 text-green-400" />,
              label: t("elevGain"),
              value: "+842m",
            },
            {
              icon: <Mountain className="h-3 w-3 text-blue-400" />,
              label: t("alt"),
              value: "1,240m",
            },
            {
              icon: null,
              label: t("progress"),
              value: "44.2%",
            },
            {
              icon: null,
              label: t("checkpoints"),
              value: "1/4",
            },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center py-1">
              {stat.icon ?? <div className="h-3 w-3" />}
              <span className="text-[7px] uppercase tracking-wide text-zinc-500">
                {stat.label}
              </span>
              <span className="text-[11px] font-bold tabular-nums text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* =========================================================================
   2) Mobile: Leaderboard Screen
   ========================================================================= */
export function MobileLeaderboardMockup() {
  const t = useTranslations("liveRacePresentation.mockups");

  const leaderboardData = [
    {
      rank: 1,
      name: "Miguel Santos",
      time: "01:28:42",
      status: "live",
      medal: "🥇",
    },
    {
      rank: 2,
      name: "João Ferreira",
      time: "01:31:15",
      status: "live",
      medal: "🥈",
    },
    {
      rank: 3,
      name: "Pedro Almeida",
      time: "01:33:08",
      status: "live",
      medal: "🥉",
    },
    {
      rank: 4,
      name: "André Costa",
      time: "01:35:22",
      status: "live",
      medal: "",
    },
    {
      rank: 5,
      name: "Ricardo Nunes",
      time: "01:37:40",
      status: "live",
      medal: "",
    },
    {
      rank: 6,
      name: "Carlos Silva",
      time: "01:39:55",
      status: "live",
      medal: "",
    },
    {
      rank: 7,
      name: "Tiago Rocha",
      time: "01:41:12",
      status: "live",
      medal: "",
    },
    { rank: 12, name: "Tu", time: "01:42:18", status: "you", medal: "" },
  ];

  return (
    <PhoneFrame>
      {/* Status bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 pt-8 text-[10px] font-semibold text-white">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
        </div>
      </div>

      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 bg-zinc-900/95 px-4 pb-3 pt-12 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4 text-white" />
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-bold text-white">
            {t("leaderboard")}
          </span>
          <div className="ml-auto rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
            LIVE
          </div>
        </div>
        {/* Filter tabs */}
        <div className="mt-2 flex gap-1">
          {[t("all"), t("male"), t("female"), "Senior"].map((tab, i) => (
            <div
              key={i}
              className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
                i === 0
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="absolute inset-0 top-[100px] overflow-hidden bg-zinc-950 px-3 pt-2">
        {leaderboardData.map((entry, i) => (
          <div
            key={i}
            className={`mb-1.5 flex items-center gap-2 rounded-lg px-2 py-2 ${
              entry.status === "you"
                ? "border border-orange-500/50 bg-orange-500/10"
                : "bg-zinc-800/50"
            }`}
          >
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                entry.rank === 1
                  ? "bg-amber-500 text-white"
                  : entry.rank === 2
                    ? "bg-zinc-300 text-zinc-800"
                    : entry.rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-zinc-700 text-zinc-300"
              }`}
            >
              {entry.rank}
            </div>
            <div className="flex-1 truncate">
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] font-bold ${entry.status === "you" ? "text-orange-400" : "text-white"}`}
                >
                  {entry.medal} {entry.name}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-zinc-400">
              {entry.time}
            </span>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* =========================================================================
   3) Desktop: Public Live Race View (spectator)
   ========================================================================= */
export function DesktopLiveRaceMockup() {
  const t = useTranslations("liveRacePresentation.mockups");

  return (
    <BrowserFrame url="athlifyr.com/events/trail-manuelino-2026/live">
      <div className="flex h-full">
        {/* Main map area */}
        <div className="relative flex-1 bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-950/30 dark:to-sky-950/30">
          {/* Map terrain hint */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, rgba(34,197,94,0.4) 0%, transparent 60%), radial-gradient(circle at 60% 70%, rgba(59,130,246,0.2) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Route + Athletes on map */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 340"
            fill="none"
          >
            {/* Route */}
            <path
              d="M 30 300 C 60 260, 100 220, 140 200 C 180 180, 160 140, 200 120 C 240 100, 280 130, 320 80 C 350 50, 370 40, 380 30"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
              strokeDasharray="5 3"
            />
            <path
              d="M 30 300 C 60 260, 100 220, 140 200 C 180 180, 160 140, 200 120"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Start */}
            <circle
              cx="30"
              cy="300"
              r="5"
              fill="#22c55e"
              stroke="white"
              strokeWidth="2"
            />
            {/* Checkpoints */}
            <circle
              cx="140"
              cy="200"
              r="4"
              fill="#f59e0b"
              stroke="white"
              strokeWidth="1.5"
            />
            <circle
              cx="320"
              cy="80"
              r="4"
              fill="#f59e0b"
              stroke="white"
              strokeWidth="1.5"
            />
            {/* Finish */}
            <circle
              cx="380"
              cy="30"
              r="5"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
            />

            {/* Athletes dots */}
            {[
              { x: 200, y: 120, color: "#3b82f6", size: 6 },
              { x: 170, y: 160, color: "#8b5cf6", size: 4 },
              { x: 155, y: 185, color: "#8b5cf6", size: 4 },
              { x: 120, y: 215, color: "#8b5cf6", size: 4 },
              { x: 100, y: 230, color: "#8b5cf6", size: 4 },
              { x: 80, y: 255, color: "#8b5cf6", size: 4 },
              { x: 60, y: 270, color: "#8b5cf6", size: 4 },
              { x: 45, y: 290, color: "#8b5cf6", size: 4 },
            ].map((a, i) => (
              <circle
                key={i}
                cx={a.x}
                cy={a.y}
                r={a.size}
                fill={a.color}
                stroke="white"
                strokeWidth={i === 0 ? 2 : 1}
                opacity={i === 0 ? 1 : 0.6}
              />
            ))}
            {/* Highlighted athlete pulse */}
            <circle cx="200" cy="120" r="12" fill="#3b82f6" opacity="0.15">
              <animate
                attributeName="r"
                values="12;18;12"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* Event title overlay */}
          <div className="absolute left-3 top-3 z-10">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold shadow-sm dark:bg-zinc-800/90">
              <Radio className="h-3 w-3 text-red-500" />
              <span className="text-zinc-800 dark:text-white">
                Trail Manuelino 2026
              </span>
              <span className="rounded bg-red-500 px-1 py-0.5 text-[8px] font-bold text-white">
                LIVE
              </span>
            </div>
          </div>

          {/* Athlete info popup */}
          <div className="absolute left-[140px] top-[75px] z-10 rounded-lg bg-white px-2 py-1.5 text-[9px] shadow-lg dark:bg-zinc-800">
            <div className="font-bold text-zinc-800 dark:text-white">
              Miguel Santos
            </div>
            <div className="text-zinc-500 dark:text-zinc-400">
              #12 · Trail 32km · 14.2km
            </div>
            <div className="mt-0.5 font-bold tabular-nums text-orange-500">
              01:42:18
            </div>
            <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-white dark:bg-zinc-800" />
          </div>

          {/* Spectator count */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] shadow dark:bg-zinc-800/90">
            <Eye className="h-3 w-3 text-zinc-500" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              248 {t("watching")}
            </span>
          </div>
        </div>

        {/* Side panel - Leaderboard */}
        <div className="w-[140px] shrink-0 border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-2 py-2 dark:border-zinc-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-800 dark:text-white">
              <Trophy className="h-3 w-3 text-amber-500" />
              {t("liveResults")}
            </div>
          </div>
          {[
            { r: 1, n: "M. Santos", t: "01:28:42", m: "🥇" },
            { r: 2, n: "J. Ferreira", t: "01:31:15", m: "🥈" },
            { r: 3, n: "P. Almeida", t: "01:33:08", m: "🥉" },
            { r: 4, n: "A. Costa", t: "01:35:22", m: "" },
            { r: 5, n: "R. Nunes", t: "01:37:40", m: "" },
            { r: 6, n: "C. Silva", t: "01:39:55", m: "" },
            { r: 7, n: "T. Rocha", t: "01:41:12", m: "" },
            { r: 8, n: "D. Lopes", t: "01:42:03", m: "" },
          ].map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-1 border-b border-zinc-50 px-2 py-1.5 dark:border-zinc-800/50"
            >
              <span
                className={`w-4 text-[9px] font-bold ${i < 3 ? "text-amber-500" : "text-zinc-400"}`}
              >
                {e.m || e.r}
              </span>
              <span className="flex-1 truncate text-[9px] text-zinc-700 dark:text-zinc-300">
                {e.n}
              </span>
              <span className="text-[8px] tabular-nums text-zinc-400">
                {e.t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================================
   4) Mobile: Registration Screen
   ========================================================================= */
export function MobileRegistrationMockup() {
  const t = useTranslations("liveRacePresentation.mockups");

  return (
    <PhoneFrame>
      {/* Status bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 pt-8 text-[10px] font-semibold text-white">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
        </div>
      </div>

      <div className="absolute inset-0 top-6 overflow-hidden bg-zinc-950 px-4 pt-8">
        {/* Event Header */}
        <div className="mb-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 p-3">
          <span className="text-[9px] font-semibold text-orange-400">
            Trail Running · Pombal
          </span>
          <h3 className="text-sm font-bold text-white">Trail Manuelino 2026</h3>
          <span className="text-[9px] text-zinc-400">1 Fev 2026</span>
        </div>

        {/* Variant Selection */}
        <div className="mb-3">
          <span className="mb-1.5 block text-[10px] font-bold text-zinc-400">
            {t("selectVariant")}
          </span>
          {[
            {
              name: "Trail 32km",
              info: "+1,400m D+",
              price: "€15.00",
              selected: true,
            },
            {
              name: "Sprint 18km",
              info: "+680m D+",
              price: "€12.00",
              selected: false,
            },
            {
              name: "Mini 12km",
              info: "+400m D+",
              price: "€10.00",
              selected: false,
            },
          ].map((v, i) => (
            <div
              key={i}
              className={`mb-1 flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                v.selected
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-800 bg-zinc-800/30"
              }`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${v.selected ? "border-orange-500 bg-orange-500" : "border-zinc-600"}`}
              >
                {v.selected && <Check className="h-2.5 w-2.5 text-white" />}
              </div>
              <div className="flex-1">
                <span
                  className={`text-[10px] font-bold ${v.selected ? "text-orange-400" : "text-white"}`}
                >
                  {v.name}
                </span>
                <span className="ml-1 text-[8px] text-zinc-500">{v.info}</span>
              </div>
              <span className="text-[10px] font-bold text-green-400">
                {v.price}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing phase */}
        <div className="mb-3 rounded-lg bg-green-500/10 px-2 py-1.5">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-green-400" />
            <span className="text-[9px] font-bold text-green-400">
              {t("earlyBird")}
            </span>
          </div>
          <span className="text-[8px] text-zinc-500">
            {t("endsIn")} 15 {t("days")}
          </span>
        </div>

        {/* CTA button */}
        <button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-2.5 text-xs font-bold text-white shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-3.5 w-3.5" />
            {t("registerNow")} — €15.00
          </div>
        </button>
      </div>
    </PhoneFrame>
  );
}

/* =========================================================================
   5) Mobile: Spectator Alerts Screen
   ========================================================================= */
export function MobileSpectatorAlertsMockup() {
  const t = useTranslations("liveRacePresentation.mockups");

  return (
    <PhoneFrame>
      {/* Status bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 pt-8 text-[10px] font-semibold text-white">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
        </div>
      </div>

      <div className="absolute inset-0 top-6 overflow-hidden bg-zinc-950 pt-8">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <Bell className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-bold text-white">
            {t("notifications")}
          </span>
          <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            5
          </div>
        </div>

        {/* Following athlete card */}
        <div className="mx-3 mb-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
              MS
            </div>
            <div>
              <div className="text-[11px] font-bold text-white">
                Miguel Santos
              </div>
              <div className="text-[9px] text-zinc-400">
                Trail 32km · #{t("position")} 12
              </div>
            </div>
            <div className="ml-auto rounded bg-green-500/20 px-1.5 py-0.5 text-[8px] font-bold text-green-400">
              {t("tracking")}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[9px]">
            <span className="text-zinc-400">📏 14.2km</span>
            <span className="text-zinc-400">⏱️ 01:42:18</span>
            <span className="text-zinc-400">🏔️ 1,240m</span>
          </div>
        </div>

        {/* Alert list */}
        <div className="px-3">
          {[
            {
              icon: "🏁",
              title: t("checkpointPassed"),
              desc: "Miguel Santos — B1 " + t("checkpoint"),
              time: "2 min",
              color: "text-green-400",
            },
            {
              icon: "📍",
              title: t("positionUpdate"),
              desc: "Miguel Santos → #12 (+2)",
              time: "5 min",
              color: "text-blue-400",
            },
            {
              icon: "🏆",
              title: t("athleteFinished"),
              desc: "João Ferreira — 01:31:15",
              time: "8 min",
              color: "text-amber-400",
            },
            {
              icon: "⚡",
              title: t("raceUpdate"),
              desc: t("leadChanged"),
              time: "12 min",
              color: "text-purple-400",
            },
            {
              icon: "🔔",
              title: t("raceStatus"),
              desc: t("raceStartedDesc"),
              time: "45 min",
              color: "text-orange-400",
            },
          ].map((alert, i) => (
            <div
              key={i}
              className="mb-2 flex gap-2 rounded-xl bg-zinc-800/50 p-2.5"
            >
              <span className="text-base">{alert.icon}</span>
              <div className="flex-1">
                <div className={`text-[10px] font-bold ${alert.color}`}>
                  {alert.title}
                </div>
                <div className="text-[9px] text-zinc-400">{alert.desc}</div>
              </div>
              <span className="whitespace-nowrap text-[8px] text-zinc-600">
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* =========================================================================
   6) Desktop: Route Editor
   ========================================================================= */
export function DesktopRouteEditorMockup() {
  const t = useTranslations("liveRacePresentation.mockups");

  return (
    <BrowserFrame url="athlifyr.com/admin/events/trail-manuelino/route">
      <div className="flex h-full">
        {/* Map */}
        <div className="relative flex-1 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/20">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 40% 50%, rgba(34,197,94,0.4) 0%, transparent 60%)",
              }}
            />
          </div>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 340"
            fill="none"
          >
            {/* Route */}
            <path
              d="M 40 290 C 80 250, 120 200, 160 180 C 200 160, 180 120, 220 100 C 260 80, 300 110, 340 60"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Start gate */}
            <rect
              x="32"
              y="280"
              width="16"
              height="20"
              rx="2"
              fill="#22c55e"
              opacity="0.7"
            />
            <text
              x="40"
              y="294"
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
            >
              P
            </text>
            {/* Finish gate */}
            <rect
              x="332"
              y="50"
              width="16"
              height="20"
              rx="2"
              fill="#ef4444"
              opacity="0.7"
            />
            <text
              x="340"
              y="64"
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
            >
              C
            </text>
            {/* Intermediate checkpoints */}
            <rect
              x="152"
              y="170"
              width="16"
              height="20"
              rx="2"
              fill="#f59e0b"
              opacity="0.7"
            />
            <text
              x="160"
              y="184"
              textAnchor="middle"
              fill="white"
              fontSize="7"
              fontWeight="bold"
            >
              B1
            </text>
            <rect
              x="212"
              y="90"
              width="16"
              height="20"
              rx="2"
              fill="#f59e0b"
              opacity="0.7"
            />
            <text
              x="220"
              y="104"
              textAnchor="middle"
              fill="white"
              fontSize="7"
              fontWeight="bold"
            >
              B2
            </text>
            {/* Geofencing circles */}
            <circle
              cx="160"
              cy="180"
              r="20"
              fill="#f59e0b"
              opacity="0.1"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx="220"
              cy="100"
              r="20"
              fill="#f59e0b"
              opacity="0.1"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </svg>

          {/* Drag hint */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-white/80 px-2 py-1 text-[9px] text-zinc-600 shadow dark:bg-zinc-800/80 dark:text-zinc-400">
            <Pencil className="h-3 w-3" />
            {t("dragCheckpoints")}
          </div>
        </div>

        {/* Sidebar - checkpoint list */}
        <div className="w-[150px] shrink-0 border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-2 py-2 dark:border-zinc-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-800 dark:text-white">
              <Flag className="h-3 w-3 text-orange-500" />
              {t("checkpointList")}
            </div>
          </div>
          {[
            { type: "P", name: t("start"), color: "bg-green-500", km: "0.0" },
            {
              type: "B1",
              name: t("checkpoint") + " 1",
              color: "bg-amber-500",
              km: "8.4",
            },
            {
              type: "B2",
              name: t("water"),
              color: "bg-amber-500",
              km: "18.2",
            },
            {
              type: "C",
              name: t("finish"),
              color: "bg-red-500",
              km: "32.0",
            },
          ].map((cp, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 border-b border-zinc-50 px-2 py-2 dark:border-zinc-800/50"
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold text-white ${cp.color}`}
              >
                {cp.type}
              </div>
              <div className="flex-1">
                <div className="text-[9px] font-bold text-zinc-700 dark:text-zinc-300">
                  {cp.name}
                </div>
                <div className="text-[8px] text-zinc-400">km {cp.km}</div>
              </div>
            </div>
          ))}

          {/* Upload GPX */}
          <div className="border-t border-zinc-100 p-2 dark:border-zinc-800">
            <div className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 py-2 text-[9px] text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
              <ArrowRight className="h-3 w-3" />
              {t("uploadGpx")}
            </div>
          </div>

          {/* Route stats */}
          <div className="px-2 py-1.5">
            <div className="flex items-center justify-between text-[8px]">
              <span className="text-zinc-500">{t("dist")}</span>
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                32.0 km
              </span>
            </div>
            <div className="flex items-center justify-between text-[8px]">
              <span className="text-zinc-500">{t("elevGain")}</span>
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                +1,400m
              </span>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* =========================================================================
   Animated wrapper for feature illustrations
   ========================================================================= */
export function FeatureIllustration({
  children,
  isEven,
}: {
  children: React.ReactNode;
  isEven: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      viewport={{ once: true }}
      className="flex flex-1 justify-center"
    >
      {children}
    </motion.div>
  );
}

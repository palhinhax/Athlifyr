// ============================================================================
// Image Composer — Weekly/Monthly Event Compilation Images
//
// Generates Instagram compilation images replicating the EventCard component
// using Satori (JSX → SVG) + resvg (SVG → PNG) + sharp (→ JPEG).
// Output: 1080×1350 (4:5 portrait, Instagram optimal)
// ============================================================================

import satori, { type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFile } from "fs/promises";
import { join } from "path";
import React from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface EventForImage {
  title: string;
  city: string;
  startDate: string;
  imageUrl: string | null;
  sportTypes: string[];
  variants: Array<{ name: string; distanceKm: number | null }>;
}

type ComposeMode = "weekly" | "monthly";

// ─── Sport Config (mirrors lib/sport-config.ts) ───────────────────────────

const SPORT_ICONS: Record<string, string> = {
  RUNNING: "🏃",
  TRAIL: "🥾",
  CYCLING: "🚴",
  BTT: "🚵",
  SWIMMING: "🏊",
  TRIATHLON: "🏊",
  DUATHLON: "🏃",
  AQUATHLON: "🏊",
  HYROX: "💪",
  CROSSFIT: "🏋️",
  OBSTACLE: "🧗",
  OCR: "🤸",
  WALKING: "🚶",
  SURF: "🏄",
  OTHER: "📍",
};

const SPORT_LABELS: Record<string, string> = {
  RUNNING: "Running",
  TRAIL: "Trail",
  CYCLING: "Cycling",
  BTT: "BTT",
  SWIMMING: "Swimming",
  TRIATHLON: "Triathlon",
  DUATHLON: "Duathlon",
  AQUATHLON: "Aquathlon",
  HYROX: "Hyrox",
  CROSSFIT: "CrossFit",
  OBSTACLE: "Obstacle",
  OCR: "OCR",
  WALKING: "Walking",
  SURF: "Surf",
  OTHER: "Evento",
};

// ─── Theme Colors (light mode, matching globals.css) ──────────────────────

const THEME = {
  primary: "#B65B16", // hsl(26, 78%, 40%) — date badge, icon accents
  primaryFg: "#FFFFFF",
  accent: "#F5C356", // hsl(41, 89%, 65%) — sport badge bg
  accentFg: "#131C26", // hsl(215, 25%, 10%) — sport badge text
  foreground: "#0f172a", // title, metadata text
  mutedFg: "#64748b", // secondary metadata
  secondary: "#f1f5f9", // distance badge bg
  secondaryFg: "#1e293b", // distance badge text
  card: "#FFFFFF",
};

// ─── Constants ─────────────────────────────────────────────────────────────

const CANVAS_W = 1080;
const CANVAS_H = 1350;

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDatePt(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  return {
    day: String(d.getDate()),
    month: d
      .toLocaleDateString("pt-PT", { month: "short" })
      .toUpperCase()
      .replace(".", ""),
  };
}

async function downloadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const raw = Buffer.from(await res.arrayBuffer());
    // Normalize to PNG via sharp — ensures valid format and correct MIME type
    const png = await sharp(raw).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

function buildTitle(events: EventForImage[], days: number): string {
  const allSports = new Set(events.flatMap((e) => e.sportTypes));
  let period: string;
  if (days <= 7) period = "DA SEMANA";
  else if (days <= 14) period = "DAS PRÓXIMAS 2 SEMANAS";
  else if (days <= 21) period = "DAS PRÓXIMAS 3 SEMANAS";
  else period = "DO MÊS";
  if (allSports.size === 1) {
    const sport = [...allSports][0];
    const label = SPORT_LABELS[sport]?.toUpperCase() || "EVENTOS";
    return `${label} ${period}`;
  }
  return `EVENTOS ${period}`;
}

let fontCacheRegular: ArrayBuffer | null = null;
let fontCacheBold: ArrayBuffer | null = null;

function bufferToArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return ab;
}

async function loadFonts(): Promise<Font[]> {
  // Satori only supports TTF/OTF/WOFF (NOT woff2 or variable fonts)
  if (!fontCacheRegular) {
    const buf = await readFile(
      join(process.cwd(), "app", "fonts", "Inter-Regular.woff")
    );
    fontCacheRegular = bufferToArrayBuffer(buf);
  }
  if (!fontCacheBold) {
    const buf = await readFile(
      join(process.cwd(), "app", "fonts", "Inter-Bold.woff")
    );
    fontCacheBold = bufferToArrayBuffer(buf);
  }
  return [
    {
      name: "Inter",
      data: fontCacheRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: fontCacheBold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.substring(0, max - 1) + "…" : str;
}

// ─── Card JSX Component (mirrors components/event-card.tsx) ───────────────

function EventCardImage({
  ev,
  imageData,
  cardW,
  cardH,
  compact,
}: {
  ev: EventForImage;
  imageData: string | null;
  cardW: number;
  cardH: number;
  compact: boolean;
}) {
  const { day, month } = formatDatePt(ev.startDate);
  const imgH = Math.floor(cardH * 0.5);
  const titleSize = compact ? 18 : 22;
  const metaSize = compact ? 14 : 17;
  const maxTitleLen = compact ? 28 : 36;
  const iconSz = compact ? 13 : 16;
  const badgeSize = compact ? 12 : 15;

  const distances = ev.variants
    .filter((v) => v.distanceKm)
    .map((v) => `${v.distanceKm} km`)
    .slice(0, 3);
  const extraVariants = ev.variants.length > 3 ? ev.variants.length - 3 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: cardW,
        height: cardH,
        borderRadius: 16,
        backgroundColor: THEME.card,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Image area with overlays ─────────────────────────── */}
      <div
        style={{
          display: "flex",
          position: "relative",
          width: cardW,
          height: imgH,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: THEME.secondary,
        }}
      >
        {imageData ? (
          <img
            src={imageData}
            width={cardW}
            height={imgH}
            style={{
              width: cardW,
              height: imgH,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: cardW,
              height: imgH,
              fontSize: 48,
            }}
          >
            {SPORT_ICONS[ev.sportTypes[0]] || "📍"}
          </div>
        )}

        {/* Date badge — top-left, flush (bg-primary) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            left: 0,
            top: 0,
            backgroundColor: THEME.primary,
            paddingLeft: compact ? 10 : 14,
            paddingRight: compact ? 10 : 14,
            paddingTop: compact ? 5 : 7,
            paddingBottom: compact ? 5 : 7,
            borderTopLeftRadius: 16,
            color: THEME.primaryFg,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: compact ? 26 : 32,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {day}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: compact ? 11 : 13,
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {month}
          </div>
        </div>

        {/* Sport badges — top-right (bg-accent rounded-full) */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          {ev.sportTypes.slice(0, 2).map((sport, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: THEME.accent,
                borderRadius: 999,
                paddingLeft: compact ? 8 : 12,
                paddingRight: compact ? 8 : 12,
                paddingTop: compact ? 4 : 5,
                paddingBottom: compact ? 4 : 5,
                marginLeft: idx > 0 ? 4 : 0,
                fontSize: compact ? 12 : 14,
                fontWeight: 600,
                color: THEME.accentFg,
              }}
            >
              {(SPORT_ICONS[sport] || "📍") +
                " " +
                (SPORT_LABELS[sport] || sport)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Card content (mirrors CardContent p-4) ───────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: compact ? 10 : 14,
          paddingRight: compact ? 10 : 14,
          paddingTop: compact ? 8 : 12,
          paddingBottom: compact ? 8 : 12,
          flexGrow: 1,
        }}
      >
        {/* Title — line-clamp-2, text-lg font-bold */}
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 700,
            color: THEME.foreground,
            lineHeight: 1.3,
          }}
        >
          {truncate(ev.title, maxTitleLen)}
        </div>

        {/* Date row — Calendar icon + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: compact ? 5 : 7,
          }}
        >
          <div
            style={{
              display: "flex",
              width: iconSz,
              height: iconSz,
              borderRadius: 2,
              backgroundColor: THEME.primary,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: metaSize,
              fontWeight: 500,
              color: THEME.foreground,
              marginLeft: compact ? 5 : 6,
            }}
          >
            {day +
              " " +
              month.toLowerCase() +
              ". " +
              new Date(ev.startDate).getFullYear()}
          </div>
        </div>

        {/* Location row — MapPin icon + city */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: compact ? 2 : 3,
          }}
        >
          <div
            style={{
              display: "flex",
              width: iconSz,
              height: iconSz,
              borderRadius: iconSz,
              backgroundColor: THEME.primary,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: metaSize,
              fontWeight: 500,
              color: THEME.foreground,
              marginLeft: compact ? 5 : 6,
            }}
          >
            {truncate(ev.city, compact ? 18 : 26)}
          </div>
        </div>

        {/* Distance badges row */}
        {distances.length > 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: compact ? 5 : 8,
            }}
          >
            {distances.map((d, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: THEME.secondary,
                  borderRadius: 6,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  marginLeft: idx > 0 ? 4 : 0,
                  fontSize: badgeSize,
                  fontWeight: 600,
                  color: THEME.secondaryFg,
                }}
              >
                {d}
              </div>
            ))}
            {extraVariants > 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: THEME.secondary,
                  borderRadius: 6,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 2,
                  paddingBottom: 2,
                  marginLeft: 4,
                  fontSize: badgeSize,
                  fontWeight: 600,
                  color: THEME.mutedFg,
                }}
              >
                {"+" + extraVariants}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Full Compilation Layout ──────────────────────────────────────────────

function CompilationLayout({
  _mode,
  events,
  imageDataMap,
  pageIndex,
  totalPages,
  days,
  customTitle,
}: {
  _mode: ComposeMode;
  events: EventForImage[];
  imageDataMap: (string | null)[];
  pageIndex: number;
  totalPages: number;
  days: number;
  customTitle?: string;
}) {
  const title = customTitle || buildTitle(events, days);
  const now = new Date();
  const endDate = new Date(now.getTime() + days * 86400000);
  const dateRange = `${now.toLocaleDateString("pt-PT", { day: "numeric", month: "short" })} — ${endDate.toLocaleDateString("pt-PT", { day: "numeric", month: "short" })}`;
  const subtitle =
    totalPages > 1
      ? `${dateRange} (${pageIndex + 1}/${totalPages})`
      : dateRange;

  // Adaptive grid
  const cols = events.length <= 4 ? 2 : 3;
  const compact = cols === 3;
  const rows = Math.ceil(events.length / cols);
  const gap = compact ? 14 : 18;
  const sidePad = 24;
  const headerH = 150;
  const footerH = 64;
  const gridH = CANVAS_H - headerH - footerH;

  const cardW = Math.floor((CANVAS_W - sidePad * 2 - gap * (cols - 1)) / cols);
  const cardH = Math.floor((gridH - gap * (rows - 1)) / rows);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: CANVAS_W,
        height: CANVAS_H,
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 28,
          paddingBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 50,
            height: 4,
            backgroundColor: THEME.primary,
            borderRadius: 2,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
          <div style={{ display: "flex", fontSize: 20, color: "#64748b" }}>
            {subtitle}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#94a3b8",
              marginLeft: 16,
            }}
          >
            {events.length + " evento" + (events.length !== 1 ? "s" : "")}
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          paddingLeft: sidePad,
          paddingRight: sidePad,
        }}
      >
        {events.map((ev, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              marginLeft: i % cols !== 0 ? gap : 0,
              marginTop: i >= cols ? gap : 0,
            }}
          >
            <EventCardImage
              ev={ev}
              imageData={imageDataMap[i]}
              cardW={cardW}
              cardH={cardH}
              compact={compact}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          paddingBottom: 16,
          paddingTop: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            width: CANVAS_W - 80,
            height: 1,
            backgroundColor: "#cbd5e1",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: 4,
          }}
        >
          ATHLIFYR
        </div>
        <div style={{ display: "flex", fontSize: 13, color: "#94a3b8" }}>
          athlifyr.com
        </div>
      </div>
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────

export async function composeCompilationImages(
  mode: ComposeMode,
  events: EventForImage[],
  days?: number,
  customTitle?: string
): Promise<Buffer[]> {
  if (events.length === 0) return [];

  const effectiveDays = days ?? (mode === "weekly" ? 7 : 30);

  const maxPerPage = effectiveDays <= 7 ? 9 : 12;
  const pages: EventForImage[][] = [];
  for (let i = 0; i < events.length; i += maxPerPage) {
    pages.push(events.slice(i, i + maxPerPage));
  }

  const fonts = await loadFonts();

  const buffers: Buffer[] = [];
  for (let p = 0; p < pages.length; p++) {
    const pageEvents = pages[p];

    // Download all images for this page in parallel
    const imageDataMap = await Promise.all(
      pageEvents.map((ev) =>
        ev.imageUrl ? downloadImageAsBase64(ev.imageUrl) : Promise.resolve(null)
      )
    );

    // Render JSX → SVG via Satori
    const svg = await satori(
      <CompilationLayout
        _mode={mode}
        events={pageEvents}
        imageDataMap={imageDataMap}
        pageIndex={p}
        totalPages={pages.length}
        days={effectiveDays}
        customTitle={customTitle}
      />,
      {
        width: CANVAS_W,
        height: CANVAS_H,
        fonts,
      }
    );

    // SVG → PNG via resvg
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: CANVAS_W },
    });
    const pngBuffer = resvg.render().asPng();

    // PNG → JPEG via sharp (smaller file for Instagram)
    const jpeg = await sharp(pngBuffer).jpeg({ quality: 92 }).toBuffer();
    buffers.push(jpeg);
  }

  return buffers;
}

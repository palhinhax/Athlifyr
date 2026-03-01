import {
  type GiveawayWinnerPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

// Athlifyr brand colours (from globals.css + logo)
const ORANGE = "#FE8818"; // logo / brand-frame tint
const ORANGE_DARK = "#B55B16"; // p-brand  hsl(26 78% 40%)
const AMBER = "#F5C256"; // p-golden  hsl(41 89% 65%) – accent

interface TemplateGiveawayWinnerProps {
  payload: GiveawayWinnerPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T15: Giveaway Winner Announcement
 * Uses Athlifyr brand palette: #FE8818 orange → #F5C256 amber (accent gradient).
 * Same colour language as the logo/nav "Athlifyr" text.
 */
export function TemplateGiveawayWinner({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateGiveawayWinnerProps) {
  const {
    eventName,
    giveawayTitle,
    prize,
    winners,
    drawDate,
    verificationHash,
    thankYouLine,
    background,
  } = payload;

  const titleScale = getAutoFontScale(giveawayTitle.length, 30);
  const eventScale = getAutoFontScale(eventName.length, 50);
  const isVertical =
    format === "STORY" || format === "REELS" || format === "TIKTOK";
  const isSquare = format === "SQUARE";

  const maxWinners = isVertical ? 5 : isSquare ? 4 : 5;
  const displayedWinners = winners.slice(0, maxWinners);

  const ticketFontSize = isVertical
    ? 72
    : isSquare && displayedWinners.length > 2
      ? 60
      : 72;

  const labelFontSize = isVertical ? 26 : 24;

  // Athlifyr-orange ✦ sparkles at fixed positions
  const sparkles = [
    { top: "7%", left: "5%", size: 26, opacity: 0.45, rotate: 12 },
    { top: "5%", left: "83%", size: 20, opacity: 0.38, rotate: -18 },
    { top: "11%", left: "49%", size: 14, opacity: 0.3, rotate: 45 },
    { top: "89%", left: "11%", size: 18, opacity: 0.38, rotate: 28 },
    { top: "87%", left: "77%", size: 24, opacity: 0.42, rotate: -8 },
    { top: "50%", left: "2%", size: 12, opacity: 0.28, rotate: 60 },
    { top: "48%", left: "95%", size: 16, opacity: 0.32, rotate: -42 },
  ];

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      {/* Athlifyr-orange sparkle accents */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute z-10 select-none"
          style={{
            top: s.top,
            left: s.left,
            opacity: s.opacity,
            transform: `rotate(${s.rotate}deg)`,
            fontSize: `${s.size}px`,
            color: ORANGE,
          }}
        >
          ✦
        </div>
      ))}

      {/* Brand glow corners */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10"
        style={{
          width: isVertical ? "320px" : "240px",
          height: isVertical ? "320px" : "240px",
          background: `radial-gradient(circle at top left, ${ORANGE}28 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-10"
        style={{
          width: isVertical ? "320px" : "240px",
          height: isVertical ? "320px" : "240px",
          background: `radial-gradient(circle at bottom right, ${ORANGE_DARK}38 0%, transparent 70%)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-10 text-center text-white">
        {/* Title — bright white with Athlifyr orange glow */}
        <h1
          className="mb-3 font-black uppercase leading-none tracking-wider"
          style={{
            fontSize: `${(isVertical ? 88 : 76) * titleScale}px`,
            color: "#FFFFFF",
            textShadow: `0 0 40px ${ORANGE}CC, 0 0 80px ${ORANGE}66, 0 4px 20px rgba(0,0,0,0.7)`,
          }}
        >
          {giveawayTitle}
        </h1>

        {/* Divider — brand orange */}
        <div
          className="mb-5 rounded-full"
          style={{
            width: "140px",
            height: "3px",
            background: `linear-gradient(90deg, ${ORANGE} 0%, ${AMBER}88 100%)`,
          }}
        />

        {/* Event name */}
        <p
          className="mb-6 font-bold uppercase tracking-wide"
          style={{
            fontSize: `${44 * eventScale}px`,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            opacity: 0.95,
          }}
        >
          {eventName}
        </p>

        {/* Prize badge — orange glass */}
        <div
          className="mb-8 inline-flex items-center gap-3 rounded-2xl px-10 py-3"
          style={{
            background: `${ORANGE}1E`,
            border: `2px solid ${ORANGE}55`,
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ fontSize: "32px" }}>🎟️</span>
          <span
            className="font-bold"
            style={{
              fontSize: "34px",
              color: AMBER,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {prize}
          </span>
        </div>

        {/* Winners */}
        <div
          className="mb-6 w-full"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: displayedWinners.length > 3 ? "14px" : "18px",
            maxWidth: isVertical ? "800px" : "860px",
          }}
        >
          {displayedWinners.map((winner, index) => (
            <div
              key={index}
              className="flex items-center gap-5 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                border: `2px solid ${ORANGE}44`,
                backdropFilter: "blur(10px)",
                padding: `${displayedWinners.length > 3 ? 16 : 20}px 32px`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)`,
              }}
            >
              {/* Ticket icon + number in brand orange */}
              <div className="flex flex-1 items-center gap-3">
                <span
                  style={{
                    fontSize: `${displayedWinners.length > 3 ? 32 : 36}px`,
                  }}
                >
                  🎟️
                </span>
                <span
                  className="font-black tracking-widest"
                  style={{
                    fontSize: `${ticketFontSize}px`,
                    color: ORANGE,
                    textShadow: `0 2px 12px ${ORANGE}88`,
                    letterSpacing: "0.08em",
                  }}
                >
                  {winner.ticketNumber}
                </span>
              </div>

              {/* Optional label */}
              {winner.label && (
                <span
                  className="shrink-0 font-semibold uppercase tracking-wider"
                  style={{ fontSize: `${labelFontSize}px`, opacity: 0.72 }}
                >
                  {winner.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Draw date */}
        {drawDate && (
          <p
            className="mb-4 font-medium tracking-wider"
            style={{
              fontSize: "30px",
              opacity: 0.68,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            🗓️ {drawDate}
          </p>
        )}

        {/* Thank you line */}
        {thankYouLine && (
          <p
            className="font-medium italic"
            style={{
              fontSize: "28px",
              opacity: 0.62,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {thankYouLine}
          </p>
        )}
      </div>

      {/* Verification Hash */}
      {verificationHash && (
        <p
          className="absolute bottom-2 left-0 right-0 z-20 text-center font-mono text-white/30"
          style={{ fontSize: "10px", letterSpacing: "0.5px" }}
        >
          #{verificationHash}
        </p>
      )}
    </BrandFrame>
  );
}

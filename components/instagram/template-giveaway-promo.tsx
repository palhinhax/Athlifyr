import {
  type GiveawayPromoPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateGiveawayPromoProps {
  payload: GiveawayPromoPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T12: Giveaway Promo
 * Clean, minimal design for announcing giveaways/sorteios
 */
export function TemplateGiveawayPromo({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateGiveawayPromoProps) {
  const {
    eventName,
    giveawayTitle,
    prize,
    drawDate,
    howToEnter,
    cta,
    verificationHash,
    background,
  } = payload;

  const titleScale = getAutoFontScale(giveawayTitle.length, 40);
  const eventScale = getAutoFontScale(eventName.length, 50);
  const isVertical =
    format === "STORY" || format === "REELS" || format === "TIKTOK";

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 text-center text-white">
        {/* Giveaway Title */}
        <h1
          className="mb-4 font-black uppercase leading-none tracking-wider"
          style={{
            fontSize: `${(isVertical ? 100 : 90) * titleScale}px`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {giveawayTitle}
        </h1>

        {/* Divider */}
        <div
          className="mb-6 rounded-full bg-white/70"
          style={{ width: "160px", height: "3px" }}
        />

        {/* Event Name */}
        <p
          className="mb-6 font-semibold uppercase tracking-wide"
          style={{
            fontSize: `${50 * eventScale}px`,
            textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            opacity: 0.9,
          }}
        >
          {eventName}
        </p>

        {/* Prize */}
        <div
          className="mb-8 rounded-2xl bg-white/15 px-10 py-4 backdrop-blur-sm"
          style={{ border: "2px solid rgba(255,255,255,0.25)" }}
        >
          <p
            className="font-bold"
            style={{
              fontSize: "38px",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {prize}
          </p>
        </div>

        {/* How to Enter Steps */}
        {howToEnter.length > 0 && (
          <div className="mb-8 w-full max-w-[700px] space-y-3">
            {howToEnter.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl bg-black/20 px-6 py-3 backdrop-blur-sm"
                style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <span
                  className="flex shrink-0 items-center justify-center rounded-full bg-white font-bold text-black"
                  style={{ width: "40px", height: "40px", fontSize: "22px" }}
                >
                  {index + 1}
                </span>
                <span
                  className="text-left font-medium"
                  style={{
                    fontSize: "30px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Draw Date */}
        {drawDate && (
          <p
            className="mb-6 font-medium tracking-wider"
            style={{ fontSize: "32px", opacity: 0.8 }}
          >
            {drawDate}
          </p>
        )}

        {/* CTA Button */}
        {cta && (
          <div
            className="rounded-full bg-white px-12 py-4 font-bold text-black"
            style={{
              fontSize: "32px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {cta}
          </div>
        )}
      </div>

      {/* Verification Hash - tiny, at the very bottom */}
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

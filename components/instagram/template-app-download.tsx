import {
  type AppDownloadPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateAppDownloadProps {
  payload: AppDownloadPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T13: App Download Promo
 * Promotes the app on Google Play with badge, features, and CTA
 * Follows Google Play badge guidelines: clear space, contrast, prominence
 */
export function TemplateAppDownload({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateAppDownloadProps) {
  const {
    headline,
    subheadline,
    features,
    badgeUrl,
    legalText,
    cta,
    background,
  } = payload;

  const headlineScale = getAutoFontScale(headline.length, 50);
  const subScale = getAutoFontScale(subheadline.length, 60);
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
        {/* Headline */}
        <h1
          className="mb-4 font-black uppercase leading-tight tracking-wider"
          style={{
            fontSize: `${(isVertical ? 90 : 80) * headlineScale}px`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p
          className="mb-8 font-medium leading-snug"
          style={{
            fontSize: `${44 * subScale}px`,
            textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            opacity: 0.9,
          }}
        >
          {subheadline}
        </p>

        {/* Feature Highlights */}
        {features.length > 0 && (
          <div className="mb-10 w-full max-w-[700px] space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl bg-black/20 px-6 py-3 backdrop-blur-sm"
                style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <span
                  className="flex shrink-0 items-center justify-center rounded-full bg-white font-bold text-black"
                  style={{ width: "40px", height: "40px", fontSize: "22px" }}
                >
                  ✓
                </span>
                <span
                  className="text-left font-medium"
                  style={{
                    fontSize: "30px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA Text */}
        {cta && (
          <p
            className="mb-6 font-semibold uppercase tracking-wider"
            style={{
              fontSize: "34px",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {cta}
          </p>
        )}

        {/* Google Play Badge - with 1/4 height clear space per guidelines */}
        {badgeUrl && (
          <div
            className="flex items-center justify-center"
            style={{ padding: "20px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badgeUrl}
              alt="Get it on Google Play"
              style={{
                height: isVertical ? "80px" : "72px",
                width: "auto",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
              }}
            />
          </div>
        )}

        {/* Legal Attribution */}
        {legalText && (
          <p
            className="mt-4 font-normal"
            style={{
              fontSize: "16px",
              opacity: 0.55,
            }}
          >
            {legalText}
          </p>
        )}
      </div>
    </BrandFrame>
  );
}

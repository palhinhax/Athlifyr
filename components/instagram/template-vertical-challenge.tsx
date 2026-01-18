import {
  type VerticalChallengePayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateVerticalChallengeProps {
  payload: VerticalChallengePayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T9: Vertical Challenge Card
 * Optimized for TikTok and Instagram Reels
 * Step-by-step format perfect for challenges and tutorials
 */
export function TemplateVerticalChallenge({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateVerticalChallengeProps) {
  const { challengeTitle, steps, hashtag, cta, background } = payload;

  // Auto-scale title if too long
  const titleScale = getAutoFontScale(challengeTitle.length, 40);

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col justify-center px-12 text-white">
        {/* Challenge Title */}
        <h1
          className="mb-12 text-center font-black uppercase leading-tight tracking-tight"
          style={{
            fontSize: `${110 * titleScale}px`,
            textShadow: "0 6px 24px rgba(0,0,0,0.6)",
          }}
        >
          {challengeTitle}
        </h1>

        {/* Steps List */}
        <div className="mb-12 space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-6">
              {/* Step Number */}
              <div
                className="flex shrink-0 items-center justify-center rounded-full bg-white font-black text-black"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "44px",
                }}
              >
                {index + 1}
              </div>
              {/* Step Text */}
              <p
                className="flex-1 font-semibold leading-snug"
                style={{
                  fontSize: "44px",
                  paddingTop: "12px",
                  textShadow: "0 4px 16px rgba(0,0,0,0.5)",
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Hashtag */}
        {hashtag && (
          <p
            className="mb-6 text-center font-bold tracking-wide"
            style={{
              fontSize: "48px",
              opacity: 0.95,
            }}
          >
            #{hashtag}
          </p>
        )}

        {/* CTA */}
        {cta && (
          <div className="text-center">
            <div
              className="inline-block rounded-full bg-white px-12 py-4 font-bold text-black"
              style={{ fontSize: "36px" }}
            >
              {cta}
            </div>
          </div>
        )}
      </div>
    </BrandFrame>
  );
}

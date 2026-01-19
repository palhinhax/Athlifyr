import {
  type TestimonialStatsPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateTestimonialStatsProps {
  payload: TestimonialStatsPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T8: Testimonial/Stats Card
 * Social proof template with big numbers and testimonials
 * Perfect for building trust and credibility
 */
export function TemplateTestimonialStats({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateTestimonialStatsProps) {
  const { statNumber, statLabel, quote, author, background } = payload;

  // Auto-scale quote if too long
  const quoteScale = quote ? getAutoFontScale(quote.length, 150) : 1;

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 text-center text-white">
        {/* Big Stat Number */}
        <div className="mb-6">
          <div
            className="font-black leading-none tracking-tighter"
            style={{
              fontSize: "180px",
              textShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            {statNumber}
          </div>
          <div
            className="mt-4 font-bold uppercase tracking-wider"
            style={{
              fontSize: "56px",
              opacity: 0.95,
            }}
          >
            {statLabel}
          </div>
        </div>

        {/* Decorative line */}
        {quote && <div className="my-8 h-1 w-32 rounded-full bg-white/50" />}

        {/* Quote */}
        {quote && (
          <div className="mb-6 max-w-4xl">
            <p
              className="font-medium italic leading-snug"
              style={{
                fontSize: `${48 * quoteScale}px`,
                opacity: 0.9,
                textShadow: "0 4px 16px rgba(0,0,0,0.5)",
              }}
            >
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        )}

        {/* Author */}
        {author && (
          <p
            className="font-semibold tracking-wide"
            style={{
              fontSize: "40px",
              opacity: 0.85,
            }}
          >
            — {author}
          </p>
        )}
      </div>
    </BrandFrame>
  );
}

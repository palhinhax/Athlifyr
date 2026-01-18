import {
  type MinimalQuotePayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateMinimalQuoteProps {
  payload: MinimalQuotePayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T4: Minimal Quote
 * Simple quote with footer
 */
export function TemplateMinimalQuote({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateMinimalQuoteProps) {
  const { quote, footer, background } = payload;

  const quoteScale = getAutoFontScale(quote.length, 200);

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center text-white">
        {/* Opening Quote Mark */}
        <div
          className="mb-8 font-serif opacity-30"
          style={{ fontSize: "180px", lineHeight: "0.8" }}
        >
          &ldquo;
        </div>

        {/* Quote Text */}
        <p
          className="max-w-5xl font-normal leading-relaxed tracking-wide"
          style={{
            fontSize: `${64 * quoteScale}px`,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {quote}
        </p>

        {/* Closing Quote Mark */}
        <div
          className="mt-8 font-serif opacity-30"
          style={{ fontSize: "180px", lineHeight: "0.8" }}
        >
          &rdquo;
        </div>

        {/* Footer */}
        <div className="mt-16">
          <div className="mx-auto mb-6 h-1 w-32 bg-white/40" />
          <p
            className="font-semibold uppercase tracking-widest"
            style={{
              fontSize: "40px",
              opacity: 0.8,
            }}
          >
            {footer}
          </p>
        </div>
      </div>
    </BrandFrame>
  );
}

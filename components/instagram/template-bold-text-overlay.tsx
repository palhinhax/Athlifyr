import {
  type BoldTextOverlayPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateBoldTextOverlayProps {
  payload: BoldTextOverlayPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T6: Bold Text Overlay
 * Modern trending style with bold statement and optional emoji
 * Perfect for Instagram Reels and TikTok
 */
export function TemplateBoldTextOverlay({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateBoldTextOverlayProps) {
  const { mainText, subText, emoji, background } = payload;

  // Auto-scale main text if too long
  const mainTextScale = getAutoFontScale(mainText.length, 60);

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 text-center text-white">
        {/* Emoji (if provided) */}
        {emoji && (
          <div
            className="mb-8"
            style={{
              fontSize: "120px",
              lineHeight: 1,
            }}
          >
            {emoji}
          </div>
        )}

        {/* Main Text - Bold and impactful */}
        <h1
          className="mb-6 font-black uppercase leading-[0.9] tracking-tight"
          style={{
            fontSize: `${140 * mainTextScale}px`,
            textShadow: "0 6px 24px rgba(0,0,0,0.6)",
            wordBreak: "break-word",
          }}
        >
          {mainText}
        </h1>

        {/* Sub Text */}
        {subText && (
          <p
            className="font-semibold tracking-wide"
            style={{
              fontSize: "52px",
              opacity: 0.95,
              textShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            {subText}
          </p>
        )}
      </div>
    </BrandFrame>
  );
}

import {
  type SplitScreenPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateSplitScreenProps {
  payload: SplitScreenPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T7: Split Screen
 * Comparison/Before-After style for engaging content
 * Great for showing contrasts or choices
 */
export function TemplateSplitScreen({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateSplitScreenProps) {
  const {
    leftTitle,
    leftSubtitle,
    rightTitle,
    rightSubtitle,
    vsText = "VS",
    background,
  } = payload;

  // Auto-scale titles if too long
  const leftTitleScale = getAutoFontScale(leftTitle.length, 30);
  const rightTitleScale = getAutoFontScale(rightTitle.length, 30);

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex h-full flex-col">
        {/* Split content */}
        <div className="flex flex-1">
          {/* Left Side */}
          <div className="flex flex-1 flex-col items-center justify-center border-r-4 border-white/30 px-8 text-center text-white">
            <h2
              className="mb-4 font-bold uppercase leading-tight tracking-tight"
              style={{
                fontSize: `${100 * leftTitleScale}px`,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              {leftTitle}
            </h2>
            {leftSubtitle && (
              <p
                className="font-medium tracking-wide"
                style={{
                  fontSize: "44px",
                  opacity: 0.9,
                }}
              >
                {leftSubtitle}
              </p>
            )}
          </div>

          {/* Right Side */}
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-white">
            <h2
              className="mb-4 font-bold uppercase leading-tight tracking-tight"
              style={{
                fontSize: `${100 * rightTitleScale}px`,
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              {rightTitle}
            </h2>
            {rightSubtitle && (
              <p
                className="font-medium tracking-wide"
                style={{
                  fontSize: "44px",
                  opacity: 0.9,
                }}
              >
                {rightSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* VS Badge - Centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="flex items-center justify-center rounded-full bg-white font-black text-black shadow-2xl"
            style={{
              width: "120px",
              height: "120px",
              fontSize: "48px",
            }}
          >
            {vsText}
          </div>
        </div>
      </div>
    </BrandFrame>
  );
}

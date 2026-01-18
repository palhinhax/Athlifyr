import {
  type CategoryCardPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateCategoryCardProps {
  payload: CategoryCardPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T2: Category Card
 * For category posts with big title, chips/keywords, and tagline
 */
export function TemplateCategoryCard({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateCategoryCardProps) {
  const { categoryTitle, chips, tagline, background } = payload;

  const titleScale = getAutoFontScale(categoryTitle.length, 20);

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center text-white">
        {/* Category Title */}
        <h1
          className="mb-12 font-bold uppercase leading-none tracking-wider"
          style={{
            fontSize: `${160 * titleScale}px`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {categoryTitle}
        </h1>

        {/* Chips/Keywords */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-6">
          {chips.slice(0, 4).map((chip, index) => (
            <div
              key={index}
              className="rounded-full border-2 border-white/30 bg-white/10 px-12 py-4 font-medium backdrop-blur-sm"
              style={{ fontSize: "40px" }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p
          className="max-w-4xl font-normal tracking-wide"
          style={{
            fontSize: "52px",
            opacity: 0.9,
          }}
        >
          {tagline}
        </p>
      </div>
    </BrandFrame>
  );
}

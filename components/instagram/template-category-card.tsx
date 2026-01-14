import {
  type CategoryCardPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";

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

  // Background rendering
  const renderBackground = () => {
    if (background.type === "photo" && background.value) {
      return (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${background.value})` }}
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (background.overlayIntensity || 50) / 100 }}
          />
        </>
      );
    }
    if (background.type === "gradient") {
      return (
        <div
          className="absolute inset-0"
          style={{ background: background.value }}
        />
      );
    }
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: background.value }}
      />
    );
  };

  return (
    <div className="relative">
      {renderBackground()}

      <BrandFrame format={format} showGuides={showGuides} showLogo={showLogo}>
        <div className="flex flex-1 flex-col items-center justify-center text-center text-white">
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
            {chips.slice(0, 3).map((chip, index) => (
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
    </div>
  );
}

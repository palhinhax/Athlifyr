import { type EventHeroPayload, type InstagramFormat } from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";

interface TemplateEventHeroProps {
  payload: EventHeroPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T1: Event Hero
 * For specific events with title, subtitle, date/location
 */
export function TemplateEventHero({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateEventHeroProps) {
  const { title, subtitle, metaLine, cta, background } = payload;

  // Auto-scale title if too long
  const titleScale = getAutoFontScale(title.length, 50);

  // Background rendering
  const renderBackground = () => {
    if (background.type === "photo" && background.value) {
      return (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${background.value})` }}
          />
          <div
            className="absolute inset-0 z-0 bg-black"
            style={{ opacity: (background.overlayIntensity || 50) / 100 }}
          />
        </>
      );
    }
    if (background.type === "gradient") {
      return (
        <div
          className="absolute inset-0 z-0"
          style={{ background: background.value }}
        />
      );
    }
    return (
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: background.value }}
      />
    );
  };

  return (
    <BrandFrame format={format} showGuides={showGuides} showLogo={showLogo}>
      {renderBackground()}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center text-white">
        {/* Main Title */}
        <h1
          className="mb-6 font-bold uppercase leading-tight tracking-tight"
          style={{
            fontSize: `${120 * titleScale}px`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="mb-4 font-medium tracking-wide"
            style={{
              fontSize: "56px",
              opacity: 0.95,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Meta line (date/location) */}
        {metaLine && (
          <p
            className="mb-8 font-normal tracking-wider"
            style={{
              fontSize: "44px",
              opacity: 0.85,
            }}
          >
            {metaLine}
          </p>
        )}

        {/* CTA */}
        {cta && (
          <div
            className="mt-8 rounded-full bg-white px-16 py-6 font-semibold text-black"
            style={{ fontSize: "40px" }}
          >
            {cta}
          </div>
        )}
      </div>
    </BrandFrame>
  );
}

import {
  type WeeklyPicksPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { BrandFrame } from "./brand-frame";

interface TemplateWeeklyPicksProps {
  payload: WeeklyPicksPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T3: Weekly Picks
 * List of 3-5 events with header and footer
 */
export function TemplateWeeklyPicks({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateWeeklyPicksProps) {
  const { header, items, footer, background } = payload;

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
        <div className="flex flex-1 flex-col justify-between text-white">
          {/* Header */}
          <div className="text-center">
            <h1
              className="mb-8 font-bold uppercase tracking-widest"
              style={{
                fontSize: "68px",
                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              {header}
            </h1>
            <div className="mx-auto h-1 w-40 bg-white/50" />
          </div>

          {/* Items List */}
          <div className="flex-1 space-y-8 py-16">
            {items.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-start gap-8">
                <div
                  className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white/20 font-bold backdrop-blur-sm"
                  style={{ fontSize: "40px" }}
                >
                  {index + 1}
                </div>
                <p
                  className="flex-1 pt-3 font-medium leading-snug"
                  style={{ fontSize: "44px" }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="mx-auto mb-6 h-1 w-40 bg-white/50" />
            <p
              className="font-semibold uppercase tracking-widest"
              style={{
                fontSize: "48px",
                opacity: 0.9,
              }}
            >
              {footer}
            </p>
          </div>
        </div>
      </BrandFrame>
    </div>
  );
}

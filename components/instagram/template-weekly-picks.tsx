import {
  type WeeklyPicksPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { BrandFrame } from "./brand-frame";
import { Calendar, MapPin } from "lucide-react";

interface TemplateWeeklyPicksProps {
  payload: WeeklyPicksPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T3: Weekly Picks
 * List of 3-5 events with header and footer
 * Now with calendar-style date badges like Monthly Events
 */
export function TemplateWeeklyPicks({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateWeeklyPicksProps) {
  const { header, items, footer, background } = payload;

  // Parse items to extract title, date, and location
  // Format expected: "Event Title • 15 jan" or "Event Title • 15 jan • Location"
  const parseItem = (item: string) => {
    const parts = item.split("•").map((p) => p.trim());
    if (parts.length >= 2) {
      return {
        title: parts[0],
        date: parts[1],
        location: parts[2] || "",
      };
    }
    return {
      title: item,
      date: "",
      location: "",
    };
  };

  // Background rendering
  const renderBackground = () => {
    if (background.type === "photo" && background.value) {
      return (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={background.value}
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover"
            crossOrigin="anonymous"
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
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={renderBackground()}
    >
      <div className="relative z-10 flex flex-1 flex-col justify-between text-white">
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

        {/* Events List - Calendar Style */}
        <div className="flex-1 space-y-6 py-12">
          {items.slice(0, 5).map((item, index) => {
            const parsed = parseItem(item);
            return (
              <div
                key={index}
                className="flex items-start gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15"
              >
                {/* Date Badge */}
                {parsed.date && (
                  <div
                    className="flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
                    style={{ minWidth: "96px" }}
                  >
                    <Calendar
                      className="mb-1"
                      style={{ width: "28px", height: "28px" }}
                    />
                    <span
                      className="text-center font-bold uppercase leading-tight"
                      style={{ fontSize: "20px" }}
                    >
                      {parsed.date}
                    </span>
                  </div>
                )}

                {/* Event Info */}
                <div className="flex-1 pt-1">
                  <h3
                    className="mb-2 font-bold leading-tight"
                    style={{ fontSize: "32px" }}
                  >
                    {parsed.title}
                  </h3>
                  {parsed.location && (
                    <div className="flex items-center gap-2 opacity-90">
                      <MapPin style={{ width: "20px", height: "20px" }} />
                      <span style={{ fontSize: "24px" }}>
                        {parsed.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
  );
}

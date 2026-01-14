import {
  type MonthlyEventsPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { BrandFrame } from "./brand-frame";
import { Calendar, MapPin } from "lucide-react";

interface TemplateMonthlyEventsProps {
  payload: MonthlyEventsPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T5: Monthly Events
 * For listing events of a specific month and sport type
 */
export function TemplateMonthlyEvents({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateMonthlyEventsProps) {
  const { month, sportType, events, footer, background } = payload;

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
            style={{ opacity: (background.overlayIntensity || 60) / 100 }}
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
      <div className="relative z-10 flex flex-1 flex-col text-white">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="mb-4 inline-block rounded-full bg-white/20 px-8 py-3 font-semibold uppercase tracking-wider backdrop-blur-sm"
            style={{ fontSize: "36px" }}
          >
            {sportType}
          </div>
          <h1
            className="font-bold uppercase tracking-wide"
            style={{
              fontSize: "72px",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {month}
          </h1>
          <div className="mx-auto mt-6 h-1 w-32 bg-white/50" />
        </div>

        {/* Events List */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {events.slice(0, 8).map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15"
            >
              {/* Date Badge */}
              <div
                className="flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
                style={{ minWidth: "96px" }}
              >
                <Calendar
                  className="mb-1"
                  style={{ width: "28px", height: "28px" }}
                />
                <span
                  className="font-bold uppercase leading-tight"
                  style={{ fontSize: "20px" }}
                >
                  {event.date}
                </span>
              </div>

              {/* Event Info */}
              <div className="flex-1 pt-1">
                <h3
                  className="mb-2 font-bold leading-tight"
                  style={{ fontSize: "32px" }}
                >
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 opacity-90">
                  <MapPin style={{ width: "20px", height: "20px" }} />
                  <span style={{ fontSize: "24px" }}>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="mx-auto mb-4 h-1 w-32 bg-white/50" />
          <p
            className="font-semibold tracking-widest"
            style={{
              fontSize: "40px",
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

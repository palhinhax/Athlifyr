import {
  type WeeklyPicksPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";
import {
  Calendar,
  MapPin,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudFog,
  Sun,
  CloudSun,
  Zap,
} from "lucide-react";

interface TemplateWeeklyPicksProps {
  payload: WeeklyPicksPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Map OpenWeatherMap condition codes to Lucide icons (for Instagram templates)
 */
function getWeatherIcon(
  condition: string,
  size: string = "28px"
): React.ReactNode {
  const conditionLower = condition.toLowerCase();

  const iconStyle = { width: size, height: size };

  if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
    return <Sun style={iconStyle} className="text-yellow-300" />;
  }
  if (
    conditionLower.includes("cloud") &&
    (conditionLower.includes("few") || conditionLower.includes("scattered"))
  ) {
    return <CloudSun style={iconStyle} className="text-blue-200" />;
  }
  if (conditionLower.includes("cloud")) {
    return <Cloud style={iconStyle} className="text-gray-300" />;
  }
  if (conditionLower.includes("drizzle")) {
    return <CloudDrizzle style={iconStyle} className="text-blue-300" />;
  }
  if (conditionLower.includes("rain")) {
    return <CloudRain style={iconStyle} className="text-blue-400" />;
  }
  if (conditionLower.includes("snow")) {
    return <CloudSnow style={iconStyle} className="text-blue-200" />;
  }
  if (
    conditionLower.includes("mist") ||
    conditionLower.includes("fog") ||
    conditionLower.includes("haze")
  ) {
    return <CloudFog style={iconStyle} className="text-gray-300" />;
  }
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return <Zap style={iconStyle} className="text-yellow-400" />;
  }

  // Default fallback
  return <CloudSun style={iconStyle} className="text-blue-200" />;
}

/**
 * Template T3: Weekly Picks
 * List of 3-5 events with header and footer
 * Now with calendar-style date badges like Monthly Events
 * + Weather info when available
 */
export function TemplateWeeklyPicks({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateWeeklyPicksProps) {
  const { header, items, footer, background, events } = payload;

  // Use structured events if available, otherwise parse string items (legacy)
  const eventsList =
    events && events.length > 0
      ? events
      : items.map((item) => {
          const parts = item.split("•").map((p) => p.trim());
          return {
            title: parts[0] || item,
            date: parts[1] || "",
            location: parts[2] || "",
            weather: null,
          };
        });

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
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

        {/* Events List - Calendar Style with Weather */}
        <div className="flex-1 space-y-6 py-12">
          {eventsList.slice(0, 5).map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15"
            >
              {/* Date Badge */}
              {event.date && (
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
                    {event.date}
                  </span>
                </div>
              )}

              {/* Event Info */}
              <div className="flex-1 pt-1">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3
                      className="mb-2 font-bold leading-tight"
                      style={{ fontSize: "32px" }}
                    >
                      {event.title}
                    </h3>
                    {event.location && (
                      <div className="flex items-center gap-2 opacity-90">
                        <MapPin style={{ width: "20px", height: "20px" }} />
                        <span style={{ fontSize: "24px" }}>
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Weather Badge */}
                  {event.weather && (
                    <div
                      className="flex flex-shrink-0 items-center gap-3 rounded-lg bg-white/25 px-4 py-3 backdrop-blur-sm"
                      style={{ minWidth: "fit-content" }}
                    >
                      {getWeatherIcon(event.weather.condition, "36px")}
                      <span className="font-bold" style={{ fontSize: "32px" }}>
                        {event.weather.temperature}°C
                      </span>
                    </div>
                  )}
                </div>
              </div>
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
  );
}

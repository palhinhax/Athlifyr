import Image from "next/image";
import {
  type VenuePromoPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";
import { MapPin, Instagram } from "lucide-react";

interface TemplateVenuePromoProps {
  payload: VenuePromoPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T11: Venue Promo
 * For promoting venues with circular logo, services, and contact info
 */
export function TemplateVenuePromo({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateVenuePromoProps) {
  const {
    venueName,
    venueType,
    tagline,
    location,
    services,
    logoUrl,
    cta,
    instagram,
    background,
  } = payload;

  // Auto-scale venue name if too long
  const nameScale = getAutoFontScale(venueName.length, 40);

  // Check if it's a vertical format (story/reels/tiktok)
  const isVertical = ["STORY", "REELS", "TIKTOK"].includes(format);

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center text-white">
        {/* Circular Logo */}
        {logoUrl && (
          <div
            className="mb-8 overflow-hidden rounded-full border-4 border-white shadow-2xl"
            style={{
              width: isVertical ? "280px" : "240px",
              height: isVertical ? "280px" : "240px",
            }}
          >
            <Image
              src={logoUrl}
              alt={venueName}
              width={280}
              height={280}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Venue Type Badge */}
        <div
          className="mb-4 rounded-full bg-white/20 px-6 py-2 font-medium uppercase tracking-wider backdrop-blur-sm"
          style={{ fontSize: "28px" }}
        >
          {venueType}
        </div>

        {/* Venue Name */}
        <h1
          className="mb-4 font-bold uppercase leading-tight tracking-tight"
          style={{
            fontSize: `${isVertical ? 80 : 72}px`,
            transform: `scale(${nameScale})`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {venueName}
        </h1>

        {/* Tagline */}
        <p
          className="mb-6 font-medium leading-snug"
          style={{
            fontSize: isVertical ? "48px" : "44px",
            opacity: 0.95,
            maxWidth: "90%",
          }}
        >
          {tagline}
        </p>

        {/* Services */}
        {services && services.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {services.slice(0, 4).map((service, index) => (
              <span
                key={index}
                className="rounded-full bg-white/25 px-5 py-2 font-medium backdrop-blur-sm"
                style={{ fontSize: "26px" }}
              >
                {service}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        <div
          className="mb-6 flex items-center gap-3"
          style={{
            fontSize: "36px",
            opacity: 0.9,
          }}
        >
          <MapPin style={{ width: "36px", height: "36px" }} />
          <span>{location}</span>
        </div>

        {/* Instagram Handle */}
        {instagram && (
          <div
            className="mb-6 flex items-center gap-3"
            style={{
              fontSize: "32px",
              opacity: 0.85,
            }}
          >
            <Instagram style={{ width: "32px", height: "32px" }} />
            <span>@{instagram.replace("@", "")}</span>
          </div>
        )}

        {/* CTA Button */}
        {cta && (
          <div
            className="mt-4 rounded-full bg-white px-12 py-5 font-bold uppercase tracking-wide text-black shadow-lg"
            style={{ fontSize: "36px" }}
          >
            {cta}
          </div>
        )}
      </div>
    </BrandFrame>
  );
}

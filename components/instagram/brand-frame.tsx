import Image from "next/image";
import {
  INSTAGRAM_SIZES,
  SAFE_AREAS,
  type InstagramFormat,
} from "@/types/instagram";

// Brand logo path - using high-res version for Instagram export
const BRAND_LOGO_PATH = "/logo.svg";

interface BrandFrameProps {
  children: React.ReactNode;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
  className?: string;
  background?: React.ReactNode;
  isTransparent?: boolean;
}

/**
 * BrandFrame wraps all Instagram templates with consistent branding:
 * - Logo placement (bottom-right)
 * - Safe area margins
 * - Optional guide overlays
 */
export function BrandFrame({
  children,
  format,
  showGuides = false,
  showLogo = true,
  className = "",
  background,
  isTransparent = false,
}: BrandFrameProps) {
  const size = INSTAGRAM_SIZES[format];
  const safeArea = SAFE_AREAS[format];

  // Scale factor for preview (based on 1080px base width)
  const scale = 1;

  return (
    <div
      className={`relative overflow-hidden ${isTransparent ? "" : "bg-black"} ${className}`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {/* Background layer - covers entire frame */}
      {background}

      {/* Content with safe margins */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          padding: `${safeArea.top}px ${safeArea.right}px ${safeArea.bottom}px ${safeArea.left}px`,
        }}
      >
        {children}
      </div>

      {/* Logo - bottom right corner inside safe area */}
      {showLogo && (
        <div
          className="absolute z-20"
          style={{
            right: `${safeArea.right + 20}px`,
            bottom: `${safeArea.bottom + 20}px`,
            width: "126px",
            height: "126px",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#FE8818",
              borderRadius: "25px",
              margin: "4px",
            }}
          />
          <div className="relative h-full w-full">
            <Image
              src={BRAND_LOGO_PATH}
              alt="Athlifyr"
              fill
              sizes="80px"
              className="object-contain"
              style={{
                filter:
                  "drop-shadow(0 2px 8px rgba(0,0,0,0.3)) contrast(1.1) saturate(1.1)",
              }}
            />
          </div>
        </div>
      )}

      {/* Safe area guides overlay (only shown in preview, not exported) */}
      {showGuides && (
        <>
          {/* Top safe area indicator */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-red-500/50"
            style={{ top: `${safeArea.top}px` }}
          />
          {/* Bottom safe area indicator */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-red-500/50"
            style={{ bottom: `${safeArea.bottom}px` }}
          />
          {/* Left safe area indicator */}
          <div
            className="absolute bottom-0 top-0 border-l-2 border-dashed border-red-500/50"
            style={{ left: `${safeArea.left}px` }}
          />
          {/* Right safe area indicator */}
          <div
            className="absolute bottom-0 top-0 border-r-2 border-dashed border-red-500/50"
            style={{ right: `${safeArea.right}px` }}
          />
          {/* Corner labels */}
          <div
            className="absolute text-xs font-bold text-red-500"
            style={{
              top: `${safeArea.top + 10}px`,
              left: `${safeArea.left + 10}px`,
            }}
          >
            SAFE AREA
          </div>
        </>
      )}
    </div>
  );
}

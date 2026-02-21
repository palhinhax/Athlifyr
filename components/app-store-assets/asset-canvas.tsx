"use client";

import { forwardRef } from "react";
import type { CanvasDesign } from "@/types/app-store-assets";

interface AssetCanvasProps {
  design: CanvasDesign;
  width: number;
  height: number;
}

/**
 * The actual canvas preview that renders the design.
 * Uses pure HTML/CSS so it can be exported to image via html-to-image.
 */
export const AssetCanvas = forwardRef<HTMLDivElement, AssetCanvasProps>(
  ({ design, width, height }, ref) => {
    // ── Background style ─────────────────────────────────────────────────
    const bgStyle: React.CSSProperties = (() => {
      switch (design.backgroundType) {
        case "solid":
          return { backgroundColor: design.backgroundColor };
        case "gradient":
          return {
            background: `linear-gradient(${design.gradientAngle}deg, ${design.gradientFrom}, ${design.gradientTo})`,
          };
        case "image":
          return {
            backgroundImage: design.backgroundImageUrl
              ? `url(${design.backgroundImageUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          };
        default:
          return { backgroundColor: design.backgroundColor };
      }
    })();

    // Scale factor for preview text (design values are for 1080px reference)
    const fontScale = Math.min(width, height) / 1080;

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: `${width} / ${height}`,
          overflow: "hidden",
          ...bgStyle,
        }}
      >
        {/* Overlay for image backgrounds */}
        {design.backgroundType === "image" && design.backgroundImageUrl && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: design.overlayColor,
              opacity: design.overlayOpacity / 100,
            }}
          />
        )}

        {/* Text layer */}
        {(design.headline || design.subheadline) && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              ...(design.textPosition === "top" ? { top: 0 } : { bottom: 0 }),
              padding: "6%",
              textAlign: design.textAlign,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: `${8 * fontScale}px`,
            }}
          >
            {design.headline && (
              <div
                style={{
                  color: design.headlineColor,
                  fontSize: `${design.headlineFontSize * fontScale}px`,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                {design.headline}
              </div>
            )}
            {design.subheadline && (
              <div
                style={{
                  color: design.subheadlineColor,
                  fontSize: `${design.subheadlineFontSize * fontScale}px`,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  textShadow: "0 1px 6px rgba(0,0,0,0.2)",
                }}
              >
                {design.subheadline}
              </div>
            )}
          </div>
        )}

        {/* Device mockup */}
        {design.showDevice && (
          <DeviceMockup
            deviceType={design.deviceType}
            screenImage={design.deviceScreenImage}
            scale={design.deviceScale}
            offsetX={design.deviceOffsetX}
            offsetY={design.deviceOffsetY}
          />
        )}
      </div>
    );
  }
);
AssetCanvas.displayName = "AssetCanvas";

// ─── Device Mockup Sub-component ─────────────────────────────────────────────

interface DeviceMockupProps {
  deviceType: "iphone" | "android";
  screenImage: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
}

function DeviceMockup({
  deviceType,
  screenImage,
  scale,
  offsetX,
  offsetY,
}: DeviceMockupProps) {
  // Device frame dimensions (aspect ratio of a phone in portrait)
  const isIphone = deviceType === "iphone";
  const borderRadius = isIphone ? "12%" : "6%";
  const bezelWidth = isIphone ? "3%" : "2.5%";

  return (
    <div
      style={{
        position: "absolute",
        bottom: `${-5 + offsetY}%`,
        left: `${50 + offsetX}%`,
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: "bottom center",
        width: "42%",
        aspectRatio: "9 / 19.5",
        zIndex: 5,
      }}
    >
      {/* Device frame */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          backgroundColor: isIphone ? "#1a1a1a" : "#2d2d2d",
          padding: bezelWidth,
          boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Notch / Dynamic Island (iPhone only) */}
        {isIphone && (
          <div
            style={{
              position: "absolute",
              top: "2.5%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "30%",
              height: "3%",
              backgroundColor: "#1a1a1a",
              borderRadius: "100px",
              zIndex: 20,
            }}
          />
        )}

        {/* Screen area */}
        <div
          style={{
            flex: 1,
            borderRadius: `calc(${borderRadius} - ${bezelWidth})`,
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            position: "relative",
          }}
        >
          {screenImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={screenImage}
              alt="App screenshot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                📱
                <br />
                Screenshot
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

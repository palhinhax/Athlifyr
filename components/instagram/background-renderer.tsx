import { type Background } from "@/types/instagram";

interface BackgroundRendererProps {
  background: Background;
}

/**
 * BackgroundRenderer handles all background types: solid, gradient, photo, transparent
 * Used by all Instagram templates to render backgrounds consistently
 */
export function BackgroundRenderer({ background }: BackgroundRendererProps) {
  // Transparent background
  if (background.type === "transparent") {
    return null; // No background layer
  }

  // Photo background
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

  // Gradient background
  if (background.type === "gradient") {
    return (
      <div
        className="absolute inset-0 z-0"
        style={{ background: background.value }}
      />
    );
  }

  // Solid color background (default)
  return (
    <div
      className="absolute inset-0 z-0"
      style={{ backgroundColor: background.value }}
    />
  );
}

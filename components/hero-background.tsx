"use client";

import Image from "next/image";

interface HeroBackgroundProps {
  image?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  height?: "default" | "tall" | "custom";
  customHeight?: string;
  clickable?: boolean;
  onImageClick?: () => void;
  imageQuality?: number;
  overlayOpacity?: "light" | "medium" | "dark";
}

export function HeroBackground({
  image,
  title,
  description,
  children,
  className = "",
  height = "default",
  customHeight,
  clickable = false,
  onImageClick,
  imageQuality = 90,
  overlayOpacity = "medium",
}: HeroBackgroundProps) {
  const heightClasses = {
    default: "py-24",
    tall: "h-[400px]",
    custom: customHeight || "py-24",
  };

  const overlayClasses = {
    light: "bg-black/30",
    medium: "bg-black/50",
    dark: "bg-black/70",
  };

  return (
    <section
      className={`relative overflow-hidden ${height === "custom" ? "" : heightClasses[height]} ${className}`}
      style={
        height === "custom" && customHeight
          ? { height: customHeight }
          : undefined
      }
    >
      {image ? (
        <>
          <div
            className={`absolute inset-0 z-0 ${clickable ? "cursor-pointer" : ""}`}
            onClick={clickable && onImageClick ? onImageClick : undefined}
          >
            <Image
              src={image}
              alt={title || "Hero background"}
              fill
              className="object-cover object-center transition-transform duration-300 hover:scale-105"
              priority
              quality={imageQuality}
              sizes="100vw"
            />
            <div
              className={`absolute inset-0 ${overlayClasses[overlayOpacity]}`}
            />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-p-golden/10 to-p-info/10" />
      )}

      {/* Content */}
      {(title || description || children) && (
        <div className="container relative z-10 mx-auto h-full px-4">
          <div className="flex h-full flex-col text-white">
            {title && (
              <h1 className="mb-2 text-4xl font-bold drop-shadow-lg">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-white drop-shadow-md">{description}</p>
            )}
            {children}
          </div>
        </div>
      )}
    </section>
  );
}

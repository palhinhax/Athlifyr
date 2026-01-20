"use client";

import Image from "next/image";

interface HeroBackgroundProps {
  image?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function HeroBackground({
  image,
  title,
  description,
  children,
  className = "",
}: HeroBackgroundProps) {
  return (
    <section className={`relative overflow-hidden py-24 ${className}`}>
      {image ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={image}
              alt={title || "Hero background"}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/20 to-primary/10" />
      )}

      {/* Content */}
      {(title || description || children) && (
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-white">
            {title && (
              <h1 className="mb-2 text-4xl font-bold drop-shadow-lg">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-white/90 drop-shadow-md">{description}</p>
            )}
            {children}
          </div>
        </div>
      )}
    </section>
  );
}

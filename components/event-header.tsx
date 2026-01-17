"use client";

import { useState } from "react";
import Image from "next/image";
import { SportType } from "@prisma/client";
import { EventImageLightbox } from "@/components/event-image-lightbox";
import { SportBadge } from "@/components/sport-badge";

interface EventHeaderProps {
  title: string;
  imageUrl: string | null;
  sportTypes: SportType[];
}

export function EventHeader({ title, imageUrl, sportTypes }: EventHeaderProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const hasImage = imageUrl && imageUrl !== "/placeholder-event.jpg";

  return (
    <>
      <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
        <div
          className={hasImage ? "cursor-pointer" : ""}
          onClick={() => hasImage && setIsLightboxOpen(true)}
        >
          <Image
            src={imageUrl || "/placeholder-event.jpg"}
            alt={title}
            fill
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="container mx-auto">
            <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
              {sportTypes.map((sportType) => (
                <SportBadge
                  key={sportType}
                  sportType={sportType}
                  size="lg"
                  className="shadow-lg"
                />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {hasImage && isLightboxOpen && (
        <EventImageLightbox
          imageUrl={imageUrl!}
          title={title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}

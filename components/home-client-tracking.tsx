"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { analyticsEvent } from "@/lib/analytics";
import { HeroBackground } from "@/components/hero-background";

// Fallback hero images for CTA section (used when no event images available)
const CTA_HERO_IMAGES = [
  "/images/challenges/challenge-1.jpg",
  "/images/challenges/challenge-2.jpg",
  "/images/challenges/challenge-3.jpg",
  "/images/challenges/challenge-4.jpg",
  "/images/challenges/challenge-5.jpg",
  "/images/challenges/challenge-6.jpg",
  "/images/challenges/challenge-7.jpg",
];

interface HomeCtaSectionProps {
  locale: string;
  ctaTitle: string;
  ctaDescription: string;
  exploreAllEvents: string;
  eventsLabel: string;
  eventImageUrls?: string[];
}

export function HomeCtaSection({
  locale: _locale,
  ctaTitle,
  ctaDescription,
  exploreAllEvents,
  eventsLabel,
  eventImageUrls = [],
}: HomeCtaSectionProps) {
  const handleExploreClick = () => {
    analyticsEvent("Homepage_CTA_Explore_Click", {
      location: "cta_section",
    });
  };

  // Shuffle images deterministically per day to vary the layout
  const shuffledImages = useMemo(() => {
    if (eventImageUrls.length === 0) return [];
    const arr = [...eventImageUrls];
    const seed = Math.floor(Date.now() / 86400000);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 1) * 9301 + 49297) % arr.length;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [eventImageUrls]);

  // Generate "scattered photos on a table" positions
  const scatterLayout = useMemo(() => {
    const count = shuffledImages.length;
    if (count < 6) return [];
    const seed = Math.floor(Date.now() / 86400000);

    // Seeded pseudo-random number generator (Mulberry32)
    function mulberry32(s: number) {
      let state = s;
      return function () {
        state = Math.trunc(state);
        state = Math.trunc(state + 0x6d2b79f5);
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const rand = mulberry32(seed);

    // Generate truly random positions
    const positions = Array.from({ length: count }, () => ({
      left: rand() * 110 - 10, // -10% to 100%
      top: rand() * 110 - 10,
      rotation: rand() * 30 - 15, // -15° to +15°
      scale: 0.85 + rand() * 0.3, // 0.85 to 1.15
      zIndex: Math.floor(rand() * count),
    }));

    return positions;
  }, [shuffledImages]);

  const useScatter = scatterLayout.length >= 6;

  // Drag state: pixel offsets per photo
  const [dragOffsets, setDragOffsets] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const draggingRef = useRef<{
    index: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const hasDraggedRef = useRef(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, index: number) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const current = dragOffsets[index] || { x: 0, y: 0 };
      draggingRef.current = {
        index,
        startX: e.clientX,
        startY: e.clientY,
        origX: current.x,
        origY: current.y,
      };
      hasDraggedRef.current = false;
    },
    [dragOffsets]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const { index, startX, startY, origX, origY } = draggingRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDraggedRef.current = true;
    setDragOffsets((prev) => ({
      ...prev,
      [index]: { x: origX + dx, y: origY + dy },
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  // Fallback: single hero image when not enough event images
  const [heroImage, setHeroImage] = useState<string>(CTA_HERO_IMAGES[0]);

  // Intersection observer for staggered fade-in
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (useScatter) return;
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setHeroImage(CTA_HERO_IMAGES[dayOfYear % CTA_HERO_IMAGES.length]);
  }, [useScatter]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!useScatter) {
    return (
      <HeroBackground image={heroImage} className="mt-12" overlayOpacity="dark">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {ctaTitle}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white">
            {ctaDescription}
          </p>
          <Button size="lg" className="px-8 shadow-lg" asChild>
            <Link
              href="/events"
              onClick={handleExploreClick}
              aria-label={eventsLabel}
            >
              {exploreAllEvents}
            </Link>
          </Button>
        </div>
      </HeroBackground>
    );
  }

  return (
    <section ref={sectionRef} className="relative mt-12 overflow-hidden py-24">
      {/* Scattered photos background */}
      <style jsx global>{`
        @keyframes scatter-drift {
          0%,
          100% {
            transform: var(--base-transform) translate(0, 0);
          }
          25% {
            transform: var(--base-transform) translate(var(--dx1), var(--dy1));
          }
          50% {
            transform: var(--base-transform) translate(var(--dx2), var(--dy2));
          }
          75% {
            transform: var(--base-transform) translate(var(--dx3), var(--dy3));
          }
        }
        .scatter-photo {
          transition:
            opacity 700ms,
            filter 400ms ease,
            box-shadow 400ms ease;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
        }
        .scatter-photo.dragging {
          cursor: grabbing;
          z-index: 200 !important;
          filter: brightness(1.5) saturate(1.3);
          box-shadow: 0 8px 40px 12px rgba(255, 255, 255, 0.35);
        }
        .scatter-photo:hover {
          filter: brightness(1.4) saturate(1.3);
          box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.3);
          z-index: 100 !important;
        }
        .scatter-photo:hover img {
          transform: scale(1.2) !important;
          transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        .scatter-photo img {
          transition: transform 400ms ease;
        }
      `}</style>
      <div
        className="absolute inset-0 z-0 bg-black"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {shuffledImages.map((url, i) => {
          const pos = scatterLayout[i];
          if (!pos) return null;
          const seed = i * 3571;
          const dx1 = ((seed % 7) - 3) * 2;
          const dy1 = (((seed * 3) % 7) - 3) * 2;
          const dx2 = (((seed * 7) % 9) - 4) * 2;
          const dy2 = (((seed * 11) % 7) - 3) * 2;
          const dx3 = (((seed * 13) % 7) - 3) * 2;
          const dy3 = (((seed * 17) % 9) - 4) * 2;
          const duration = 12 + (seed % 10);
          const delay = i * 60;
          const offset = dragOffsets[i] || { x: 0, y: 0 };
          const isDragging = draggingRef.current?.index === i;
          const wasDragged = offset.x !== 0 || offset.y !== 0;

          let photoZIndex = pos.zIndex;
          if (isDragging) photoZIndex = 200;
          else if (wasDragged) photoZIndex = 99;

          let photoAnimation = "none";
          if (!wasDragged && !isDragging && isVisible) {
            photoAnimation = `scatter-drift ${duration}s ease-in-out ${delay}ms infinite`;
          }

          return (
            <div
              key={i}
              className={`scatter-photo absolute w-[90px] sm:w-[110px] md:w-[140px] lg:w-[160px]${isDragging ? "dragging" : ""}`}
              onPointerDown={(e) => handlePointerDown(e, i)}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                zIndex: photoZIndex,
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${delay}ms`,
                ["--base-transform" as string]: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
                ["--dx1" as string]: `${dx1}px`,
                ["--dy1" as string]: `${dy1}px`,
                ["--dx2" as string]: `${dx2}px`,
                ["--dy2" as string]: `${dy2}px`,
                ["--dx3" as string]: `${dx3}px`,
                ["--dy3" as string]: `${dy3}px`,
                animation: photoAnimation,
                transform: `rotate(${pos.rotation}deg) scale(${isDragging ? pos.scale * 1.1 : pos.scale}) translate(${offset.x}px, ${offset.y}px)`,
              }}
            >
              <Image
                src={url}
                alt=""
                role="presentation"
                width={300}
                height={169}
                className="rounded-sm border border-white/10 object-cover shadow-md"
                quality={30}
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
      {/* Dark overlay - pointer-events-none so photos are hoverable */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/50" />
      {/* Content - pointer-events-none so photos behind are hoverable */}
      <div className="container pointer-events-none relative z-10 mx-auto h-full px-4">
        <div className="flex h-full flex-col text-white">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {ctaTitle}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white">
              {ctaDescription}
            </p>
            <Button
              size="lg"
              className="pointer-events-auto px-8 shadow-lg"
              asChild
            >
              <Link
                href="/events"
                onClick={handleExploreClick}
                aria-label={eventsLabel}
              >
                {exploreAllEvents}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface HomeSeeAllButtonProps {
  seeAll: string;
  eventsLabel: string;
}

export function HomeSeeAllButton({
  seeAll,
  eventsLabel,
}: Readonly<HomeSeeAllButtonProps>) {
  const handleClick = () => {
    analyticsEvent("Homepage_SeeAll_Click", {
      location: "events_section",
    });
  };

  return (
    <Button variant="ghost" asChild>
      <Link href="/events" onClick={handleClick} aria-label={eventsLabel}>
        {seeAll}
      </Link>
    </Button>
  );
}

interface HomeNoEventsCtaProps {
  locale: string;
  exploreAllEvents: string;
  eventsLabel: string;
}

export function HomeNoEventsCta({
  locale: _locale,
  exploreAllEvents,
  eventsLabel,
}: HomeNoEventsCtaProps) {
  const handleClick = () => {
    analyticsEvent("Homepage_NoEvents_Explore_Click", {
      location: "no_events_message",
    });
  };

  return (
    <Button asChild>
      <Link href="/events" onClick={handleClick} aria-label={eventsLabel}>
        {exploreAllEvents}
      </Link>
    </Button>
  );
}

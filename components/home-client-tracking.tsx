"use client";

import { useState, useEffect, useMemo } from "react";
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

  // Shuffle images deterministically per day to vary the mosaic
  const shuffledImages = useMemo(() => {
    if (eventImageUrls.length === 0) return [];
    const arr = [...eventImageUrls];
    // Simple seeded shuffle based on day
    const seed = Math.floor(Date.now() / 86400000);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 1) * 9301 + 49297) % arr.length;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [eventImageUrls]);

  const useMosaic = shuffledImages.length >= 6;

  // Fallback: single hero image when not enough event images
  const [heroImage, setHeroImage] = useState<string>(CTA_HERO_IMAGES[0]);

  useEffect(() => {
    if (useMosaic) return;
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setHeroImage(CTA_HERO_IMAGES[dayOfYear % CTA_HERO_IMAGES.length]);
  }, [useMosaic]);

  if (!useMosaic) {
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
    <section className="relative mt-12 overflow-hidden py-24">
      {/* Image mosaic background */}
      <div className="absolute inset-0 z-0 grid grid-cols-4 gap-0.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {shuffledImages.map((url, i) => (
          <div key={i} className="relative aspect-square overflow-hidden">
            <Image
              src={url}
              alt=""
              role="presentation"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16.6vw, 12.5vw"
              quality={30}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1] bg-black/70" />
      {/* Content */}
      <div className="container relative z-10 mx-auto h-full px-4">
        <div className="flex h-full flex-col text-white">
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

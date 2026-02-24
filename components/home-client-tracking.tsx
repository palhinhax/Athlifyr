"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { analyticsEvent } from "@/lib/analytics";
import { HeroBackground } from "@/components/hero-background";

// Hero images for CTA section
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
}

export function HomeCtaSection({
  locale: _locale,
  ctaTitle,
  ctaDescription,
  exploreAllEvents,
}: HomeCtaSectionProps) {
  const handleExploreClick = () => {
    analyticsEvent("Homepage_CTA_Explore_Click", {
      location: "cta_section",
    });
  };

  // Select hero image based on the current day to avoid hydration mismatch
  // This ensures the same image is shown on both server and client
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const heroImage = CTA_HERO_IMAGES[dayOfYear % CTA_HERO_IMAGES.length];

  return (
    <HeroBackground image={heroImage} className="mt-12" overlayOpacity="dark">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {ctaTitle}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white">
          {ctaDescription}
        </p>
        <Link href="/events" onClick={handleExploreClick}>
          <Button size="lg" className="px-8 shadow-lg">
            {exploreAllEvents}
          </Button>
        </Link>
      </div>
    </HeroBackground>
  );
}

interface HomeSeeAllButtonProps {
  seeAll: string;
}

export function HomeSeeAllButton({ seeAll }: HomeSeeAllButtonProps) {
  const handleClick = () => {
    analyticsEvent("Homepage_SeeAll_Click", {
      location: "events_section",
    });
  };

  return (
    <Link href="/events" onClick={handleClick}>
      <Button variant="ghost">{seeAll}</Button>
    </Link>
  );
}

interface HomeNoEventsCtaProps {
  locale: string;
  exploreAllEvents: string;
}

export function HomeNoEventsCta({
  locale: _locale,
  exploreAllEvents,
}: HomeNoEventsCtaProps) {
  const handleClick = () => {
    analyticsEvent("Homepage_NoEvents_Explore_Click", {
      location: "no_events_message",
    });
  };

  return (
    <Link href="/events" onClick={handleClick}>
      <Button>{exploreAllEvents}</Button>
    </Link>
  );
}

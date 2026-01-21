"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { analyticsEvent } from "@/lib/analytics";

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

  return (
    <section className="mt-12 bg-muted/50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">{ctaTitle}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          {ctaDescription}
        </p>
        <Link href="/events" onClick={handleExploreClick}>
          <Button size="lg">{exploreAllEvents}</Button>
        </Link>
      </div>
    </section>
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

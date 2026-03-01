import { CollapsibleDescription } from "@/components/collapsible-description";
import { EventPricingPhases } from "@/components/event-pricing-phases";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PricingPhase } from "@prisma/client";
import { StravaRouteEmbed } from "@/components/strava-route-embed";

interface EventMainContentProps {
  description: string;
  pricingPhases: PricingPhase[];
  variants?: { id: string; name: string }[];
  externalUrl: string | null;
  stravaRouteEmbed?: string | null;
  cancelled?: boolean;
  hasRegistrations?: boolean;
  translations: {
    aboutEvent: string;
    readyToParticipate: string;
    moreInfoDescription: string;
    goToWebsite: string;
  };
}

export function EventMainContent({
  description,
  pricingPhases,
  variants = [],
  externalUrl,
  stravaRouteEmbed,
  cancelled,
  hasRegistrations = false,
  translations: t,
}: EventMainContentProps) {
  return (
    <>
      {/* Description */}
      <div className="prose prose-lg mb-8 max-w-none overflow-x-hidden break-words">
        <h2 className="mb-4 text-2xl font-bold">{t.aboutEvent}</h2>
        <CollapsibleDescription description={description} />
      </div>

      {/* Strava Route Embed - Mobile Only */}
      {stravaRouteEmbed && (
        <div className="mb-8 lg:hidden">
          <StravaRouteEmbed embedCode={stravaRouteEmbed} />
        </div>
      )}

      {/* Event Pricing Phases */}
      {pricingPhases && pricingPhases.length > 0 && (
        <div className="mb-8">
          <EventPricingPhases phases={pricingPhases} variants={variants} />
        </div>
      )}

      {/* CTA */}
      {externalUrl && !cancelled && !hasRegistrations && (
        <div className="border-t pt-8">
          <h3 className="mb-4 text-xl font-bold">{t.readyToParticipate}</h3>
          <p className="mb-6 text-muted-foreground">{t.moreInfoDescription}</p>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block flex justify-center"
          >
            <Button size="lg" className="gap-2">
              {t.goToWebsite}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      )}
    </>
  );
}

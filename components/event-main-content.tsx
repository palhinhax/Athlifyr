import { CollapsibleDescription } from "@/components/collapsible-description";
import { EventPricingPhases } from "@/components/event-pricing-phases";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PricingPhase } from "@prisma/client";

interface EventMainContentProps {
  description: string;
  pricingPhases: PricingPhase[];
  externalUrl: string | null;
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
  externalUrl,
  translations: t,
}: EventMainContentProps) {
  return (
    <>
      {/* Description */}
      <div className="prose prose-lg mb-8 max-w-none">
        <h2 className="mb-4 text-2xl font-bold">{t.aboutEvent}</h2>
        <CollapsibleDescription description={description} />
      </div>

      {/* Event Pricing Phases */}
      {pricingPhases && pricingPhases.length > 0 && (
        <div className="mb-8">
          <EventPricingPhases phases={pricingPhases} />
        </div>
      )}

      {/* CTA */}
      {externalUrl && (
        <div className="border-t pt-8">
          <h3 className="mb-4 text-xl font-bold">{t.readyToParticipate}</h3>
          <p className="mb-6 text-muted-foreground">{t.moreInfoDescription}</p>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
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

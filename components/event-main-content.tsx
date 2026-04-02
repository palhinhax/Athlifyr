import { CollapsibleDescription } from "@/components/collapsible-description";
import { StravaRouteEmbed } from "@/components/strava-route-embed";

interface EventMainContentProps {
  description: string;
  stravaRouteEmbed?: string | null;
  translations: {
    aboutEvent: string;
  };
}

export function EventMainContent({
  description,
  stravaRouteEmbed,
  translations: t,
}: EventMainContentProps) {
  return (
    <>
      {/* Description */}
      <section className="mb-8">
        <h2 className="mb-8 font-headline text-2xl font-extrabold sm:text-3xl">
          {t.aboutEvent}
        </h2>
        <div className="prose prose-lg max-w-none overflow-x-hidden break-words text-muted-foreground">
          <CollapsibleDescription description={description} />
        </div>
      </section>

      {/* Strava Route Embed - Mobile Only */}
      {stravaRouteEmbed && (
        <div className="mb-8 lg:hidden">
          <StravaRouteEmbed embedCode={stravaRouteEmbed} />
        </div>
      )}
    </>
  );
}

import { Route } from "lucide-react";
import { TriathlonSegmentsDisplay } from "./triathlon-segments-display";
import { formatPrice, type Currency } from "@/lib/currency";

interface TriathlonSegment {
  id: string;
  segmentType: "SWIM" | "BIKE" | "RUN";
  distanceKm: number;
  terrainType: "POOL" | "OPEN_WATER" | "ROAD" | "TRAIL" | "MIXED";
  order: number;
}

interface EventVariant {
  id: string;
  name: string;
  distanceKm: number | null;
  description: string | null;
  elevationGainM: number | null;
  elevationLossM: number | null;
  cutoffTimeHours: number | null;
  itraPoints: number | null;
  atrpGrade: number | null;
  startTime: string | null;
  currency?: Currency;
  triathlonSegments?: TriathlonSegment[];
  pricingPhases: Array<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    price: number;
    currency?: Currency;
    discountPercent: number | null;
    note: string | null;
  }>;
}

interface VariantLabels {
  title: string;
  distances: string;
  distance: string;
  elevationGain: string;
  elevationLoss: string;
  cutoffTime: string;
  time: string;
  prices: string;
  currentPhase: string;
  triathlon?: {
    swim: string;
    bike: string;
    run: string;
    terrainTypes: {
      POOL: string;
      OPEN_WATER: string;
      ROAD: string;
      TRAIL: string;
      MIXED: string;
    };
  };
}

interface EventVariantsListProps {
  variants: EventVariant[];
  labels?: VariantLabels;
}

// Default labels in Portuguese (fallback)
const defaultLabels: VariantLabels = {
  title: "Variantes / Distâncias",
  distances: "Distâncias",
  distance: "Distância",
  elevationGain: "D+",
  elevationLoss: "D-",
  cutoffTime: "Tempo Limite",
  time: "Hora",
  prices: "Preços",
  currentPhase: "(Atual)",
  triathlon: {
    swim: "Natação",
    bike: "Ciclismo",
    run: "Corrida",
    terrainTypes: {
      POOL: "Piscina",
      OPEN_WATER: "Águas Abertas",
      ROAD: "Estrada",
      TRAIL: "Trail",
      MIXED: "Misto",
    },
  },
};

export function EventVariantsList({
  variants,
  labels = defaultLabels,
}: EventVariantsListProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Check if any variant has triathlon segments
  const hasTriathlonSegments = variants.some(
    (v) => v.triathlonSegments && v.triathlonSegments.length > 0
  );

  // Get unique distances for compact display (only for non-triathlon variants)
  const distances = variants
    .filter((v) => !v.triathlonSegments || v.triathlonSegments.length === 0)
    .map((v) => v.distanceKm)
    .filter((d): d is number => d !== null);
  const uniqueDistances = Array.from(new Set(distances)).sort((a, b) => a - b);

  return (
    <>
      {/* Triathlon Segments Display - Show first if present */}
      {hasTriathlonSegments &&
        variants.map((variant) =>
          variant.triathlonSegments && variant.triathlonSegments.length > 0 ? (
            <div key={`triathlon-${variant.id}`}>
              <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                {variant.name}
              </h2>
              <TriathlonSegmentsDisplay
                segments={variant.triathlonSegments}
                labels={labels.triathlon}
              />
            </div>
          ) : null
        )}

      {/* Compact distance tags - Only show for non-triathlon variants */}
      {uniqueDistances.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {labels.distances}:
            </span>
            {uniqueDistances.length === 1 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {uniqueDistances[0]} km
              </span>
            ) : (
              uniqueDistances.map((distance) => (
                <span
                  key={distance}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {distance} km
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Detailed variants */}
      <div className="mb-8">
        <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          {labels.title}
        </h2>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {variants
            .filter(
              (v) => !v.triathlonSegments || v.triathlonSegments.length === 0
            )
            .map((variant) => (
              <div
                key={variant.id}
                className="space-y-2 rounded-lg border p-3 sm:space-y-3 sm:p-4"
              >
                <h3 className="text-sm font-semibold sm:text-base">
                  {variant.name}
                </h3>
                {variant.description && (
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {variant.description}
                  </p>
                )}

                {/* Technical Data */}
                <div className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                  {variant.distanceKm && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {labels.distance}:
                      </span>
                      <span className="font-medium">
                        {variant.distanceKm} km
                      </span>
                    </div>
                  )}
                  {variant.elevationGainM && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {labels.elevationGain}:
                      </span>
                      <span className="font-medium">
                        {variant.elevationGainM} m
                      </span>
                    </div>
                  )}
                  {variant.elevationLossM && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {labels.elevationLoss}:
                      </span>
                      <span className="font-medium">
                        {variant.elevationLossM} m
                      </span>
                    </div>
                  )}
                  {variant.cutoffTimeHours && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {labels.cutoffTime}:
                      </span>
                      <span className="font-medium">
                        {variant.cutoffTimeHours}h
                      </span>
                    </div>
                  )}
                  {variant.itraPoints && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ITRA:</span>
                      <span className="font-medium">{variant.itraPoints}</span>
                    </div>
                  )}
                  {variant.atrpGrade && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ATRP:</span>
                      <span className="font-medium">{variant.atrpGrade}</span>
                    </div>
                  )}
                  {variant.startTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {labels.time}:
                      </span>
                      <span className="font-medium">{variant.startTime}</span>
                    </div>
                  )}
                </div>

                {/* Pricing Phases */}
                {variant.pricingPhases && variant.pricingPhases.length > 0 && (
                  <div className="space-y-1 border-t pt-2 sm:pt-3">
                    <div className="text-xs font-medium text-muted-foreground sm:text-sm">
                      {labels.prices}:
                    </div>
                    {variant.pricingPhases.map((phase) => {
                      const isActive =
                        new Date() >= phase.startDate &&
                        new Date() <= phase.endDate;
                      const hasEnded = new Date() > phase.endDate;

                      return (
                        <div
                          key={phase.id}
                          className={`flex items-center justify-between gap-2 text-xs sm:text-sm ${
                            isActive
                              ? "font-semibold text-primary"
                              : hasEnded
                                ? "text-muted-foreground/50 line-through"
                                : "text-muted-foreground"
                          }`}
                        >
                          <span className="truncate">
                            {phase.name}
                            {isActive && ` ${labels.currentPhase}`}
                          </span>
                          <span className="whitespace-nowrap font-medium">
                            {formatPrice(phase.price, phase.currency)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

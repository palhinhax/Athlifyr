import { Route, Mountain } from "lucide-react";
import { TriathlonSegmentsDisplay } from "./triathlon-segments-display";

interface TriathlonSegment {
  id: string;
  segmentType: "SWIM" | "BIKE" | "RUN";
  distanceKm: number;
  terrainType: "POOL" | "OPEN_WATER" | "ROAD" | "TRAIL" | "MIXED";
  order: number;
}

interface PricingPhase {
  id: string;
  name: string;
  price: number;
  currency: string;
  startDate: Date;
  endDate: Date;
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
  maxParticipants?: number | null;
  registrationCount?: number;
  triathlonSegments?: TriathlonSegment[];
  pricingPhases?: PricingPhase[];
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
  soldOut?: string;
  spotsLeft?: string;
  showRoute?: string;
  hideRoute?: string;
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
  eventId?: string;
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
  soldOut: "Esgotado",
  spotsLeft: "vagas restantes",
  showRoute: "Ver percurso",
  hideRoute: "Ocultar percurso",
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

function getCurrentPrice(
  pricingPhases?: PricingPhase[]
): { price: number; currency: string } | null {
  if (!pricingPhases || pricingPhases.length === 0) return null;
  const now = new Date();
  const active = pricingPhases.find(
    (p) => new Date(p.startDate) <= now && new Date(p.endDate) >= now
  );
  if (active) return { price: active.price, currency: active.currency };
  // If no active phase, return the cheapest
  const sorted = [...pricingPhases].sort((a, b) => a.price - b.price);
  return { price: sorted[0].price, currency: sorted[0].currency };
}

function getVariantIcon(name: string): React.ReactNode {
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes("caminhada") ||
    lowerName.includes("walk") ||
    lowerName.includes("hike")
  ) {
    return <Route className="h-6 w-6 text-primary" />;
  }
  if (
    lowerName.includes("sprint") ||
    lowerName.includes("mini") ||
    lowerName.includes("kids")
  ) {
    return <Route className="h-6 w-6 text-primary" />;
  }
  return <Mountain className="h-6 w-6 text-primary" />;
}

export function EventVariantsList({
  variants,
  labels = defaultLabels,
  eventId: _eventId,
}: EventVariantsListProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Check if any variant has triathlon segments
  const hasTriathlonSegments = variants.some(
    (v) => v.triathlonSegments && v.triathlonSegments.length > 0
  );

  // Non-triathlon variants
  const standardVariants = variants.filter(
    (v) => !v.triathlonSegments || v.triathlonSegments.length === 0
  );

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

      {/* Bento-style variant cards */}
      {standardVariants.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-6 text-2xl font-extrabold sm:text-3xl">
            {labels.title}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {standardVariants.map((variant) => {
              const isSoldOut =
                variant.maxParticipants != null &&
                (variant.registrationCount ?? 0) >= variant.maxParticipants;
              const currentPrice = getCurrentPrice(variant.pricingPhases);

              return (
                <div
                  key={variant.id}
                  className={`group flex flex-col justify-between gap-6 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md sm:flex-row sm:p-8 ${
                    isSoldOut ? "opacity-60" : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {getVariantIcon(variant.name)}
                      </div>
                      <h3 className="text-xl font-bold sm:text-2xl">
                        {variant.name}
                      </h3>
                      {isSoldOut && (
                        <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                          {labels.soldOut}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      {variant.distanceKm && (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {labels.distance}
                          </span>
                          <span className="text-lg font-black sm:text-xl">
                            {variant.distanceKm} km
                          </span>
                        </div>
                      )}
                      {variant.elevationGainM && (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {labels.elevationGain}
                          </span>
                          <span className="text-lg font-black sm:text-xl">
                            {variant.elevationGainM}m D+
                          </span>
                        </div>
                      )}
                      {variant.startTime && (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {labels.time}
                          </span>
                          <span className="text-lg font-black sm:text-xl">
                            {variant.startTime}
                          </span>
                        </div>
                      )}
                      {variant.cutoffTimeHours && (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {labels.cutoffTime}
                          </span>
                          <span className="text-lg font-black sm:text-xl">
                            {variant.cutoffTimeHours}h
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {currentPrice && (
                    <div className="flex flex-col items-start justify-center sm:items-end">
                      <span className="text-3xl font-black text-primary sm:text-4xl">
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: currentPrice.currency || "EUR",
                          minimumFractionDigits: 2,
                        }).format(currentPrice.price)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

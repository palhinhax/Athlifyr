import { Route } from "lucide-react";
import { TriathlonSegmentsDisplay } from "./triathlon-segments-display";
import { VariantCardWithMap } from "./variant-card-with-map";

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
  maxParticipants?: number | null;
  registrationCount?: number;
  triathlonSegments?: TriathlonSegment[];
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

export function EventVariantsList({
  variants,
  labels = defaultLabels,
  eventId,
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

      {/* Compact variant cards */}
      {standardVariants.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
            <Route className="h-5 w-5 text-primary" />
            {labels.title}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {standardVariants.map((variant) => {
              const isSoldOut =
                variant.maxParticipants != null &&
                (variant.registrationCount ?? 0) >= variant.maxParticipants;

              return (
                <VariantCardWithMap
                  key={variant.id}
                  variant={variant}
                  isSoldOut={isSoldOut}
                  labels={labels}
                  eventId={eventId}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

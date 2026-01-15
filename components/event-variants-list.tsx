import { Route } from "lucide-react";

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
  pricingPhases: Array<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    price: number;
    discountPercent: number | null;
    note: string | null;
  }>;
}

interface EventVariantsListProps {
  variants: EventVariant[];
}

export function EventVariantsList({ variants }: EventVariantsListProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Get unique distances for compact display
  const distances = variants
    .map((v) => v.distanceKm)
    .filter((d): d is number => d !== null);
  const uniqueDistances = Array.from(new Set(distances)).sort((a, b) => a - b);

  return (
    <>
      {/* Compact distance tags */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Distâncias:
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

      {/* Detailed variants */}
      <div className="mb-8">
        <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          Variantes / Distâncias
        </h2>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant) => (
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
                    <span className="text-muted-foreground">Distância:</span>
                    <span className="font-medium">{variant.distanceKm} km</span>
                  </div>
                )}
                {variant.elevationGainM && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">D+:</span>
                    <span className="font-medium">
                      {variant.elevationGainM} m
                    </span>
                  </div>
                )}
                {variant.elevationLossM && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">D-:</span>
                    <span className="font-medium">
                      {variant.elevationLossM} m
                    </span>
                  </div>
                )}
                {variant.cutoffTimeHours && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo Limite:</span>
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
                    <span className="text-muted-foreground">Hora:</span>
                    <span className="font-medium">{variant.startTime}</span>
                  </div>
                )}
              </div>

              {/* Pricing Phases */}
              {variant.pricingPhases && variant.pricingPhases.length > 0 && (
                <div className="space-y-1 border-t pt-2 sm:pt-3">
                  <div className="text-xs font-medium text-muted-foreground sm:text-sm">
                    Preços:
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
                          {isActive && " (Atual)"}
                        </span>
                        <span className="whitespace-nowrap font-medium">
                          {phase.price.toFixed(2)}€
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

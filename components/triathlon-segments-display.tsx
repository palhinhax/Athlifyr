import { Waves, Bike, FootprintsIcon as Run } from "lucide-react";

interface TriathlonSegment {
  id: string;
  segmentType: "SWIM" | "BIKE" | "RUN";
  distanceKm: number;
  terrainType: "POOL" | "OPEN_WATER" | "ROAD" | "TRAIL" | "MIXED";
  order: number;
}

interface TriathlonSegmentsDisplayProps {
  segments: TriathlonSegment[];
  labels?: {
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

// Default labels in Portuguese (fallback)
const defaultLabels = {
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
};

const segmentIcons = {
  SWIM: Waves,
  BIKE: Bike,
  RUN: Run,
};

export function TriathlonSegmentsDisplay({
  segments,
  labels = defaultLabels,
}: TriathlonSegmentsDisplayProps) {
  if (!segments || segments.length === 0) {
    return null;
  }

  // Sort segments by order
  const sortedSegments = [...segments].sort((a, b) => a.order - b.order);

  // Get segment label
  const getSegmentLabel = (type: "SWIM" | "BIKE" | "RUN") => {
    switch (type) {
      case "SWIM":
        return labels.swim;
      case "BIKE":
        return labels.bike;
      case "RUN":
        return labels.run;
    }
  };

  return (
    <div className="mb-8">
      {/* Compact overview - horizontal layout with arrows */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {sortedSegments.map((segment, index) => {
          const Icon = segmentIcons[segment.segmentType];
          return (
            <div key={segment.id} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 sm:px-4">
                <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                <span className="text-sm font-medium text-primary sm:text-base">
                  {segment.distanceKm} km
                </span>
              </div>
              {index < sortedSegments.length - 1 && (
                <span className="text-lg text-muted-foreground sm:text-xl">
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed breakdown - vertical timeline */}
      <div className="space-y-4">
        {sortedSegments.map((segment, index) => {
          const Icon = segmentIcons[segment.segmentType];
          const isLast = index === sortedSegments.length - 1;

          return (
            <div key={segment.id} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                {!isLast && (
                  <div
                    className="my-1 w-0.5 flex-1 bg-primary/20"
                    style={{ minHeight: "20px" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <h3 className="mb-1 text-lg font-semibold">
                  {getSegmentLabel(segment.segmentType)}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">
                      {segment.distanceKm} km
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5">
                    <span>{labels.terrainTypes[segment.terrainType]}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Metadata } from "next";
import { EventsMap } from "@/components/events-map";

export const metadata: Metadata = {
  title: "Mapa de Eventos - Athlifyr",
  description:
    "Explora eventos desportivos em Portugal no mapa interativo. Encontra corridas, trails, triatlons e mais perto de ti.",
  openGraph: {
    title: "Mapa de Eventos - Athlifyr",
    description: "Explora eventos desportivos em Portugal no mapa interativo.",
    type: "website",
  },
};

export default function MapPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Mapa de Eventos</h1>
          <p className="text-sm text-muted-foreground">
            Explora eventos desportivos por localização
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <EventsMap />
      </div>
    </div>
  );
}

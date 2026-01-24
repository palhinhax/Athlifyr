"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Edit, Trash2, UserPlus, DollarSign } from "lucide-react";

type VenueType =
  | "CROSSFIT_BOX"
  | "GYM"
  | "PT_STUDIO"
  | "MASSAGE"
  | "PHYSIO"
  | "NUTRITION"
  | "OTHER";

interface Venue {
  id: string;
  name: string;
  slug: string;
  type: VenueType;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  commissionType: "PERCENT" | "FIXED";
  commissionValue: number;
  createdAt: string;
}

const venueTypeLabels: Record<VenueType, string> = {
  CROSSFIT_BOX: "CrossFit Box",
  GYM: "Ginásio",
  PT_STUDIO: "Estúdio PT",
  MASSAGE: "Massagem",
  PHYSIO: "Fisioterapia",
  NUTRITION: "Nutrição",
  OTHER: "Outro",
};

interface AdminVenueCardProps {
  venue: Venue;
  onOpenFeeDialog: (venue: Venue) => void;
  onOpenOwnerDialog: (venue: Venue) => void;
  onDelete: (id: string) => void;
}

export function AdminVenueCard({
  venue,
  onOpenFeeDialog,
  onOpenOwnerDialog,
  onDelete,
}: AdminVenueCardProps) {
  const router = useRouter();

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold">{venue.name}</h3>
            <p className="text-sm text-muted-foreground">
              {venueTypeLabels[venue.type]}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenFeeDialog(venue)}
              title="Gerir Comissões"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenOwnerDialog(venue)}
              title="Definir Owner"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/venues/${venue.slug}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(venue.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          {venue.description && (
            <p className="line-clamp-2 text-muted-foreground">
              {venue.description}
            </p>
          )}
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate">{venue.address}</p>
              <p className="text-muted-foreground">
                {venue.city}, {venue.country}
              </p>
            </div>
          </div>
          {(venue.latitude || venue.longitude) && (
            <div className="pt-2 text-xs text-muted-foreground">
              <span className="block truncate">
                📍 {venue.latitude?.toFixed(4)}, {venue.longitude?.toFixed(4)}
              </span>
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/50 p-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 text-xs">
              <p className="font-medium">
                Comissão:{" "}
                {venue.commissionType === "PERCENT"
                  ? `${(venue.commissionValue / 100).toFixed(2)}%`
                  : `${(venue.commissionValue / 100).toFixed(2)}€`}
              </p>
              <p className="text-muted-foreground">
                {venue.commissionType === "PERCENT"
                  ? "Percentagem"
                  : "Valor fixo"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

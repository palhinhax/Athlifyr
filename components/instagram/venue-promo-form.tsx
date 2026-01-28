"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VenueSearch } from "./venue-search";
import { VenuePromoPayload } from "@/types/instagram";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VenueSearchResult {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo: string | null;
  city: string | null;
  country: string;
  services: string[];
  instagram: string | null;
}

interface VenuePromoFormProps {
  payload: VenuePromoPayload;
  onPayloadChange: (payload: VenuePromoPayload) => void;
}

const venueTypeLabels: Record<string, string> = {
  GYM: "Ginásio",
  BOX: "Box CrossFit",
  STUDIO: "Estúdio",
  POOL: "Piscina",
  TRACK: "Pista",
  OUTDOOR: "Outdoor",
  SPORTS_CENTER: "Centro Desportivo",
  WELLNESS_CENTER: "Centro de Bem-Estar",
  MASSAGE_THERAPY: "Massagem Desportiva",
  PHYSIOTHERAPY: "Fisioterapia",
  NUTRITION: "Nutrição",
  OTHER: "Outro",
};

const serviceLabels: Record<string, string> = {
  // Training Services
  PERSONAL_TRAINING: "Personal Training",
  GROUP_CLASSES: "Aulas de Grupo",
  CROSSFIT: "CrossFit",
  YOGA: "Yoga",
  PILATES: "Pilates",
  SWIMMING: "Natação",
  RUNNING: "Running",
  CYCLING: "Cycling",
  MARTIAL_ARTS: "Artes Marciais",
  WEIGHTLIFTING: "Musculação",
  HIIT: "HIIT",
  FUNCTIONAL_TRAINING: "Treino Funcional",
  STRENGTH_CONDITIONING: "Força e Condicionamento",
  // Recovery & Wellness
  SPORTS_MASSAGE: "Massagem Desportiva",
  PHYSIOTHERAPY: "Fisioterapia",
  RECOVERY: "Recuperação",
  NUTRITION_CONSULTING: "Consulta de Nutrição",
  CRYOTHERAPY: "Crioterapia",
  SAUNA: "Sauna",
  STRETCHING: "Alongamento",
  MEDITATION: "Meditação",
  // Other
  EVENTS: "Eventos",
  COMPETITIONS: "Competições",
  KIDS_PROGRAMS: "Programas Kids",
  SENIOR_PROGRAMS: "Programas Sénior",
  ONLINE_COACHING: "Coaching Online",
};

export function VenuePromoForm({
  payload,
  onPayloadChange,
}: VenuePromoFormProps) {
  const handleVenueSelect = (venue: VenueSearchResult) => {
    // Update payload with venue data
    onPayloadChange({
      ...payload,
      venueName: venue.name,
      venueType: venueTypeLabels[venue.type] || venue.type,
      location: venue.city
        ? `${venue.city}${venue.country ? `, ${venue.country}` : ""}`
        : "",
      logoUrl: venue.logo || undefined,
      services: venue.services
        ? venue.services
            .slice(0, 4)
            .map((s: string) => serviceLabels[s] || s)
            .filter(Boolean)
        : undefined,
      instagram: venue.instagram || undefined,
    });
  };

  const updatePayload = (updates: Partial<VenuePromoPayload>) => {
    onPayloadChange({ ...payload, ...updates });
  };

  return (
    <div className="space-y-4">
      {/* Venue Search */}
      <div>
        <Label>Procurar Venue</Label>
        <VenueSearch onVenueSelect={handleVenueSelect} />
        <p className="mt-1 text-xs text-muted-foreground">
          Procura um venue existente para preencher automaticamente
        </p>
      </div>

      {/* Manual Fields */}
      <div className="grid gap-4 pt-2">
        <div>
          <Label>Nome do Venue *</Label>
          <Input
            value={payload.venueName}
            onChange={(e) => updatePayload({ venueName: e.target.value })}
            maxLength={40}
            placeholder="FM Massagem Desportiva"
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {payload.venueName.length}/40
          </p>
        </div>

        <div>
          <Label>Tipo de Venue</Label>
          <Select
            value={payload.venueType}
            onValueChange={(value) => updatePayload({ venueType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleciona o tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(venueTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tagline</Label>
          <Textarea
            value={payload.tagline}
            onChange={(e) => updatePayload({ tagline: e.target.value })}
            maxLength={100}
            placeholder="Recuperação e performance para atletas"
            className="h-16 resize-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {payload.tagline.length}/100
          </p>
        </div>

        <div>
          <Label>Localização</Label>
          <Input
            value={payload.location}
            onChange={(e) => updatePayload({ location: e.target.value })}
            maxLength={40}
            placeholder="Ermesinde, Portugal"
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {payload.location.length}/40
          </p>
        </div>

        <div>
          <Label>Serviços (separados por vírgula)</Label>
          <Input
            value={payload.services?.join(", ") || ""}
            onChange={(e) =>
              updatePayload({
                services: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 4),
              })
            }
            placeholder="Massagem, Recuperação, Fisioterapia"
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Máximo 4 serviços para o template
          </p>
        </div>

        <div>
          <Label>URL do Logo</Label>
          <Input
            value={payload.logoUrl || ""}
            onChange={(e) =>
              updatePayload({ logoUrl: e.target.value || undefined })
            }
            placeholder="https://..."
            autoComplete="off"
          />
        </div>

        <div>
          <Label>CTA (Call to Action)</Label>
          <Input
            value={payload.cta || ""}
            onChange={(e) =>
              updatePayload({ cta: e.target.value || undefined })
            }
            maxLength={30}
            placeholder="Descobre na Athlifyr"
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {(payload.cta || "").length}/30
          </p>
        </div>

        <div>
          <Label>Instagram Handle</Label>
          <Input
            value={payload.instagram || ""}
            onChange={(e) =>
              updatePayload({ instagram: e.target.value || undefined })
            }
            maxLength={30}
            placeholder="@fmmassagem"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

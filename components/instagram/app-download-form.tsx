import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface AppDownloadFormProps {
  headline: string;
  subheadline: string;
  features: string[];
  badgeUrl: string;
  legalText: string;
  cta: string;
  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onFeaturesChange: (value: string[]) => void;
  onBadgeUrlChange: (value: string) => void;
  onLegalTextChange: (value: string) => void;
  onCtaChange: (value: string) => void;
}

export function AppDownloadForm({
  headline,
  subheadline,
  features,
  badgeUrl,
  legalText,
  cta,
  onHeadlineChange,
  onSubheadlineChange,
  onFeaturesChange,
  onBadgeUrlChange,
  onLegalTextChange,
  onCtaChange,
}: AppDownloadFormProps) {
  const addFeature = () => {
    if (features.length < 4) {
      onFeaturesChange([...features, ""]);
    }
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      onFeaturesChange(features.filter((_, i) => i !== index));
    }
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    onFeaturesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Título Principal *</Label>
        <Input
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          maxLength={50}
          placeholder="Descarrega a App"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {headline.length}/50
        </p>
      </div>

      <div>
        <Label>Subtítulo *</Label>
        <Input
          value={subheadline}
          onChange={(e) => onSubheadlineChange(e.target.value)}
          maxLength={60}
          placeholder="Todos os eventos desportivos num só lugar"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {subheadline.length}/60
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Funcionalidades</Label>
          {features.length < 4 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addFeature}
              className="h-7 px-2 text-xs"
            >
              <Plus className="mr-1 h-3 w-3" />
              Adicionar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted text-sm font-medium">
                ✓
              </span>
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                maxLength={40}
                placeholder={`Funcionalidade ${index + 1}...`}
                autoComplete="off"
              />
              {features.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                  className="h-9 w-9 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>URL do Badge Google Play</Label>
        <Input
          value={badgeUrl}
          onChange={(e) => onBadgeUrlChange(e.target.value)}
          placeholder="/images/badges/google-play-pt.png"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Caminho para a imagem do badge Google Play
        </p>
      </div>

      <div>
        <Label>CTA (Call to Action)</Label>
        <Input
          value={cta}
          onChange={(e) => onCtaChange(e.target.value)}
          maxLength={30}
          placeholder="Disponível no Google Play"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">{cta.length}/30</p>
      </div>

      <div>
        <Label>Texto Legal (Atribuição)</Label>
        <Input
          value={legalText}
          onChange={(e) => onLegalTextChange(e.target.value)}
          placeholder="Google Play e o logótipo do Google Play são marcas comerciais da Google LLC."
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Atribuição de marca (opcional, recomendado pela Google)
        </p>
      </div>
    </div>
  );
}

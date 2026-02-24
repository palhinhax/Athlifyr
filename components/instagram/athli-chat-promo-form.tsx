import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AthliChatPromoFormProps {
  headline: string;
  subheadline: string;
  chatSuggestions: string[];
  cta: string;
  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onChatSuggestionsChange: (value: string[]) => void;
  onCtaChange: (value: string) => void;
}

export function AthliChatPromoForm({
  headline,
  subheadline,
  chatSuggestions,
  cta,
  onHeadlineChange,
  onSubheadlineChange,
  onChatSuggestionsChange,
  onCtaChange,
}: AthliChatPromoFormProps) {
  const updateSuggestion = (index: number, value: string) => {
    const updated = [...chatSuggestions];
    updated[index] = value;
    onChatSuggestionsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Título Principal *</Label>
        <Input
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          maxLength={50}
          placeholder="Conhece o Athli"
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
          placeholder="O teu assistente desportivo com IA"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {subheadline.length}/60
        </p>
      </div>

      <div>
        <Label className="mb-2 block">Sugestões do Chat (4 chips)</Label>
        <div className="space-y-2">
          {chatSuggestions.map((suggestion, index) => (
            <Input
              key={index}
              value={suggestion}
              onChange={(e) => updateSuggestion(index, e.target.value)}
              maxLength={30}
              placeholder={`Sugestão ${index + 1}`}
              autoComplete="off"
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Textos mostrados nos chips de sugestão da janela do chat
        </p>
      </div>

      <div>
        <Label>CTA (opcional)</Label>
        <Input
          value={cta}
          onChange={(e) => onCtaChange(e.target.value)}
          maxLength={30}
          placeholder="Experimenta agora"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">{cta.length}/30</p>
      </div>
    </div>
  );
}

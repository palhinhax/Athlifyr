import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface GiveawayPromoFormProps {
  eventName: string;
  giveawayTitle: string;
  prize: string;
  drawDate: string;
  howToEnter: string[];
  cta: string;
  onEventNameChange: (value: string) => void;
  onGiveawayTitleChange: (value: string) => void;
  onPrizeChange: (value: string) => void;
  onDrawDateChange: (value: string) => void;
  onHowToEnterChange: (value: string[]) => void;
  onCtaChange: (value: string) => void;
}

export function GiveawayPromoForm({
  eventName,
  giveawayTitle,
  prize,
  drawDate,
  howToEnter,
  cta,
  onEventNameChange,
  onGiveawayTitleChange,
  onPrizeChange,
  onDrawDateChange,
  onHowToEnterChange,
  onCtaChange,
}: GiveawayPromoFormProps) {
  const addStep = () => {
    if (howToEnter.length < 4) {
      onHowToEnterChange([...howToEnter, ""]);
    }
  };

  const removeStep = (index: number) => {
    if (howToEnter.length > 1) {
      onHowToEnterChange(howToEnter.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...howToEnter];
    updated[index] = value;
    onHowToEnterChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Título *</Label>
        <Input
          value={giveawayTitle}
          onChange={(e) => onGiveawayTitleChange(e.target.value)}
          maxLength={40}
          placeholder="SORTEIO"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {giveawayTitle.length}/40
        </p>
      </div>

      <div>
        <Label>Evento *</Label>
        <Input
          value={eventName}
          onChange={(e) => onEventNameChange(e.target.value)}
          maxLength={50}
          placeholder="Meia Maratona do Porto 2026"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {eventName.length}/50
        </p>
      </div>

      <div>
        <Label>Prémio *</Label>
        <Input
          value={prize}
          onChange={(e) => onPrizeChange(e.target.value)}
          maxLength={60}
          placeholder="1 Inscrição"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">{prize.length}/60</p>
      </div>

      <div>
        <Label>Data do Sorteio</Label>
        <Input
          value={drawDate}
          onChange={(e) => onDrawDateChange(e.target.value)}
          maxLength={30}
          placeholder="15 Mar 2026"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {drawDate.length}/30
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Como Participar</Label>
          {howToEnter.length < 4 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addStep}
              className="h-7 px-2 text-xs"
            >
              <Plus className="mr-1 h-3 w-3" />
              Passo
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {howToEnter.map((step, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted text-sm font-medium">
                {index + 1}
              </span>
              <Input
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                maxLength={40}
                placeholder={`Passo ${index + 1}...`}
                autoComplete="off"
              />
              {howToEnter.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(index)}
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
        <Label>CTA (Call to Action)</Label>
        <Input
          value={cta}
          onChange={(e) => onCtaChange(e.target.value)}
          maxLength={30}
          placeholder="Participa Já"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">{cta.length}/30</p>
      </div>
    </div>
  );
}

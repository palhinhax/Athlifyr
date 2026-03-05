import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { GiveawayWinnerPayload } from "@/types/instagram";

interface GiveawayWinnerFormProps {
  eventName: string;
  giveawayTitle: string;
  prize: string;
  winners: GiveawayWinnerPayload["winners"];
  drawDate: string;
  thankYouLine: string;
  verificationHash: string;
  onEventNameChange: (value: string) => void;
  onGiveawayTitleChange: (value: string) => void;
  onPrizeChange: (value: string) => void;
  onWinnersChange: (value: GiveawayWinnerPayload["winners"]) => void;
  onDrawDateChange: (value: string) => void;
  onThankYouLineChange: (value: string) => void;
  onVerificationHashChange: (value: string) => void;
}

export function GiveawayWinnerForm({
  eventName,
  giveawayTitle,
  prize,
  winners,
  drawDate,
  thankYouLine,
  verificationHash,
  onEventNameChange,
  onGiveawayTitleChange,
  onPrizeChange,
  onWinnersChange,
  onDrawDateChange,
  onThankYouLineChange,
  onVerificationHashChange,
}: GiveawayWinnerFormProps) {
  const addWinner = () => {
    if (winners.length < 5) {
      onWinnersChange([...winners, { ticketNumber: "", label: "" }]);
    }
  };

  const removeWinner = (index: number) => {
    if (winners.length > 1) {
      onWinnersChange(winners.filter((_, i) => i !== index));
    }
  };

  const updateWinner = (
    index: number,
    field: keyof GiveawayWinnerPayload["winners"][0],
    value: string
  ) => {
    const updated = [...winners];
    updated[index] = { ...updated[index], [field]: value };
    onWinnersChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <Label>Título *</Label>
        <Input
          value={giveawayTitle}
          onChange={(e) => onGiveawayTitleChange(e.target.value)}
          maxLength={40}
          placeholder="VENCEDORES DO SORTEIO"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {giveawayTitle.length}/40
        </p>
      </div>

      {/* Event name */}
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

      {/* Prize */}
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

      {/* Winners */}
      <div>
        <Label>Números Vencedores * (máx. 5)</Label>
        <div className="mt-2 space-y-3">
          {winners.map((winner, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xs font-black text-black">
                {index + 1}
              </div>
              <div className="flex flex-1 gap-2">
                <Input
                  value={winner.ticketNumber}
                  onChange={(e) =>
                    updateWinner(index, "ticketNumber", e.target.value)
                  }
                  maxLength={20}
                  placeholder="#0042"
                  autoComplete="off"
                  className="flex-1"
                />
                <Input
                  value={winner.label ?? ""}
                  onChange={(e) => updateWinner(index, "label", e.target.value)}
                  maxLength={20}
                  placeholder="1º Lugar (opcional)"
                  autoComplete="off"
                  className="flex-1"
                />
              </div>
              {winners.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWinner(index)}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {winners.length < 5 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addWinner}
            className="mt-2 w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Vencedor
          </Button>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {winners.length}/5 vencedores
        </p>
      </div>

      {/* Draw date */}
      <div>
        <Label>Data do Sorteio</Label>
        <Input
          value={drawDate}
          onChange={(e) => onDrawDateChange(e.target.value)}
          maxLength={30}
          placeholder="1 Mar 2026"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {drawDate.length}/30
        </p>
      </div>

      {/* Thank you line */}
      <div>
        <Label>Mensagem de Agradecimento</Label>
        <Input
          value={thankYouLine}
          onChange={(e) => onThankYouLineChange(e.target.value)}
          maxLength={60}
          placeholder="Obrigado a todos os participantes!"
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {thankYouLine.length}/60
        </p>
      </div>

      {/* Verification hash */}
      <div>
        <Label>Hash de Verificação (opcional)</Label>
        <Input
          value={verificationHash}
          onChange={(e) => onVerificationHashChange(e.target.value)}
          maxLength={64}
          placeholder="SHA-256 para transparência do sorteio"
          autoComplete="off"
          className="font-mono text-xs"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Aparece discretamente no rodapé para verificação.
        </p>
      </div>
    </div>
  );
}

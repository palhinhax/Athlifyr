import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  selected: boolean;
}

interface MonthlyEventsFormProps {
  month: string;
  sportType: string;
  events: EventItem[];
  isLoading: boolean;
  onMonthChange: (value: string) => void;
  onSportTypeChange: (value: string) => void;
  onToggleEvent: (eventId: string) => void;
  onToggleAllEvents: (selected: boolean) => void;
}

export function MonthlyEventsForm({
  month,
  sportType,
  events,
  isLoading,
  onMonthChange,
  onSportTypeChange,
  onToggleEvent,
  onToggleAllEvents,
}: MonthlyEventsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Mês *</Label>
        <Input
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          placeholder="2026-01"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Seleciona o mês para listar eventos
        </p>
      </div>

      <div>
        <Label>Tipo de Desporto *</Label>
        <Select value={sportType} onValueChange={onSportTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">🌟 Todos os Desportos</SelectItem>
            <SelectItem value="TRAIL">🏔️ Trail</SelectItem>
            <SelectItem value="RUNNING">🏃 Corrida</SelectItem>
            <SelectItem value="BTT">🚵 BTT</SelectItem>
            <SelectItem value="HYROX">💪 HYROX</SelectItem>
            <SelectItem value="TRIATHLON">🏊 Triatlo</SelectItem>
            <SelectItem value="CYCLING">🚴 Ciclismo</SelectItem>
            <SelectItem value="OCR">🧗 OCR</SelectItem>
            <SelectItem value="CROSSFIT">🏋️ CrossFit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-input bg-muted/50 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm">A carregar eventos...</span>
          </div>
        ) : events.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">
                {events.filter((e) => e.selected).length}/{events.length}{" "}
                eventos selecionados:
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleAllEvents(true)}
                  className="h-7 text-xs"
                >
                  Selecionar todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleAllEvents(false)}
                  className="h-7 text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
              {events.map((event) => (
                <label
                  key={event.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={event.selected}
                    onChange={() => onToggleEvent(event.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.date} • {event.location}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              💡 Dica: Seleciona apenas os eventos mais importantes (máximo 8
              aparecem no post)
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Nenhum evento encontrado para este mês e tipo de desporto.
          </p>
        )}
      </div>
    </div>
  );
}

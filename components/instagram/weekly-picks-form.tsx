import { useState, useEffect } from "react";
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

interface WeeklyPicksFormProps {
  header: string;
  items: string;
  footer: string;
  onHeaderChange: (value: string) => void;
  onItemsChange: (value: string) => void;
  onFooterChange: (value: string) => void;
  allEvents: EventItem[];
  onToggleEvent: (eventId: string) => void;
  onToggleAllEvents: (selected: boolean) => void;
  sportType: string;
  onSportTypeChange: (sportType: string) => void;
  onEventsLoaded?: (events: EventItem[]) => void;
}

export function WeeklyPicksForm({
  header,
  items,
  footer,
  onHeaderChange,
  onItemsChange,
  onFooterChange,
  allEvents,
  onToggleEvent,
  onToggleAllEvents,
  sportType,
  onSportTypeChange,
  onEventsLoaded,
}: WeeklyPicksFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localEvents, setLocalEvents] = useState<EventItem[]>(allEvents);

  // Load events when sport type changes
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const url =
          sportType === "ALL"
            ? "/api/events/weekly"
            : `/api/events/weekly?sportType=${sportType}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const eventsWithSelection = (data.events || []).map(
            (event: {
              id: string;
              title: string;
              date: string;
              location: string;
            }) => ({
              ...event,
              selected: true,
            })
          );
          setLocalEvents(eventsWithSelection);
          // Notify parent component
          if (onEventsLoaded) {
            onEventsLoaded(eventsWithSelection);
          }
        }
      } catch (error) {
        console.error("Error loading weekly events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [sportType, onEventsLoaded]);

  // Sync local events with parent
  useEffect(() => {
    setLocalEvents(allEvents);
  }, [allEvents]);

  const handleToggle = (eventId: string) => {
    setLocalEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, selected: !e.selected } : e))
    );
    onToggleEvent(eventId);
  };

  const handleToggleAll = (selected: boolean) => {
    setLocalEvents((prev) => prev.map((e) => ({ ...e, selected })));
    onToggleAllEvents(selected);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Header *</Label>
        <Input
          value={header}
          onChange={(e) => onHeaderChange(e.target.value)}
          maxLength={30}
          placeholder="EVENTOS DA SEMANA"
        />
      </div>

      {/* Sport Type Selector */}
      <div>
        <Label>Tipo de Desporto</Label>
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

      {/* Event Selection List */}
      <div className="rounded-md border border-input bg-muted/50 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm">A carregar eventos...</span>
          </div>
        ) : localEvents.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">
                Eventos desta semana (
                {localEvents.filter((e) => e.selected).length}/
                {localEvents.length} selecionados):
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAll(true)}
                  className="h-7 text-xs"
                >
                  Selecionar todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAll(false)}
                  className="h-7 text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {localEvents.map((event) => (
                <label
                  key={event.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={event.selected}
                    onChange={() => handleToggle(event.id)}
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
          </div>
        ) : (
          <div>
            <p className="mb-3 text-center text-sm text-muted-foreground">
              Nenhum evento encontrado para esta semana.
            </p>
            <div>
              <Label>Items manuais (um por linha, 3-5 items)</Label>
              <textarea
                value={items}
                onChange={(e) => onItemsChange(e.target.value)}
                placeholder="Trail Mondego • 20K&#10;HYROX Lisboa • Singles&#10;Maratona do Porto"
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>Footer *</Label>
        <Input
          value={footer}
          onChange={(e) => onFooterChange(e.target.value)}
          maxLength={30}
          placeholder="athlifyr.com"
        />
      </div>
    </div>
  );
}

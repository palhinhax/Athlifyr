"use client";

import { useState } from "react";
import { SportType } from "@prisma/client";
import type { MapFilters, DateRangeMode } from "@/lib/map-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  RotateCcw,
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  X,
} from "lucide-react";

interface MapFiltersPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  onReset: () => void;
  isSaving?: boolean;
}

// Sport type display names
const SPORT_LABELS: Record<SportType, string> = {
  RUNNING: "Corrida",
  TRAIL: "Trail",
  HYROX: "Hyrox",
  CROSSFIT: "CrossFit",
  OCR: "OCR",
  BTT: "BTT",
  CYCLING: "Ciclismo",
  SURF: "Surf",
  TRIATHLON: "Triatlo",
  SWIMMING: "Natação",
  OTHER: "Outro",
};

const DATE_RANGE_LABELS: Record<DateRangeMode, string> = {
  all: "Todos",
  today: "Hoje",
  this_week: "Esta Semana",
  this_month: "Este Mês",
  custom: "Personalizado",
};

export function MapFiltersPanel({
  filters,
  onFiltersChange,
  onReset,
  isSaving,
}: MapFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSport = (sport: SportType) => {
    const newSportIds = filters.sportIds.includes(sport)
      ? filters.sportIds.filter((s) => s !== sport)
      : [...filters.sportIds, sport];

    onFiltersChange({
      ...filters,
      sportIds: newSportIds,
    });
  };

  const updateDateRange = (mode: DateRangeMode) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        mode,
      },
    });
  };

  const updateCustomDate = (field: "start" | "end", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const updateDistance = (value: number[]) => {
    onFiltersChange({
      ...filters,
      distanceKm: value[0],
    });
  };

  const updateTextSearch = (value: string) => {
    onFiltersChange({
      ...filters,
      textSearch: value,
    });
  };

  const togglePastEvents = () => {
    onFiltersChange({
      ...filters,
      showPastEvents: !filters.showPastEvents,
    });
  };

  const updateSort = (value: string) => {
    onFiltersChange({
      ...filters,
      sort: value as MapFilters["sort"],
    });
  };

  return (
    <div className="absolute left-4 top-4 z-[1000] w-80 rounded-lg border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Filtros</h3>
          {isSaving && (
            <span className="text-xs text-muted-foreground">A guardar...</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            title="Repor filtros"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <X className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto p-4">
          {/* Text Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Pesquisar
            </Label>
            <Input
              id="search"
              placeholder="Nome do evento, cidade..."
              value={filters.textSearch || ""}
              onChange={(e) => updateTextSearch(e.target.value)}
            />
          </div>

          {/* Sport Types */}
          <div className="space-y-2">
            <Label>Desportos</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(SportType).map((sport) => (
                <Button
                  key={sport}
                  variant={
                    filters.sportIds.includes(sport) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleSport(sport)}
                  className="text-xs"
                >
                  {SPORT_LABELS[sport]}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período
            </Label>
            <Select
              value={filters.dateRange.mode}
              onValueChange={(value) => updateDateRange(value as DateRangeMode)}
            >
              <SelectTrigger id="dateRange">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filters.dateRange.mode === "custom" && (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="startDate" className="text-xs">
                    Início
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.dateRange.start || ""}
                    onChange={(e) => updateCustomDate("start", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs">
                    Fim
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.dateRange.end || ""}
                    onChange={(e) => updateCustomDate("end", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Distância: {filters.distanceKm || 50} km
            </Label>
            <Slider
              id="distance"
              min={1}
              max={500}
              step={1}
              value={[filters.distanceKm || 50]}
              onValueChange={updateDistance}
            />
          </div>

          {/* Show Past Events */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPastEvents"
              checked={filters.showPastEvents}
              onChange={togglePastEvents}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showPastEvents" className="cursor-pointer">
              Mostrar eventos passados
            </Label>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label htmlFor="sort" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ordenar por
            </Label>
            <Select value={filters.sort} onValueChange={updateSort}>
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recomendado</SelectItem>
                <SelectItem value="date_asc">Data (mais próximo)</SelectItem>
                <SelectItem value="distance_asc">Distância</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Collapsed Summary */}
      {!isExpanded && (
        <div className="p-4 text-sm text-muted-foreground">
          {filters.sportIds.length > 0 && (
            <div>
              {filters.sportIds.length} desporto
              {filters.sportIds.length > 1 ? "s" : ""}
            </div>
          )}
          {filters.textSearch && (
            <div className="truncate">Pesquisa: {filters.textSearch}</div>
          )}
          <div>{DATE_RANGE_LABELS[filters.dateRange.mode]}</div>
        </div>
      )}
    </div>
  );
}

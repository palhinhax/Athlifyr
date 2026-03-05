"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Loader2,
  Upload,
  Trash2,
  Plus,
  Map,
  ChevronDown,
  ChevronUp,
  GripVertical,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import type {
  RouteCheckpoint,
  CheckpointType,
} from "@/components/route-map-editor";

// Dynamic import — avoids SSR issues with mapbox-gl
const RouteMapEditor = dynamic(() => import("@/components/route-map-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-lg bg-muted">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface VariantRoute {
  id?: string;
  gpxData?: string | null;
  routePoints: [number, number][];
  distanceKm?: number | null;
  elevationGainM?: number | null;
  elevationLossM?: number | null;
  checkpoints: RouteCheckpoint[];
}

interface VariantRouteEditorProps {
  eventId: string;
  variantId: string;
  variantName: string;
}

// ─── Client-side GPX preview parser (simplified, no dependencies) ────────────
function extractPreviewPoints(gpx: string): [number, number][] {
  const points: [number, number][] = [];
  const re = /<trkpt\s+lat="([\d.\-]+)"\s+lon="([\d.\-]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(gpx)) !== null) {
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (!isNaN(lat) && !isNaN(lng)) points.push([lat, lng]);
  }
  // Return every Nth point to keep preview lightweight (max 500 pts)
  const step = Math.max(1, Math.floor(points.length / 500));
  return points.filter((_, i) => i % step === 0);
}

const CHECKPOINT_TYPE_LABELS: Record<CheckpointType, string> = {
  START: "Partida",
  FINISH: "Chegada",
  INTERMEDIATE: "Baliza",
  TRANSITION: "Transição",
};

const CHECKPOINT_TYPE_COLORS: Record<CheckpointType, string> = {
  START: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  FINISH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  INTERMEDIATE:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  TRANSITION:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

export function VariantRouteEditor({
  eventId,
  variantId,
  variantName,
}: VariantRouteEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState<VariantRoute | null>(null);
  const [addingCheckpoint, setAddingCheckpoint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Load route from API ──────────────────────────────────────────────────
  const loadRoute = useCallback(async () => {
    if (loaded) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/events/${eventId}/variants/${variantId}/route`
      );
      if (res.ok) {
        const data = (await res.json()) as { route: VariantRoute | null };
        setRoute(
          data.route ?? {
            routePoints: [],
            checkpoints: [],
          }
        );
      }
    } catch {
      toast({
        title: "Erro ao carregar percurso",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoaded(true);
    }
  }, [eventId, variantId, loaded]);

  const handleToggle = () => {
    if (!isExpanded && !loaded) {
      void loadRoute();
    }
    setIsExpanded((prev) => !prev);
  };

  // ─── GPX upload ───────────────────────────────────────────────────────────
  const handleGpxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".gpx")) {
      toast({ title: "Ficheiro deve ser .gpx", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text) return;

      // Parse client-side to get a preview (server will re-parse on save)
      // We send the raw gpxData to the API which does the real parsing
      setRoute((prev) => ({
        ...(prev ?? { routePoints: [], checkpoints: [] }),
        gpxData: text,
        // Clear previous points — will be populated from server response after save
        routePoints: extractPreviewPoints(text),
      }));

      toast({ title: "GPX carregado — guarda para aplicar" });
    };
    reader.readAsText(file);

    // Reset input so same file can be uploaded again
    e.target.value = "";
  };

  // ─── Map click — add checkpoint ───────────────────────────────────────────
  const handleMapClick = (lat: number, lng: number) => {
    if (!addingCheckpoint) return;
    setRoute((prev) => {
      if (!prev) return prev;
      const newCp: RouteCheckpoint = {
        name: "Posto " + (prev.checkpoints.length + 1),
        type: "INTERMEDIATE",
        order: prev.checkpoints.length,
        latitude: lat,
        longitude: lng,
        radiusM: 10,
        cutoffMin: null,
      };
      return { ...prev, checkpoints: [...prev.checkpoints, newCp] };
    });
    setAddingCheckpoint(false);
  };

  const handleCheckpointMove = (idx: number, lat: number, lng: number) => {
    setRoute((prev) => {
      if (!prev) return prev;
      const updated = [...prev.checkpoints];
      updated[idx] = { ...updated[idx], latitude: lat, longitude: lng };
      return { ...prev, checkpoints: updated };
    });
  };

  const updateCheckpoint = (
    idx: number,
    field: keyof RouteCheckpoint,
    value: string | number | null
  ) => {
    setRoute((prev) => {
      if (!prev) return prev;
      const updated = [...prev.checkpoints];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, checkpoints: updated };
    });
  };

  const removeCheckpoint = (idx: number) => {
    setRoute((prev) => {
      if (!prev) return prev;
      const updated = prev.checkpoints
        .filter((_, i) => i !== idx)
        .map((cp, i) => ({ ...cp, order: i }));
      return { ...prev, checkpoints: updated };
    });
  };

  // ─── Save route ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!route) return;
    setIsSaving(true);
    try {
      const res = await fetch(
        `/api/events/${eventId}/variants/${variantId}/route`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gpxData: route.gpxData ?? undefined,
            routePoints: route.gpxData ? undefined : route.routePoints,
            distanceKm: route.distanceKm,
            elevationGainM: route.elevationGainM,
            elevationLossM: route.elevationLossM,
            checkpoints: route.checkpoints,
          }),
        }
      );

      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error);
      }

      const data = (await res.json()) as { route: VariantRoute };
      setRoute(data.route);
      toast({ title: "Percurso guardado com sucesso" });
    } catch (err) {
      toast({
        title: "Erro ao guardar percurso",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete route ─────────────────────────────────────────────────────────
  const handleDeleteRoute = async () => {
    if (!route?.id) {
      setRoute({ routePoints: [], checkpoints: [] });
      return;
    }
    setIsSaving(true);
    try {
      await fetch(`/api/events/${eventId}/variants/${variantId}/route`, {
        method: "DELETE",
      });
      setRoute({ routePoints: [], checkpoints: [] });
      toast({ title: "Percurso eliminado" });
    } catch {
      toast({ title: "Erro ao eliminar percurso", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const hasRoute = (route?.routePoints?.length ?? 0) > 0 || !!route?.gpxData;

  return (
    <div className="rounded-lg border">
      {/* Header — toggle */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Percurso — {variantName}</span>
          {hasRoute && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {route?.distanceKm ? `${route.distanceKm} km` : "GPX carregado"}
            </Badge>
          )}
          {(route?.checkpoints?.length ?? 0) > 0 && (
            <Badge variant="outline" className="text-xs">
              {route!.checkpoints.length} postos
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-4 border-t px-4 pb-4 pt-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* GPX upload + actions */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".gpx"
                  className="hidden"
                  onChange={handleGpxUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Importar GPX
                </Button>

                {/* "Adicionar posto" always visible — works with or without GPX */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${addingCheckpoint ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-400" : ""}`}
                  onClick={() => setAddingCheckpoint((p) => !p)}
                >
                  <Plus className="h-4 w-4" />
                  {addingCheckpoint ? "Cancelar" : "Adicionar posto"}
                </Button>

                {hasRoute && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive hover:bg-destructive/10"
                    onClick={() => void handleDeleteRoute()}
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpar percurso
                  </Button>
                )}

                {addingCheckpoint && (
                  <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Clica no mapa para colocar o posto
                  </div>
                )}
              </div>

              {/* Route stats */}
              {hasRoute && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Distância (km)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={route?.distanceKm?.toString() ?? ""}
                      onChange={(e) =>
                        setRoute((prev) =>
                          prev
                            ? {
                                ...prev,
                                distanceKm: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                              }
                            : prev
                        )
                      }
                      placeholder="Auto"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Desnível+ (m)
                    </Label>
                    <Input
                      type="number"
                      value={route?.elevationGainM?.toString() ?? ""}
                      onChange={(e) =>
                        setRoute((prev) =>
                          prev
                            ? {
                                ...prev,
                                elevationGainM: e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : null,
                              }
                            : prev
                        )
                      }
                      placeholder="Auto"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Desnível- (m)
                    </Label>
                    <Input
                      type="number"
                      value={route?.elevationLossM?.toString() ?? ""}
                      onChange={(e) =>
                        setRoute((prev) =>
                          prev
                            ? {
                                ...prev,
                                elevationLossM: e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : null,
                              }
                            : prev
                        )
                      }
                      placeholder="Auto"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Map */}
              <RouteMapEditor
                routePoints={route?.routePoints ?? []}
                checkpoints={route?.checkpoints ?? []}
                onMapClick={handleMapClick}
                onCheckpointMove={handleCheckpointMove}
                editable
                clickMode={addingCheckpoint}
                height={380}
              />

              {/* Checkpoints list */}
              {(route?.checkpoints?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Postos de controlo
                    </span>
                  </div>
                  <div className="space-y-2">
                    {route!.checkpoints.map((cp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-md border p-2"
                      >
                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />

                        {/* Type badge */}
                        <Badge
                          className={`shrink-0 text-xs ${CHECKPOINT_TYPE_COLORS[cp.type]}`}
                        >
                          {cp.type === "START" && (
                            <Flag className="mr-1 h-3 w-3" />
                          )}
                          {CHECKPOINT_TYPE_LABELS[cp.type]}
                        </Badge>

                        {/* Name */}
                        <Input
                          value={cp.name}
                          onChange={(e) =>
                            updateCheckpoint(idx, "name", e.target.value)
                          }
                          className="h-7 min-w-0 flex-1 text-xs"
                          placeholder="Nome"
                        />

                        {/* Type select */}
                        <Select
                          value={cp.type}
                          onValueChange={(v) =>
                            updateCheckpoint(idx, "type", v)
                          }
                        >
                          <SelectTrigger className="h-7 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.keys(
                                CHECKPOINT_TYPE_LABELS
                              ) as CheckpointType[]
                            ).map((t) => (
                              <SelectItem key={t} value={t} className="text-xs">
                                {CHECKPOINT_TYPE_LABELS[t]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Cutoff */}
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="0"
                            value={cp.cutoffMin?.toString() ?? ""}
                            onChange={(e) =>
                              updateCheckpoint(
                                idx,
                                "cutoffMin",
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : null
                              )
                            }
                            className="h-7 w-16 text-xs"
                            placeholder="min"
                            title="Corte (minutos)"
                          />
                        </div>

                        {/* Radius */}
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="5"
                            value={cp.radiusM.toString()}
                            onChange={(e) =>
                              updateCheckpoint(
                                idx,
                                "radiusM",
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : 10
                              )
                            }
                            className="h-7 w-16 text-xs"
                            placeholder="m"
                            title="Raio (metros)"
                          />
                          <span className="text-xs text-muted-foreground">
                            m
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-destructive hover:bg-destructive/10"
                          onClick={() => removeCheckpoint(idx)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hint when no route loaded */}
              {!hasRoute && (
                <p className="text-center text-xs text-muted-foreground">
                  Importa um GPX para traçar o percurso, ou clica em{" "}
                  <strong>Adicionar posto</strong> para marcar pontos
                  directamente no mapa.
                </p>
              )}

              {/* Save button */}
              <div className="flex justify-end border-t pt-3">
                <Button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isSaving}
                  size="sm"
                  className="gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Guardar percurso
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

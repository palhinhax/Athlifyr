"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import type { EventDetails, EventVariant, PricingPhase } from "./types";
import { toDateOnly } from "./types";

interface TabPrecosProps {
  event: EventDetails;
  variants: EventVariant[];
  pricingPhases: PricingPhase[];
  isLoadingPhases: boolean;
  loadPricingPhases: (eventId: string) => Promise<void>;
}

export function TabPrecos({
  event,
  variants,
  pricingPhases,
  isLoadingPhases,
  loadPricingPhases,
}: TabPrecosProps) {
  const t = useTranslations("manage.pricing");
  const tErr = useTranslations("manage.errors");
  const tCommon = useTranslations("manage.common");

  const [isSaving, setIsSaving] = useState(false);
  const [editingPhase, setEditingPhase] = useState<PricingPhase | null>(null);

  // New phase form state
  const [newName, setNewName] = useState("");
  const [newVariantId, setNewVariantId] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCurrency, setNewCurrency] = useState("EUR");
  const [newDiscount, setNewDiscount] = useState("");
  const [newNote, setNewNote] = useState("");

  const handleAddPhase = async () => {
    if (!newName.trim() || !newStartDate || !newEndDate || newPrice === "") {
      toast({
        title: tErr("saveError"),
        description: t("requiredFields"),
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/events/${event.id}/pricing-phases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          startDate: newStartDate,
          endDate: newEndDate,
          price: parseFloat(newPrice),
          currency: newCurrency,
          discountPercent: newDiscount ? parseInt(newDiscount) : null,
          note: newNote || null,
          variantId:
            newVariantId && newVariantId !== "all" ? newVariantId : null,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error);
      }
      setNewName("");
      setNewStartDate("");
      setNewEndDate("");
      setNewPrice("");
      setNewCurrency("EUR");
      setNewDiscount("");
      setNewNote("");
      setNewVariantId("");
      await loadPricingPhases(event.id);
      toast({ title: t("phaseAdded") });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePhase = async (phase: PricingPhase) => {
    setIsSaving(true);
    try {
      const res = await fetch(
        `/api/events/${event.id}/pricing-phases/${phase.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: phase.name,
            startDate: phase.startDate,
            endDate: phase.endDate,
            price: phase.price,
            currency: phase.currency,
            discountPercent: phase.discountPercent,
            note: phase.note,
            variantId: phase.variantId,
          }),
        }
      );
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error);
      }
      setEditingPhase(null);
      await loadPricingPhases(event.id);
      toast({ title: t("phaseSaved") });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhase = async (phaseId: string) => {
    setIsSaving(true);
    try {
      await fetch(`/api/events/${event.id}/pricing-phases/${phaseId}`, {
        method: "DELETE",
      });
      await loadPricingPhases(event.id);
      toast({ title: t("phaseDeleted") });
    } catch {
      toast({
        title: tErr("saveError"),
        description: tErr("genericError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TabsContent value="precos" className="space-y-6">
      {/* Existing pricing phases */}
      {isLoadingPhases ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : pricingPhases.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("existingPhases")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pricingPhases.map((phase) => {
              const isEditing = editingPhase?.id === phase.id;
              const now = new Date();
              const isActive =
                new Date(phase.startDate) <= now &&
                new Date(phase.endDate) >= now;
              const isPast = new Date(phase.endDate) < now;

              if (isEditing && editingPhase) {
                return (
                  <div
                    key={phase.id}
                    className="space-y-3 rounded-lg border border-primary p-4"
                  >
                    <div className="grid gap-2">
                      <Label>{t("phaseName")} *</Label>
                      <Input
                        value={editingPhase.name}
                        onChange={(e) =>
                          setEditingPhase({
                            ...editingPhase,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t("variant")}</Label>
                      <Select
                        value={editingPhase.variantId ?? "all"}
                        onValueChange={(v) =>
                          setEditingPhase({
                            ...editingPhase,
                            variantId: v === "all" ? null : v,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("allVariants")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("allVariants")}
                          </SelectItem>
                          {variants.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>{t("startDate")} *</Label>
                        <Input
                          type="date"
                          value={toDateOnly(editingPhase.startDate)}
                          onChange={(e) =>
                            setEditingPhase({
                              ...editingPhase,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t("endDate")} *</Label>
                        <Input
                          type="date"
                          value={toDateOnly(editingPhase.endDate)}
                          onChange={(e) =>
                            setEditingPhase({
                              ...editingPhase,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t("price")} (€) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingPhase.price}
                          onChange={(e) =>
                            setEditingPhase({
                              ...editingPhase,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>{t("discount")}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editingPhase.discountPercent ?? ""}
                          onChange={(e) =>
                            setEditingPhase({
                              ...editingPhase,
                              discountPercent: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>{t("note")}</Label>
                      <Input
                        value={editingPhase.note ?? ""}
                        onChange={(e) =>
                          setEditingPhase({
                            ...editingPhase,
                            note: e.target.value || null,
                          })
                        }
                        placeholder={t("notePlaceholder")}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPhase(null)}
                        disabled={isSaving}
                      >
                        {tCommon("cancel")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => void handleSavePhase(editingPhase)}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        {isSaving && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        {tCommon("save")}
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={phase.id}
                  className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : isPast
                        ? "opacity-50"
                        : ""
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{phase.name}</span>
                      {phase.variantId ? (
                        <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                          {variants.find((v) => v.id === phase.variantId)
                            ?.name ?? t("variant")}
                        </span>
                      ) : (
                        <span className="rounded bg-gray-500/10 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                          {t("all")}
                        </span>
                      )}
                      {isActive && (
                        <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                          {t("active")}
                        </span>
                      )}
                      {isPast && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {t("expired")}
                        </span>
                      )}
                      {phase.discountPercent && phase.discountPercent > 0 && (
                        <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                          -{phase.discountPercent}%
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold">
                      {phase.price.toFixed(2)} {phase.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(phase.startDate).toLocaleDateString()} —{" "}
                      {new Date(phase.endDate).toLocaleDateString()}
                    </p>
                    {phase.note && (
                      <p className="text-xs text-muted-foreground">
                        {phase.note}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setEditingPhase(phase)}
                      disabled={isSaving}
                    >
                      <FileEdit className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          disabled={isSaving}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deletePhase")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deletePhaseDescription", {
                              name: phase.name,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {tCommon("cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void handleDeletePhase(phase.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {tCommon("delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      {/* Add new pricing phase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            {t("addPhase")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="newPhaseName">{t("phaseName")} *</Label>
            <Input
              id="newPhaseName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("phaseNamePlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPhaseVariant">{t("variant")}</Label>
            <Select value={newVariantId} onValueChange={setNewVariantId}>
              <SelectTrigger id="newPhaseVariant">
                <SelectValue placeholder={t("allVariants")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allVariants")}</SelectItem>
                {variants.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t("variantHelp")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="newPhaseStartDate">{t("startDate")} *</Label>
              <Input
                id="newPhaseStartDate"
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPhaseEndDate">{t("endDate")} *</Label>
              <Input
                id="newPhaseEndDate"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPhasePrice">{t("price")} *</Label>
              <Input
                id="newPhasePrice"
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPhaseCurrency">{t("currency")}</Label>
              <Select value={newCurrency} onValueChange={setNewCurrency}>
                <SelectTrigger id="newPhaseCurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPhaseDiscount">{t("discount")}</Label>
              <Input
                id="newPhaseDiscount"
                type="number"
                min="0"
                max="100"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPhaseNote">{t("note")}</Label>
            <Input
              id="newPhaseNote"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={t("notePlaceholder")}
            />
          </div>
          <Button
            onClick={() => void handleAddPhase()}
            disabled={
              isSaving ||
              !newName.trim() ||
              !newStartDate ||
              !newEndDate ||
              newPrice === ""
            }
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t("addPhaseButton")}
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

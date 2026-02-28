"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
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
import type { EventDetails, EventVariant } from "./types";
import { toDateOnly } from "./types";

interface TabPercursosProps {
  event: EventDetails;
  variants: EventVariant[];
  setVariants: React.Dispatch<React.SetStateAction<EventVariant[]>>;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}

export function TabPercursos({
  variants,
  setVariants,
  onSave,
}: TabPercursosProps) {
  const t = useTranslations("manage.variants");
  const tErr = useTranslations("manage.errors");
  const tCommon = useTranslations("manage.common");

  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDistance, setNewDistance] = useState("");
  const [newElevation, setNewElevation] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newMaxParticipants, setNewMaxParticipants] = useState("");
  const [newTeamSize, setNewTeamSize] = useState("1");

  const handleUpdateVariant = (
    index: number,
    field: keyof EventVariant,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        const parsed =
          field === "distanceKm" ||
          field === "elevationGainM" ||
          field === "price" ||
          field === "maxParticipants" ||
          field === "teamSize"
            ? value === ""
              ? field === "teamSize"
                ? 1
                : null
              : field === "maxParticipants" || field === "teamSize"
                ? parseInt(value, 10)
                : parseFloat(value)
            : value || null;
        return { ...v, [field]: parsed };
      })
    );
  };

  const handleSaveVariants = async () => {
    setIsSaving(true);
    try {
      await onSave({ variants });
      toast({ title: t("variantsSaved") });
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

  const handleDeleteVariant = async (variantId: string) => {
    setIsSaving(true);
    try {
      const updated = variants.filter((v) => v.id !== variantId);
      await onSave({ variants: updated });
      toast({ title: t("variantDeleted") });
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

  const handleAddVariant = async () => {
    if (!newName.trim()) {
      toast({
        title: tErr("saveError"),
        description: t("nameRequired"),
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const newVariant = {
        name: newName.trim(),
        distanceKm: newDistance ? parseFloat(newDistance) : undefined,
        elevationGainM: newElevation ? parseFloat(newElevation) : undefined,
        startDate: newStartDate || undefined,
        startTime: newStartTime || undefined,
        maxParticipants: newMaxParticipants
          ? parseInt(newMaxParticipants, 10)
          : undefined,
        teamSize: parseInt(newTeamSize, 10) || 1,
      };
      await onSave({ variants: [...variants, newVariant] });
      setNewName("");
      setNewDistance("");
      setNewElevation("");
      setNewStartDate("");
      setNewStartTime("");
      setNewMaxParticipants("");
      setNewTeamSize("1");
      toast({ title: t("variantAdded") });
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

  return (
    <TabsContent value="percursos" className="space-y-6">
      {/* Existing variants */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("existingVariants")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((v, i) => (
              <div key={v.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">#{i + 1}</span>
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
                          {t("deleteVariant")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("deleteVariantDescription", { name: v.name })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {tCommon("cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => void handleDeleteVariant(v.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {tCommon("delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="grid gap-2">
                  <Label>{t("name")}</Label>
                  <Input
                    value={v.name}
                    onChange={(e) =>
                      handleUpdateVariant(i, "name", e.target.value)
                    }
                    placeholder={t("namePlaceholder")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>{t("distance")}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={v.distanceKm?.toString() ?? ""}
                      onChange={(e) =>
                        handleUpdateVariant(i, "distanceKm", e.target.value)
                      }
                      placeholder="30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("elevation")}</Label>
                    <Input
                      type="number"
                      value={v.elevationGainM?.toString() ?? ""}
                      onChange={(e) =>
                        handleUpdateVariant(i, "elevationGainM", e.target.value)
                      }
                      placeholder="1200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("startDate")}</Label>
                    <Input
                      type="date"
                      value={toDateOnly(v.startDate)}
                      onChange={(e) =>
                        handleUpdateVariant(i, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("startTime")}</Label>
                    <Input
                      type="time"
                      value={v.startTime ?? ""}
                      onChange={(e) =>
                        handleUpdateVariant(i, "startTime", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("maxParticipants")}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={v.maxParticipants?.toString() ?? ""}
                      onChange={(e) =>
                        handleUpdateVariant(
                          i,
                          "maxParticipants",
                          e.target.value
                        )
                      }
                      placeholder={t("maxParticipantsPlaceholder")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("teamSize")}</Label>
                    <select
                      value={v.teamSize?.toString() ?? "1"}
                      onChange={(e) =>
                        handleUpdateVariant(i, "teamSize", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="1">{t("teamSizeIndividual")}</option>
                      <option value="2">{t("teamSizeDuo")}</option>
                      <option value="3">{t("teamSizeTrio")}</option>
                      <option value="4">{t("teamSizeQuad")}</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("teamSizeHelp")}
                </p>
              </div>
            ))}
            <div className="flex justify-end border-t pt-4">
              <Button
                onClick={() => void handleSaveVariants()}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("saveChanges")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add new variant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            {t("addVariant")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="newVariantName">{t("name")} *</Label>
            <Input
              id="newVariantName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="newVariantDistance">{t("distance")}</Label>
              <Input
                id="newVariantDistance"
                type="number"
                step="0.1"
                value={newDistance}
                onChange={(e) => setNewDistance(e.target.value)}
                placeholder="30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newVariantElevation">{t("elevation")}</Label>
              <Input
                id="newVariantElevation"
                type="number"
                value={newElevation}
                onChange={(e) => setNewElevation(e.target.value)}
                placeholder="1200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newVariantStartDate">{t("startDate")}</Label>
              <Input
                id="newVariantStartDate"
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newVariantStartTime">{t("startTime")}</Label>
              <Input
                id="newVariantStartTime"
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newVariantMaxParticipants">
                {t("maxParticipants")}
              </Label>
              <Input
                id="newVariantMaxParticipants"
                type="number"
                min="0"
                value={newMaxParticipants}
                onChange={(e) => setNewMaxParticipants(e.target.value)}
                placeholder={t("maxParticipantsPlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newVariantTeamSize">{t("teamSize")}</Label>
              <select
                id="newVariantTeamSize"
                value={newTeamSize}
                onChange={(e) => setNewTeamSize(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="1">{t("teamSizeIndividual")}</option>
                <option value="2">{t("teamSizeDuo")}</option>
                <option value="3">{t("teamSizeTrio")}</option>
                <option value="4">{t("teamSizeQuad")}</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("teamSizeHelp")}</p>
          <Button
            onClick={() => void handleAddVariant()}
            disabled={isSaving || !newName.trim()}
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t("addVariant")}
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

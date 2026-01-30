"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  PercentIcon,
} from "lucide-react";
import { WeightUnit } from "@prisma/client";
import type { CreateSetPrescriptionInput } from "@/types/workout";
import { cn } from "@/lib/utils";

interface SetPrescriptionEditorProps {
  exerciseName: string;
  sets: CreateSetPrescriptionInput[];
  onChange: (sets: CreateSetPrescriptionInput[]) => void;
  blockType: string;
}

export function SetPrescriptionEditor({
  exerciseName: _exerciseName,
  sets,
  onChange,
  blockType,
}: SetPrescriptionEditorProps) {
  const t = useTranslations("workouts");
  const [isOpen, setIsOpen] = useState(sets.length > 0);

  // Add a new set prescription
  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: CreateSetPrescriptionInput = {
      setNumber: sets.length + 1,
      reps: lastSet?.reps ?? undefined,
      weightPercent: lastSet?.weightPercent
        ? Math.min((lastSet.weightPercent || 0) + 5, 100)
        : undefined,
      weight: lastSet?.weight ?? undefined,
      weightUnit: lastSet?.weightUnit ?? "KG",
    };
    onChange([...sets, newSet]);
    setIsOpen(true);
  };

  // Remove a set
  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    // Renumber sets
    newSets.forEach((set, i) => {
      set.setNumber = i + 1;
    });
    onChange(newSets);
  };

  // Update a specific set
  const updateSet = (
    index: number,
    field: keyof CreateSetPrescriptionInput,
    value: unknown
  ) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    onChange(newSets);
  };

  // Duplicate last set (convenient for adding similar sets)
  const duplicateLastSet = () => {
    if (sets.length === 0) {
      addSet();
      return;
    }
    const lastSet = sets[sets.length - 1];
    const newSet: CreateSetPrescriptionInput = {
      ...lastSet,
      setNumber: sets.length + 1,
    };
    onChange([...sets, newSet]);
  };

  // Show % option for STRENGTH and EMOM blocks
  const showPercentOption = blockType === "STRENGTH" || blockType === "EMOM";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="mt-3 rounded-md border bg-background/50">
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between p-2 text-sm hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
              <span className="font-medium">
                {t("exercises.setPrescriptions")}
              </span>
              {sets.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {sets.length} {sets.length === 1 ? "set" : "sets"}
                </Badge>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={(e) => {
                e.stopPropagation();
                addSet();
              }}
            >
              <PlusIcon className="mr-1 h-3 w-3" />
              {t("exercises.addSet")}
            </Button>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {sets.length === 0 ? (
            <div className="border-t p-3 text-center text-sm text-muted-foreground">
              {t("exercises.noSetPrescriptions")}
            </div>
          ) : (
            <div className="space-y-2 border-t p-3">
              {sets.map((set, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-md bg-muted/30 p-2"
                >
                  {/* Set number */}
                  <Badge variant="outline" className="shrink-0">
                    Set {set.setNumber}
                  </Badge>

                  {/* Reps */}
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={1}
                      className="h-8 w-16"
                      value={set.reps ?? ""}
                      onChange={(e) =>
                        updateSet(
                          index,
                          "reps",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      placeholder="max"
                    />
                    <span className="text-xs text-muted-foreground">reps</span>
                  </div>

                  {/* Weight or Percent */}
                  {showPercentOption ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">@</span>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        className="h-8 w-16"
                        value={set.weightPercent ?? ""}
                        onChange={(e) =>
                          updateSet(
                            index,
                            "weightPercent",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        placeholder="65"
                      />
                      <PercentIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">PR</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        className="h-8 w-16"
                        value={set.weight ?? ""}
                        onChange={(e) =>
                          updateSet(
                            index,
                            "weight",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        placeholder="60"
                      />
                      <Select
                        value={set.weightUnit ?? "KG"}
                        onValueChange={(v) =>
                          updateSet(index, "weightUnit", v as WeightUnit)
                        }
                      >
                        <SelectTrigger className="h-8 w-14">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KG">kg</SelectItem>
                          <SelectItem value="LB">lb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Notes (optional) */}
                  <Input
                    className="h-8 flex-1"
                    value={set.notes ?? ""}
                    onChange={(e) =>
                      updateSet(index, "notes", e.target.value || undefined)
                    }
                    placeholder={t("exercises.setNotes")}
                  />

                  {/* Remove */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                    onClick={() => removeSet(index)}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {/* Quick add buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  onClick={duplicateLastSet}
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  {t("exercises.duplicateSet")}
                </Button>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

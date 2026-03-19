"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusIcon,
  GripVerticalIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CopyIcon,
  XIcon,
} from "lucide-react";
import { WorkoutBlockType } from "@prisma/client";
import { WorkoutBlockEditor } from "@/components/workout-block-editor";
import type {
  WorkoutWithBlocks,
  CreateWorkoutInput,
  CreateWorkoutBlockInput,
  CreateExerciseGroupInput,
  CreateSetPrescriptionInput,
  WorkoutBlockWithExercises,
  WorkoutBlockExerciseWithDetails,
  ExerciseGroupWithExercises,
} from "@/types/workout";
import { BLOCK_TYPE_INFO } from "@/types/workout";

function mapSetPrescriptions(
  setPrescriptions: WorkoutBlockExerciseWithDetails["setPrescriptions"]
): CreateSetPrescriptionInput[] | undefined {
  if (!setPrescriptions?.length) return undefined;
  return setPrescriptions.map((sp, spIndex) => ({
    setNumber: sp.setNumber ?? spIndex + 1,
    reps: sp.reps || undefined,
    weight: sp.weight || undefined,
    weightUnit: sp.weightUnit || undefined,
    weightPercent: sp.weightPercent || undefined,
    time: sp.time || undefined,
    distance: sp.distance || undefined,
    distanceUnit: sp.distanceUnit || undefined,
    calories: sp.calories || undefined,
    repsFemale: sp.repsFemale || undefined,
    weightFemale: sp.weightFemale || undefined,
    weightUnitFemale: sp.weightUnitFemale || undefined,
    weightPercentFemale: sp.weightPercentFemale || undefined,
    timeFemale: sp.timeFemale || undefined,
    distanceFemale: sp.distanceFemale || undefined,
    distanceUnitFemale: sp.distanceUnitFemale || undefined,
    caloriesFemale: sp.caloriesFemale || undefined,
    notes: sp.notes || undefined,
  }));
}

function mapExerciseGroupToInput(
  group: ExerciseGroupWithExercises
): CreateExerciseGroupInput {
  return {
    name: group.name || undefined,
    orderIndex: group.orderIndex,
    rounds: group.rounds,
    restBetweenRounds: group.restBetweenRounds || undefined,
    notes: group.notes || undefined,
    exercises: group.exercises.map((ex, exIndex) => ({
      exerciseId: ex.exerciseId,
      orderIndex: exIndex,
      prescribedReps: ex.prescribedReps || undefined,
      prescribedWeight: ex.prescribedWeight || undefined,
      prescribedWeightUnit: ex.prescribedWeightUnit || undefined,
      prescribedWeightPercent: ex.prescribedWeightPercent || undefined,
      prescribedDistance: ex.prescribedDistance || undefined,
      prescribedDistanceUnit: ex.prescribedDistanceUnit || undefined,
      prescribedTime: ex.prescribedTime || undefined,
      prescribedCalories: ex.prescribedCalories || undefined,
      prescribedSets: ex.prescribedSets || undefined,
      prescribedRepsFemale: ex.prescribedRepsFemale || undefined,
      prescribedWeightFemale: ex.prescribedWeightFemale || undefined,
      prescribedWeightUnitFemale: ex.prescribedWeightUnitFemale || undefined,
      prescribedWeightPercentFemale:
        ex.prescribedWeightPercentFemale || undefined,
      prescribedDistanceFemale: ex.prescribedDistanceFemale || undefined,
      prescribedDistanceUnitFemale:
        ex.prescribedDistanceUnitFemale || undefined,
      prescribedTimeFemale: ex.prescribedTimeFemale || undefined,
      prescribedCaloriesFemale: ex.prescribedCaloriesFemale || undefined,
      prescribedSetsFemale: ex.prescribedSetsFemale || undefined,
      notes: ex.notes || undefined,
    })),
  };
}

interface WorkoutBuilderProps {
  workout?: WorkoutWithBlocks | null;
  onSave: () => void;
  onCancel: () => void;
}

export function WorkoutBuilder({
  workout,
  onSave,
  onCancel,
}: WorkoutBuilderProps) {
  const t = useTranslations("workouts");
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState(workout?.name || "");
  const [description, setDescription] = useState(workout?.description || "");
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(
    workout?.estimatedTime || undefined
  );
  const [difficulty, setDifficulty] = useState<number | undefined>(
    workout?.difficulty || undefined
  );
  const [tags, setTags] = useState<string[]>(workout?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isTemplate, setIsTemplate] = useState(workout?.isTemplate || false);
  const [isPublic, setIsPublic] = useState(workout?.isPublic || false);
  const [blocks, setBlocks] = useState<WorkoutBlockWithExercises[]>(
    workout?.blocks || []
  );
  const [isSaving, setIsSaving] = useState(false);

  // Add a new block
  const addBlock = (type: WorkoutBlockType) => {
    const newBlock: WorkoutBlockWithExercises = {
      id: `temp-${Date.now()}`,
      workoutId: workout?.id || "",
      type,
      name: null,
      orderIndex: blocks.length,
      timeCap: type === "AMRAP" || type === "FOR_TIME" ? 600 : null,
      workTime: type === "EMOM" ? 60 : type === "TABATA" ? 20 : null,
      rounds: type === "EMOM" || type === "TABATA" ? 8 : null,
      notes: null,
      exercises: [],
    };
    setBlocks([...blocks, newBlock]);
  };

  // Remove a block
  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    // Update order indices
    newBlocks.forEach((block, i) => {
      block.orderIndex = i;
    });
    setBlocks(newBlocks);
  };

  // Move block up
  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [
      newBlocks[index],
      newBlocks[index - 1],
    ];
    newBlocks.forEach((block, i) => {
      block.orderIndex = i;
    });
    setBlocks(newBlocks);
  };

  // Move block down
  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [
      newBlocks[index + 1],
      newBlocks[index],
    ];
    newBlocks.forEach((block, i) => {
      block.orderIndex = i;
    });
    setBlocks(newBlocks);
  };

  // Duplicate block
  const duplicateBlock = (index: number) => {
    const blockToCopy = blocks[index];
    const newBlock: WorkoutBlockWithExercises = {
      ...blockToCopy,
      id: `temp-${Date.now()}`,
      orderIndex: blocks.length,
      exercises: blockToCopy.exercises.map((ex) => ({
        ...ex,
        id: `temp-ex-${Date.now()}-${Math.random()}`,
      })),
    };
    setBlocks([...blocks, newBlock]);
  };

  // Update block
  const updateBlock = (
    index: number,
    updatedBlock: WorkoutBlockWithExercises
  ) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
  };

  // Add tag
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Save workout
  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name is required",
        variant: "destructive",
      });
      return;
    }

    if (blocks.length === 0) {
      toast({
        title: "Add at least one block",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const workoutData: CreateWorkoutInput = {
        name: name.trim(),
        description: description.trim() || undefined,
        estimatedTime,
        difficulty,
        tags,
        isTemplate,
        isPublic,
        blocks: blocks.map(
          (block, index): CreateWorkoutBlockInput => ({
            type: block.type,
            name: block.name || undefined,
            orderIndex: index,
            timeCap: block.timeCap || undefined,
            workTime: block.workTime || undefined,
            rounds: block.rounds || undefined,
            notes: block.notes || undefined,
            exercises: block.exercises
              .filter((ex) => !ex.groupId) // Only standalone exercises
              .map((ex, exIndex) => ({
                exerciseId: ex.exercise.id,
                orderIndex: ex.orderIndex ?? exIndex,
                // Male/Rx
                prescribedReps: ex.prescribedReps || undefined,
                prescribedWeight: ex.prescribedWeight || undefined,
                prescribedWeightUnit: ex.prescribedWeightUnit || undefined,
                prescribedWeightPercent:
                  ex.prescribedWeightPercent || undefined,
                prescribedDistance: ex.prescribedDistance || undefined,
                prescribedDistanceUnit: ex.prescribedDistanceUnit || undefined,
                prescribedTime: ex.prescribedTime || undefined,
                prescribedCalories: ex.prescribedCalories || undefined,
                prescribedSets: ex.prescribedSets || undefined,
                // Female (optional)
                prescribedRepsFemale: ex.prescribedRepsFemale || undefined,
                prescribedWeightFemale: ex.prescribedWeightFemale || undefined,
                prescribedWeightUnitFemale:
                  ex.prescribedWeightUnitFemale || undefined,
                prescribedWeightPercentFemale:
                  ex.prescribedWeightPercentFemale || undefined,
                prescribedDistanceFemale:
                  ex.prescribedDistanceFemale || undefined,
                prescribedDistanceUnitFemale:
                  ex.prescribedDistanceUnitFemale || undefined,
                prescribedTimeFemale: ex.prescribedTimeFemale || undefined,
                prescribedCaloriesFemale:
                  ex.prescribedCaloriesFemale || undefined,
                prescribedSetsFemale: ex.prescribedSetsFemale || undefined,
                notes: ex.notes || undefined,
                setPrescriptions: mapSetPrescriptions(ex.setPrescriptions),
              })),
            // Include exercise groups
            exerciseGroups: block.exerciseGroups?.length
              ? block.exerciseGroups.map(mapExerciseGroupToInput)
              : undefined,
          })
        ),
      };

      const url = workout ? `/api/workouts/${workout.id}` : "/api/workouts";
      const method = workout ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error("Failed to save workout");
      }

      toast({
        title: workout ? t("success.updated") : t("success.created"),
      });

      onSave();
    } catch (error) {
      console.error("Failed to save workout:", error);
      toast({
        title: t("errors.saveFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {workout ? t("editWorkout") : t("createWorkout")}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t("form.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "..." : t("form.save")}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.name")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("form.name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("form.namePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">{t("form.estimatedTime")}</Label>
              <Input
                id="estimatedTime"
                type="number"
                min={1}
                value={estimatedTime || ""}
                onChange={(e) =>
                  setEstimatedTime(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("form.description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("form.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("form.difficulty")}</Label>
              <Select
                value={difficulty?.toString() || ""}
                onValueChange={(v) =>
                  setDifficulty(v ? parseInt(v) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.difficulty")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {t(`form.difficultyLevels.${level}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("form.tags")}</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={t("form.tagsPlaceholder")}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <XIcon className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isTemplate"
                checked={isTemplate}
                onCheckedChange={(checked) => setIsTemplate(checked === true)}
              />
              <Label htmlFor="isTemplate">{t("form.isTemplate")}</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="isPublic">{t("form.isPublic")}</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blocks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("blocks.title")}</h2>
        </div>

        {/* Add block buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(BLOCK_TYPE_INFO).map(([type, info]) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addBlock(type as WorkoutBlockType)}
              className="gap-1"
              style={{
                borderColor: info.color,
                color: info.color,
              }}
            >
              <PlusIcon className="h-3 w-3" />
              {t(`blocks.types.${type}`)}
            </Button>
          ))}
        </div>

        {/* Block list */}
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                {t("blocks.title")} - Click a button above to add a block
              </CardContent>
            </Card>
          ) : (
            blocks.map((block, index) => (
              <Card
                key={block.id}
                className="relative"
                style={{
                  borderLeftColor: BLOCK_TYPE_INFO[block.type].color,
                  borderLeftWidth: "4px",
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVerticalIcon className="h-5 w-5 cursor-grab text-muted-foreground" />
                      <Badge
                        style={{
                          backgroundColor: `${BLOCK_TYPE_INFO[block.type].color}20`,
                          color: BLOCK_TYPE_INFO[block.type].color,
                        }}
                      >
                        {t(`blocks.types.${block.type}`)}
                      </Badge>
                      {block.name && (
                        <span className="font-medium">{block.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveBlockUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveBlockDown(index)}
                        disabled={index === blocks.length - 1}
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateBlock(index)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBlock(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <WorkoutBlockEditor
                    block={block}
                    onChange={(updatedBlock: WorkoutBlockWithExercises) =>
                      updateBlock(index, updatedBlock)
                    }
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

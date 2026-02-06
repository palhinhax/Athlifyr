"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  Clock,
  Dumbbell,
  Globe,
  Send,
  Check,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import type { Locale } from "date-fns";
import { useLocale } from "next-intl";
import type { WorkoutBlockType } from "@prisma/client";

// Map locale to date-fns locale
const dateLocales: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

// Session workout type
interface SessionWorkout {
  id: string;
  sessionId: string;
  workoutId: string;
  notes?: string | null;
  session: {
    id: string;
    title: string;
    startsAt: string;
    endsAt: string;
    type: string;
  };
  workout: {
    id: string;
    name: string;
    description?: string | null;
    estimatedTime?: number | null;
    difficulty?: number | null;
    blocks: {
      id: string;
      type: WorkoutBlockType;
      name?: string | null;
      timeCap?: number | null;
      rounds?: number | null;
      exercises: {
        id: string;
        prescribedReps?: number | null;
        exercise: {
          id: string;
          name: string;
        };
      }[];
    }[];
  };
}

interface PublishWodDialogProps {
  venueId: string;
  venueName: string;
  onWodPublished?: () => void;
  children: React.ReactNode;
}

export function PublishWodDialog({
  venueId,
  venueName,
  onWodPublished,
  children,
}: PublishWodDialogProps) {
  const t = useTranslations("venues.publishWod");
  const tBlocks = useTranslations("workouts.blocks.types");
  const { toast } = useToast();
  const locale = useLocale();
  const dateLocale = dateLocales[locale] || enUS;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [sessionWorkouts, setSessionWorkouts] = useState<SessionWorkout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Fetch today's sessions with workouts
  useEffect(() => {
    if (!open) return;

    const fetchTodayWorkouts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/venues/${venueId}/sessions/today-workouts`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        setSessionWorkouts(data);

        // Auto-select if only one workout
        if (data.length === 1) {
          setSelectedWorkoutId(data[0].workoutId);
        }
      } catch (error) {
        console.error("Error fetching today workouts:", error);
        toast({
          title: t("fetchError"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodayWorkouts();
  }, [open, venueId, toast, t]);

  const handlePublish = async () => {
    if (!selectedWorkoutId) return;

    setPublishing(true);
    try {
      const selectedSession = sessionWorkouts.find(
        (sw) => sw.workoutId === selectedWorkoutId
      );

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: additionalNotes.trim(),
          venueId,
          workoutId: selectedWorkoutId,
          sessionId: selectedSession?.sessionId,
          isPublic,
          postType: "WOD",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish WOD");
      }

      toast({
        title: t("publishSuccess"),
        description: t("publishSuccessDesc"),
      });

      setOpen(false);
      setSelectedWorkoutId("");
      setAdditionalNotes("");
      setIsPublic(false);
      onWodPublished?.();
    } catch (error) {
      console.error("Error publishing WOD:", error);
      toast({
        title: t("publishError"),
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  // Get unique workouts (avoid showing same workout multiple times)
  const uniqueWorkouts = sessionWorkouts.reduce((acc, sw) => {
    if (!acc.find((w) => w.workoutId === sw.workoutId)) {
      acc.push(sw);
    }
    return acc;
  }, [] as SessionWorkout[]);

  // Format block info for preview
  const formatBlockInfo = (block: SessionWorkout["workout"]["blocks"][0]) => {
    const typeLabel = tBlocks(block.type);
    if (block.timeCap) {
      return `${typeLabel} ${Math.floor(block.timeCap / 60)}min`;
    }
    if (block.rounds) {
      return `${block.rounds} ${t("rounds")}`;
    }
    return typeLabel;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("description", { venueName })}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : uniqueWorkouts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">{t("noWorkoutsToday")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("noWorkoutsTodayDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Workout selection */}
            <div className="space-y-2">
              <Label>{t("selectWorkout")}</Label>
              <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-md border p-2">
                {uniqueWorkouts.map((sw) => (
                  <button
                    key={sw.workoutId}
                    type="button"
                    onClick={() => setSelectedWorkoutId(sw.workoutId)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      selectedWorkoutId === sw.workoutId
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        selectedWorkoutId === sw.workoutId
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedWorkoutId === sw.workoutId && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{sw.workout.name}</span>
                        {sw.workout.estimatedTime && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            {sw.workout.estimatedTime}min
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sw.workout.blocks.slice(0, 3).map((block) => (
                          <Badge
                            key={block.id}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {formatBlockInfo(block)}
                          </Badge>
                        ))}
                        {sw.workout.blocks.length > 3 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{sw.workout.blocks.length - 3}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {sw.session.title} •{" "}
                        {format(new Date(sw.session.startsAt), "HH:mm", {
                          locale: dateLocale,
                        })}
                      </p>
                      {sw.workout.blocks[0]?.exercises && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {sw.workout.blocks[0].exercises
                            .slice(0, 3)
                            .map((e) => e.exercise.name)
                            .join(", ")}
                          {sw.workout.blocks[0].exercises.length > 3 && "..."}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t("additionalNotes")}</Label>
              <Textarea
                id="notes"
                placeholder={t("notesPlaceholder")}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={2}
              />
            </div>

            {/* Public toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              />
              <Label
                htmlFor="isPublic"
                className="flex cursor-pointer items-center gap-1.5 text-sm font-normal"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{t("makePublic")}</span>
              </Label>
            </div>

            {/* Publish button */}
            <Button
              onClick={handlePublish}
              disabled={!selectedWorkoutId || publishing}
              className="w-full"
            >
              {publishing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {t("publishButton")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

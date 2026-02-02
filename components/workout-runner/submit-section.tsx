"use client";

/**
 * SubmitSection Component
 *
 * Displays the submit results card at the bottom of the workout.
 */

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import { formatTime } from "@/types/workout";

interface SubmitSectionProps {
  hasStarted: boolean;
  elapsedTime: number;
  onSubmit: () => void;
}

export function SubmitSection({
  hasStarted,
  elapsedTime,
  onSubmit,
}: SubmitSectionProps) {
  const t = useTranslations("workouts");

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <h3 className="text-lg font-semibold">
              {t("runner.readyToSubmit")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("runner.submitDescription")}
            </p>
          </div>
          {hasStarted && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                {t("runner.totalTime")}:{" "}
                <span className="font-mono font-semibold">
                  {formatTime(elapsedTime)}
                </span>
              </span>
            </div>
          )}
          <Button
            size="lg"
            className="gap-2 px-8"
            onClick={onSubmit}
            disabled={!hasStarted}
          >
            <CheckCircleIcon className="h-5 w-5" />
            {t("runner.submitResults")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

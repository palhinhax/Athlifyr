"use client";

/**
 * SubmitSection Component
 *
 * Simple submit button without card wrapper.
 */

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";

interface SubmitSectionProps {
  onSubmit: () => void;
}

export function SubmitSection({ onSubmit }: SubmitSectionProps) {
  const t = useTranslations("workouts");

  return (
    <div className="flex justify-center py-6">
      <Button size="lg" className="gap-2 px-8" onClick={onSubmit}>
        <CheckCircleIcon className="h-5 w-5" />
        {t("runner.submitResults")}
      </Button>
    </div>
  );
}

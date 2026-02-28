"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { CustomField, CustomFieldAnswer } from "@/types/custom-fields";
import { formatFieldPrice } from "@/types/custom-fields";

interface CustomFieldsFormProps {
  fields: CustomField[];
  answers: CustomFieldAnswer[];
  onAnswersChange: (answers: CustomFieldAnswer[]) => void;
  locale?: string;
  /** Optional label shown above the fields, e.g. "Participant 2" */
  participantLabel?: string;
}

/**
 * Renders custom field inputs for the registration flow.
 * Used inside the consent/registration dialog.
 */
export function CustomFieldsForm({
  fields,
  answers,
  onAnswersChange,
  locale = "en",
  participantLabel,
}: CustomFieldsFormProps) {
  const t = useTranslations("events.registration.customFields");

  // Initialize BOOLEAN fields with "false" so they always have a value
  // in the answers array. This prevents the required-field validation from
  // rejecting a switch that was never toggled (its default state is "No").
  useEffect(() => {
    const booleanFields = fields.filter((f) => f.type === "BOOLEAN");
    const missing = booleanFields.filter(
      (f) => !answers.some((a) => a.customFieldId === f.id)
    );
    if (missing.length > 0) {
      onAnswersChange([
        ...answers,
        ...missing.map((f) => ({ customFieldId: f.id, value: "false" })),
      ]);
    }
  }, [fields]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAnswer = (fieldId: string): string => {
    return answers.find((a) => a.customFieldId === fieldId)?.value ?? "";
  };

  const updateAnswer = (fieldId: string, value: string) => {
    const existing = answers.find((a) => a.customFieldId === fieldId);
    if (existing) {
      onAnswersChange(
        answers.map((a) => (a.customFieldId === fieldId ? { ...a, value } : a))
      );
    } else {
      onAnswersChange([...answers, { customFieldId: fieldId, value }]);
    }
  };

  if (fields.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        {participantLabel && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-p-brand">
            {participantLabel}
          </p>
        )}
        <h4 className="text-sm font-medium">{t("title")}</h4>
        <p className="text-xs text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-3">
        {fields.map((field) => {
          const priceLabel = formatFieldPrice(
            field.priceCents,
            field.currency,
            locale
          );

          return (
            <div key={field.id} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{field.label}</Label>
                <div className="flex items-center gap-1.5">
                  {priceLabel && (
                    <Badge variant="secondary" className="text-xs">
                      +{priceLabel}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {field.required ? t("required") : t("optional")}
                  </Badge>
                </div>
              </div>

              {field.type === "SELECT" ? (
                <Select
                  value={getAnswer(field.id) || undefined}
                  onValueChange={(v) => updateAnswer(field.id, v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("selectPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-3">
                  <Switch
                    checked={getAnswer(field.id) === "true"}
                    onCheckedChange={(checked) =>
                      updateAnswer(field.id, checked ? "true" : "false")
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {getAnswer(field.id) === "true" ? t("yes") : t("no")}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

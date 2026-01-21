"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { VenuePlanPolicy } from "@/types/venue-plan";

interface PolicyScheduleFormProps {
  policy: VenuePlanPolicy;
  onPolicyChange: (policy: VenuePlanPolicy) => void;
}

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export function PolicyScheduleForm({
  policy,
  onPolicyChange,
}: PolicyScheduleFormProps) {
  const tPolicy = useTranslations("venues.plan");

  const toggleDay = (day: string) => {
    const currentDays = policy.allowedDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    onPolicyChange({
      ...policy,
      allowedDays: newDays.length > 0 ? newDays : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{tPolicy("timeRestrictions")}</h3>

      <div className="space-y-3">
        <div>
          <Label className="mb-2 block">{tPolicy("allowedDays")}</Label>
          <div className="grid grid-cols-4 gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={(policy.allowedDays || []).includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                />
                <label htmlFor={day} className="cursor-pointer text-sm">
                  {tPolicy(`daysOfWeek.${day}`)}
                </label>
              </div>
            ))}
          </div>
          {(!policy.allowedDays || policy.allowedDays.length === 0) && (
            <p className="mt-2 text-xs text-muted-foreground">
              {tPolicy("allDays")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeFrom">{tPolicy("allowedStartTimeFrom")}</Label>
            <Input
              id="timeFrom"
              type="time"
              value={policy.allowedStartTimeFrom || ""}
              onChange={(e) =>
                onPolicyChange({
                  ...policy,
                  allowedStartTimeFrom: e.target.value || undefined,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeTo">{tPolicy("allowedStartTimeTo")}</Label>
            <Input
              id="timeTo"
              type="time"
              value={policy.allowedStartTimeTo || ""}
              onChange={(e) =>
                onPolicyChange({
                  ...policy,
                  allowedStartTimeTo: e.target.value || undefined,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VenuePlanPolicy, PlanDuration } from "@/types/venue-plan";

interface PolicyDurationFormProps {
  policy: VenuePlanPolicy;
  onPolicyChange: (policy: VenuePlanPolicy) => void;
}

export function PolicyDurationForm({
  policy,
  onPolicyChange,
}: PolicyDurationFormProps) {
  const tPolicy = useTranslations("venues.plan");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{tPolicy("duration")}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationType">
            {tPolicy("durationType.MONTHLY")}
          </Label>
          <Select
            value={policy.duration}
            onValueChange={(value: PlanDuration) =>
              onPolicyChange({ ...policy, duration: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">
                {tPolicy("durationType.DAILY")}
              </SelectItem>
              <SelectItem value="WEEKLY">
                {tPolicy("durationType.WEEKLY")}
              </SelectItem>
              <SelectItem value="MONTHLY">
                {tPolicy("durationType.MONTHLY")}
              </SelectItem>
              <SelectItem value="QUARTERLY">
                {tPolicy("durationType.QUARTERLY")}
              </SelectItem>
              <SelectItem value="YEARLY">
                {tPolicy("durationType.YEARLY")}
              </SelectItem>
              <SelectItem value="ONE_TIME">
                {tPolicy("durationType.ONE_TIME")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {policy.duration !== "ONE_TIME" && (
          <div className="space-y-2">
            <Label htmlFor="durationValue">{tPolicy("durationValue")}</Label>
            <Input
              id="durationValue"
              type="number"
              min="1"
              value={policy.durationValue || 1}
              onChange={(e) =>
                onPolicyChange({
                  ...policy,
                  durationValue: parseInt(e.target.value) || 1,
                })
              }
              placeholder="1"
            />
            <p className="text-xs text-muted-foreground">
              {tPolicy("durationValueHint", {
                duration: policy.duration.toLowerCase(),
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

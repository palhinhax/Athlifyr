"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VenuePlanPolicy } from "@/types/venue-plan";

interface PolicyLimitsFormProps {
  policy: VenuePlanPolicy;
  onPolicyChange: (policy: VenuePlanPolicy) => void;
}

export function PolicyLimitsForm({
  policy,
  onPolicyChange,
}: PolicyLimitsFormProps) {
  const tPolicy = useTranslations("venues.plan");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{tPolicy("accessLimits")}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxPerDay">{tPolicy("maxBookingsPerDay")}</Label>
          <Input
            id="maxPerDay"
            type="number"
            min="0"
            value={policy.maxBookingsPerDay || ""}
            onChange={(e) =>
              onPolicyChange({
                ...policy,
                maxBookingsPerDay: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            placeholder={tPolicy("unlimited")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPerWeek">{tPolicy("maxBookingsPerWeek")}</Label>
          <Input
            id="maxPerWeek"
            type="number"
            min="0"
            value={policy.maxBookingsPerWeek || ""}
            onChange={(e) =>
              onPolicyChange({
                ...policy,
                maxBookingsPerWeek: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            placeholder={tPolicy("unlimited")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPerMonth">{tPolicy("maxBookingsPerMonth")}</Label>
          <Input
            id="maxPerMonth"
            type="number"
            min="0"
            value={policy.maxBookingsPerMonth || ""}
            onChange={(e) =>
              onPolicyChange({
                ...policy,
                maxBookingsPerMonth: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            placeholder={tPolicy("unlimited")}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { VenuePlanPolicy } from "@/types/venue-plan";

interface PolicyAdvancedFormProps {
  policy: VenuePlanPolicy;
  onPolicyChange: (policy: VenuePlanPolicy) => void;
}

export function PolicyAdvancedForm({
  policy,
  onPolicyChange,
}: PolicyAdvancedFormProps) {
  const tPolicy = useTranslations("venues.plan");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{tPolicy("advancedSettings")}</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="advanceBooking"
            checked={policy.requiresAdvanceBooking}
            onCheckedChange={(checked) =>
              onPolicyChange({
                ...policy,
                requiresAdvanceBooking: checked === true,
              })
            }
          />
          <label htmlFor="advanceBooking" className="cursor-pointer text-sm">
            {tPolicy("requiresAdvanceBooking")}
          </label>
        </div>

        {policy.requiresAdvanceBooking && (
          <div className="ml-6 space-y-2">
            <Label htmlFor="advanceHours">
              {tPolicy("advanceBookingHours")}
            </Label>
            <Input
              id="advanceHours"
              type="number"
              min="1"
              value={policy.advanceBookingHours || ""}
              onChange={(e) =>
                onPolicyChange({
                  ...policy,
                  advanceBookingHours: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowCancel"
            checked={policy.allowCancellation}
            onCheckedChange={(checked) =>
              onPolicyChange({
                ...policy,
                allowCancellation: checked === true,
              })
            }
          />
          <label htmlFor="allowCancel" className="cursor-pointer text-sm">
            {tPolicy("allowCancellation")}
          </label>
        </div>

        {policy.allowCancellation && (
          <div className="ml-6 space-y-2">
            <Label htmlFor="cancelHours">{tPolicy("cancellationHours")}</Label>
            <Input
              id="cancelHours"
              type="number"
              min="0"
              value={policy.cancellationHours || ""}
              onChange={(e) =>
                onPolicyChange({
                  ...policy,
                  cancellationHours: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasTrial"
            checked={policy.hasTrialPeriod}
            onCheckedChange={(checked) =>
              onPolicyChange({
                ...policy,
                hasTrialPeriod: checked === true,
              })
            }
          />
          <label htmlFor="hasTrial" className="cursor-pointer text-sm">
            {tPolicy("hasTrialPeriod")}
          </label>
        </div>

        {policy.hasTrialPeriod && (
          <div className="ml-6 space-y-2">
            <Label htmlFor="trialDays">{tPolicy("trialDays")}</Label>
            <Input
              id="trialDays"
              type="number"
              min="1"
              value={policy.trialDays || ""}
              onChange={(e) =>
                onPolicyChange({
                  ...policy,
                  trialDays: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

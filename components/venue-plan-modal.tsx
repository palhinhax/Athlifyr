"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DEFAULT_PLAN_POLICY,
  type VenuePlanPolicy,
  type PlanDuration,
} from "@/types/venue-plan";

interface VenuePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  plan?: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    currency: string;
    policy?: VenuePlanPolicy | null;
  } | null;
  onSuccess: () => void;
}

export function VenuePlanModal({
  open,
  onOpenChange,
  venueId,
  plan,
  onSuccess,
}: VenuePlanModalProps) {
  const t = useTranslations("venues.plans");
  const tPolicy = useTranslations("venues.plan");
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    price: plan?.price?.toString() || "",
    currency: plan?.currency || "EUR",
  });

  const [policy, setPolicy] = useState<VenuePlanPolicy>(
    plan?.policy || DEFAULT_PLAN_POLICY
  );

  // Update form data when plan changes (for editing different plans)
  useEffect(() => {
    if (open) {
      setFormData({
        name: plan?.name || "",
        description: plan?.description || "",
        price: plan?.price?.toString() || "",
        currency: plan?.currency || "EUR",
      });
      setPolicy(plan?.policy || DEFAULT_PLAN_POLICY);
    }
  }, [plan, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = plan
        ? `/api/venues/${venueId}/plans/${plan.id}`
        : `/api/venues/${venueId}/plans`;

      const method = plan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          price: formData.price ? parseFloat(formData.price) : null,
          currency: formData.currency,
          // paymentProvider removed - now managed at venue level
          policy: policy,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save plan");
      }

      toast({
        title: plan ? t("planUpdated") : t("planCreated"),
        description: plan
          ? t("planUpdatedDescription")
          : t("planCreatedDescription"),
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const DAYS_OF_WEEK = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const toggleDay = (day: string) => {
    const currentDays = policy.allowedDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setPolicy({
      ...policy,
      allowedDays: newDays.length > 0 ? newDays : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{plan ? t("editPlan") : t("createPlan")}</DialogTitle>
          <DialogDescription>
            {plan ? t("editPlanDescription") : t("createPlanDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
              <TabsTrigger value="policy">{tPolicy("policy")}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("namePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t("price")}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">{t("currency")}</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currency: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="EUR"
                    maxLength={3}
                  />
                </div>
              </div>

              {/* Payment provider removed - now managed at venue level */}
            </TabsContent>

            <TabsContent value="policy" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-medium">
                    {tPolicy("duration")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="durationType">
                        {tPolicy("durationType.MONTHLY")}
                      </Label>
                      <Select
                        value={policy.duration}
                        onValueChange={(value: PlanDuration) =>
                          setPolicy({ ...policy, duration: value })
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
                        <Label htmlFor="durationValue">
                          {tPolicy("durationValue")}
                        </Label>
                        <Input
                          id="durationValue"
                          type="number"
                          min="1"
                          value={policy.durationValue || 1}
                          onChange={(e) =>
                            setPolicy({
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

                <div>
                  <h3 className="mb-3 text-sm font-medium">
                    {tPolicy("accessLimits")}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxPerDay">
                        {tPolicy("maxBookingsPerDay")}
                      </Label>
                      <Input
                        id="maxPerDay"
                        type="number"
                        min="0"
                        value={policy.maxBookingsPerDay || ""}
                        onChange={(e) =>
                          setPolicy({
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
                      <Label htmlFor="maxPerWeek">
                        {tPolicy("maxBookingsPerWeek")}
                      </Label>
                      <Input
                        id="maxPerWeek"
                        type="number"
                        min="0"
                        value={policy.maxBookingsPerWeek || ""}
                        onChange={(e) =>
                          setPolicy({
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
                      <Label htmlFor="maxPerMonth">
                        {tPolicy("maxBookingsPerMonth")}
                      </Label>
                      <Input
                        id="maxPerMonth"
                        type="number"
                        min="0"
                        value={policy.maxBookingsPerMonth || ""}
                        onChange={(e) =>
                          setPolicy({
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

                <div>
                  <h3 className="mb-3 text-sm font-medium">
                    {tPolicy("timeRestrictions")}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <Label className="mb-2 block">
                        {tPolicy("allowedDays")}
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={day}
                              checked={(policy.allowedDays || []).includes(day)}
                              onCheckedChange={() => toggleDay(day)}
                            />
                            <label
                              htmlFor={day}
                              className="cursor-pointer text-sm"
                            >
                              {tPolicy(`daysOfWeek.${day}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                      {(!policy.allowedDays ||
                        policy.allowedDays.length === 0) && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {tPolicy("allDays")}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeFrom">
                          {tPolicy("allowedStartTimeFrom")}
                        </Label>
                        <Input
                          id="timeFrom"
                          type="time"
                          value={policy.allowedStartTimeFrom || ""}
                          onChange={(e) =>
                            setPolicy({
                              ...policy,
                              allowedStartTimeFrom: e.target.value || undefined,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeTo">
                          {tPolicy("allowedStartTimeTo")}
                        </Label>
                        <Input
                          id="timeTo"
                          type="time"
                          value={policy.allowedStartTimeTo || ""}
                          onChange={(e) =>
                            setPolicy({
                              ...policy,
                              allowedStartTimeTo: e.target.value || undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium">
                    {tPolicy("advancedSettings")}
                  </h3>
                  <div className="space-y-4">
                    {/* Cancellation Policy - belongs in plan as different plans can have different policies */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowCancel"
                        checked={policy.allowCancellation}
                        onCheckedChange={(checked) =>
                          setPolicy({
                            ...policy,
                            allowCancellation: checked === true,
                          })
                        }
                      />
                      <label
                        htmlFor="allowCancel"
                        className="cursor-pointer text-sm"
                      >
                        {tPolicy("allowCancellation")}
                      </label>
                    </div>

                    {policy.allowCancellation && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="cancelHours">
                          {tPolicy("cancellationHours")}
                        </Label>
                        <Input
                          id="cancelHours"
                          type="number"
                          min="0"
                          value={policy.cancellationHours || ""}
                          onChange={(e) =>
                            setPolicy({
                              ...policy,
                              cancellationHours: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          {tPolicy("cancellationHoursHint")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("saving") : plan ? t("save") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

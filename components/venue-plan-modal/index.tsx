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
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_PLAN_POLICY, type VenuePlanPolicy } from "@/types/venue-plan";
import { BasicInfoForm } from "./basic-info-form";
import { PolicyDurationForm } from "./policy-duration-form";
import { PolicyLimitsForm } from "./policy-limits-form";
import { PolicyScheduleForm } from "./policy-schedule-form";
import { PolicyAdvancedForm } from "./policy-advanced-form";
import { IncludedVenuesForm } from "./included-venues-form";

interface IncludedVenue {
  venue: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    logo: string | null;
  };
}

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
    includedVenues?: IncludedVenue[];
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
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    price: plan?.price?.toString() || "",
    currency: plan?.currency || "EUR",
    // paymentProvider removed - now managed at venue level
  });

  const [policy, setPolicy] = useState<VenuePlanPolicy>(
    plan?.policy || DEFAULT_PLAN_POLICY
  );

  const [includedVenueIds, setIncludedVenueIds] = useState<string[]>(
    plan?.includedVenues?.map((iv) => iv.venue.id) || []
  );
  // Update form data when plan changes (for editing different plans)
  useEffect(() => {
    if (open) {
      setFormData({
        name: plan?.name || "",
        description: plan?.description || "",
        price: plan?.price?.toString() || "",
        currency: plan?.currency || "EUR",
        // paymentProvider removed - now managed at venue level
      });
      setPolicy(plan?.policy || DEFAULT_PLAN_POLICY);
      setIncludedVenueIds(plan?.includedVenues?.map((iv) => iv.venue.id) || []);
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
          includedVenueIds: includedVenueIds,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{plan ? t("editPlan") : t("createPlan")}</DialogTitle>
          <DialogDescription>{t("planDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
              <TabsTrigger value="policy">{t("accessPolicy")}</TabsTrigger>
              <TabsTrigger value="venues">{t("multiVenue")}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 py-4">
              <BasicInfoForm
                formData={formData}
                onFormDataChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="policy" className="space-y-6 py-4">
              <PolicyDurationForm policy={policy} onPolicyChange={setPolicy} />
              <PolicyLimitsForm policy={policy} onPolicyChange={setPolicy} />
              <PolicyScheduleForm policy={policy} onPolicyChange={setPolicy} />
              <PolicyAdvancedForm policy={policy} onPolicyChange={setPolicy} />
            </TabsContent>

            <TabsContent value="venues" className="space-y-4 py-4">
              <IncludedVenuesForm
                currentVenueId={venueId}
                selectedVenueIds={includedVenueIds}
                onSelectedVenueIdsChange={setIncludedVenueIds}
              />
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

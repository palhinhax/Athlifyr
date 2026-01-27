"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VenueSessionsSettingsProps {
  venue: {
    id: string;
    services?: string[];
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultCancellationDeadlineMinutes: number;
  };
  onRefresh?: () => void;
}

const AVAILABLE_SERVICES = [
  "CROSSFIT",
  "HYROX",
  "WEIGHTLIFTING",
  "POWERLIFTING",
  "OLYMPIC_LIFTING",
  "FUNCTIONAL_FITNESS",
  "PERSONAL_TRAINING",
  "GROUP_CLASSES",
  "OPEN_GYM",
  "MASSAGE",
  "PHYSIOTHERAPY",
  "NUTRITION",
  "YOGA",
  "PILATES",
  "BOXING",
  "KICKBOXING",
  "MMA",
  "BJJ",
  "RECOVERY",
  "SAUNA",
  "COLD_PLUNGE",
  "OTHER",
];

export function VenueSessionsSettings({
  venue,
  onRefresh,
}: VenueSessionsSettingsProps) {
  const t = useTranslations("venues");
  const tInfo = useTranslations("venues.info");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    services: venue.services || [],
    defaultSessionCapacity: venue.defaultSessionCapacity?.toString() || "",
    defaultBookingAdvanceDays: venue.defaultBookingAdvanceDays.toString(),
    defaultCancellationDeadlineMinutes:
      venue.defaultCancellationDeadlineMinutes.toString(),
  });

  // Sync form data when venue prop changes (after router.refresh())
  useEffect(() => {
    setFormData({
      services: venue.services || [],
      defaultSessionCapacity: venue.defaultSessionCapacity?.toString() || "",
      defaultBookingAdvanceDays: venue.defaultBookingAdvanceDays.toString(),
      defaultCancellationDeadlineMinutes:
        venue.defaultCancellationDeadlineMinutes.toString(),
    });
  }, [
    venue.services,
    venue.defaultSessionCapacity,
    venue.defaultBookingAdvanceDays,
    venue.defaultCancellationDeadlineMinutes,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        services: formData.services,
        defaultSessionCapacity: formData.defaultSessionCapacity
          ? parseInt(formData.defaultSessionCapacity, 10)
          : null,
        defaultBookingAdvanceDays: parseInt(
          formData.defaultBookingAdvanceDays,
          10
        ),
        defaultCancellationDeadlineMinutes: parseInt(
          formData.defaultCancellationDeadlineMinutes,
          10
        ),
      };

      const response = await fetch(`/api/venues/${venue.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update venue");
      }

      // Get the updated venue data from response
      const updatedVenue = await response.json();

      // Update local form state with saved values
      setFormData({
        services: updatedVenue.services || [],
        defaultSessionCapacity:
          updatedVenue.defaultSessionCapacity?.toString() || "",
        defaultBookingAdvanceDays:
          updatedVenue.defaultBookingAdvanceDays.toString(),
        defaultCancellationDeadlineMinutes:
          updatedVenue.defaultCancellationDeadlineMinutes.toString(),
      });

      toast({
        title: tCommon("success"),
        description: t("edit.updateSuccess"),
      });

      // Trigger refresh callback to update parent component data
      if (onRefresh) {
        onRefresh();
      }

      // Also trigger router refresh for other components
      router.refresh();

      // Don't close modal - user can continue editing or close manually
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: tCommon("error"),
        description: t("edit.updateError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Session Defaults */}
      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{t("sessionDefaults")}</h3>
          <p className="text-xs text-muted-foreground">
            {tInfo("sessionDefaultsDescription")}
          </p>
        </div>

        <div className="space-y-4">
          {/* Default Capacity */}
          <div className="space-y-2">
            <Label htmlFor="defaultSessionCapacity">
              {tInfo("defaultCapacity")}
            </Label>
            <Input
              id="defaultSessionCapacity"
              name="defaultSessionCapacity"
              type="number"
              min="1"
              value={formData.defaultSessionCapacity}
              onChange={handleInputChange}
              placeholder="20"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {tInfo("defaultCapacityHint")}
            </p>
          </div>

          {/* Default Booking Advance Days */}
          <div className="space-y-2">
            <Label htmlFor="defaultBookingAdvanceDays">
              {tInfo("defaultBookingAdvance")}
            </Label>
            <Input
              id="defaultBookingAdvanceDays"
              name="defaultBookingAdvanceDays"
              type="number"
              min="0"
              value={formData.defaultBookingAdvanceDays}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {tInfo("defaultBookingAdvanceHint")}
            </p>
          </div>

          {/* Default Cancellation Deadline Minutes */}
          <div className="space-y-2">
            <Label htmlFor="defaultCancellationDeadlineMinutes">
              {tInfo("defaultCancellationDeadline")}
            </Label>
            <Input
              id="defaultCancellationDeadlineMinutes"
              name="defaultCancellationDeadlineMinutes"
              type="number"
              min="0"
              value={formData.defaultCancellationDeadlineMinutes}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {tInfo("defaultCancellationDeadlineHint")}
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{tInfo("servicesTitle")}</h3>
          <p className="text-xs text-muted-foreground">
            {tInfo("servicesDescription")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AVAILABLE_SERVICES.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service}`}
                checked={formData.services.includes(service)}
                onCheckedChange={() => handleServiceToggle(service)}
                disabled={loading}
              />
              <label
                htmlFor={`service-${service}`}
                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t(`services.${service}`)}
              </label>
            </div>
          ))}
        </div>

        {formData.services.length === 0 && (
          <p className="text-sm italic text-muted-foreground">
            {tInfo("noServicesSelected")}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tCommon("loading")}
            </>
          ) : (
            tCommon("save")
          )}
        </Button>
      </div>
    </form>
  );
}

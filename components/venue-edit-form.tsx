"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

// Venue types from Prisma schema
const VENUE_TYPES = [
  "CROSSFIT_BOX",
  "CROSSTRAINING_BOX",
  "GYM",
  "PT_STUDIO",
  "MASSAGE",
  "PHYSIO",
  "NUTRITION",
  "OTHER",
] as const;

// Venue services from Prisma schema
const VENUE_SERVICES = [
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
] as const;

interface VenueEditFormProps {
  venue: {
    id: string;
    name: string;
    type: string;
    logo: string | null;
    coverImage: string | null;
    description: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    instagram: string | null;
    whatsapp: string | null;
    address: string | null;
    city: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
    services?: string[];
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultCancellationDeadlineMinutes: number;
  };
  onSuccess?: () => void;
}

export function VenueEditForm({ venue, onSuccess }: VenueEditFormProps) {
  const t = useTranslations("venues");
  const tInfo = useTranslations("venues.info");
  const tTypes = useTranslations("venues.types");
  const tServices = useTranslations("venues.services");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: venue.name,
    type: venue.type,
    description: venue.description || "",
    phone: venue.phone || "",
    email: venue.email || "",
    website: venue.website || "",
    instagram: venue.instagram || "",
    whatsapp: venue.whatsapp || "",
    address: venue.address || "",
    city: venue.city || "",
    country: venue.country,
    logo: venue.logo || "",
    coverImage: venue.coverImage || "",
    latitude: venue.latitude?.toString() || "",
    longitude: venue.longitude?.toString() || "",
    services: venue.services || [],
    defaultSessionCapacity: venue.defaultSessionCapacity?.toString() || "",
    defaultBookingAdvanceDays: venue.defaultBookingAdvanceDays.toString(),
    defaultCancellationDeadlineMinutes:
      venue.defaultCancellationDeadlineMinutes.toString(),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleImageUpload = async (
    url: string,
    _fileId: string,
    _fileName: string,
    type: "logo" | "cover"
  ) => {
    if (type === "logo") {
      setFormData((prev) => ({ ...prev, logo: url }));
    } else {
      setFormData((prev) => ({ ...prev, coverImage: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/venues/${venue.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          defaultSessionCapacity: formData.defaultSessionCapacity
            ? parseInt(formData.defaultSessionCapacity)
            : null,
          defaultBookingAdvanceDays: parseInt(
            formData.defaultBookingAdvanceDays
          ),
          defaultCancellationDeadlineMinutes: parseInt(
            formData.defaultCancellationDeadlineMinutes
          ),
        }),
      });

      if (response.ok) {
        toast({
          title: tCommon("success"),
          description: t("edit.updateSuccess"),
        });
        router.refresh();
        onSuccess?.();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update venue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      toast({
        title: "Error",
        description: "Failed to update venue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Images Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label>{t("coverImage")}</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            {formData.coverImage ? (
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg border-2 border-muted sm:w-32">
                <Image
                  src={formData.coverImage}
                  alt="Cover"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/10 sm:w-32">
                <p className="text-xs text-muted-foreground">No cover</p>
              </div>
            )}
            <ImageUpload
              id="venue-cover-upload"
              onUploadComplete={(url, fileId, fileName) => {
                handleImageUpload(url, fileId, fileName, "cover");
              }}
              buttonText={
                formData.coverImage ? t("changeCover") : t("uploadCover")
              }
            />
          </div>
        </div>

        <div>
          <Label>{t("logo")}</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            {formData.logo ? (
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg border-2 border-muted sm:w-32">
                <Image
                  src={formData.logo}
                  alt="Logo"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/10 sm:w-32">
                <p className="text-xs text-muted-foreground">No logo</p>
              </div>
            )}
            <ImageUpload
              id="venue-logo-upload"
              onUploadComplete={(url, fileId, fileName) => {
                handleImageUpload(url, fileId, fileName, "logo");
              }}
              buttonText={formData.logo ? t("changeLogo") : t("uploadLogo")}
            />
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{tInfo("name")}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">{tInfo("type")}</Label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder={tInfo("type")} />
            </SelectTrigger>
            <SelectContent>
              {VENUE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {tTypes(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">{tInfo("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{tInfo("phone")}</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{tInfo("description")}</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {t("edit.markdownSupported")}
        </p>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <Label>{tInfo("servicesTitle")}</Label>
        <p className="text-sm text-muted-foreground">
          {tInfo("servicesDescription")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {VENUE_SERVICES.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center space-x-2 rounded-md border p-2 hover:bg-muted/50"
            >
              <Checkbox
                id={`service-${service}`}
                checked={formData.services.includes(service)}
                onCheckedChange={() => handleServiceToggle(service)}
              />
              <span className="text-sm">{tServices(service)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">{tInfo("website")}</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">{tInfo("instagram")}</Label>
          <Input
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            placeholder="@username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="+351 912 345 678"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">{tInfo("address")}</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{tInfo("city")}</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="latitude">{tInfo("latitude")}</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">{tInfo("longitude")}</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Session Defaults */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">{t("sessionDefaults")}</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="defaultSessionCapacity">
              {tInfo("defaultCapacity")}
            </Label>
            <Input
              id="defaultSessionCapacity"
              name="defaultSessionCapacity"
              type="number"
              value={formData.defaultSessionCapacity}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultBookingAdvanceDays">
              {tInfo("bookingAdvanceDays")}
            </Label>
            <Input
              id="defaultBookingAdvanceDays"
              name="defaultBookingAdvanceDays"
              type="number"
              value={formData.defaultBookingAdvanceDays}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultCancellationDeadlineMinutes">
              {tInfo("cancellationDeadline")}
            </Label>
            <Input
              id="defaultCancellationDeadlineMinutes"
              name="defaultCancellationDeadlineMinutes"
              type="number"
              value={formData.defaultCancellationDeadlineMinutes}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tCommon("save")}
        </Button>
      </div>
    </form>
  );
}

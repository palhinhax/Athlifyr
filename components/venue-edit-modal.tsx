"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface VenueEditModalProps {
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
    address: string | null;
    city: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultCancellationDeadlineMinutes: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VenueEditModal({
  venue,
  open,
  onOpenChange,
}: VenueEditModalProps) {
  const t = useTranslations("venues");
  const tInfo = useTranslations("venues.info");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [formData, setFormData] = useState({
    name: venue.name,
    description: venue.description || "",
    phone: venue.phone || "",
    email: venue.email || "",
    website: venue.website || "",
    instagram: venue.instagram || "",
    address: venue.address || "",
    city: venue.city || "",
    country: venue.country,
    logo: venue.logo || "",
    coverImage: venue.coverImage || "",
    latitude: venue.latitude?.toString() || "",
    longitude: venue.longitude?.toString() || "",
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

  const handleImageUpload = async (
    url: string,
    fileId: string,
    fileName: string,
    type: "logo" | "cover"
  ) => {
    console.log(`${type} upload completed:`, { url, fileId, fileName });

    setFormData((prev) => ({
      ...prev,
      [type === "logo" ? "logo" : "coverImage"]: url,
    }));

    if (type === "logo") {
      setUploadingLogo(false);
    } else {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data with proper type conversions
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
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

      console.log("Submitting venue data:", submitData);

      const response = await fetch(`/api/venues/${venue.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        throw new Error(errorData.error || "Failed to update venue");
      }

      const updatedVenue = await response.json();
      console.log("Venue updated successfully:", updatedVenue);

      toast({
        title: tCommon("success"),
        description: t("edit.updateSuccess"),
      });

      onOpenChange(false);
      router.refresh();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("editVenue")}</DialogTitle>
          <DialogDescription>{t("edit.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">{t("edit.logo")}</Label>
            <div className="flex flex-col gap-4">
              {formData.logo && (
                <div className="flex items-center gap-2">
                  <Image
                    src={formData.logo}
                    alt="Logo"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-lg object-cover"
                    key={formData.logo}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, logo: "" }))
                    }
                  >
                    {t("edit.removeImage")}
                  </Button>
                </div>
              )}
              <ImageUpload
                folder="events"
                onUploadComplete={(url, fileId, fileName) => {
                  console.log("Logo uploaded:", { url, fileId, fileName });
                  handleImageUpload(url, fileId, fileName, "logo");
                }}
                currentImageUrl={formData.logo}
                buttonText={
                  formData.logo ? t("edit.changeLogo") : t("edit.uploadLogo")
                }
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">{t("edit.coverImage")}</Label>
            <div className="flex flex-col gap-4">
              {formData.coverImage && (
                <div className="relative">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={formData.coverImage}
                      alt="Cover"
                      key={formData.coverImage}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, coverImage: "" }))
                    }
                  >
                    {t("edit.removeImage")}
                  </Button>
                </div>
              )}
              <ImageUpload
                folder="events"
                onUploadComplete={(url, fileId, fileName) => {
                  console.log("Cover uploaded:", { url, fileId, fileName });
                  handleImageUpload(url, fileId, fileName, "cover");
                }}
                currentImageUrl={formData.coverImage}
                buttonText={
                  formData.coverImage
                    ? t("edit.changeCover")
                    : t("edit.uploadCover")
                }
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{tInfo("name")} *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{tInfo("description")}</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Contact Info - Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">{tInfo("phone")}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{tInfo("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">{tInfo("website")}</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram">{tInfo("instagram")}</Label>
              <Input
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="@username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">{tInfo("address")}</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Location - Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">{tInfo("city")}</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">{tInfo("country")}</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Coordinates - Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Latitude */}
            <div className="space-y-2">
              <Label htmlFor="latitude">
                {tInfo("latitude")}
                <span className="ml-1 text-xs text-muted-foreground">
                  (ex: 38.7223)
                </span>
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="text"
                inputMode="decimal"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="38.7223"
                disabled={loading}
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <Label htmlFor="longitude">
                {tInfo("longitude")}
                <span className="ml-1 text-xs text-muted-foreground">
                  (ex: -9.1393)
                </span>
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="text"
                inputMode="decimal"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="-9.1393"
                disabled={loading}
              />
            </div>
          </div>

          {/* Session Defaults Section */}
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">
                {tInfo("sessionDefaults")}
              </h3>
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingLogo || uploadingCover}
            >
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
      </DialogContent>
    </Dialog>
  );
}

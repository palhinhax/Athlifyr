"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VenueStaffManager } from "@/components/venue/staff";
import { VenueEditForm } from "@/components/venue-edit-form";
import { VenuePaymentsSettings } from "@/components/venue-payments-settings";
import { VenueSessionsSettings } from "@/components/venue-sessions-settings";
import { VenueSEOSettings } from "@/components/venue-seo-settings";

interface VenueSettingsModalProps {
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
    services?: string[];
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultCancellationDeadlineMinutes: number;
    paymentMode: "IN_APP" | "EXTERNAL" | "MIXED";
    externalPaymentInstructions: string | null;
    members: Array<{
      id: string;
      role: string;
      userId: string;
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
      };
    }>;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
  userId: string;
  isOwner: boolean;
  userRole?: string;
}

export function VenueSettingsModal({
  venue,
  open,
  onOpenChange,
  onRefresh,
  userId,
  isOwner,
  userRole,
}: VenueSettingsModalProps) {
  const t = useTranslations("venues");
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("venueSettings")}</DialogTitle>
          <DialogDescription>{venue.name}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              {t("settingsTabs.general")}
            </TabsTrigger>
            <TabsTrigger value="sessions">
              {t("settingsTabs.sessions")}
            </TabsTrigger>
            <TabsTrigger value="staff">{t("settingsTabs.staff")}</TabsTrigger>
            <TabsTrigger value="payments">
              {t("settingsTabs.payments")}
            </TabsTrigger>
            <TabsTrigger value="seo">{t("settingsTabs.seo")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <VenueEditForm
              venue={venue}
              onSuccess={() => {
                if (onRefresh) onRefresh();
                onOpenChange(false);
              }}
            />
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <VenueSessionsSettings venue={venue} onRefresh={onRefresh} />
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <VenueStaffManager
              venueId={venue.id}
              venueName={venue.name}
              members={venue.members}
              currentUserId={userId}
              isOwner={isOwner}
              isAppAdmin={userRole === "ADMIN"}
            />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <VenuePaymentsSettings
              venueId={venue.id}
              isOwner={isOwner}
              userRole={userRole}
              currentPaymentMode={venue.paymentMode}
              externalPaymentInstructions={venue.externalPaymentInstructions}
            />
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <VenueSEOSettings
              venueId={venue.id}
              venueName={venue.name}
              venueCity={venue.city}
              isOwner={isOwner}
              isAppAdmin={userRole === "ADMIN"}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

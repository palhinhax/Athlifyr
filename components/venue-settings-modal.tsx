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
import {
  ResponsiveTabs,
  ResponsiveTabsContent,
} from "@/components/ui/responsive-tabs";
import {
  Building2Icon,
  CalendarIcon,
  CreditCardIcon,
  GlobeIcon,
  SearchIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react";
import { VenueStaffManager } from "@/components/venue/staff";
import { VenueEditForm } from "@/components/venue-edit-form";
import { VenuePaymentsSettings } from "@/components/venue-payments-settings";
import { VenueSessionsSettings } from "@/components/venue-sessions-settings";
import { VenueSEOSettings } from "@/components/venue-seo-settings";
import { VenueVisibilitySettings } from "@/components/venue-visibility-settings";
import { VenueDescriptionTranslations } from "@/components/venue-description-translations";

interface VenueSettingsModalProps {
  venue: {
    id: string;
    slug: string;
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
    defaultBookingDeadlineMinutes: number;
    defaultCancellationDeadlineMinutes: number;
    requiresPlanToBook: boolean;
    paymentMode: "IN_APP" | "EXTERNAL" | "MIXED";
    externalPaymentInstructions: string | null;
    visibleTabs?: string[];
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

        <ResponsiveTabs
          tabs={[
            {
              value: "general",
              label: t("settingsTabs.general"),
              icon: <Building2Icon />,
            },
            {
              value: "translations",
              label: t("settingsTabs.translations"),
              icon: <GlobeIcon />,
            },
            {
              value: "sessions",
              label: t("settingsTabs.sessions"),
              icon: <CalendarIcon />,
            },
            {
              value: "staff",
              label: t("settingsTabs.staff"),
              icon: <UsersIcon />,
            },
            {
              value: "payments",
              label: t("settingsTabs.payments"),
              icon: <CreditCardIcon />,
            },
            {
              value: "advanced",
              label: t("settingsTabs.advanced"),
              icon: <Settings2Icon />,
            },
            {
              value: "seo",
              label: t("settingsTabs.seo"),
              icon: <SearchIcon />,
            },
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        <ResponsiveTabsContent value="general" activeValue={activeTab}>
          <VenueEditForm
            venue={venue}
            onSuccess={() => {
              if (onRefresh) onRefresh();
              onOpenChange(false);
            }}
          />
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="translations" activeValue={activeTab}>
          <VenueDescriptionTranslations
            venueId={venue.id}
            venueDescription={venue.description}
            isOwner={isOwner}
            isAppAdmin={userRole === "ADMIN"}
          />
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="sessions" activeValue={activeTab}>
          <VenueSessionsSettings venue={venue} onRefresh={onRefresh} />
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="staff" activeValue={activeTab}>
          <VenueStaffManager
            venueId={venue.id}
            venueName={venue.name}
            members={venue.members}
            currentUserId={userId}
            isOwner={isOwner}
            isAppAdmin={userRole === "ADMIN"}
          />
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="payments" activeValue={activeTab}>
          <VenuePaymentsSettings
            venueId={venue.id}
            isOwner={isOwner}
            userRole={userRole}
            currentPaymentMode={venue.paymentMode}
            externalPaymentInstructions={venue.externalPaymentInstructions}
          />
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="advanced" activeValue={activeTab}>
          <VenueVisibilitySettings
            venueId={venue.id}
            visibleTabs={venue.visibleTabs || []}
            isOwner={isOwner}
            isAppAdmin={userRole === "ADMIN"}
            onRefresh={onRefresh}
          />
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="seo" activeValue={activeTab}>
          <VenueSEOSettings
            venueId={venue.id}
            venueName={venue.name}
            venueCity={venue.city}
            isOwner={isOwner}
            isAppAdmin={userRole === "ADMIN"}
          />
        </ResponsiveTabsContent>
      </DialogContent>
    </Dialog>
  );
}

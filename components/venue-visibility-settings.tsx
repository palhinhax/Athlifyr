"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Home,
  Info,
  CreditCard,
  Calendar,
  AlertCircle,
  Users,
  Receipt,
} from "lucide-react";

// Available tabs that can be toggled for public view
// Public tabs: visible to everyone
// Admin tabs: only visible to owners/admins but can be disabled
const AVAILABLE_TABS = [
  { id: "feed", icon: Home, isAdminOnly: false },
  { id: "about", icon: Info, isAdminOnly: false },
  { id: "plans", icon: CreditCard, isAdminOnly: false },
  { id: "sessions", icon: Calendar, isAdminOnly: false },
  { id: "team", icon: Users, isAdminOnly: false },
  { id: "clients", icon: Users, isAdminOnly: true },
  { id: "subscriptions", icon: Receipt, isAdminOnly: true },
] as const;

type TabId = (typeof AVAILABLE_TABS)[number]["id"];

const DEFAULT_VISIBLE_TABS = [
  "feed",
  "about",
  "plans",
  "sessions",
  "team",
  "clients",
  "subscriptions",
];

interface VenueVisibilitySettingsProps {
  venueId: string;
  visibleTabs: string[];
  isOwner: boolean;
  isAppAdmin?: boolean;
  onRefresh?: () => void;
}

export function VenueVisibilitySettings({
  venueId,
  visibleTabs: initialVisibleTabs,
  isOwner,
  isAppAdmin = false,
  onRefresh,
}: VenueVisibilitySettingsProps) {
  const t = useTranslations("venues");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState<string[]>(
    initialVisibleTabs || DEFAULT_VISIBLE_TABS
  );

  // Sync state when props change
  useEffect(() => {
    setVisibleTabs(initialVisibleTabs || DEFAULT_VISIBLE_TABS);
  }, [initialVisibleTabs]);

  const handleToggle = (tabId: TabId, checked: boolean) => {
    if (checked) {
      setVisibleTabs((prev) => [...prev, tabId]);
    } else {
      setVisibleTabs((prev) => prev.filter((id) => id !== tabId));
    }
  };

  const handleSave = async () => {
    // Ensure at least one tab is visible
    if (visibleTabs.length === 0) {
      toast({
        title: t("visibility.atLeastOne"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibleTabs }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility settings");
      }

      toast({
        title: tCommon("changesSaved"),
      });

      router.refresh();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error saving visibility settings:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    JSON.stringify(visibleTabs.sort()) !==
    JSON.stringify((initialVisibleTabs || DEFAULT_VISIBLE_TABS).sort());

  // Allow owners and app admins to manage visibility settings
  const canManageVisibility = isOwner || isAppAdmin;

  if (!canManageVisibility) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-500">
        <AlertCircle className="h-4 w-4" />
        <p>{t("visibility.ownerOnly")}</p>
      </div>
    );
  }

  // Separate public and admin-only tabs
  const publicTabs = AVAILABLE_TABS.filter((tab) => !tab.isAdminOnly);
  const adminTabs = AVAILABLE_TABS.filter((tab) => tab.isAdminOnly);

  return (
    <div className="space-y-6">
      {/* Public Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>{t("visibility.publicTabs")}</CardTitle>
          <CardDescription>
            {t("visibility.publicTabsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {publicTabs.map((tab) => {
            const Icon = tab.icon;
            const isChecked = visibleTabs.includes(tab.id);

            return (
              <div
                key={tab.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label
                      htmlFor={`tab-${tab.id}`}
                      className="cursor-pointer text-base font-medium"
                    >
                      {t(`tabs.${tab.id}`)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t(`visibility.tabs.${tab.id}Description`)}
                    </p>
                  </div>
                </div>
                <Checkbox
                  id={`tab-${tab.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked: boolean) =>
                    handleToggle(tab.id, checked)
                  }
                  disabled={loading}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Admin-Only Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>{t("visibility.adminTabs")}</CardTitle>
          <CardDescription>
            {t("visibility.adminTabsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isChecked = visibleTabs.includes(tab.id);

            return (
              <div
                key={tab.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label
                      htmlFor={`tab-${tab.id}`}
                      className="cursor-pointer text-base font-medium"
                    >
                      {t(`tabs.${tab.id}`)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t(`visibility.tabs.${tab.id}Description`)}
                    </p>
                  </div>
                </div>
                <Checkbox
                  id={`tab-${tab.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked: boolean) =>
                    handleToggle(tab.id, checked)
                  }
                  disabled={loading}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {visibleTabs.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-600 dark:text-red-500">
          <AlertCircle className="h-4 w-4" />
          <p>{t("visibility.atLeastOne")}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading || !hasChanges}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tCommon("save")}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { VenueProfileHeader } from "@/components/venue-profile-header";
import { VenueFeed } from "@/components/venue-feed";
import { VenuePlanModal } from "@/components/venue-plan-modal/index";
import { VenueSubscribersManager } from "@/components/venue-subscribers-manager";
import { VenueSessionsCalendar } from "@/components/venue-sessions-calendar";
import { VenueClientsManager } from "@/components/venue-clients-manager";
import { VenueOwnershipClaimButton } from "@/components/venue-ownership-claim-button";
import { VenueAboutTab } from "@/components/venue-about-tab";
import { VenuePlansTab } from "@/components/venue-plans-tab";
import { VenueTeamTab } from "@/components/venue-team-tab";
import { VenueCheckoutDialog } from "@/components/venue-checkout-dialog";
import { Calendar, Home, Info, CreditCard, Users } from "lucide-react";
import type { VenuePlanPolicy } from "@/types/venue-plan";

interface Venue {
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
  plans: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    currency: string;
    // paymentProvider removed - now managed at venue level via venue.paymentMode
    policy?: VenuePlanPolicy | null;
    isActive: boolean;
    includedVenues?: Array<{
      venue: {
        id: string;
        name: string;
        slug: string;
        city: string | null;
        logo: string | null;
      };
    }>;
    subscriptions?: Array<{
      id: string;
      status: string;
      paymentStatus: string;
      startsAt: string;
      endsAt: string | null;
      createdAt: string;
      totalBookingsUsed?: number;
    }>;
  }>;
  _count: {
    sessions: number;
    bookings: number;
    subscriptions: number;
  };
  crossVenueSubscriptions?: Array<{
    id: string;
    status: string;
    paymentStatus: string;
    startsAt: string;
    endsAt: string | null;
    createdAt: string;
    totalBookingsUsed?: number;
    plan: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      currency: string;
      policy?: VenuePlanPolicy | null;
      venue: {
        id: string;
        name: string;
        slug: string;
        city: string | null;
        logo: string | null;
      };
    };
  }>;
}

// Admin tabs that are ALWAYS visible for owners/admins (cannot be hidden)
// These are essential management tabs that must always be accessible
const ADMIN_ONLY_TABS = ["clients", "subscriptions"];

export function VenueDetailClient({
  slug,
  locale,
  userId,
  userName,
  userImage,
  userRole,
  initialTranslatedDescription,
}: {
  slug: string;
  locale: string;
  userId?: string;
  userName?: string | null;
  userImage?: string | null;
  userRole?: string;
  initialTranslatedDescription?: string | null;
}) {
  const t = useTranslations("venues");
  const tPlans = useTranslations("venues.plans");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<
    string | null
  >(initialTranslatedDescription ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: number;
    currency: string;
    // paymentProvider removed - will use venue.paymentMode instead
  } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "IN_APP" | "EXTERNAL" | null
  >(null); // For MIXED mode: temporary choice until user selects
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<{
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    currency: string;
    policy?: VenuePlanPolicy | null;
    includedVenues?: Array<{
      venue: {
        id: string;
        name: string;
        slug: string;
        city: string | null;
        logo: string | null;
      };
    }>;
  } | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check if user is owner or admin
  const isOwnerOrAdmin = Boolean(
    userId &&
    (userRole === "ADMIN" || // App admin can edit any venue
      venue?.members.some(
        (m) =>
          m.user.id === userId && (m.role === "OWNER" || m.role === "ADMIN")
      ))
  );

  // Check if user is a coach (or higher: owner/admin)
  const isCoachOrHigher = Boolean(
    userId &&
    (userRole === "ADMIN" || // App admin
      venue?.members.some(
        (m) =>
          m.user.id === userId &&
          (m.role === "OWNER" || m.role === "ADMIN" || m.role === "COACH")
      ))
  );

  // Check if user is a member (any role)
  const isMember = Boolean(
    userId && venue?.members.some((m) => m.user.id === userId)
  );

  const handleSubscribeClick = (plan: {
    id: string;
    name: string;
    price: number | null;
    currency: string;
    // paymentProvider removed - will use venue.paymentMode instead
  }) => {
    if (!plan.price) return;
    setSelectedPlan({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      // paymentProvider removed - checkout will use venue.paymentMode
    });
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setCheckoutOpen(false);
    setSelectedPlan(null);
    setSelectedPaymentMethod(null); // Reset payment method selection for MIXED mode

    // Show success toast
    toast({
      title: tPlans("subscriptionSuccess"),
      description: tPlans("subscriptionSuccessDescription"),
      variant: "default",
    });

    // Refresh venue data to show new subscription
    fetchVenue();
  };

  const handleOnSiteSubscriptionRequest = async () => {
    if (!venue || !selectedPlan) return;

    try {
      const response = await fetch(`/api/venues/${venue.id}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit subscription request");
      }

      setCheckoutOpen(false);
      setSelectedPlan(null);
      setSelectedPaymentMethod(null);

      // Show pending toast (not success - subscription is pending staff approval)
      toast({
        title: t("payment.requestSubmitted"),
        description: t("payment.requestSubmittedDescription"),
        variant: "default",
      });

      // Refresh venue data
      fetchVenue();
    } catch (error) {
      console.error("Error submitting subscription request:", error);
      toast({
        title: tPlans("errors.subscribeFailed"),
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCheckoutCancel = () => {
    setCheckoutOpen(false);
    setSelectedPlan(null);
    setSelectedPaymentMethod(null); // Reset payment method selection for MIXED mode
  };

  const handleTogglePlanActiveClick = (planId: string) => {
    setDeletePlanId(planId);
    setDeleteAlertOpen(true);
  };

  const handleTogglePlanActiveConfirm = async () => {
    if (!deletePlanId || !venue) return;

    const plan = venue.plans.find((p) => p.id === deletePlanId);
    if (!plan) return;

    try {
      setIsDeleting(true);

      if (plan.isActive) {
        // Deactivate plan
        const response = await fetch(
          `/api/venues/${venue.id}/plans/${deletePlanId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to deactivate plan");
        }
      } else {
        // Reactivate plan
        const response = await fetch(
          `/api/venues/${venue.id}/plans/${deletePlanId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isActive: true }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to reactivate plan");
        }
      }

      // Refresh venue data
      await fetchVenue();

      // Close dialog
      setDeleteAlertOpen(false);
      setDeletePlanId(null);
    } catch (err) {
      console.error("Error toggling plan status:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to update plan status. Please try again.";

      setErrorMessage(errorMsg);
      setErrorDialogOpen(true);
      setDeleteAlertOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchVenue = useCallback(async () => {
    try {
      const response = await fetch(`/api/venues/${slug}`);

      if (!response.ok) {
        throw new Error("Venue not found");
      }

      const data = await response.json();
      setVenue(data);

      // Only fetch translations if we don't already have one from SSR
      if (!translatedDescription) {
        try {
          const translationsResponse = await fetch(`/api/venues/${slug}/seo`);
          if (translationsResponse.ok) {
            const translationsData = await translationsResponse.json();
            const translation = translationsData.translations?.find(
              (t: { language: string; description?: string }) =>
                t.language === locale
            );
            if (translation?.description) {
              setTranslatedDescription(translation.description);
            }
          }
        } catch {
          // If translations fetch fails, use the default description
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load venue");
    } finally {
      setLoading(false);
    }
  }, [slug, locale, translatedDescription]);

  useEffect(() => {
    fetchVenue();
  }, [fetchVenue]);

  // Hide SSR content when client loads successfully
  useEffect(() => {
    if (!loading && venue) {
      // Find and hide SSR content
      const ssrContent = document.querySelector(".venue-ssr-content");
      if (ssrContent) {
        (ssrContent as HTMLElement).style.display = "none";
      }
    }
  }, [loading, venue]);

  // Helper function to check if a tab is visible
  const isTabVisible = useCallback(
    (tabId: string) => {
      // Admin tabs are ALWAYS visible for owners/admins - they cannot be hidden
      // These are essential management tabs that must always be accessible
      if (ADMIN_ONLY_TABS.includes(tabId)) {
        return true; // Always visible (access is controlled by isOwnerOrAdmin check in JSX)
      }

      // For public tabs, check the visibleTabs configuration
      const defaultTabs = ["feed", "about", "plans", "sessions", "team"];
      const visibleTabs = venue?.visibleTabs ?? [
        ...defaultTabs,
        ...ADMIN_ONLY_TABS,
      ];
      return visibleTabs.includes(tabId);
    },
    [venue?.visibleTabs]
  );

  // Count visible tabs to hide TabsList when only 1 tab is visible
  const visibleTabsCount = useMemo(() => {
    const publicTabs = ["feed", "about", "plans", "sessions", "team"];

    let count = publicTabs.filter((tab) => isTabVisible(tab)).length;

    // Admin tabs are always counted for owners/admins
    if (isOwnerOrAdmin) {
      count += ADMIN_ONLY_TABS.length;
    }

    return count;
  }, [isTabVisible, isOwnerOrAdmin]);

  // Get the first visible tab as default
  const getDefaultTab = useCallback(() => {
    const publicTabs = ["feed", "about", "plans", "sessions", "team"];

    // Check public tabs first
    for (const tab of publicTabs) {
      if (isTabVisible(tab)) return tab;
    }

    // Then admin tabs if user is owner/admin (always available)
    if (isOwnerOrAdmin) {
      return ADMIN_ONLY_TABS[0];
    }

    return "feed"; // Fallback
  }, [isTabVisible, isOwnerOrAdmin]);

  // Show loading skeleton only during initial load
  if (loading) {
    return null; // SSR content is already visible
  }

  // If error or no venue after loading, don't show anything
  // SSR content is already rendered in the DOM for crawlers
  if (error || !venue) {
    return null; // Let SSR content be the only visible content
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Profile Header */}
      <VenueProfileHeader
        venue={venue}
        userId={userId}
        userRole={userRole}
        isOwnerOrAdmin={isOwnerOrAdmin}
        onRefresh={fetchVenue}
        slug={slug}
        locale={locale}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <Tabs defaultValue={getDefaultTab()} className="w-full">
          {/* Hide TabsList when only 1 tab is visible */}
          {visibleTabsCount > 1 && (
            <div className="overflow-x-auto">
              <TabsList className="w-full min-w-max md:min-w-0">
                {isTabVisible("feed") && (
                  <TabsTrigger
                    value="feed"
                    className="flex-1 gap-2 md:flex-initial"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("tabs.feed")}</span>
                  </TabsTrigger>
                )}
                {isTabVisible("about") && (
                  <TabsTrigger
                    value="about"
                    className="flex-1 gap-2 md:flex-initial"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("tabs.about")}</span>
                  </TabsTrigger>
                )}
                {isTabVisible("plans") && (
                  <TabsTrigger
                    value="plans"
                    className="flex-1 gap-2 md:flex-initial"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">{tPlans("title")}</span>
                  </TabsTrigger>
                )}
                {isTabVisible("sessions") && (
                  <TabsTrigger
                    value="sessions"
                    className="flex-1 gap-2 md:flex-initial"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t("tabs.sessions")}
                    </span>
                  </TabsTrigger>
                )}
                {isTabVisible("team") && (
                  <TabsTrigger
                    value="team"
                    className="flex-1 gap-2 md:flex-initial"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("tabs.team")}</span>
                  </TabsTrigger>
                )}
                {/* Admin tabs - ALWAYS visible for owners/admins */}
                {isOwnerOrAdmin && (
                  <TabsTrigger
                    value="clients"
                    className="flex-1 gap-2 md:flex-initial"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t("tabs.clients")}
                    </span>
                  </TabsTrigger>
                )}
                {isOwnerOrAdmin && (
                  <TabsTrigger
                    value="subscriptions"
                    className="flex-1 gap-2 md:flex-initial"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t("tabs.subscriptions")}
                    </span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
          )}

          {/* Feed Tab */}
          {isTabVisible("feed") && (
            <TabsContent value="feed">
              <VenueFeed
                venueId={venue.id}
                venueName={venue.name}
                userId={userId}
                userName={userName}
                userImage={userImage}
                isMember={isMember}
                isOwner={isOwnerOrAdmin}
              />
            </TabsContent>
          )}

          {/* About Tab */}
          {isTabVisible("about") && (
            <TabsContent value="about" className="space-y-6">
              <VenueAboutTab
                venue={venue}
                translatedDescription={translatedDescription}
                isOwnerOrAdmin={isOwnerOrAdmin}
              />
            </TabsContent>
          )}

          {/* Plans Tab */}
          {isTabVisible("plans") && (
            <TabsContent value="plans" className="space-y-6">
              <VenuePlansTab
                plans={venue.plans}
                crossVenueSubscriptions={venue.crossVenueSubscriptions}
                locale={locale}
                userId={userId}
                isOwnerOrAdmin={isOwnerOrAdmin}
                onSubscribeClick={handleSubscribeClick}
                onCreatePlan={() => {
                  setEditingPlan(null);
                  setPlanModalOpen(true);
                }}
                onEditPlan={(plan) => {
                  setEditingPlan(plan);
                  setPlanModalOpen(true);
                }}
                onTogglePlanActive={handleTogglePlanActiveClick}
              />
            </TabsContent>
          )}

          {/* Sessions Tab */}
          {isTabVisible("sessions") && (
            <TabsContent value="sessions" className="space-y-6">
              <VenueSessionsCalendar
                venueId={venue.id}
                locale={locale}
                userId={userId}
                hasActiveSubscription={
                  venue.plans.some(
                    (plan) =>
                      plan.subscriptions &&
                      plan.subscriptions.some((sub) => sub.status === "ACTIVE")
                  ) ||
                  (venue.crossVenueSubscriptions ?? []).some(
                    (sub) => sub.status === "ACTIVE"
                  )
                }
                isOwnerOrAdmin={isOwnerOrAdmin}
                canEditSessions={isCoachOrHigher}
                venueDefaults={{
                  defaultSessionCapacity: venue.defaultSessionCapacity,
                  defaultBookingAdvanceDays: venue.defaultBookingAdvanceDays,
                  defaultBookingDeadlineMinutes:
                    venue.defaultBookingDeadlineMinutes,
                  defaultCancellationDeadlineMinutes:
                    venue.defaultCancellationDeadlineMinutes,
                }}
              />
            </TabsContent>
          )}

          {/* Team Tab (Public - shows staff: owners, admins, coaches) */}
          {isTabVisible("team") && (
            <TabsContent value="team" className="space-y-4">
              <VenueTeamTab members={venue.members} />
            </TabsContent>
          )}

          {/* Clients Tab (Only for Owners/Admins - ALWAYS available) */}
          {isOwnerOrAdmin && (
            <TabsContent value="clients" className="space-y-4">
              <VenueClientsManager venueId={venue.id} locale={locale} />
            </TabsContent>
          )}

          {/* Subscriptions Tab (Only for Owners/Admins - ALWAYS available) */}
          {isOwnerOrAdmin && (
            <TabsContent value="subscriptions" className="space-y-4">
              <VenueSubscribersManager
                venueId={venue.id}
                locale={locale}
                plans={venue.plans}
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Ownership Claim - Discrete footer for venues without owner */}
        {!venue.members.some((m) => m.role === "OWNER") && (
          <div className="mt-12 border-t pt-6">
            <VenueOwnershipClaimButton
              venueId={venue.id}
              venueName={venue.name}
              hasOwner={false}
              userId={userId}
              locale={locale}
            />
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <VenueCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        venueId={venue.id}
        venueName={venue.name}
        paymentMode={venue.paymentMode}
        selectedPlan={selectedPlan}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodSelect={setSelectedPaymentMethod}
        onSuccess={handleCheckoutSuccess}
        onCancel={handleCheckoutCancel}
        onOnSiteRequest={handleOnSiteSubscriptionRequest}
      />

      {/* Plan Management Modal */}
      <VenuePlanModal
        open={planModalOpen}
        onOpenChange={setPlanModalOpen}
        venueId={venue?.id || ""}
        plan={editingPlan}
        onSuccess={() => {
          setPlanModalOpen(false);
          setEditingPlan(null);
          fetchVenue();
        }}
      />

      {/* Toggle Plan Active Status Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {venue?.plans.find((p) => p.id === deletePlanId)?.isActive
                ? tPlans("deactivateConfirmTitle")
                : tPlans("reactivateConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {venue?.plans.find((p) => p.id === deletePlanId)?.isActive
                ? tPlans("deactivateConfirmDescription")
                : tPlans("reactivateConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {tPlans("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTogglePlanActiveConfirm}
              disabled={isDeleting}
              className={
                venue?.plans.find((p) => p.id === deletePlanId)?.isActive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            >
              {isDeleting
                ? tPlans("processing")
                : venue?.plans.find((p) => p.id === deletePlanId)?.isActive
                  ? tPlans("deactivate")
                  : tPlans("reactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCommon("error")}</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              {tCommon("close")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

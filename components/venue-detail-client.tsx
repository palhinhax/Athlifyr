"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { StripeCheckout } from "@/components/stripe-checkout";
import { VenuePlanModal } from "@/components/venue-plan-modal";
import { VenueSubscribersManager } from "@/components/venue-subscribers-manager";
import { VenueSessionsCalendar } from "@/components/venue-sessions-calendar";
import { VenueClientsManager } from "@/components/venue-clients-manager";
import { CollapsibleDescription } from "@/components/collapsible-description";
import { VenueGallery } from "@/components/venue-gallery";
import {
  Trash2,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  Globe,
  Instagram,
  Home,
  Info,
  CreditCard,
  Users,
} from "lucide-react";
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
  address: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  defaultSessionCapacity: number | null;
  defaultBookingAdvanceDays: number;
  defaultCancellationDeadlineMinutes: number;
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
    subscriptions?: Array<{
      id: string;
      status: string;
      paymentStatus: string;
      startsAt: string;
      endsAt: string | null;
      createdAt: string;
    }>;
  }>;
  _count: {
    sessions: number;
    bookings: number;
    subscriptions: number;
  };
}

export function VenueDetailClient({
  slug,
  locale,
  userId,
  userName,
  userImage,
  userRole,
}: {
  slug: string;
  locale: string;
  userId?: string;
  userName?: string | null;
  userImage?: string | null;
  userRole?: string;
}) {
  const t = useTranslations("venues");
  const tRoles = useTranslations("venues.roles");
  const tInfo = useTranslations("venues.info");
  const tPlans = useTranslations("venues.plans");
  const tPolicy = useTranslations("venues.plan");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<
    string | null
  >(null);
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

      // Fetch translations for the venue description
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
          } else {
            setTranslatedDescription(null);
          }
        }
      } catch {
        // If translations fetch fails, use the default description
        setTranslatedDescription(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load venue");
    } finally {
      setLoading(false);
    }
  }, [slug, locale]);

  useEffect(() => {
    fetchVenue();
  }, [fetchVenue]);

  // Helper function to check if a tab is visible
  const isTabVisible = useCallback(
    (tabId: string) => {
      // Default tabs if not configured
      const defaultTabs = [
        "feed",
        "about",
        "plans",
        "sessions",
        "team",
        "clients",
        "subscriptions",
      ];
      const visibleTabs = venue?.visibleTabs ?? defaultTabs;
      return visibleTabs.includes(tabId);
    },
    [venue?.visibleTabs]
  );

  // Count visible tabs to hide TabsList when only 1 tab is visible
  const visibleTabsCount = useMemo(() => {
    const publicTabs = ["feed", "about", "plans", "sessions", "team"];
    const adminTabs = ["clients", "subscriptions"];

    let count = publicTabs.filter((tab) => isTabVisible(tab)).length;

    if (isOwnerOrAdmin) {
      count += adminTabs.filter((tab) => isTabVisible(tab)).length;
    }

    return count;
  }, [isTabVisible, isOwnerOrAdmin]);

  // Get the first visible tab as default
  const getDefaultTab = useCallback(() => {
    const publicTabs = ["feed", "about", "plans", "sessions", "team"];
    const adminTabs = ["clients", "subscriptions"];

    // Check public tabs first
    for (const tab of publicTabs) {
      if (isTabVisible(tab)) return tab;
    }

    // Then admin tabs if user is owner/admin
    if (isOwnerOrAdmin) {
      for (const tab of adminTabs) {
        if (isTabVisible(tab)) return tab;
      }
    }

    return "feed"; // Fallback
  }, [isTabVisible, isOwnerOrAdmin]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="mb-2 text-lg font-medium">{t("venueNotFound")}</p>
          <p className="text-sm text-muted-foreground">
            {t("venueNotFoundDesc")}
          </p>
        </div>
      </div>
    );
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
                {isOwnerOrAdmin && isTabVisible("clients") && (
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
                {isOwnerOrAdmin && isTabVisible("subscriptions") && (
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
                userId={userId}
                userName={userName}
                userImage={userImage}
                isMember={isMember}
              />
            </TabsContent>
          )}

          {/* About Tab */}
          {isTabVisible("about") && (
            <TabsContent value="about" className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-2xl font-semibold">
                  {tInfo("description")}
                </h2>
                {translatedDescription || venue.description ? (
                  <CollapsibleDescription
                    description={
                      translatedDescription || venue.description || ""
                    }
                  />
                ) : (
                  <p className="text-muted-foreground">{t("noDescription")}</p>
                )}
              </div>

              {/* Venue Photo Gallery */}
              <VenueGallery venueId={venue.id} isOwner={isOwnerOrAdmin} />

              {/* Contact Information */}
              {(venue.phone ||
                venue.email ||
                venue.website ||
                venue.instagram) && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-2xl font-semibold">
                    {tInfo("contactInformation")}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {venue.phone && (
                      <a
                        href={`tel:${venue.phone}`}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Phone className="h-4 w-4" />
                        {venue.phone}
                      </a>
                    )}
                    {venue.email && (
                      <a
                        href={`mailto:${venue.email}`}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                        {venue.email}
                      </a>
                    )}
                    {venue.website && (
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Globe className="h-4 w-4" />
                        {tInfo("website")}
                      </a>
                    )}
                    {venue.instagram && (
                      <a
                        href={`https://instagram.com/${venue.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Instagram className="h-4 w-4" />@
                        {venue.instagram.replace("@", "")}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Location Information */}
              {(venue.address || venue.city) && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-2xl font-semibold">
                    {tInfo("location")}
                  </h2>
                  <div className="space-y-2 text-muted-foreground">
                    {venue.address && <p>{venue.address}</p>}
                  </div>
                </div>
              )}

              {/* {!userId && (
                <div className="rounded-lg bg-muted p-6">
                  <p className="mb-4 text-sm">{t("signInToJoin")}</p>
                  <Button>{t("signIn")}</Button>
                </div>
              )} */}
            </TabsContent>
          )}

          {/* Plans Tab */}
          {isTabVisible("plans") && (
            <TabsContent value="plans" className="space-y-6">
              {isOwnerOrAdmin && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setEditingPlan(null);
                      setPlanModalOpen(true);
                    }}
                  >
                    {tPlans("createPlan")}
                  </Button>
                </div>
              )}

              {venue.plans.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <p className="text-muted-foreground">
                    {t("noPlansAvailable")}
                  </p>
                  {isOwnerOrAdmin && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tPlans("createFirstPlan")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {venue.plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`rounded-lg border bg-card p-6 ${
                        !plan.isActive ? "opacity-60" : ""
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-xl font-semibold">{plan.name}</h3>
                          {!plan.isActive && (
                            <span className="inline-flex w-fit rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              Inactive
                            </span>
                          )}
                        </div>
                        {isOwnerOrAdmin && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingPlan(plan);
                                setPlanModalOpen(true);
                              }}
                            >
                              {tPlans("edit")}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleTogglePlanActiveClick(plan.id)
                              }
                              className={
                                plan.isActive
                                  ? "text-destructive hover:text-destructive"
                                  : "text-green-600 hover:text-green-700"
                              }
                            >
                              {plan.isActive ? (
                                <Trash2 className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">Reactivate</span>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      {plan.description && (
                        <p className="mb-4 text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      )}

                      {/* Plan Policy Info */}
                      {plan.policy && (
                        <div className="mb-4 space-y-2 rounded-lg bg-muted/30 p-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {tPolicy(`durationType.${plan.policy.duration}`)}
                              {plan.policy.durationValue &&
                                plan.policy.durationValue > 1 && (
                                  <span> ({plan.policy.durationValue}x)</span>
                                )}
                            </span>
                          </div>
                          {plan.policy.duration !== "ONE_TIME" &&
                            (plan.policy.maxBookingsPerDay ||
                              plan.policy.maxBookingsPerWeek ||
                              plan.policy.maxBookingsPerMonth) && (
                              <div className="text-xs text-muted-foreground">
                                {plan.policy.maxBookingsPerDay && (
                                  <div>
                                    • Max {plan.policy.maxBookingsPerDay}{" "}
                                    {tPolicy("maxBookingsPerDay")
                                      .toLowerCase()
                                      .split(" ")
                                      .slice(1)
                                      .join(" ")}
                                  </div>
                                )}
                                {plan.policy.maxBookingsPerWeek && (
                                  <div>
                                    • Max {plan.policy.maxBookingsPerWeek}{" "}
                                    {tPolicy("maxBookingsPerWeek")
                                      .toLowerCase()
                                      .split(" ")
                                      .slice(1)
                                      .join(" ")}
                                  </div>
                                )}
                                {plan.policy.maxBookingsPerMonth && (
                                  <div>
                                    • Max {plan.policy.maxBookingsPerMonth}{" "}
                                    {tPolicy("maxBookingsPerMonth")
                                      .toLowerCase()
                                      .split(" ")
                                      .slice(1)
                                      .join(" ")}
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      )}

                      {plan.price && (
                        <p className="mb-4 text-2xl font-bold">
                          {plan.price} {plan.currency}
                          {plan.policy?.duration !== "ONE_TIME" && (
                            <span className="text-sm font-normal text-muted-foreground">
                              {" "}
                              / {tPlans("perMonth")}
                            </span>
                          )}
                        </p>
                      )}

                      {/* Check if user has active subscription */}
                      {plan.subscriptions && plan.subscriptions.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">
                              {tPlans("subscribed")}
                            </span>
                          </div>
                          {plan.subscriptions[0].endsAt && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {tPlans("validUntil")}:{" "}
                                {new Date(
                                  plan.subscriptions[0].endsAt
                                ).toLocaleDateString(locale, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handleSubscribeClick(plan)}
                          disabled={!userId || !plan.price}
                        >
                          {tPlans("subscribe")}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* Sessions Tab */}
          {isTabVisible("sessions") && (
            <TabsContent value="sessions" className="space-y-6">
              <VenueSessionsCalendar
                venueId={venue.id}
                locale={locale}
                userId={userId}
                hasActiveSubscription={venue.plans.some(
                  (plan) =>
                    plan.subscriptions &&
                    plan.subscriptions.some((sub) => sub.status === "ACTIVE")
                )}
                isOwnerOrAdmin={isOwnerOrAdmin}
                venueDefaults={{
                  defaultSessionCapacity: venue.defaultSessionCapacity,
                  defaultBookingAdvanceDays: venue.defaultBookingAdvanceDays,
                  defaultCancellationDeadlineMinutes:
                    venue.defaultCancellationDeadlineMinutes,
                }}
              />
            </TabsContent>
          )}

          {/* Team Tab (Public - shows staff: owners, admins, coaches) */}
          {isTabVisible("team") && (
            <TabsContent value="team" className="space-y-4">
              {venue.members.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <p className="text-muted-foreground">{t("noTeamMembers")}</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {venue.members.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        {member.user.image ? (
                          <Image
                            src={member.user.image}
                            alt={member.user.name || "User"}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            {member.user.name?.[0] || "?"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tRoles(member.role)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* Clients Tab (Only for Owners/Admins - shows clients) */}
          {isOwnerOrAdmin && isTabVisible("clients") && (
            <TabsContent value="clients" className="space-y-4">
              <VenueClientsManager venueId={venue.id} locale={locale} />
            </TabsContent>
          )}

          {/* Subscriptions Tab (Only for Owners/Admins) */}
          {isOwnerOrAdmin && isTabVisible("subscriptions") && (
            <TabsContent value="subscriptions" className="space-y-4">
              <VenueSubscribersManager
                venueId={venue.id}
                locale={locale}
                plans={venue.plans}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{tPlans("subscribe")}</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  {tPlans("subscribeTo")} {selectedPlan.name} -{" "}
                  {selectedPlan.price} {selectedPlan.currency} /{" "}
                  {tPlans("perMonth")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && venue && (
            <>
              {/* EXTERNAL: On-site payment only */}
              {venue.paymentMode === "EXTERNAL" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-muted bg-muted/50 p-6">
                    <h3 className="mb-3 text-lg font-semibold">
                      {t("payment.onSiteTitle")}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t("payment.onSiteInstructions")}
                    </p>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">
                        {t("payment.onSiteSteps")}
                      </p>
                      <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                        <li>{t("payment.onSiteStep1")}</li>
                        <li>{t("payment.onSiteStep2")}</li>
                        <li>{t("payment.onSiteStep3")}</li>
                      </ol>
                      <p className="mt-4 text-xs text-muted-foreground">
                        {t("payment.onSiteNote")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCheckoutCancel}>
                      {t("payment.goBack")}
                    </Button>
                    <Button onClick={handleCheckoutCancel}>
                      {t("payment.confirmOnSite")}
                    </Button>
                  </div>
                </div>
              )}

              {/* IN_APP: Stripe checkout only */}
              {venue.paymentMode === "IN_APP" && (
                <StripeCheckout
                  venueId={venue.id}
                  venueName={venue.name}
                  planId={selectedPlan.id}
                  planName={selectedPlan.name}
                  price={selectedPlan.price}
                  currency={selectedPlan.currency}
                  onSuccess={handleCheckoutSuccess}
                  onCancel={handleCheckoutCancel}
                />
              )}

              {/* MIXED: Choice between in-app and on-site */}
              {venue.paymentMode === "MIXED" && (
                <div className="space-y-4">
                  {!selectedPaymentMethod ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {t("payment.chooseMethod")}
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* In-App Payment Option */}
                        <button
                          onClick={() => {
                            setSelectedPaymentMethod("IN_APP");
                          }}
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-6 transition-colors hover:border-primary hover:bg-muted/50"
                        >
                          <svg
                            className="mb-3 h-12 w-12 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <h3 className="mb-2 font-semibold">
                            {t("payment.inApp")}
                          </h3>
                          <p className="text-center text-xs text-muted-foreground">
                            {t("payment.inAppDescription")}
                          </p>
                        </button>

                        {/* On-Site Payment Option */}
                        <button
                          onClick={() => {
                            setSelectedPaymentMethod("EXTERNAL");
                          }}
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-6 transition-colors hover:border-primary hover:bg-muted/50"
                        >
                          <svg
                            className="mb-3 h-12 w-12 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <h3 className="mb-2 font-semibold">
                            {t("payment.external")}
                          </h3>
                          <p className="text-center text-xs text-muted-foreground">
                            {t("payment.externalDescription")}
                          </p>
                        </button>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={handleCheckoutCancel}
                        >
                          {t("payment.cancel")}
                        </Button>
                      </div>
                    </>
                  ) : selectedPaymentMethod === "IN_APP" ? (
                    <StripeCheckout
                      venueId={venue.id}
                      venueName={venue.name}
                      planId={selectedPlan.id}
                      planName={selectedPlan.name}
                      price={selectedPlan.price}
                      currency={selectedPlan.currency}
                      onSuccess={handleCheckoutSuccess}
                      onCancel={() => {
                        setSelectedPaymentMethod(null);
                        handleCheckoutCancel();
                      }}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-muted bg-muted/50 p-6">
                        <h3 className="mb-3 text-lg font-semibold">
                          {t("payment.onSiteTitle")}
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          {t("payment.onSiteInstructions")}
                        </p>
                        <div className="space-y-3">
                          <p className="text-sm font-medium">
                            {t("payment.onSiteSteps")}
                          </p>
                          <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                            <li>{t("payment.onSiteStep1")}</li>
                            <li>{t("payment.onSiteStep2")}</li>
                            <li>{t("payment.onSiteStep3")}</li>
                          </ol>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPaymentMethod(null)}
                        >
                          {t("payment.back")}
                        </Button>
                        <Button onClick={handleCheckoutSuccess}>
                          {t("payment.confirmBooking")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

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

"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  CheckCircle,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { VenuePlanPolicy, PlanDuration } from "@/types/venue-plan";

const BILLING_PERIOD_KEYS: Record<string, string> = {
  DAILY: "perDay",
  WEEKLY: "perWeek",
  MONTHLY: "perMonth",
  QUARTERLY: "perQuarter",
  YEARLY: "perYear",
};

interface PlanSubscription {
  id: string;
  status: string;
  paymentStatus: string;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  totalBookingsUsed?: number;
  stripeSubscriptionId?: string | null;
}

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
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
  subscriptions?: PlanSubscription[];
}

interface CrossVenueSubscription {
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
}

interface VenuePlansTabProps {
  plans: Plan[];
  crossVenueSubscriptions?: CrossVenueSubscription[];
  venueId: string;
  locale: string;
  userId?: string;
  isOwnerOrAdmin: boolean;
  onSubscribeClick: (plan: {
    id: string;
    name: string;
    price: number | null;
    currency: string;
    duration?: PlanDuration;
  }) => void;
  onCancelSubscription: (subscriptionId: string) => void;
  onCreatePlan: () => void;
  onEditPlan: (plan: Plan) => void;
  onTogglePlanActive: (planId: string) => void;
}

export function VenuePlansTab({
  plans,
  crossVenueSubscriptions,
  venueId,
  locale,
  userId,
  isOwnerOrAdmin,
  onSubscribeClick,
  onCancelSubscription,
  onCreatePlan,
  onEditPlan,
  onTogglePlanActive,
}: VenuePlansTabProps) {
  const t = useTranslations("venues");
  const tPlans = useTranslations("venues.plans");
  const tPolicy = useTranslations("venues.plan");

  return (
    <div className="space-y-6">
      {isOwnerOrAdmin && (
        <div className="flex justify-end">
          <Button onClick={onCreatePlan}>{tPlans("createPlan")}</Button>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noPlansAvailable")}</p>
          {isOwnerOrAdmin && (
            <p className="mt-2 text-sm text-muted-foreground">
              {tPlans("createFirstPlan")}
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
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
                      onClick={() => onEditPlan(plan)}
                    >
                      {tPlans("edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTogglePlanActive(plan.id)}
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
                  {plan.policy.maxTotalBookings && (
                    <div className="text-xs font-medium text-p-info">
                      • {plan.policy.maxTotalBookings}{" "}
                      {plan.policy.maxTotalBookings === 1
                        ? tPolicy("sessionSingular")
                        : tPolicy("sessionsPlural")}
                    </div>
                  )}
                  {(plan.policy.maxBookingsPerDay ||
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
                  {plan.policy?.duration &&
                    plan.policy.duration !== "ONE_TIME" && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        /{" "}
                        {tPlans(
                          BILLING_PERIOD_KEYS[plan.policy.duration] ??
                            "perMonth"
                        )}
                      </span>
                    )}
                </p>
              )}

              {/* Subscription Status */}
              <PlanSubscriptionStatus
                plan={plan}
                venueId={venueId}
                locale={locale}
                userId={userId}
                onSubscribeClick={onSubscribeClick}
                onCancelSubscription={onCancelSubscription}
                tPlans={tPlans}
              />
            </div>
          ))}
        </div>
      )}

      {/* Cross-venue subscriptions */}
      {crossVenueSubscriptions && crossVenueSubscriptions.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {tPlans("crossVenueTitle")}
          </h3>
          {crossVenueSubscriptions.map((sub) => {
            const cvPolicy = sub.plan.policy as VenuePlanPolicy | null;
            const cvMaxTotal = cvPolicy?.maxTotalBookings;
            const cvUsed = sub.totalBookingsUsed ?? 0;
            const cvIsExhausted =
              cvMaxTotal && cvMaxTotal > 0 && cvUsed >= cvMaxTotal;

            return (
              <div key={sub.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{sub.plan.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {tPlans("fromVenue", { venue: sub.plan.venue.name })}
                    </span>
                  </div>
                  {cvIsExhausted ? (
                    <div className="flex items-center gap-1 text-p-golden">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        {tPlans("packExhausted")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        {tPlans("subscribed")}
                      </span>
                    </div>
                  )}
                </div>
                {cvMaxTotal && cvMaxTotal > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {tPlans("sessionsUsed", {
                      used: String(cvUsed),
                      total: String(cvMaxTotal),
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Extracted subscription status display logic for a single plan card
function PlanSubscriptionStatus({
  plan,
  locale,
  userId,
  onSubscribeClick,
  onCancelSubscription,
  tPlans,
}: {
  plan: Plan;
  venueId: string;
  locale: string;
  userId?: string;
  onSubscribeClick: (plan: {
    id: string;
    name: string;
    price: number | null;
    currency: string;
    duration?: PlanDuration;
  }) => void;
  onCancelSubscription: (subscriptionId: string) => void;
  tPlans: ReturnType<typeof useTranslations>;
}) {
  if (!plan.subscriptions || plan.subscriptions.length === 0) {
    return (
      <Button
        className="w-full"
        onClick={() =>
          onSubscribeClick({ ...plan, duration: plan.policy?.duration })
        }
        disabled={!userId || !plan.price}
      >
        {tPlans("subscribe")}
      </Button>
    );
  }

  const now = new Date();
  const activeSubscriptions = plan.subscriptions.filter(
    (sub: { startsAt: string; endsAt: string | null }) => {
      const startsAt = new Date(sub.startsAt);
      const endsAt = sub.endsAt ? new Date(sub.endsAt) : null;
      return startsAt <= now && (!endsAt || endsAt >= now);
    }
  );

  const policy = plan.policy;
  const maxTotal = policy?.maxTotalBookings;

  const activeSubscription =
    maxTotal && maxTotal > 0
      ? (activeSubscriptions.find(
          (sub: { totalBookingsUsed?: number }) =>
            (sub.totalBookingsUsed ?? 0) < maxTotal
        ) ?? activeSubscriptions[0])
      : activeSubscriptions[0];

  const scheduledSubscription = plan.subscriptions.find(
    (sub: { startsAt: string }) => {
      const startsAt = new Date(sub.startsAt);
      return startsAt > now;
    }
  );

  if (activeSubscription) {
    const used =
      (activeSubscription as { totalBookingsUsed?: number })
        .totalBookingsUsed ?? 0;
    const isExhausted = maxTotal && maxTotal > 0 && used >= maxTotal;

    if (isExhausted) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            <div className="flex flex-col">
              <span className="font-medium">{tPlans("packExhausted")}</span>
              <span className="text-xs">
                {tPlans("sessionsUsed", {
                  used: String(used),
                  total: String(maxTotal),
                })}
              </span>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() =>
              onSubscribeClick({ ...plan, duration: plan.policy?.duration })
            }
            disabled={!userId || !plan.price}
          >
            {tPlans("resubscribe")}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {activeSubscription.status === "CANCELLING" ? (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{tPlans("subscriptionEnding")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{tPlans("subscribed")}</span>
          </div>
        )}
        {maxTotal && maxTotal > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {tPlans("sessionsUsed", {
                used: String(used),
                total: String(maxTotal),
              })}
            </span>
          </div>
        )}
        {activeSubscription.endsAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {tPlans("validUntil")}:{" "}
              {new Date(activeSubscription.endsAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
        {activeSubscription.stripeSubscriptionId &&
          activeSubscription.status !== "CANCELLING" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => onCancelSubscription(activeSubscription.id)}
            >
              {tPlans("cancelSubscription")}
            </Button>
          )}
      </div>
    );
  }

  if (scheduledSubscription) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="h-5 w-5" />
          <span className="font-medium">{tPlans("scheduled")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {tPlans("startsOn")}:{" "}
            {new Date(scheduledSubscription.startsAt).toLocaleDateString(
              locale,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </span>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <Button
      className="w-full"
      onClick={() =>
        onSubscribeClick({ ...plan, duration: plan.policy?.duration })
      }
      disabled={!userId || !plan.price}
    >
      {tPlans("subscribe")}
    </Button>
  );
}

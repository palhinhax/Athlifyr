"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  status: string;
  paymentStatus: string;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  paymentConfirmedAt: string | null;
  venue: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  plan: {
    id: string;
    name: string;
    price: number | null;
    currency: string;
  };
}

export function SubscriptionsHistory() {
  const t = useTranslations("settings.subscriptions");
  const tStatus = useTranslations("venues.status");

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/me/subscriptions");
        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.subscriptions || []);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            {tStatus("ACTIVE")}
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            <Clock className="mr-1 h-3 w-3" />
            {tStatus("EXPIRED")}
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            {tStatus("CANCELLED")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            {tStatus("PENDING")}
          </Badge>
        );
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "PAID":
        return (
          <Badge
            variant="outline"
            className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
          >
            <CreditCard className="mr-1 h-3 w-3" />
            {t("paid")}
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            {t("pending")}
          </Badge>
        );
      case "OVERDUE":
        return (
          <Badge
            variant="outline"
            className="border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
          >
            <XCircle className="mr-1 h-3 w-3" />
            {t("overdue")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>;
    }
  };

  const isActive = (subscription: Subscription) => {
    if (subscription.status !== "ACTIVE") return false;
    if (!subscription.endsAt) return true;
    return new Date(subscription.endsAt) > new Date();
  };

  const activeSubscriptions = subscriptions.filter(isActive);
  const pastSubscriptions = subscriptions.filter((s) => !isActive(s));

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">{t("noSubscriptions")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("noSubscriptionsDescription")}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">{t("active")}</h3>
          <div className="space-y-4">
            {activeSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {subscription.venue.logo && (
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                          src={subscription.venue.logo}
                          alt={subscription.venue.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">
                          {subscription.venue.name}
                        </h4>
                        {getStatusBadge(subscription.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {subscription.plan.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {t("startDate")}:{" "}
                            {new Date(
                              subscription.startsAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {subscription.endsAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {t("endDate")}:{" "}
                              {new Date(
                                subscription.endsAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {subscription.plan.price && (
                      <span className="text-lg font-bold">
                        {subscription.plan.price} {subscription.plan.currency}
                      </span>
                    )}
                    {getPaymentBadge(subscription.paymentStatus)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Subscriptions */}
      {pastSubscriptions.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">{t("history")}</h3>
          <div className="space-y-4">
            {pastSubscriptions.map((subscription) => (
              <Card
                key={subscription.id}
                className="p-4 opacity-75 hover:opacity-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {subscription.venue.logo && (
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                          src={subscription.venue.logo}
                          alt={subscription.venue.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">
                          {subscription.venue.name}
                        </h4>
                        {getStatusBadge(subscription.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {subscription.plan.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {t("startDate")}:{" "}
                            {new Date(
                              subscription.startsAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {subscription.endsAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {t("endDate")}:{" "}
                              {new Date(
                                subscription.endsAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {subscription.paymentConfirmedAt && (
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            <span>
                              {t("paidOn")}:{" "}
                              {new Date(
                                subscription.paymentConfirmedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {subscription.plan.price && (
                      <span className="text-lg font-bold">
                        {subscription.plan.price} {subscription.plan.currency}
                      </span>
                    )}
                    {getPaymentBadge(subscription.paymentStatus)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

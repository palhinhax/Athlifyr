"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Plus,
  MoreHorizontal,
  Edit,
  RefreshCw,
  Ban,
} from "lucide-react";
import { format } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";
import { VenueSubscriptionModal } from "./venue-subscription-modal";
import { useToast } from "@/components/ui/use-toast";

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "ACTIVE" | "PENDING" | "CANCELLED" | "EXPIRED";
  paymentStatus: "PAID" | "PENDING_PAYMENT" | "NOT_REQUIRED" | "FAILED";
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  plan: {
    id: string;
    name: string;
    price: number | null;
    currency: string;
  };
}

const localeMap = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface Plan {
  id: string;
  name: string;
  price: number | null;
  currency: string;
}

export function VenueSubscribersManager({
  venueId,
  locale,
  plans,
}: {
  venueId: string;
  locale: string;
  plans: Plan[];
}) {
  const t = useTranslations("venues.subscribers");
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [subscriptionToRenew, setSubscriptionToRenew] =
    useState<Subscription | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] =
    useState<Subscription | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [subscriptionToApprove, setSubscriptionToApprove] =
    useState<Subscription | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/venues/${venueId}/subscriptions`);

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      setFilteredSubscriptions(data.subscriptions || []);
    } catch {
      console.error("Error fetching subscriptions");
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubscriptions(subscriptions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = subscriptions.filter(
        (sub) =>
          sub.user.name.toLowerCase().includes(query) ||
          sub.user.email.toLowerCase().includes(query) ||
          sub.plan.name.toLowerCase().includes(query)
      );
      setFilteredSubscriptions(filtered);
    }
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [searchQuery, subscriptions]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscriptions = filteredSubscriptions.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("status.active")}
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-white">
            <Calendar className="mr-1 h-3 w-3" />
            {t("status.pending")}
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary">
            <XCircle className="mr-1 h-3 w-3" />
            {t("status.cancelled")}
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="outline">
            <XCircle className="mr-1 h-3 w-3" />
            {t("status.expired")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge variant="default" className="bg-blue-500">
            <CreditCard className="mr-1 h-3 w-3" />
            {t("paymentStatus.paid")}
          </Badge>
        );
      case "PENDING_PAYMENT":
        return (
          <Badge variant="secondary">
            <CreditCard className="mr-1 h-3 w-3" />
            {t("paymentStatus.pending")}
          </Badge>
        );
      case "NOT_REQUIRED":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("paymentStatus.notRequired")}
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            {t("paymentStatus.failed")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PP", { locale: dateLocale });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return t("free");
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const handleAddSubscriber = () => {
    setSelectedSubscription(null);
    setModalOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setModalOpen(true);
  };

  const handleCancelSubscription = async (subscription: Subscription) => {
    setSubscriptionToCancel(subscription);
    setCancelDialogOpen(true);
  };

  const confirmCancelSubscription = async () => {
    if (!subscriptionToCancel) return;

    try {
      const response = await fetch(
        `/api/venues/${venueId}/subscriptions/${subscriptionToCancel.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELLED" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast({
        title: t("cancelled"),
        description: t("cancelledDescription"),
      });

      fetchSubscriptions();
      setCancelDialogOpen(false);
      setSubscriptionToCancel(null);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: tCommon("error"),
        description: t("cancelErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleRenewSubscription = async (subscription: Subscription) => {
    setSubscriptionToRenew(subscription);
    setRenewDialogOpen(true);
  };

  const confirmRenewSubscription = async () => {
    if (!subscriptionToRenew) return;

    try {
      const response = await fetch(
        `/api/venues/${venueId}/subscriptions/${subscriptionToRenew.id}/renew`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to renew subscription");
      }

      toast({
        title: t("renewed"),
        description: t("renewedDescription"),
      });

      fetchSubscriptions();
      setRenewDialogOpen(false);
      setSubscriptionToRenew(null);
    } catch (error) {
      console.error("Error renewing subscription:", error);
      toast({
        title: tCommon("error"),
        description: t("renewErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleApproveSubscription = (subscription: Subscription) => {
    setSubscriptionToApprove(subscription);
    setApproveDialogOpen(true);
  };

  const confirmApproveSubscription = async () => {
    if (!subscriptionToApprove) return;

    try {
      const response = await fetch(
        `/api/venues/${venueId}/subscriptions/${subscriptionToApprove.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACTIVE" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve subscription");
      }

      toast({
        title: t("approved"),
        description: t("approvedDescription"),
      });

      fetchSubscriptions();
      setApproveDialogOpen(false);
      setSubscriptionToApprove(null);
    } catch (error) {
      console.error("Error approving subscription:", error);
      toast({
        title: tCommon("error"),
        description: t("approveErrorDescription"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">{tCommon("loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {t("totalSubscribers", { count: filteredSubscriptions.length })}
          </div>
          <Button onClick={handleAddSubscriber}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addSubscriber")}
          </Button>
        </div>
      </div>

      {/* Subscriptions Table */}
      {filteredSubscriptions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? t("noResults") : t("noSubscriptions")}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="space-y-4 md:hidden">
            {paginatedSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                {/* User Info */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                      {subscription.user.image ? (
                        <Image
                          src={subscription.user.image}
                          alt={subscription.user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-medium">
                          {subscription.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {subscription.user.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.user.email}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditSubscription(subscription)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t("editSubscription")}
                      </DropdownMenuItem>
                      {subscription.status === "PENDING" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleApproveSubscription(subscription)
                          }
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t("approveSubscription")}
                        </DropdownMenuItem>
                      )}
                      {subscription.status === "ACTIVE" && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRenewSubscription(subscription)
                            }
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {t("renewSubscription")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleCancelSubscription(subscription)
                            }
                            className="text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {t("cancelSubscription")}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Plan and Status */}
                <div className="mb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("plan")}:
                    </span>
                    <span className="font-medium">
                      {subscription.plan.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("table.status")}:
                    </span>
                    {getStatusBadge(subscription.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("table.payment")}:
                    </span>
                    {getPaymentStatusBadge(subscription.paymentStatus)}
                  </div>
                </div>

                {/* Dates and Price */}
                <div className="space-y-2 border-t pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {t("table.startDate")}:
                    </div>
                    <span>{formatDate(subscription.startsAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {t("table.endDate")}:
                    </div>
                    <span>
                      {subscription.endsAt
                        ? formatDate(subscription.endsAt)
                        : t("noEndDate")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("table.price")}:
                    </span>
                    <span className="font-semibold">
                      {formatPrice(
                        subscription.plan.price,
                        subscription.plan.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 px-4 py-4 md:hidden">
              <div className="text-sm text-muted-foreground">
                {t("pagination.showing", {
                  from: startIndex + 1,
                  to: Math.min(endIndex, filteredSubscriptions.length),
                  total: filteredSubscriptions.length,
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {t("pagination.previous")}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;

                      if (!showPage) {
                        // Show ellipsis for gaps
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-[2rem]"
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}

          {/* Desktop Table View */}
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.subscriber")}</TableHead>
                  <TableHead>{t("table.plan")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.payment")}</TableHead>
                  <TableHead>{t("table.startDate")}</TableHead>
                  <TableHead>{t("table.endDate")}</TableHead>
                  <TableHead>{t("table.price")}</TableHead>
                  <TableHead className="w-[80px]">
                    {t("table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                          {subscription.user.image ? (
                            <Image
                              src={subscription.user.image}
                              alt={subscription.user.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-medium">
                              {subscription.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {subscription.user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscription.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {subscription.plan.name}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(subscription.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(subscription.startsAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {subscription.endsAt ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(subscription.endsAt)}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {t("noEndDate")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatPrice(
                          subscription.plan.price,
                          subscription.plan.currency
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditSubscription(subscription)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("editSubscription")}
                          </DropdownMenuItem>
                          {subscription.status === "PENDING" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleApproveSubscription(subscription)
                              }
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t("approveSubscription")}
                            </DropdownMenuItem>
                          )}
                          {subscription.status === "ACTIVE" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRenewSubscription(subscription)
                                }
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                {t("renewSubscription")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleCancelSubscription(subscription)
                                }
                                className="text-destructive"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                {t("cancelSubscription")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Desktop Pagination Controls */}
          {totalPages > 1 && (
            <div className="hidden items-center justify-between px-4 py-4 md:flex">
              <div className="text-sm text-muted-foreground">
                {t("pagination.showing", {
                  from: startIndex + 1,
                  to: Math.min(endIndex, filteredSubscriptions.length),
                  total: filteredSubscriptions.length,
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {t("pagination.previous")}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;

                      if (!showPage) {
                        // Show ellipsis for gaps
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-[2rem]"
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Subscription Modal */}
      <VenueSubscriptionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        venueId={venueId}
        plans={plans}
        subscription={selectedSubscription}
        onSuccess={fetchSubscriptions}
      />

      {/* Renew Confirmation Dialog */}
      <AlertDialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("renewSubscription")}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">{t("renewConfirmation")}</p>
                {subscriptionToRenew && (
                  <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                    <div>
                      <span className="font-medium">{t("user")}:</span>{" "}
                      {subscriptionToRenew.user.name}
                    </div>
                    <div>
                      <span className="font-medium">{t("plan")}:</span>{" "}
                      {subscriptionToRenew.plan.name}
                    </div>
                    {subscriptionToRenew.endsAt && (
                      <div>
                        <span className="font-medium">
                          {t("table.endDate")}:
                        </span>{" "}
                        {format(new Date(subscriptionToRenew.endsAt), "PPP", {
                          locale: dateLocale,
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRenewSubscription}>
              {t("renewSubscription")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cancelSubscription")}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">{t("cancelConfirmation")}</p>
                {subscriptionToCancel && (
                  <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                    <div>
                      <span className="font-medium">{t("user")}:</span>{" "}
                      {subscriptionToCancel.user.name}
                    </div>
                    <div>
                      <span className="font-medium">{t("plan")}:</span>{" "}
                      {subscriptionToCancel.plan.name}
                    </div>
                    {subscriptionToCancel.endsAt && (
                      <div>
                        <span className="font-medium">
                          {t("table.endDate")}:
                        </span>{" "}
                        {format(new Date(subscriptionToCancel.endsAt), "PPP", {
                          locale: dateLocale,
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelSubscription}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("cancelSubscription")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("approveSubscription")}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">{t("approveConfirmation")}</p>
                {subscriptionToApprove && (
                  <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                    <div>
                      <span className="font-medium">{t("user")}:</span>{" "}
                      {subscriptionToApprove.user.name}
                    </div>
                    <div>
                      <span className="font-medium">{t("plan")}:</span>{" "}
                      {subscriptionToApprove.plan.name}
                    </div>
                    <div>
                      <span className="font-medium">{t("table.price")}:</span>{" "}
                      {formatPrice(
                        subscriptionToApprove.plan.price,
                        subscriptionToApprove.plan.currency
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApproveSubscription}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {t("approveSubscription")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

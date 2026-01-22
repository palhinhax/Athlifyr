"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { addDays, addMonths, addYears } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Plan {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  policy?: unknown; // JSON field with duration info
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: string;
  paymentStatus: string;
  startsAt: string;
  endsAt: string | null;
}

interface VenueSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  plans: Plan[];
  subscription?: Subscription | null;
  onSuccess: () => void;
}

export function VenueSubscriptionModal({
  open,
  onOpenChange,
  venueId,
  plans,
  subscription,
  onSuccess,
}: VenueSubscriptionModalProps) {
  const t = useTranslations("venues.subscribers");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "PAID" | "PENDING_PAYMENT" | "NOT_REQUIRED"
  >("PAID");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser(null);
      setSelectedPlanId("");
      setStartsAt("");
      setEndsAt("");
      setPaymentStatus("PAID");
    } else if (subscription) {
      // If editing existing subscription
      setSelectedPlanId(subscription.planId);
      setStartsAt(subscription.startsAt.split("T")[0]);
      setEndsAt(subscription.endsAt ? subscription.endsAt.split("T")[0] : "");
      setPaymentStatus(
        subscription.paymentStatus === "PAID"
          ? "PAID"
          : subscription.paymentStatus === "NOT_REQUIRED"
            ? "NOT_REQUIRED"
            : "PENDING_PAYMENT"
      );
    } else {
      // New subscription - set default start date to today
      const today = new Date().toISOString().split("T")[0];
      setStartsAt(today);
    }
  }, [open, subscription]);

  // Auto-calculate end date when plan or start date changes
  useEffect(() => {
    if (!selectedPlanId || !startsAt || subscription) return; // Skip for editing

    const selectedPlan = plans.find((p) => p.id === selectedPlanId);
    if (!selectedPlan) return;

    try {
      const startDate = new Date(startsAt);
      const policy = selectedPlan.policy as {
        duration?: { value: number; unit: string };
      };

      if (policy?.duration) {
        const { value, unit } = policy.duration;
        let endDate: Date;

        switch (unit) {
          case "days":
            endDate = addDays(startDate, value);
            break;
          case "months":
            endDate = addMonths(startDate, value);
            break;
          case "years":
            endDate = addYears(startDate, value);
            break;
          default:
            // Default to 1 month
            endDate = addMonths(startDate, 1);
        }

        setEndsAt(endDate.toISOString().split("T")[0]);
      } else {
        // No duration specified, default to 1 month
        const endDate = addMonths(startDate, 1);
        setEndsAt(endDate.toISOString().split("T")[0]);
      }
    } catch (error) {
      console.error("Error calculating end date:", error);
    }
  }, [selectedPlanId, startsAt, subscription, plans]);

  // Search users
  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}&includeSelf=true`
      );

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      // API returns array directly, not { users: [] }
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: t("searchError"),
        description: t("searchErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && !subscription) {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subscription && !selectedUser) {
      toast({
        title: t("selectUser"),
        description: t("selectUserDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!selectedPlanId) {
      toast({
        title: t("selectPlan"),
        description: t("selectPlanDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!startsAt) {
      toast({
        title: t("selectStartDate"),
        description: t("selectStartDateDescription"),
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId: subscription ? subscription.userId : selectedUser!.id,
        planId: selectedPlanId,
        startsAt,
        endsAt: endsAt || null,
        paymentStatus,
        status: "ACTIVE",
        manual: !subscription, // true for new subscriptions, false for edits
      };

      const url = subscription
        ? `/api/venues/${venueId}/subscriptions/${subscription.id}`
        : `/api/venues/${venueId}/subscriptions`;

      const method = subscription ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save subscription");
      }

      toast({
        title: subscription ? t("updated") : t("created"),
        description: subscription
          ? t("updatedDescription")
          : t("createdDescription"),
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : t("saveErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {subscription ? t("editSubscription") : t("addSubscription")}
          </DialogTitle>
          <DialogDescription>
            {subscription
              ? t("editSubscriptionDescription")
              : t("addSubscriptionDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Selection (only for new subscriptions) */}
          {!subscription && (
            <div className="space-y-2">
              <Label htmlFor="user">{t("user")}</Label>
              {selectedUser ? (
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                  >
                    {tCommon("change")}
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    id="user"
                    placeholder={t("searchUserPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchLoading && (
                    <p className="text-sm text-muted-foreground">
                      {tCommon("searching")}...
                    </p>
                  )}
                  {searchResults.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-md border">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          className="w-full p-3 text-left hover:bg-muted"
                          onClick={() => {
                            setSelectedUser(user);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                        >
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Plan Selection */}
          <div className="space-y-2">
            <Label htmlFor="plan">{t("plan")}</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger id="plan">
                <SelectValue placeholder={t("selectPlan")} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} -{" "}
                    {plan.price ? `${plan.price} ${plan.currency}` : t("free")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startsAt">{t("startDate")}</Label>
            <Input
              id="startsAt"
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endsAt">{t("endDate")}</Label>
            <Input
              id="endsAt"
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("endDateHint")}</p>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label htmlFor="paymentStatus">{t("paymentStatus.label")}</Label>
            <Select
              value={paymentStatus}
              onValueChange={(value) =>
                setPaymentStatus(
                  value as "PAID" | "PENDING_PAYMENT" | "NOT_REQUIRED"
                )
              }
            >
              <SelectTrigger id="paymentStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAID">{t("paymentStatus.paid")}</SelectItem>
                <SelectItem value="PENDING_PAYMENT">
                  {t("paymentStatus.pending")}
                </SelectItem>
                <SelectItem value="NOT_REQUIRED">
                  {t("paymentStatus.notRequired")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {subscription ? tCommon("save") : tCommon("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

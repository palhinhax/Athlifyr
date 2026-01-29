"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Clock, CheckCircle, XCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface VenueOwnershipClaimButtonProps {
  venueId: string;
  venueName: string;
  hasOwner: boolean;
  userId?: string;
  locale: string;
}

type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED" | null;

export function VenueOwnershipClaimButton({
  venueId,
  venueName,
  hasOwner,
  userId,
  locale,
}: VenueOwnershipClaimButtonProps) {
  const t = useTranslations("venues.ownershipClaim");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingClaim, setCheckingClaim] = useState(true);
  const [existingClaimStatus, setExistingClaimStatus] =
    useState<ClaimStatus>(null);

  // Check if user already has a claim
  useEffect(() => {
    const checkExistingClaim = async () => {
      if (!userId) {
        setCheckingClaim(false);
        return;
      }

      try {
        const response = await fetch(`/api/venues/${venueId}/ownership-claim`);
        if (response.ok) {
          const data = await response.json();
          if (data.claim) {
            setExistingClaimStatus(data.claim.status);
          }
        }
      } catch (error) {
        console.error("Error checking claim status:", error);
      } finally {
        setCheckingClaim(false);
      }
    };

    checkExistingClaim();
  }, [venueId, userId]);

  // Don't render if venue has an owner
  if (hasOwner) {
    return null;
  }

  // Show loading state
  if (checkingClaim) {
    return null;
  }

  // User not logged in
  if (!userId) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50 p-4">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("claimOwnership")}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("loginRequired")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => router.push(`/${locale}/auth/signin`)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t("loginButton")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Already has pending claim
  if (existingClaimStatus === "PENDING") {
    return (
      <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
              {t("claimPending")}
            </p>
            <p className="mt-1 text-xs text-yellow-600/80 dark:text-yellow-500/80">
              {t("claimPendingDescription")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Already approved (shouldn't reach here but just in case)
  if (existingClaimStatus === "APPROVED") {
    return (
      <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-500">
              {t("claimApproved")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/ownership-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() || undefined }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit claim");
      }

      toast({
        title: t("claimSuccess"),
        description: t("claimSuccessDescription"),
      });

      setExistingClaimStatus("PENDING");
      setOpen(false);
      setMessage("");
    } catch (error) {
      toast({
        title: t("claimError"),
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50 p-4">
      <div className="flex items-start gap-3">
        <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">{t("claimOwnership")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("claimDescription")}
          </p>

          {existingClaimStatus === "REJECTED" && (
            <div className="mt-2 flex items-center gap-2 text-xs text-orange-600">
              <XCircle className="h-4 w-4" />
              {t("claimRejectedDescription")}
            </div>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-3">
                {t("claimButton")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("claimOwnership")}</DialogTitle>
                <DialogDescription>
                  {t("claimDescription")} ({venueName})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="message">{t("claimMessage")}</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("claimMessagePlaceholder")}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "..." : t("submitClaim")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

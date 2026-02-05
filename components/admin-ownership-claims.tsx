"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  User,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Locale } from "date-fns";
import { pt, enUS, es, fr, de, it } from "date-fns/locale";

interface OwnershipClaim {
  id: string;
  venueId: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string | null;
  adminNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  venue: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    country: string;
    type: string;
    logo: string | null;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface AdminOwnershipClaimsProps {
  locale: string;
}

const localeMap: Record<string, Locale> = {
  pt,
  en: enUS,
  es,
  fr,
  de,
  it,
};

export function AdminOwnershipClaims({ locale }: AdminOwnershipClaimsProps) {
  const t = useTranslations("venues.ownershipClaim");
  const { toast } = useToast();
  const [claims, setClaims] = useState<OwnershipClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<OwnershipClaim | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(
    null
  );

  const dateLocale = localeMap[locale] || enUS;

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await fetch("/api/admin/venues/ownership-claims");
      if (response.ok) {
        const data = await response.json();
        setClaims(data);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedClaim) return;

    setProcessingId(selectedClaim.id);
    try {
      const response = await fetch(
        `/api/admin/venues/ownership-claims/${selectedClaim.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            adminNotes: adminNotes.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process claim");
      }

      toast({
        title: action === "approve" ? t("claimApproved") : t("claimRejected"),
        description:
          action === "approve"
            ? `${selectedClaim.user.name || selectedClaim.user.email} is now the owner of ${selectedClaim.venue.name}`
            : "The claim has been rejected",
      });

      // Refresh claims
      fetchClaims();
      setSelectedClaim(null);
      setDialogAction(null);
      setAdminNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openActionDialog = (
    claim: OwnershipClaim,
    action: "approve" | "reject"
  ) => {
    setSelectedClaim(claim);
    setDialogAction(action);
    setAdminNotes("");
  };

  const pendingClaims = claims.filter((c) => c.status === "PENDING");
  const processedClaims = claims.filter((c) => c.status !== "PENDING");

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t("adminTitle")}
          </CardTitle>
          <CardDescription>{t("adminDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingClaims.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>{t("noClaims")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start"
                >
                  {/* Header with Avatar and Badge */}
                  <div className="flex items-start justify-between gap-4 sm:contents">
                    {/* User Avatar */}
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={claim.user.image || undefined} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Badge - visible on mobile */}
                    <Badge variant="outline" className="sm:hidden">
                      <Clock className="mr-1 h-3 w-3" />
                      {t("status.PENDING")}
                    </Badge>
                  </div>

                  {/* Claim Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {claim.user.name || claim.user.email}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {claim.user.email}
                        </p>
                      </div>
                      {/* Badge - hidden on mobile */}
                      <Badge
                        variant="outline"
                        className="hidden shrink-0 sm:flex"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {t("status.PENDING")}
                      </Badge>
                    </div>

                    {/* Venue Info */}
                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <Link
                          href={`/${locale}/venues/${claim.venue.slug}`}
                          className="truncate font-medium hover:text-primary hover:underline"
                        >
                          {claim.venue.name}
                        </Link>
                      </div>
                      {claim.venue.city && (
                        <div className="flex items-center gap-2 pl-6 sm:pl-0">
                          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground sm:ml-2" />
                          <span className="truncate text-muted-foreground">
                            {claim.venue.city}, {claim.venue.country}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {claim.message && (
                      <div className="rounded-md bg-muted p-3 text-sm">
                        <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          Message:
                        </div>
                        {claim.message}
                      </div>
                    )}

                    {/* Time and Actions */}
                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(claim.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </p>
                      <div className="flex w-full gap-2 sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openActionDialog(claim, "reject")}
                          disabled={processingId === claim.id}
                          className="flex-1 sm:flex-initial"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          {t("reject")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openActionDialog(claim, "approve")}
                          disabled={processingId === claim.id}
                          className="flex-1 sm:flex-initial"
                        >
                          {processingId === claim.id ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-1 h-4 w-4" />
                          )}
                          {t("approve")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show processed claims in a collapsed section */}
          {processedClaims.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Recently processed ({processedClaims.length})
              </p>
              <div className="space-y-2">
                {processedClaims.slice(0, 5).map((claim) => (
                  <div
                    key={claim.id}
                    className="flex flex-col gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="truncate">
                        {claim.user.name || claim.user.email}
                      </span>
                      <span className="shrink-0 text-muted-foreground">→</span>
                      <Link
                        href={`/${locale}/venues/${claim.venue.slug}`}
                        className="truncate hover:text-primary hover:underline"
                      >
                        {claim.venue.name}
                      </Link>
                    </div>
                    <Badge
                      variant={
                        claim.status === "APPROVED" ? "default" : "destructive"
                      }
                      className="w-fit shrink-0"
                    >
                      {claim.status === "APPROVED" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {t(`status.${claim.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={dialogAction !== null}
        onOpenChange={() => {
          setDialogAction(null);
          setSelectedClaim(null);
          setAdminNotes("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" ? t("approve") : t("reject")} Claim
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? `This will make ${selectedClaim?.user.name || selectedClaim?.user.email} the owner of ${selectedClaim?.venue.name}.`
                : `This will reject the ownership claim from ${selectedClaim?.user.name || selectedClaim?.user.email}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminNotes">{t("adminNotes")}</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={t("adminNotesPlaceholder")}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogAction(null);
                setSelectedClaim(null);
                setAdminNotes("");
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              variant={dialogAction === "approve" ? "default" : "destructive"}
              onClick={() => dialogAction && handleAction(dialogAction)}
              disabled={processingId !== null}
            >
              {processingId ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : dialogAction === "approve" ? (
                <CheckCircle className="mr-1 h-4 w-4" />
              ) : (
                <XCircle className="mr-1 h-4 w-4" />
              )}
              {dialogAction === "approve" ? t("approve") : t("reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

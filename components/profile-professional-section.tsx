"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Briefcase,
  Building2,
  Check,
  X,
  Loader2,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface VenueInvite {
  id: string;
  role: string;
  venue: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    city: string | null;
  };
  invitedBy: {
    name: string;
    image: string | null;
  };
  createdAt: string;
}

interface VenueMembership {
  id: string;
  role: string;
  venue: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    city: string | null;
  };
  joinedAt: string | null;
}

interface ProfileProfessionalSectionProps {
  userId: string;
}

export function ProfileProfessionalSection({
  userId,
}: ProfileProfessionalSectionProps) {
  const t = useTranslations("profile.professional");
  const tRoles = useTranslations("venues.roles");
  const router = useRouter();
  const { toast } = useToast();

  const [pendingInvites, setPendingInvites] = useState<VenueInvite[]>([]);
  const [memberships, setMemberships] = useState<VenueMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingInvite, setProcessingInvite] = useState<string | null>(null);
  const [leavingMembership, setLeavingMembership] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchProfessionalData();
  }, [userId]);

  async function fetchProfessionalData() {
    try {
      const response = await fetch("/api/profile/professional");
      if (response.ok) {
        const data = await response.json();
        setPendingInvites(data.pendingInvites || []);
        setMemberships(data.memberships || []);
      }
    } catch (error) {
      console.error("Error fetching professional data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleInviteResponse(inviteId: string, accept: boolean) {
    setProcessingInvite(inviteId);
    try {
      const response = await fetch(`/api/venues/invites/${inviteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });

      if (response.ok) {
        // Remove from pending invites
        setPendingInvites((prev) => prev.filter((inv) => inv.id !== inviteId));

        if (accept) {
          // Refresh to get new membership
          await fetchProfessionalData();
          toast({
            title: t("inviteAccepted"),
            description: t("inviteAcceptedDesc"),
          });
        } else {
          toast({
            title: t("inviteDeclined"),
            description: t("inviteDeclinedDesc"),
          });
        }
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: t("error"),
          description: error.error || t("errorProcessingInvite"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error responding to invite:", error);
      toast({
        title: t("error"),
        description: t("errorProcessingInvite"),
        variant: "destructive",
      });
    } finally {
      setProcessingInvite(null);
    }
  }

  async function handleLeaveVenue(membershipId: string, venueName: string) {
    setLeavingMembership(membershipId);
    try {
      const response = await fetch("/api/profile/professional", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId }),
      });

      if (response.ok) {
        // Remove from memberships
        setMemberships((prev) => prev.filter((m) => m.id !== membershipId));
        toast({
          title: t("leftVenue"),
          description: t("leftVenueDesc", { venue: venueName }),
        });
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: t("error"),
          description: error.error || t("errorLeavingVenue"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error leaving venue:", error);
      toast({
        title: t("error"),
        description: t("errorLeavingVenue"),
        variant: "destructive",
      });
    } finally {
      setLeavingMembership(null);
    }
  }

  // Don't show section if user has no invites and no memberships
  if (!loading && pendingInvites.length === 0 && memberships.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-12">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Briefcase className="h-6 w-6 text-primary" />
        {t("title")}
      </h2>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge variant="secondary" className="animate-pulse">
                {pendingInvites.length}
              </Badge>
              {t("pendingInvites")}
            </CardTitle>
            <CardDescription>{t("pendingInvitesDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-lg border bg-background p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={invite.venue.logo || undefined}
                        alt={invite.venue.name}
                      />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{invite.venue.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {invite.venue.city}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{tRoles(invite.role)}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {t("invitedBy", { name: invite.invitedBy.name })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInviteResponse(invite.id, false)}
                      disabled={processingInvite === invite.id}
                    >
                      {processingInvite === invite.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleInviteResponse(invite.id, true)}
                      disabled={processingInvite === invite.id}
                    >
                      {processingInvite === invite.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          {t("accept")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Memberships */}
      {memberships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("myVenues")}</CardTitle>
            <CardDescription>{t("myVenuesDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {memberships.map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <Link
                    href={`/venues/${membership.venue.slug}`}
                    className="group flex flex-1 items-center gap-4"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={membership.venue.logo || undefined}
                        alt={membership.venue.name}
                      />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{membership.venue.name}</p>
                        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {membership.venue.city}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {tRoles(membership.role)}
                      </Badge>
                    </div>
                  </Link>

                  {/* Leave venue button - only for non-owners */}
                  {membership.role !== "OWNER" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          disabled={leavingMembership === membership.id}
                        >
                          {leavingMembership === membership.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("leaveVenueTitle")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("leaveVenueConfirm", {
                              venue: membership.venue.name,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() =>
                              handleLeaveVenue(
                                membership.id,
                                membership.venue.name
                              )
                            }
                          >
                            {t("confirmLeave")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

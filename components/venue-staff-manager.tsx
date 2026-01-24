"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  UserPlus,
  Mail,
  Send,
  Trash2,
  RotateCw,
  XCircle,
  Shield,
  Loader2,
} from "lucide-react";

interface VenueMember {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface VenueInvite {
  id: string;
  email: string;
  role: string;
  name: string | null;
  message: string | null;
  invitedBy: {
    name: string;
  };
  createdAt: string;
}

interface VenueStaffManagerProps {
  venueId: string;
  venueName: string;
  members: VenueMember[];
  currentUserId: string;
  isOwner: boolean;
}

export function VenueStaffManager({
  venueId,
  venueName: _venueName,
  members: initialMembers,
  currentUserId: _currentUserId,
  isOwner,
}: VenueStaffManagerProps) {
  const t = useTranslations("venues.staff");
  const tRoles = useTranslations("venues.roles");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();

  const [members, setMembers] = useState<VenueMember[]>(initialMembers);
  const [invites, setInvites] = useState<VenueInvite[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<VenueMember | null>(
    null
  );

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "COACH",
    name: "",
    message: "",
  });

  // Load pending invites
  useEffect(() => {
    if (isOwner) {
      fetchInvites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  async function fetchInvites() {
    try {
      const response = await fetch(`/api/venues/${venueId}/invites`);
      if (response.ok) {
        const data = await response.json();
        setInvites(data);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  }

  async function handleSendInvite() {
    if (!inviteForm.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    setInviteLoading(true);

    try {
      const response = await fetch(`/api/venues/${venueId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });

      if (response.ok) {
        const newInvite = await response.json();
        setInvites([...invites, newInvite]);
        setInviteForm({ email: "", role: "COACH", name: "", message: "" });
        setShowInviteForm(false);
        toast({
          title: t("inviteSent"),
          description: `Invite sent to ${inviteForm.email}`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to send invite",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        title: "Error",
        description: "Failed to send invite",
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleCancelInvite(inviteId: string) {
    try {
      const response = await fetch(
        `/api/venues/${venueId}/invites/${inviteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setInvites(invites.filter((inv) => inv.id !== inviteId));
        toast({
          title: t("cancelInvite"),
          description: "Invite cancelled successfully",
        });
      }
    } catch (error) {
      console.error("Error cancelling invite:", error);
    }
  }

  async function handleResendInvite(inviteId: string) {
    try {
      const response = await fetch(
        `/api/venues/${venueId}/invites/${inviteId}/resend`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast({
          title: t("resendInvite"),
          description: "Invite resent successfully",
        });
      }
    } catch (error) {
      console.error("Error resending invite:", error);
    }
  }

  async function handleRemoveMember(member: VenueMember) {
    if (member.role === "OWNER") {
      toast({
        title: t("cannotRemoveOwner"),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/venues/${venueId}/members/${member.userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMembers(members.filter((m) => m.id !== member.id));
        setRemoveDialogOpen(false);
        setMemberToRemove(null);
        toast({
          title: t("staffRemoved"),
          description: `${member.user.name} removed from team`,
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  }

  async function handleChangeRole(member: VenueMember, newRole: string) {
    if (member.role === "OWNER") {
      toast({
        title: t("cannotChangeOwnerRole"),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/venues/${venueId}/members/${member.userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (response.ok) {
        setMembers(
          members.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
        );
        toast({
          title: t("roleChanged"),
          description: `${member.user.name} is now ${tRoles(newRole)}`,
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Error",
        description: "Failed to change role",
        variant: "destructive",
      });
    }
  }

  function getRoleBadgeVariant(role: string) {
    switch (role) {
      case "OWNER":
        return "default";
      case "ADMIN":
        return "secondary";
      case "COACH":
        return "outline";
      default:
        return "outline";
    }
  }

  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("ownerOnly")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite Form */}
      {showInviteForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {t("inviteStaff")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">{t("inviteEmail")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("inviteEmailPlaceholder")}
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t("inviteRole")}</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) =>
                    setInviteForm({ ...inviteForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">{tRoles("ADMIN")}</SelectItem>
                    <SelectItem value="COACH">{tRoles("COACH")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t("inviteName")}</Label>
              <Input
                id="name"
                placeholder={t("inviteNamePlaceholder")}
                value={inviteForm.name}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("inviteMessage")}</Label>
              <Textarea
                id="message"
                placeholder={t("inviteMessagePlaceholder")}
                value={inviteForm.message}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, message: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSendInvite}
                disabled={inviteLoading}
                className="flex-1"
              >
                {inviteLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {t("inviteButton")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteForm(false);
                  setInviteForm({
                    email: "",
                    role: "COACH",
                    name: "",
                    message: "",
                  });
                }}
              >
                {tCommon("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowInviteForm(true)} className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          {t("inviteStaff")}
        </Button>
      )}

      {/* Pending Invites */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t("pendingInvites")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{invite.email}</p>
                      <Badge variant="outline">{tRoles(invite.role)}</Badge>
                    </div>
                    {invite.name && (
                      <p className="text-sm text-muted-foreground">
                        {invite.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t("invitedBy", { name: invite.invitedBy.name })} •{" "}
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendInvite(invite.id)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelInvite(invite.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Staff */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("currentStaff")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">{t("noStaff")}</p>
              <p className="text-xs text-muted-foreground">
                {t("noStaffDescription")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={member.user.image || undefined}
                        alt={member.user.name}
                      />
                      <AvatarFallback>
                        {member.user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.role === "OWNER" ? (
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {tRoles(member.role)}
                      </Badge>
                    ) : (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleChangeRole(member, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">
                              {tRoles("ADMIN")}
                            </SelectItem>
                            <SelectItem value="COACH">
                              {tRoles("COACH")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMemberToRemove(member);
                            setRemoveDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("removeStaff")}</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove &&
                t("confirmRemove", { name: memberToRemove.user.name })}
              <br />
              <span className="text-destructive">
                {t("confirmRemoveWarning")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                memberToRemove && handleRemoveMember(memberToRemove)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("removeStaff")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

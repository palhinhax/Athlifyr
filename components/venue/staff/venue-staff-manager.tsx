"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import type { VenueMember, VenueInvite, VenueStaffManagerProps } from "./types";
import { VenueStaffUserInvite } from "./venue-staff-user-invite";
import { VenueStaffPendingInvites } from "./venue-staff-pending-invites";
import { VenueStaffMemberList } from "./venue-staff-member-list";
import { VenueStaffRemoveDialog } from "./venue-staff-remove-dialog";

export function VenueStaffManager({
  venueId,
  venueName: _venueName,
  members: initialMembers,
  currentUserId: _currentUserId,
  isOwner,
  isAppAdmin = false,
}: VenueStaffManagerProps) {
  const t = useTranslations("venues.staff");
  const tRoles = useTranslations("venues.roles");
  const router = useRouter();
  const { toast } = useToast();

  // Allow access if user is owner OR app admin
  const canManageStaff = isOwner || isAppAdmin;

  const [members, setMembers] = useState<VenueMember[]>(initialMembers);
  const [invites, setInvites] = useState<VenueInvite[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<VenueMember | null>(
    null
  );

  const fetchInvites = useCallback(async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}/invites`);
      if (response.ok) {
        const data = await response.json();
        setInvites(data);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  }, [venueId]);

  // Load pending invites
  useEffect(() => {
    if (canManageStaff) {
      fetchInvites();
    }
  }, [canManageStaff, fetchInvites]);

  function handleInviteSent() {
    setShowInviteForm(false);
    fetchInvites();
    router.refresh();
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
          title: t("inviteCancelled"),
          description: t("inviteCancelledDesc"),
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
          title: t("inviteResent"),
          description: t("inviteResentDesc"),
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
          description: t("staffRemovedDesc", { name: member.user.name }),
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: t("error"),
        description: t("removeError"),
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
          description: t("roleChangedDesc", {
            name: member.user.name,
            role: tRoles(newRole),
          }),
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: t("error"),
        description: t("roleChangeError"),
        variant: "destructive",
      });
    }
  }

  function handleRemoveClick(member: VenueMember) {
    setMemberToRemove(member);
    setRemoveDialogOpen(true);
  }

  function handleConfirmRemove() {
    if (memberToRemove) {
      handleRemoveMember(memberToRemove);
    }
  }

  if (!canManageStaff) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("ownerOnly")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Get IDs of existing members to filter from search
  const existingMemberIds = members.map((m) => m.userId);

  return (
    <div className="space-y-6">
      {/* Invite Form */}
      {showInviteForm ? (
        <VenueStaffUserInvite
          venueId={venueId}
          existingMemberIds={existingMemberIds}
          onInviteSent={handleInviteSent}
          onCancel={() => setShowInviteForm(false)}
        />
      ) : (
        <Button onClick={() => setShowInviteForm(true)} className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          {t("inviteStaff")}
        </Button>
      )}

      {/* Pending Invites */}
      <VenueStaffPendingInvites
        invites={invites}
        onResend={handleResendInvite}
        onCancel={handleCancelInvite}
      />

      {/* Current Staff */}
      <VenueStaffMemberList
        members={members}
        onRoleChange={handleChangeRole}
        onRemove={handleRemoveClick}
      />

      {/* Remove Confirmation Dialog */}
      <VenueStaffRemoveDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        member={memberToRemove}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}

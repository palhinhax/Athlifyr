"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Search, Send, Loader2, X } from "lucide-react";

interface SearchUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface VenueStaffUserInviteProps {
  venueId: string;
  existingMemberIds: string[];
  onInviteSent: () => void;
  onCancel: () => void;
}

export function VenueStaffUserInvite({
  venueId,
  existingMemberIds,
  onInviteSent,
  onCancel,
}: VenueStaffUserInviteProps) {
  const t = useTranslations("venues.staff");
  const tRoles = useTranslations("venues.roles");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [selectedRole, setSelectedRole] = useState("COACH");
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Debounced search
  const searchUsers = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}&limit=10`
        );
        if (response.ok) {
          const users: SearchUser[] = await response.json();
          // Filter out existing members
          const filteredUsers = users.filter(
            (user) => !existingMemberIds.includes(user.id)
          );
          setSearchResults(filteredUsers);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [existingMemberIds]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && !selectedUser) {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers, selectedUser]);

  function handleSelectUser(user: SearchUser) {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setSearchResults([]);
  }

  function handleClearSelection() {
    setSelectedUser(null);
    setSearchQuery("");
    setSearchResults([]);
  }

  async function handleSendInvite() {
    if (!selectedUser) {
      toast({
        title: t("error"),
        description: t("selectUserFirst"),
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: selectedRole,
        }),
      });

      if (response.ok) {
        toast({
          title: t("inviteSent"),
          description: t("inviteSentToUser", { name: selectedUser.name }),
        });
        onInviteSent();
      } else {
        const error = await response.json();
        toast({
          title: t("error"),
          description: error.error || t("inviteFailed"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        title: t("error"),
        description: t("inviteFailed"),
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {t("inviteStaff")}
        </CardTitle>
        <CardDescription>{t("searchUserDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Search */}
        <div className="space-y-2">
          <Label>{t("searchUser")}</Label>
          <div className="relative">
            {selectedUser ? (
              <div className="flex items-center gap-3 rounded-md border p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedUser.image || undefined}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback>
                    {selectedUser.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("searchUserPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && !selectedUser && (
            <div className="rounded-md border bg-background shadow-lg">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent"
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 &&
            !isSearching &&
            searchResults.length === 0 &&
            !selectedUser && (
              <p className="text-sm text-muted-foreground">
                {t("noUsersFound")}
              </p>
            )}
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <Label>{t("inviteRole")}</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">{tRoles("ADMIN")}</SelectItem>
              <SelectItem value="COACH">{tRoles("COACH")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleSendInvite}
            disabled={!selectedUser || isInviting}
            className="flex-1"
          >
            {isInviting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {t("sendInvite")}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {tCommon("cancel")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

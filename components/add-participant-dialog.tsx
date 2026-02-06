"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, UserPlus, Users } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface AddParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  sessionId: string;
  onSuccess: () => void;
}

export function AddParticipantDialog({
  open,
  onOpenChange,
  venueId,
  sessionId,
  onSuccess,
}: AddParticipantDialogProps) {
  const t = useTranslations("venues.sessions");
  const tCommon = useTranslations("common");
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"search" | "guest">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Guest form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Search for users (venue members)
  const searchUsers = useCallback(async () => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/members/search?q=${encodeURIComponent(debouncedSearch)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.members || []);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  }, [venueId, debouncedSearch]);

  // Run search when debounced query changes
  useEffect(() => {
    searchUsers();
  }, [searchUsers]);

  // Add existing user as participant
  const handleAddUser = async (user: User) => {
    setIsAdding(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/${sessionId}/add-participant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add participant");
      }

      toast({
        title: t("participantAdded"),
        description: user.name || user.email,
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error adding participant:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to add participant",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Add guest participant
  const handleAddGuest = async () => {
    if (!guestName.trim()) {
      toast({
        title: tCommon("error"),
        description: t("participantNamePlaceholder"),
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/${sessionId}/add-participant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestName: guestName.trim(),
            guestEmail: guestEmail.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add participant");
      }

      toast({
        title: t("participantAdded"),
        description: guestName,
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error adding guest:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to add participant",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setSearchResults([]);
    setGuestName("");
    setGuestEmail("");
    setActiveTab("search");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t("addParticipant")}
          </DialogTitle>
          <DialogDescription>{t("manageParticipants")}</DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "search" | "guest")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {tCommon("search")}
            </TabsTrigger>
            <TabsTrigger value="guest" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {tCommon("guest")}
            </TabsTrigger>
          </TabsList>

          {/* Search Tab - Find existing members */}
          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label>{tCommon("search")}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("participantNamePlaceholder")}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers();
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddUser(user)}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              ) : searchQuery.length >= 2 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {tCommon("noResults")}
                </p>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {tCommon("typeToSearch")}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Guest Tab - Add without account */}
          <TabsContent value="guest" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">{t("participantName")} *</Label>
              <Input
                id="guestName"
                placeholder={t("participantNamePlaceholder")}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email ({tCommon("optional")})</Label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="email@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAddGuest}
              disabled={isAdding || !guestName.trim()}
              className="w-full"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tCommon("loading")}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("addParticipant")}
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

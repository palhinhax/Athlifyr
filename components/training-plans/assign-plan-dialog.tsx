"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon, SearchIcon, UserIcon, CheckIcon } from "lucide-react";
import type { TrainingPlanWithDetails } from "@/types/training-plan";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  friendshipStatus?: string | null;
}

interface AssignPlanDialogProps {
  plan: TrainingPlanWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (
    planId: string,
    userId: string,
    startDate: Date,
    notes?: string
  ) => Promise<boolean>;
}

export function AssignPlanDialog({
  plan,
  open,
  onOpenChange,
  onAssign,
}: AssignPlanDialogProps) {
  const t = useTranslations("workouts.plans.assignment");

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setUsers([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchUsers(value);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.name || user.email || "");
    setUsers([]);
  };

  const handleAssign = async () => {
    if (!plan || !selectedUser) return;

    setIsAssigning(true);
    try {
      const success = await onAssign(
        plan.id,
        selectedUser.id,
        new Date(startDate),
        notes.trim() || undefined
      );
      if (success) {
        // Reset form
        setSearchQuery("");
        setSelectedUser(null);
        setStartDate(new Date().toISOString().split("T")[0]);
        setNotes("");
        onOpenChange(false);
      }
    } finally {
      setIsAssigning(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setSearchQuery("");
      setSelectedUser(null);
      setUsers([]);
      setStartDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
    onOpenChange(newOpen);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {plan?.name && (
              <span className="font-medium text-foreground">{plan.name}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Athlete Search */}
          <div className="space-y-2">
            <Label>{t("selectAthlete")}</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchAthletes")}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
              />
              {isSearching && (
                <Loader2Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Search Results */}
            {users.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-md border">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="flex w-full items-center gap-3 p-2 text-left hover:bg-accent"
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected User */}
            {selectedUser && users.length === 0 && (
              <div className="flex items-center gap-3 rounded-md border bg-accent/50 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedUser.image || undefined} />
                  <AvatarFallback>
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
                <CheckIcon className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">{t("startDate")}</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              placeholder={t("notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedUser || isAssigning}
          >
            {isAssigning ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                {t("title")}
              </>
            ) : (
              <>
                <UserIcon className="mr-2 h-4 w-4" />
                {t("title")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

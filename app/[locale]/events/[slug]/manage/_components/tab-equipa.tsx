"use client";

import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Shield,
  Users,
  UserPlus,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { EventOrganizerRole, EventStaffRole } from "@prisma/client";
import { useTranslations } from "next-intl";
import type {
  EventDetails,
  OrganizerMember,
  StaffMember,
  UserSearchResult,
} from "./types";
import { ORGANIZER_ROLE_COLORS, STAFF_ROLE_COLORS } from "./types";

interface TabEquipaProps {
  event: EventDetails;
  organizers: OrganizerMember[];
  staff: StaffMember[];
  canManageTeam: boolean;
  loadTeam: (eventId: string) => Promise<void>;
}

export function TabEquipa({
  event,
  organizers,
  staff,
  canManageTeam,
  loadTeam,
}: TabEquipaProps) {
  const t = useTranslations("manage.team");
  const tErr = useTranslations("manage.errors");
  const tCommon = useTranslations("manage.common");

  // Organizer invite state
  const [addOrgUserId, setAddOrgUserId] = useState("");
  const [addOrgRole, setAddOrgRole] = useState<EventOrganizerRole>(
    EventOrganizerRole.ADMIN
  );
  const [orgQuery, setOrgQuery] = useState("");
  const [orgResults, setOrgResults] = useState<UserSearchResult[]>([]);
  const [isSearchingOrg, setIsSearchingOrg] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const orgSearchRef = useRef<HTMLDivElement>(null);

  // Staff invite state
  const [addStaffUserId, setAddStaffUserId] = useState("");
  const [addStaffRole, setAddStaffRole] = useState<EventStaffRole>(
    EventStaffRole.STAFF
  );
  const [staffQuery, setStaffQuery] = useState("");
  const [staffResults, setStaffResults] = useState<UserSearchResult[]>([]);
  const [isSearchingStaff, setIsSearchingStaff] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const staffSearchRef = useRef<HTMLDivElement>(null);

  // Debounced search for organizer
  useEffect(() => {
    if (orgQuery.trim().length < 2) {
      setOrgResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingOrg(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(orgQuery.trim())}`
        );
        if (res.ok) setOrgResults((await res.json()) as UserSearchResult[]);
      } catch {
        setOrgResults([]);
      } finally {
        setIsSearchingOrg(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [orgQuery]);

  // Debounced search for staff
  useEffect(() => {
    if (staffQuery.trim().length < 2) {
      setStaffResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingStaff(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(staffQuery.trim())}`
        );
        if (res.ok) setStaffResults((await res.json()) as UserSearchResult[]);
      } catch {
        setStaffResults([]);
      } finally {
        setIsSearchingStaff(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [staffQuery]);

  // Click-outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        orgSearchRef.current &&
        !orgSearchRef.current.contains(e.target as Node)
      )
        setShowOrgDropdown(false);
      if (
        staffSearchRef.current &&
        !staffSearchRef.current.contains(e.target as Node)
      )
        setShowStaffDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOrgUser = (user: UserSearchResult) => {
    setAddOrgUserId(user.id);
    setOrgQuery(user.name || user.email);
    setShowOrgDropdown(false);
    setOrgResults([]);
  };

  const clearOrgSelection = () => {
    setAddOrgUserId("");
    setOrgQuery("");
    setOrgResults([]);
  };

  const selectStaffUser = (user: UserSearchResult) => {
    setAddStaffUserId(user.id);
    setStaffQuery(user.name || user.email);
    setShowStaffDropdown(false);
    setStaffResults([]);
  };

  const clearStaffSelection = () => {
    setAddStaffUserId("");
    setStaffQuery("");
    setStaffResults([]);
  };

  const handleAddOrganizer = async () => {
    if (!addOrgUserId.trim()) return;
    try {
      const res = await fetch(`/api/events/${event.id}/organizers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: addOrgUserId.trim(), role: addOrgRole }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error);
      }
      clearOrgSelection();
      await loadTeam(event.id);
      toast({ title: t("organizerAdded") });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveOrganizer = async (organizerId: string) => {
    try {
      await fetch(`/api/events/${event.id}/organizers/${organizerId}`, {
        method: "DELETE",
      });
      await loadTeam(event.id);
      toast({ title: t("organizerRemoved") });
    } catch {
      toast({
        title: tErr("saveError"),
        description: t("removeError"),
        variant: "destructive",
      });
    }
  };

  const handleChangeOrganizerRole = async (
    organizerId: string,
    role: EventOrganizerRole
  ) => {
    try {
      await fetch(`/api/events/${event.id}/organizers/${organizerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      await loadTeam(event.id);
    } catch {
      toast({
        title: tErr("saveError"),
        description: t("roleChangeError"),
        variant: "destructive",
      });
    }
  };

  const handleAddStaff = async () => {
    if (!addStaffUserId.trim()) return;
    try {
      const res = await fetch(`/api/events/${event.id}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: addStaffUserId.trim(),
          role: addStaffRole,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error);
      }
      clearStaffSelection();
      await loadTeam(event.id);
      toast({ title: t("staffAdded") });
    } catch (e) {
      toast({
        title: tErr("saveError"),
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    try {
      await fetch(`/api/events/${event.id}/staff/${staffId}`, {
        method: "DELETE",
      });
      await loadTeam(event.id);
      toast({ title: t("staffRemoved") });
    } catch {
      toast({
        title: tErr("saveError"),
        description: t("removeError"),
        variant: "destructive",
      });
    }
  };

  const orgRoleKeys = Object.values(EventOrganizerRole);
  const staffRoleKeys = Object.values(EventStaffRole);

  return (
    <TabsContent value="team" className="space-y-6">
      {/* Organizers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-purple-500" />
            {t("organizers")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {organizers.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noOrganizers")}</p>
          ) : (
            <div className="space-y-2">
              {organizers.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {org.user.name ?? org.user.email}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {org.user.email}
                    </p>
                  </div>
                  {canManageTeam ? (
                    <Select
                      value={org.role}
                      onValueChange={(v) =>
                        void handleChangeOrganizerRole(
                          org.id,
                          v as EventOrganizerRole
                        )
                      }
                      disabled={org.role === EventOrganizerRole.OWNER}
                    >
                      <SelectTrigger className="h-7 w-36 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orgRoleKeys.map((val) => (
                          <SelectItem key={val} value={val}>
                            {t(`roles.${val}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${ORGANIZER_ROLE_COLORS[org.role]}`}
                    >
                      {t(`roles.${org.role}`)}
                    </span>
                  )}
                  {canManageTeam && org.role !== EventOrganizerRole.OWNER && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("removeOrganizer")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("removeOrganizerDescription", {
                              name: org.user.name ?? org.user.email,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {tCommon("cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void handleRemoveOrganizer(org.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {tCommon("remove")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add organizer */}
          {canManageTeam && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex gap-2">
                <SearchInput
                  ref={orgSearchRef}
                  selectedUserId={addOrgUserId}
                  query={orgQuery}
                  results={orgResults}
                  isSearching={isSearchingOrg}
                  showDropdown={showOrgDropdown}
                  placeholder={t("searchPlaceholder")}
                  searchingLabel={t("searching")}
                  noResultsLabel={t("noUsersFound")}
                  minCharsLabel={t("minChars")}
                  noNameLabel={t("noName")}
                  onQueryChange={(v) => {
                    setOrgQuery(v);
                    setShowOrgDropdown(true);
                  }}
                  onFocus={() => {
                    if (orgResults.length > 0) setShowOrgDropdown(true);
                  }}
                  onSelectUser={selectOrgUser}
                  onClear={clearOrgSelection}
                />
                <Select
                  value={addOrgRole}
                  onValueChange={(v) => setAddOrgRole(v as EventOrganizerRole)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orgRoleKeys.map((val) => (
                      <SelectItem key={val} value={val}>
                        {t(`roles.${val}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => void handleAddOrganizer()}
                  disabled={!addOrgUserId}
                  className="gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  {t("add")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-orange-500" />
            {t("staff")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {staff.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noStaff")}</p>
          ) : (
            <div className="space-y-2">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {s.user.name ?? s.user.email}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.user.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STAFF_ROLE_COLORS[s.role]}`}
                  >
                    {t(`roles.${s.role}`)}
                  </span>
                  {canManageTeam && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("removeStaff")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("removeStaffDescription", {
                              name: s.user.name ?? s.user.email,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {tCommon("cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void handleRemoveStaff(s.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {tCommon("remove")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add staff */}
          {canManageTeam && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex gap-2">
                <SearchInput
                  ref={staffSearchRef}
                  selectedUserId={addStaffUserId}
                  query={staffQuery}
                  results={staffResults}
                  isSearching={isSearchingStaff}
                  showDropdown={showStaffDropdown}
                  placeholder={t("searchPlaceholder")}
                  searchingLabel={t("searching")}
                  noResultsLabel={t("noUsersFound")}
                  minCharsLabel={t("minChars")}
                  noNameLabel={t("noName")}
                  onQueryChange={(v) => {
                    setStaffQuery(v);
                    setShowStaffDropdown(true);
                  }}
                  onFocus={() => {
                    if (staffResults.length > 0) setShowStaffDropdown(true);
                  }}
                  onSelectUser={selectStaffUser}
                  onClear={clearStaffSelection}
                />
                <Select
                  value={addStaffRole}
                  onValueChange={(v) => setAddStaffRole(v as EventStaffRole)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoleKeys.map((val) => (
                      <SelectItem key={val} value={val}>
                        {t(`roles.${val}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => void handleAddStaff()}
                  disabled={!addStaffUserId}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  {t("add")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

/* ── Reusable user search input ─────────────────────────────────────────────── */

import React from "react";

interface SearchInputProps {
  selectedUserId: string;
  query: string;
  results: UserSearchResult[];
  isSearching: boolean;
  showDropdown: boolean;
  placeholder: string;
  searchingLabel: string;
  noResultsLabel: string;
  minCharsLabel: string;
  noNameLabel: string;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onSelectUser: (user: UserSearchResult) => void;
  onClear: () => void;
}

const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  (
    {
      selectedUserId,
      query,
      results,
      isSearching,
      showDropdown,
      placeholder,
      searchingLabel,
      noResultsLabel,
      minCharsLabel,
      noNameLabel,
      onQueryChange,
      onFocus,
      onSelectUser,
      onClear,
    },
    ref
  ) => (
    <div className="relative flex-1" ref={ref}>
      {selectedUserId ? (
        <div className="flex h-10 items-center gap-2 rounded-md border bg-muted/50 px-3">
          <span className="truncate text-sm">{query}</span>
          <button
            type="button"
            onClick={onClear}
            className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onFocus}
            className="pl-9"
          />
        </div>
      )}
      {showDropdown && !selectedUserId && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {searchingLabel}
              </span>
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-48 overflow-auto py-1">
              {results.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => onSelectUser(user)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? ""}
                      />
                      <AvatarFallback className="text-xs">
                        {(user.name ?? user.email)?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user.name ?? noNameLabel}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim().length >= 2 ? (
            <p className="p-3 text-center text-sm text-muted-foreground">
              {noResultsLabel}
            </p>
          ) : (
            <p className="p-3 text-center text-sm text-muted-foreground">
              {minCharsLabel}
            </p>
          )}
        </div>
      )}
    </div>
  )
);
SearchInput.displayName = "SearchInput";

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Gift,
  Users,
  Trophy,
  Calendar,
  Pencil,
  Trash2,
  Send,
  Search,
  X,
  UserPlus,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTranslations, useLocale } from "next-intl";
import { GiveawayStatus, GiveawayPlatform, Language } from "@prisma/client";
import { formatDate } from "@/lib/event-utils";

const LANGUAGES: Language[] = ["pt", "en", "es", "fr", "de", "it"];
const LANGUAGE_LABELS: Record<Language, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

interface GiveawayTranslation {
  lang: Language;
  title: string;
  details: string;
}

interface Giveaway {
  id: string;
  eventId: string;
  status: GiveawayStatus;
  platform: GiveawayPlatform;
  drawAt: string | null;
  prizeCount: number;
  secretHash: string | null;
  secretRevealed: string | null;
  event: { id: string; title: string; slug: string };
  translations: GiveawayTranslation[];
  _count: { participations: number; winners: number };
}

interface Event {
  id: string;
  title: string;
}

const STATUS_COLORS: Record<GiveawayStatus, string> = {
  DRAFT: "secondary",
  SCHEDULED: "default",
  DRAWING: "destructive",
  DRAWN: "outline",
  CANCELLED: "secondary",
};

// Valid state transitions — prevents going backwards
// (Used only for API validation, UI uses action buttons instead)

export default function AdminGiveawaysPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.giveaways");

  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSearch, setEventSearch] = useState("");
  const filteredEvents = useMemo(() => {
    const query = eventSearch.trim().toLowerCase();
    if (!query) return events;
    return events.filter((e) => e.title.toLowerCase().includes(query));
  }, [events, eventSearch]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGiveawayId, setEditingGiveawayId] = useState<string | null>(
    null
  );
  const [editingOriginalStatus, setEditingOriginalStatus] =
    useState<GiveawayStatus | null>(null);
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(
    null
  );
  const [participants, setParticipants] = useState<
    Array<{
      id: string;
      ticketNumber: number;
      createdAt: string;
      user: { id: string; name: string | null; email: string };
    }>
  >([]);
  const [removeTarget, setRemoveTarget] = useState<{
    userId: string;
    name: string;
  } | null>(null);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [winners, setWinners] = useState<
    Array<{
      id: string;
      rank: number;
      user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
      };
    }>
  >([]);
  const [winningTicketNumbers, setWinningTicketNumbers] = useState<number[]>(
    []
  );

  // Add participant dialog state
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<
    Array<{
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    }>
  >([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);

  const [formData, setFormData] = useState({
    eventId: "",
    drawAt: "",
    prizeCount: 1,
    platform: "ALL" as GiveawayPlatform,
    translations: LANGUAGES.map((lang) => ({ lang, title: "", details: "" })),
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  const fetchGiveaways = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/giveaways");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGiveaways(data.giveaways);
    } catch (error) {
      console.error("Error fetching giveaways:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/events?pageSize=100");
      if (!res.ok) return;
      const data = await res.json();
      setEvents(data.events);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchGiveaways();
    fetchEvents();
  }, [fetchGiveaways, fetchEvents]);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);

      // Convert date-only input (YYYY-MM-DD) to full ISO with fixed time 12:00 UTC
      const drawAtISO = formData.drawAt ? `${formData.drawAt}T12:00:00Z` : null;
      const payload = {
        ...formData,
        drawAt: drawAtISO,
        translations: formData.translations.filter(
          (t) => t.title.trim() && t.details.trim()
        ),
      };

      if (editingGiveawayId) {
        // Update existing giveaway
        const res = await fetch(`/api/admin/giveaways/${editingGiveawayId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast({
          title: t("toast.updated"),
          description: t("toast.updatedDesc"),
        });
      } else {
        // Create new giveaway
        const res = await fetch("/api/admin/giveaways", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast({
          title: t("toast.created"),
          description: t("toast.createdDesc"),
        });
      }

      setIsCreateOpen(false);
      setEditingGiveawayId(null);
      setEditingOriginalStatus(null);
      setFormData({
        eventId: "",
        drawAt: "",
        prizeCount: 1,
        platform: "ALL" as GiveawayPlatform,
        translations: LANGUAGES.map((lang) => ({
          lang,
          title: "",
          details: "",
        })),
      });
      fetchGiveaways();
    } catch {
      toast({
        title: t("toast.error"),
        description: editingGiveawayId
          ? t("toast.updateError")
          : t("toast.createError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraw = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/giveaways/${id}/draw`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to draw");
      toast({ title: t("toast.drawn"), description: t("toast.drawnDesc") });
      fetchGiveaways();
      if (selectedGiveaway?.id === id) setIsDetailOpen(false);
    } catch {
      toast({
        title: t("toast.error"),
        description: t("toast.drawError"),
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/giveaways/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: GiveawayStatus.CANCELLED }),
      });
      if (!res.ok) throw new Error("Failed to cancel");
      toast({
        title: t("toast.cancelled"),
        description: t("toast.cancelledDesc"),
      });
      fetchGiveaways();
      if (selectedGiveaway?.id === id) setIsDetailOpen(false);
    } catch {
      toast({
        title: t("toast.error"),
        description: t("toast.updateError"),
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/giveaways/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: GiveawayStatus.SCHEDULED }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      toast({
        title: t("toast.updated"),
        description: t("toast.updatedDesc"),
      });
      fetchGiveaways();
      if (selectedGiveaway?.id === id) setIsDetailOpen(false);
    } catch {
      toast({
        title: t("toast.error"),
        description: t("toast.updateError"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/giveaways/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({
        title: t("toast.deleted"),
        description: t("toast.deletedDesc"),
      });
      fetchGiveaways();
      if (selectedGiveaway?.id === id) setIsDetailOpen(false);
    } catch {
      toast({
        title: t("toast.error"),
        description: t("toast.deleteError"),
        variant: "destructive",
      });
    }
  };

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setUserResults([]);
      return;
    }
    setIsSearchingUsers(true);
    try {
      const res = await fetch(
        `/api/admin/users?search=${encodeURIComponent(query)}&limit=10`
      );
      if (!res.ok) return;
      const data = await res.json();
      setUserResults(
        data.users.map(
          (u: {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
          }) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            image: u.image,
          })
        )
      );
    } catch {
      setUserResults([]);
    } finally {
      setIsSearchingUsers(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => searchUsers(userSearch), 300);
    return () => clearTimeout(timeout);
  }, [userSearch, searchUsers]);

  const handleAddParticipant = async (userId: string) => {
    if (!selectedGiveaway) return;
    setIsAddingParticipant(true);
    try {
      const res = await fetch(
        `/api/admin/giveaways/${selectedGiveaway.id}/participants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add");
      }
      toast({
        title: t("toast.participantAdded"),
        description: t("toast.participantAddedDesc"),
      });
      setIsAddParticipantOpen(false);
      setUserSearch("");
      setUserResults([]);
      // Refresh participants
      openDetail(selectedGiveaway);
      fetchGiveaways();
    } catch (error) {
      toast({
        title: t("toast.error"),
        description:
          error instanceof Error &&
          error.message === "User already participates"
            ? t("toast.alreadyParticipates")
            : t("toast.addParticipantError"),
        variant: "destructive",
      });
    } finally {
      setIsAddingParticipant(false);
    }
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!selectedGiveaway) return;
    try {
      const res = await fetch(
        `/api/admin/giveaways/${selectedGiveaway.id}/participants`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) throw new Error("Failed to remove");
      toast({
        title: t("toast.participantRemoved"),
        description: t("toast.participantRemovedDesc"),
      });
      setParticipants((prev) => prev.filter((p) => p.user.id !== userId));
      fetchGiveaways();
    } catch {
      toast({
        title: t("toast.error"),
        description: t("toast.removeParticipantError"),
        variant: "destructive",
      });
    }
  };

  const openEditForm = (giveaway: Giveaway) => {
    setEditingGiveawayId(giveaway.id);
    setEditingOriginalStatus(giveaway.status);
    setFormData({
      eventId: giveaway.eventId,
      drawAt: giveaway.drawAt
        ? new Date(giveaway.drawAt).toISOString().slice(0, 10)
        : "",
      prizeCount: giveaway.prizeCount,
      platform: giveaway.platform,
      translations: LANGUAGES.map((lang) => {
        const existing = giveaway.translations.find((t) => t.lang === lang);
        return {
          lang,
          title: existing?.title || "",
          details: existing?.details || "",
        };
      }),
    });
    setIsDetailOpen(false);
    setIsCreateOpen(true);
  };

  const openDetail = async (giveaway: Giveaway) => {
    setSelectedGiveaway(giveaway);
    setIsDetailOpen(true);
    setIsLoadingParticipants(true);
    setWinners([]);
    setWinningTicketNumbers([]);
    try {
      const [participantsRes, detailRes] = await Promise.all([
        fetch(`/api/admin/giveaways/${giveaway.id}/participants`),
        fetch(`/api/admin/giveaways/${giveaway.id}`),
      ]);
      if (participantsRes.ok) {
        const data = await participantsRes.json();
        setParticipants(data.participations);
      } else {
        setParticipants([]);
      }
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        setWinners(detailData.giveaway.winners || []);
        setWinningTicketNumbers(detailData.giveaway.winningTicketNumbers || []);
      }
    } catch {
      setParticipants([]);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const updateTranslation = (
    lang: Language,
    field: "title" | "details",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.lang === lang ? { ...t, [field]: value } : t
      ),
    }));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("new")}
        </Button>
      </div>

      {giveaways.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gift className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">{t("noGiveaways")}</p>
            <p className="text-sm text-muted-foreground">
              {t("noGiveawaysDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {giveaways.map((giveaway) => {
            const translation =
              giveaway.translations.find(
                (t) => t.lang === (locale as Language)
              ) ||
              giveaway.translations.find((t) => t.lang === "en") ||
              giveaway.translations[0];

            return (
              <Card
                key={giveaway.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => openDetail(giveaway)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <p className="text-sm text-muted-foreground">
                      {giveaway.event.title}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {giveaway.platform !== "ALL" && (
                        <Badge variant="outline">
                          {t(`platform.${giveaway.platform}`)}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          STATUS_COLORS[giveaway.status] as
                            | "default"
                            | "secondary"
                            | "destructive"
                            | "outline"
                        }
                      >
                        {t(`status.${giveaway.status}`)}
                      </Badge>
                    </div>
                  </div>
                  <p className="mb-3 font-medium">
                    {translation?.title || "—"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {giveaway._count.participations}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" />
                      {giveaway.prizeCount}
                    </span>
                    {giveaway.drawAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(new Date(giveaway.drawAt))}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setEditingGiveawayId(null);
            setEditingOriginalStatus(null);
            setEventSearch("");
            setFormData({
              eventId: "",
              drawAt: "",
              prizeCount: 1,
              platform: "ALL" as GiveawayPlatform,
              translations: LANGUAGES.map((lang) => ({
                lang,
                title: "",
                details: "",
              })),
            });
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGiveawayId ? t("edit") : t("new")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t("fields.event")}</Label>
              <Select
                value={formData.eventId}
                onValueChange={(v) => {
                  setFormData((p) => ({ ...p, eventId: v }));
                  setEventSearch("");
                }}
                disabled={
                  editingOriginalStatus !== null &&
                  editingOriginalStatus !== GiveawayStatus.DRAFT
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("fields.event")} />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 z-10 border-b border-border bg-popover p-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        onKeyDown={(e) => {
                          // Prevent Radix Select typeahead from intercepting
                          // character keys, but allow navigation keys
                          // (Escape, Tab, Enter, Arrow keys) to propagate
                          // so the dropdown's keyboard interactions still work.
                          if (
                            e.key !== "Escape" &&
                            e.key !== "Tab" &&
                            e.key !== "Enter" &&
                            !e.key.startsWith("Arrow")
                          ) {
                            e.stopPropagation();
                          }
                        }}
                        placeholder={t("fields.searchEventPlaceholder")}
                        aria-label={t("fields.searchEventPlaceholder")}
                        className="h-10 pl-9"
                      />
                    </div>
                  </div>
                  {filteredEvents.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {t("fields.noEventsFound")}
                    </div>
                  ) : (
                    filteredEvents.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("fields.drawAt")}</Label>
                <Input
                  type="date"
                  value={formData.drawAt}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, drawAt: e.target.value }))
                  }
                  disabled={
                    editingOriginalStatus !== null &&
                    editingOriginalStatus !== GiveawayStatus.DRAFT
                  }
                />
              </div>
              <div>
                <Label>{t("fields.prizeCount")}</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.prizeCount}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      prizeCount: Number.parseInt(e.target.value) || 1,
                    }))
                  }
                  disabled={
                    editingOriginalStatus !== null &&
                    editingOriginalStatus !== GiveawayStatus.DRAFT
                  }
                />
              </div>
            </div>
            <div>
              <Label>{t("fields.platform")}</Label>
              <Select
                value={formData.platform}
                onValueChange={(v) =>
                  setFormData((p) => ({
                    ...p,
                    platform: v as GiveawayPlatform,
                  }))
                }
                disabled={
                  editingOriginalStatus !== null &&
                  editingOriginalStatus !== GiveawayStatus.DRAFT
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["ALL", "MOBILE", "ANDROID", "IOS"] as const).map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(`platform.${p}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Secret and hash are now auto-generated on creation */}
            <div>
              <Label>{t("form.translations")}</Label>
              <div className="mt-2 space-y-4">
                {LANGUAGES.map((lang) => {
                  const trans = formData.translations.find(
                    (t) => t.lang === lang
                  )!;
                  return (
                    <div key={lang} className="rounded-md border p-3">
                      <p className="mb-2 text-sm font-medium">
                        {LANGUAGE_LABELS[lang]}
                      </p>
                      <div className="space-y-2">
                        <Input
                          placeholder={t("form.title")}
                          value={trans.title}
                          onChange={(e) =>
                            updateTranslation(lang, "title", e.target.value)
                          }
                        />
                        <Textarea
                          placeholder={t("form.details")}
                          value={trans.details}
                          rows={2}
                          onChange={(e) =>
                            updateTranslation(lang, "details", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingGiveawayId(null);
              }}
            >
              {t("form.cancel")}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || !formData.eventId}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingGiveawayId ? t("form.saveChanges") : t("form.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedGiveaway && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedGiveaway.translations.find(
                    (t) => t.lang === (locale as Language)
                  )?.title ||
                    selectedGiveaway.translations[0]?.title ||
                    "—"}
                </DialogTitle>
                <DialogDescription>
                  {selectedGiveaway.event.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {t("fields.status")}:{" "}
                    </span>
                    <Badge
                      variant={
                        STATUS_COLORS[selectedGiveaway.status] as
                          | "default"
                          | "secondary"
                          | "destructive"
                          | "outline"
                      }
                    >
                      {t(`status.${selectedGiveaway.status}`)}
                    </Badge>
                  </div>
                  {selectedGiveaway.platform !== "ALL" && (
                    <div>
                      <span className="text-muted-foreground">
                        {t("fields.platform")}:{" "}
                      </span>
                      <Badge variant="outline">
                        {t(`platform.${selectedGiveaway.platform}`)}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">
                      {t("fields.prizeCount")}:{" "}
                    </span>
                    <span>{selectedGiveaway.prizeCount}</span>
                  </div>
                  {selectedGiveaway.drawAt && (
                    <div>
                      <span className="text-muted-foreground">
                        {t("fields.drawAt")}:{" "}
                      </span>
                      <span>
                        {formatDate(new Date(selectedGiveaway.drawAt))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Winners */}
                <div>
                  <h3 className="mb-2 font-medium">{t("detail.winners")}</h3>
                  {selectedGiveaway._count.winners === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t("detail.noWinners")}
                    </p>
                  )}
                  {selectedGiveaway._count.winners > 0 &&
                    winners.length === 0 && (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )}
                  {selectedGiveaway._count.winners > 0 &&
                    winners.length > 0 && (
                      <div className="max-h-48 overflow-y-auto rounded-md border">
                        {winners.map((w) => (
                          <div
                            key={w.id}
                            className="flex items-center justify-between border-b px-3 py-2 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="shrink-0">
                                #{w.rank}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium">
                                  {w.user.name || "—"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {w.user.email}
                                </p>
                              </div>
                            </div>
                            {winningTicketNumbers[w.rank - 1] !== undefined && (
                              <Badge variant="secondary" className="shrink-0">
                                {t("detail.ticket")} #
                                {winningTicketNumbers[w.rank - 1]}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Participants */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{t("detail.participants")}</h3>
                    {selectedGiveaway.status !== GiveawayStatus.DRAWN &&
                      selectedGiveaway.status !== GiveawayStatus.CANCELLED && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsAddParticipantOpen(true)}
                        >
                          <UserPlus className="mr-1 h-3.5 w-3.5" />
                          {t("detail.addParticipant")}
                        </Button>
                      )}
                  </div>
                  {isLoadingParticipants && (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}
                  {!isLoadingParticipants && participants.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t("detail.noParticipants")}
                    </p>
                  )}
                  {!isLoadingParticipants && participants.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-md border">
                      {participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between border-b px-3 py-2 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className="min-w-[3rem] justify-center font-mono text-xs"
                            >
                              #{p.ticketNumber}
                            </Badge>
                            <div>
                              <p className="text-sm font-medium">
                                {p.user.name || "—"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {p.user.email}
                              </p>
                            </div>
                          </div>
                          {selectedGiveaway.status !== GiveawayStatus.DRAWN &&
                            selectedGiveaway.status !==
                              GiveawayStatus.CANCELLED && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setRemoveTarget({
                                    userId: p.user.id,
                                    name: p.user.name || p.user.email,
                                  })
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="flex-wrap gap-2">
                {/* DRAFT actions: Edit, Publish, Draw Now, Delete */}
                {selectedGiveaway.status === GiveawayStatus.DRAFT && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => openEditForm(selectedGiveaway)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {t("detail.edit")}
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handlePublish(selectedGiveaway.id)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {t("detail.publish")}
                    </Button>
                    <Button onClick={() => handleDraw(selectedGiveaway.id)}>
                      <Trophy className="mr-2 h-4 w-4" />
                      {t("detail.drawNow")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedGiveaway.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("detail.deleteGiveaway")}
                    </Button>
                  </>
                )}

                {/* SCHEDULED actions: Draw Now, Cancel */}
                {selectedGiveaway.status === GiveawayStatus.SCHEDULED && (
                  <>
                    <Button onClick={() => handleDraw(selectedGiveaway.id)}>
                      <Trophy className="mr-2 h-4 w-4" />
                      {t("detail.drawNow")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(selectedGiveaway.id)}
                    >
                      {t("detail.cancelGiveaway")}
                    </Button>
                  </>
                )}

                {/* DRAWING — retry draw if stuck */}
                {selectedGiveaway.status === GiveawayStatus.DRAWING && (
                  <Button onClick={() => handleDraw(selectedGiveaway.id)}>
                    <Trophy className="mr-2 h-4 w-4" />
                    {t("detail.drawNow")}
                  </Button>
                )}

                {/* DRAWN / CANCELLED — no status actions */}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Participant Dialog */}
      <Dialog
        open={isAddParticipantOpen}
        onOpenChange={(open) => {
          setIsAddParticipantOpen(open);
          if (!open) {
            setUserSearch("");
            setUserResults([]);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("detail.addParticipant")}</DialogTitle>
            <DialogDescription>
              {t("detail.searchUserDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("detail.searchPlaceholder")}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            {isSearchingUsers && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
            {!isSearchingUsers && userResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto rounded-md border">
                {userResults.map((u) => {
                  const alreadyIn = participants.some(
                    (p) => p.user.id === u.id
                  );
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between border-b px-3 py-2 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{u.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={alreadyIn ? "secondary" : "default"}
                        disabled={alreadyIn || isAddingParticipant}
                        onClick={() => handleAddParticipant(u.id)}
                      >
                        {alreadyIn ? t("detail.alreadyIn") : t("detail.add")}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            {!isSearchingUsers &&
              userSearch.length >= 2 &&
              userResults.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t("detail.noUsersFound")}
                </p>
              )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Participant Confirmation */}
      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("detail.confirmRemoveTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("detail.confirmRemoveDesc", {
                name: removeTarget?.name ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("detail.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeTarget) {
                  handleRemoveParticipant(removeTarget.userId);
                  setRemoveTarget(null);
                }
              }}
            >
              {t("detail.confirmRemove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

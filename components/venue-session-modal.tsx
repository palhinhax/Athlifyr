"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { SessionWorkoutSelector } from "@/components/session-workout-selector";
import { format, parseISO, setHours, setMinutes } from "date-fns";

interface StaffMember {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface VenueSession {
  id: string;
  venueId: string;
  type: "CLASS" | "APPOINTMENT";
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  coachId: string | null;
  tags: string[];
}

interface VenueSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  userId?: string; // Current user ID for "Assign to me" feature
  session?: VenueSession | null;
  defaultDate?: Date;
  onSuccess: () => void;
  venueDefaults?: {
    defaultSessionCapacity: number | null;
    defaultBookingAdvanceDays: number;
    defaultBookingDeadlineMinutes: number;
    defaultCancellationDeadlineMinutes: number;
  };
}

export function VenueSessionModal({
  open,
  onOpenChange,
  venueId,
  userId,
  session,
  defaultDate,
  onSuccess,
  venueDefaults,
}: VenueSessionModalProps) {
  const t = useTranslations("venues.sessions");
  const tVenues = useTranslations("venues");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<string[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    tags: "",
    isRecurring: false,
    bookingAdvanceDays: "4",
    cancellationDeadlineMinutes: "30",
  });

  // Fetch session workouts when editing
  const fetchSessionWorkouts = useCallback(async () => {
    if (!session?.id) {
      setSelectedWorkoutIds([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/venues/${venueId}/sessions/${session.id}/workouts`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedWorkoutIds(
          data.workouts?.map((w: { id: string }) => w.id) || []
        );
      }
    } catch (error) {
      console.error("Error fetching session workouts:", error);
    }
  }, [session?.id, venueId]);

  // Fetch venue staff/members (only OWNER, ADMIN, COACH - not CLIENT)
  const fetchStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/members`);
      if (!response.ok) throw new Error("Failed to fetch staff");

      const data = await response.json();
      // Filter to only show staff (OWNER, ADMIN, COACH) - exclude CLIENT role
      const staffMembers = (data.members || []).filter(
        (member: StaffMember) =>
          member.role === "OWNER" ||
          member.role === "ADMIN" ||
          member.role === "COACH"
      );
      setStaff(staffMembers);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]);
    } finally {
      setLoadingStaff(false);
    }
  }, [venueId]);

  // Reset form when modal opens/closes or session changes
  useEffect(() => {
    if (open) {
      fetchStaff();
      if (session) {
        // Editing existing session - no recurring option
        const startsAt = parseISO(session.startsAt);
        const endsAt = parseISO(session.endsAt);
        setFormData({
          title: session.title,
          description: session.description || "",
          date: format(startsAt, "yyyy-MM-dd"),
          startTime: format(startsAt, "HH:mm"),
          endTime: format(endsAt, "HH:mm"),
          capacity: session.capacity?.toString() || "",
          tags: session.tags.join(", "),
          isRecurring: false,
          bookingAdvanceDays: "4",
          cancellationDeadlineMinutes: "30",
        });
        setSelectedCoachId(session.coachId);
        fetchSessionWorkouts();
      } else {
        // Creating new session - use venue defaults
        const dateToUse = defaultDate || new Date();
        setSelectedCoachId(null);
        setFormData({
          title: "",
          description: "",
          date: format(dateToUse, "yyyy-MM-dd"),
          startTime: "09:00",
          endTime: "10:00",
          capacity: venueDefaults?.defaultSessionCapacity?.toString() || "",
          tags: "",
          isRecurring: false,
          bookingAdvanceDays:
            venueDefaults?.defaultBookingAdvanceDays.toString() || "4",
          cancellationDeadlineMinutes:
            venueDefaults?.defaultCancellationDeadlineMinutes.toString() ||
            "30",
        });
        setSelectedWorkoutIds([]);
      }
    }
  }, [
    open,
    session,
    defaultDate,
    fetchSessionWorkouts,
    fetchStaff,
    venueDefaults?.defaultSessionCapacity,
    venueDefaults?.defaultBookingAdvanceDays,
    venueDefaults?.defaultCancellationDeadlineMinutes,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build datetime from date and time
      const [startHour, startMinute] = formData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = formData.endTime.split(":").map(Number);
      const baseDate = new Date(formData.date);

      const startsAt = setMinutes(setHours(baseDate, startHour), startMinute);
      const endsAt = setMinutes(setHours(baseDate, endHour), endMinute);

      // Validate times
      if (endsAt <= startsAt) {
        toast({
          title: tCommon("error"),
          description: t("endTimeError"),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Parse tags
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload: {
        type: string;
        title: string;
        description: string | null;
        startsAt: string;
        endsAt: string;
        capacity: number | null;
        tags: string[];
        bookingAdvanceDays: number;
        cancellationDeadlineMinutes: number;
        coachId?: string | null;
        isRecurring?: boolean;
        recurringWeeks?: number;
      } = {
        type: "CLASS", // Always use CLASS as the default type
        title: formData.title,
        description: formData.description || null,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
        tags,
        bookingAdvanceDays: parseInt(formData.bookingAdvanceDays, 10),
        cancellationDeadlineMinutes: parseInt(
          formData.cancellationDeadlineMinutes,
          10
        ),
        coachId: selectedCoachId,
      };

      // Add recurring info only for new sessions (creates 52 weeks by default)
      if (!session && formData.isRecurring) {
        payload.isRecurring = true;
      }

      const url = session
        ? `/api/venues/${venueId}/sessions/${session.id}`
        : `/api/venues/${venueId}/sessions`;

      const method = session ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save session");
      }

      const result = await response.json();
      const sessionId = session?.id || result.id;
      const sessionsCreated = result.count || 1;

      // Save workout assignments if session exists (not for recurring bulk creation)
      if (sessionId && !formData.isRecurring) {
        await fetch(`/api/venues/${venueId}/sessions/${sessionId}/workouts`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workoutIds: selectedWorkoutIds }),
        });
      }

      toast({
        title: session
          ? t("sessionUpdated")
          : sessionsCreated > 1
            ? t("sessionsCreated", { count: sessionsCreated })
            : t("sessionCreated"),
        variant: "default",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        title: tCommon("error"),
        description:
          error instanceof Error ? error.message : "Failed to save session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {session ? t("editSession") : t("createSession")}
          </DialogTitle>
          <DialogDescription>
            {session
              ? t("editSessionDescription")
              : t("createSessionDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t("sessionTitle")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t("sessionTitlePlaceholder")}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t("sessionDescription")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("sessionDescriptionPlaceholder")}
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">{t("date")}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          {/* Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">{t("startTime")}</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">{t("endTime")}</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">{t("capacity")}</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              placeholder={t("capacityPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("capacityHint")}</p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">{t("tags")}</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder={t("tagsPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("tagsHint")}</p>
          </div>

          {/* Professional/Coach Selection */}
          <div className="space-y-2">
            <Label>{t("assignedProfessional")}</Label>
            <div className="flex gap-2">
              <Select
                value={selectedCoachId || "none"}
                onValueChange={(value) =>
                  setSelectedCoachId(value === "none" ? null : value)
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={
                      loadingStaff
                        ? tVenues("loading")
                        : t("selectProfessional")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("noCoachAssigned")}</SelectItem>
                  {staff.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      <div className="flex items-center gap-2">
                        <span>{member.user.name || member.user.email}</span>
                        <span className="text-xs text-muted-foreground">
                          ({tVenues(`roles.${member.role}`)})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Assign to me shortcut - only show if user is in staff list and not already selected */}
              {userId &&
                !selectedCoachId &&
                staff.some((member) => member.userId === userId) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCoachId(userId)}
                    className="whitespace-nowrap"
                  >
                    {t("assignToMe")}
                  </Button>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("assignedProfessionalHint")}
            </p>
          </div>

          {/* Workout Assignment - Only for single sessions (not recurring) */}
          {!formData.isRecurring && (
            <div className="space-y-4 rounded-lg border p-4">
              <SessionWorkoutSelector
                venueId={venueId}
                sessionId={session?.id}
                selectedWorkoutIds={selectedWorkoutIds}
                onSelectionChange={setSelectedWorkoutIds}
                locale={locale}
              />
            </div>
          )}

          {/* Booking Rules */}
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="text-sm font-medium">{t("bookingRules")}</h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bookingAdvanceDays">
                  {t("bookingAdvanceDays")}
                </Label>
                <Input
                  id="bookingAdvanceDays"
                  type="number"
                  min="0"
                  value={formData.bookingAdvanceDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bookingAdvanceDays: e.target.value,
                    })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t("bookingAdvanceDaysHint")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationDeadlineMinutes">
                  {t("cancellationDeadlineMinutes")}
                </Label>
                <Input
                  id="cancellationDeadlineMinutes"
                  type="number"
                  min="0"
                  value={formData.cancellationDeadlineMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cancellationDeadlineMinutes: e.target.value,
                    })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t("cancellationDeadlineMinutesHint")}
                </p>
              </div>
            </div>
          </div>

          {/* Recurring Sessions - only for new sessions */}
          {!session && (
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRecurring: checked === true })
                  }
                />
                <div className="flex flex-col">
                  <Label htmlFor="isRecurring" className="cursor-pointer">
                    {t("recurringSession")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("recurringHint")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {session ? tCommon("save") : tCommon("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

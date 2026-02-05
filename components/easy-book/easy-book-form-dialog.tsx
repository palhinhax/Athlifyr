"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { pt, enUS, es, fr, de, it, Locale } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Calendar, Clock, User } from "lucide-react";

const localeMap: Record<string, Locale> = {
  pt: pt,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
};

interface SessionInfo {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  hasActiveSubscription: boolean;
  isMember: boolean;
}

interface EasyBookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  venueName: string;
  session: SessionInfo | null;
  locale: string;
  user: UserData | null;
  onSuccess: () => void;
}

export function EasyBookFormDialog({
  open,
  onOpenChange,
  venueId,
  venueName,
  session,
  locale,
  user,
  onSuccess,
}: EasyBookFormDialogProps) {
  const t = useTranslations("easyBook.bookingForm");
  const { toast } = useToast();
  const dateLocale = localeMap[locale] || enUS;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isGuestBooking = !user;

  const validateForm = () => {
    // For logged-in users, no validation needed
    if (!isGuestBooking) return true;

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("invalidEmail");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !session) return;

    setIsSubmitting(true);

    try {
      const endpoint = isGuestBooking
        ? `/api/venues/${venueId}/sessions/${session.id}/easy-book`
        : `/api/venues/${venueId}/sessions/${session.id}/book`;

      const body = isGuestBooking
        ? {
            guestName: formData.name.trim(),
            guestEmail: formData.email.trim(),
            guestPhone: formData.phone.trim(),
          }
        : {};

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = t("errorDescription");
        if (data.reason === "SESSION_FULL") {
          errorMessage = t("sessionFull");
        } else if (data.reason === "ALREADY_BOOKED") {
          errorMessage = t("alreadyBooked");
        }
        throw new Error(errorMessage);
      }

      toast({
        title: t("success"),
        description: t("successDescription"),
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "" });
      onSuccess();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  const sessionStart = parseISO(session.startsAt);
  const sessionEnd = parseISO(session.endsAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{venueName}</DialogDescription>
        </DialogHeader>

        {/* Session Info */}
        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="font-medium">{session.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(sessionStart, "PPP", { locale: dateLocale })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {format(sessionStart, "HH:mm", { locale: dateLocale })} -{" "}
              {format(sessionEnd, "HH:mm", { locale: dateLocale })}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info Display (for logged-in users) */}
          {user && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.name || user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Guest Form Fields */}
          {isGuestBooking && (
            <>
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("namePlaceholder")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t("emailPlaceholder")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder={t("phonePlaceholder")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("confirmBooking")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

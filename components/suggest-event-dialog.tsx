"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { SportType } from "@prisma/client";

const SPORT_TYPES = Object.values(SportType);

interface SuggestEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuggestEventDialog({
  open,
  onOpenChange,
}: Readonly<SuggestEventDialogProps>) {
  const t = useTranslations("events");
  const tSports = useTranslations("sports");
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    location: "",
    date: "",
    sportType: "",
    url: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      location: "",
      date: "",
      sportType: "",
      url: "",
    });
    setIsSuccess(false);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      resetForm();
    }
    onOpenChange(value);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.message.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/event-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          message: formData.message.trim(),
          location: formData.location.trim() || undefined,
          date: formData.date || undefined,
          sportType: formData.sportType || undefined,
          url: formData.url.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setIsSuccess(true);
    } catch {
      // Keep form open on error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <DialogHeader className="items-center">
              <DialogTitle>{t("suggest.thankYouTitle")}</DialogTitle>
              <DialogDescription className="text-center">
                {t("suggest.thankYouDesc")}
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => handleClose(false)} className="mt-2">
              {t("suggest.close")}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("suggest.title")}</DialogTitle>
              <DialogDescription>{t("suggest.description")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="suggest-title">
                  {t("suggest.eventName")} *
                </Label>
                <Input
                  id="suggest-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder={t("suggest.eventNamePlaceholder")}
                  maxLength={200}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="suggest-date">{t("suggest.date")}</Label>
                  <Input
                    id="suggest-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, date: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="suggest-sport">{t("suggest.sport")}</Label>
                  <Select
                    value={formData.sportType}
                    onValueChange={(v) =>
                      setFormData((f) => ({ ...f, sportType: v }))
                    }
                  >
                    <SelectTrigger id="suggest-sport">
                      <SelectValue
                        placeholder={t("suggest.sportPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORT_TYPES.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {tSports(sport)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suggest-location">
                  {t("suggest.location")}
                </Label>
                <Input
                  id="suggest-location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder={t("suggest.locationPlaceholder")}
                  maxLength={200}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suggest-url">{t("suggest.website")}</Label>
                <Input
                  id="suggest-url"
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, url: e.target.value }))
                  }
                  placeholder={t("suggest.websitePlaceholder")}
                  maxLength={500}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suggest-message">
                  {t("suggest.message")} *
                </Label>
                <Textarea
                  id="suggest-message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder={t("suggest.messagePlaceholder")}
                  rows={3}
                  maxLength={2000}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.message.trim()
                }
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("suggest.submit")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

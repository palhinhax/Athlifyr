"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
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
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send, Check } from "lucide-react";

interface ContactFormProps {
  /** Compact mode for floating chat popup */
  compact?: boolean;
  /** Show subject field (hidden in compact mode) */
  showSubject?: boolean;
  /** Callback when form is successfully submitted */
  onSuccess?: () => void;
  /** Show success state inline instead of toast */
  showInlineSuccess?: boolean;
}

type FormStep = "form" | "success";

interface FormData {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
}

export function ContactForm({
  compact = false,
  showSubject = true,
  onSuccess,
  showInlineSuccess = false,
}: ContactFormProps) {
  const { data: session } = useSession();
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const [step, setStep] = useState<FormStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "question",
    subject: "",
    message: "",
  });

  // Check if user is logged in
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";

  // Pre-fill form data when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        name: userName,
        email: userEmail,
      }));
    }
  }, [isLoggedIn, userName, userEmail]);

  // Get type-specific placeholder for message
  const MESSAGE_PLACEHOLDER_KEYS: Record<string, string> = {
    addEvent: "form.placeholders.addEvent",
    addVenue: "form.placeholders.addVenue",
  };
  const messagePlaceholder = t(
    MESSAGE_PLACEHOLDER_KEYS[formData.type] ?? "form.messagePlaceholder"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = isLoggedIn ? userName : formData.name;
    const email = isLoggedIn ? userEmail : formData.email;

    const missingRequired =
      !name ||
      !email ||
      !formData.message ||
      (showSubject && !formData.subject);
    if (missingRequired) {
      toast({
        variant: "destructive",
        title: t("toast.requiredFields"),
        description: t("toast.requiredFieldsDesc"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          type: formData.type,
          subject: showSubject
            ? formData.subject
            : `[Quick Chat] ${formData.type}`,
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      if (showInlineSuccess) {
        setStep("success");
      } else {
        toast({
          title: t("toast.success"),
          description: t("toast.successDesc"),
        });

        // Reset form
        setFormData({
          name: isLoggedIn ? userName : "",
          email: isLoggedIn ? userEmail : "",
          type: "question",
          subject: "",
          message: "",
        });
      }

      onSuccess?.();
    } catch {
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("toast.errorDesc"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("form");
    setFormData({
      name: isLoggedIn ? userName : "",
      email: isLoggedIn ? userEmail : "",
      type: "question",
      subject: "",
      message: "",
    });
  };

  // Success state (inline)
  if (step === "success" && showInlineSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h4 className="mb-2 text-lg font-semibold">{t("toast.success")}</h4>
        <p className="mb-4 text-sm text-muted-foreground">
          {t("toast.successDesc")}
        </p>
        <Button variant="outline" onClick={resetForm}>
          {tCommon("close")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-4" : "space-y-6"}
    >
      {/* Welcome message (compact mode only) */}
      {compact && (
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            {isLoggedIn
              ? t("welcomeMessageLoggedIn", { name: userName.split(" ")[0] })
              : t("welcomeMessage")}
          </p>
        </div>
      )}

      {/* Name - only show for non-logged in users */}
      {!isLoggedIn && (
        <div className={compact ? "space-y-2" : ""}>
          <Label htmlFor="contact-name" className={compact ? "text-sm" : ""}>
            {t("form.name")} *
          </Label>
          <Input
            id="contact-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t("form.namePlaceholder")}
            required
            className={compact ? "h-9" : ""}
          />
        </div>
      )}

      {/* Email - only show for non-logged in users */}
      {!isLoggedIn && (
        <div className={compact ? "space-y-2" : ""}>
          <Label htmlFor="contact-email" className={compact ? "text-sm" : ""}>
            {t("form.email")} *
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder={t("form.emailPlaceholder")}
            required
            className={compact ? "h-9" : ""}
          />
        </div>
      )}

      {/* Type */}
      <div className={compact ? "space-y-2" : ""}>
        <Label htmlFor="contact-type" className={compact ? "text-sm" : ""}>
          {t("form.type")} *
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger id="contact-type" className={compact ? "h-9" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="question">{t("form.types.question")}</SelectItem>
            <SelectItem value="addEvent">{t("form.types.addEvent")}</SelectItem>
            <SelectItem value="addVenue">{t("form.types.addVenue")}</SelectItem>
            <SelectItem value="suggestion">
              {t("form.types.suggestion")}
            </SelectItem>
            <SelectItem value="bug">{t("form.types.bug")}</SelectItem>
            <SelectItem value="feedback">{t("form.types.feedback")}</SelectItem>
            <SelectItem value="other">{t("form.types.other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subject - only show in full page mode */}
      {showSubject && (
        <div>
          <Label htmlFor="contact-subject">{t("form.subject")} *</Label>
          <Input
            id="contact-subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            placeholder={t("form.subjectPlaceholder")}
            required
          />
        </div>
      )}

      {/* Message */}
      <div className={compact ? "space-y-2" : ""}>
        <Label htmlFor="contact-message" className={compact ? "text-sm" : ""}>
          {t("form.message")} *
        </Label>
        <Textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder={messagePlaceholder}
          required
          className={compact ? "min-h-[80px] resize-none" : "min-h-[150px]"}
        />
        {!compact && (
          <p className="mt-1 text-xs text-muted-foreground">
            {t("form.messageHelper")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          isSubmitting ||
          (!isLoggedIn && (!formData.name || !formData.email)) ||
          !formData.message ||
          (showSubject && !formData.subject)
        }
        className="w-full gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("form.submitting")}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t("form.submit")}
          </>
        )}
      </Button>
    </form>
  );
}

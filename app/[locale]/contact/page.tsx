"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send, Mail, MessageSquare, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const { data: session } = useSession();
  const t = useTranslations("common.contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    type: "suggestion",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
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
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast({
        title: t("toast.success"),
        description: t("toast.successDesc"),
      });

      // Reset form
      setFormData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        type: "suggestion",
        subject: "",
        message: "",
      });
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

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Contact Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center p-6 text-center">
          <MessageSquare className="mb-3 h-8 w-8 text-primary" />
          <h3 className="mb-1 font-semibold">{t("cards.suggestions")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("cards.suggestionsDesc")}
          </p>
        </Card>

        <Card className="flex flex-col items-center p-6 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-orange-500" />
          <h3 className="mb-1 font-semibold">{t("cards.reportProblem")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("cards.reportProblemDesc")}
          </p>
        </Card>

        <Card className="flex flex-col items-center p-6 text-center">
          <Mail className="mb-3 h-8 w-8 text-blue-500" />
          <h3 className="mb-1 font-semibold">{t("cards.questions")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("cards.questionsDesc")}
          </p>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">{t("form.name")} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("form.namePlaceholder")}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">{t("form.email")} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={t("form.emailPlaceholder")}
              required
            />
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">{t("form.type")} *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="suggestion">{t("form.types.suggestion")}</option>
              <option value="bug">{t("form.types.bug")}</option>
              <option value="question">{t("form.types.question")}</option>
              <option value="feedback">{t("form.types.feedback")}</option>
              <option value="other">{t("form.types.other")}</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">{t("form.subject")} *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder={t("form.subjectPlaceholder")}
              required
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">{t("form.message")} *</Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder={t("form.messagePlaceholder")}
              className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {t("form.messageHelper")}
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("form.submitting")}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t("form.submit")}
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          {t("footer.directContact")}{" "}
          <a
            href="mailto:hello@athlifyr.com"
            className="text-primary hover:underline"
          >
            hello@athlifyr.com
          </a>
        </p>
        <p className="mt-2">
          {t("footer.responseTime")} <strong>{t("footer.hours")}</strong>
        </p>
      </div>
    </div>
  );
}

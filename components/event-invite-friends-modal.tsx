"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Check, Link2, Copy, CheckCheck } from "lucide-react";
import Image from "next/image";
import {
  PremiumModal,
  PremiumModalBody,
  PremiumModalFooter,
} from "@/components/ui/premium-modal";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

interface Friend {
  id: string;
  name: string | null;
  image: string | null;
  username?: string | null;
}

interface EventInviteFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
}

export function EventInviteFriendsModal({
  open,
  onOpenChange,
  eventId,
  eventTitle,
  eventSlug,
}: EventInviteFriendsModalProps) {
  const t = useTranslations("events.inviteModal");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const eventUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${eventSlug}`
      : `/events/${eventSlug}`;

  // Fetch friends when modal opens
  useEffect(() => {
    if (!open) return;
    setSelected(new Set());
    setSearch("");
    setSent(false);
    setIsLoading(true);

    fetch("/api/friends?type=all")
      .then((r) => r.json())
      .then((data: Friend[]) => {
        setFriends(data);
      })
      .catch(() => setFriends([]))
      .finally(() => setIsLoading(false));
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return friends;
    const q = search.toLowerCase();
    return friends.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.username?.toLowerCase().includes(q)
    );
  }, [friends, search]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((f) => f.id)));
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (selected.size === 0 || isSending) return;
    setIsSending(true);
    try {
      await fetch(`/api/events/${eventId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [...selected] }),
      });
      setSent(true);
      setTimeout(() => onOpenChange(false), 1500);
    } finally {
      setIsSending(false);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${eventTitle} — ${eventUrl}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(eventTitle)}`;

  return (
    <PremiumModal open={open} onOpenChange={onOpenChange} size="max-w-2xl">
      {/* Custom header to match design */}
      <div className="flex items-center justify-between px-8 pb-5 pt-8">
        <h2 className="font-headline text-2xl font-black tracking-tight text-foreground">
          {t("title", { event: eventTitle })}
        </h2>
        <DialogPrimitive.Close className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-foreground focus:outline-none">
          ✕
        </DialogPrimitive.Close>
      </div>

      <PremiumModalBody className="space-y-7 px-8 pb-6 pt-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-2xl border-2 border-transparent bg-surface-container-low py-4 pl-12 pr-5 text-sm font-medium placeholder:text-muted-foreground/60 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {/* Friend list */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
              {t("recentConnections")}
            </h3>
            {filtered.length > 0 && (
              <button
                onClick={selectAll}
                className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary hover:underline"
              >
                {selected.size === filtered.length
                  ? t("deselectAll")
                  : t("selectAll")}
              </button>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {search ? t("noResults") : t("noFriends")}
            </p>
          )}

          <div className="space-y-3">
            {filtered.map((friend) => {
              const isSelected = selected.has(friend.id);
              return (
                <button
                  key={friend.id}
                  onClick={() => toggleSelect(friend.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary/20 bg-primary/5 shadow-sm"
                      : "border-transparent hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-surface-container-high bg-surface-container-low">
                      {friend.image ? (
                        <Image
                          src={friend.image}
                          alt={friend.name || ""}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                          {friend.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-headline text-base font-bold text-foreground">
                        {friend.name}
                      </p>
                      {friend.username && (
                        <p className="text-sm text-muted-foreground">
                          @{friend.username}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary shadow-[0_4px_12px_rgba(232,93,4,0.3)]"
                        : "border-surface-container-highest"
                    }`}
                  >
                    {isSelected && (
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Unique event link */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
            {t("eventLink")}
          </h3>
          <div className="flex items-center gap-3 rounded-2xl border border-surface-container-high bg-surface-container-lowest p-2.5">
            <Link2 className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-sm font-medium text-foreground">
              {eventUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-surface-container-high bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:bg-surface-container-lowest hover:shadow-md active:scale-95"
            >
              {copied ? (
                <>
                  <CheckCheck className="h-4 w-4" />
                  {t("copied")}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {t("copy")}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Quick share */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
            {t("quickShare")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-surface-container-high p-4 transition-all hover:bg-surface-container-lowest hover:shadow-sm"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/10 text-xl font-bold text-[#25D366]">
                W
              </div>
              <span className="text-sm font-bold text-foreground">
                WhatsApp
              </span>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-surface-container-high p-4 transition-all hover:bg-surface-container-lowest hover:shadow-sm"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0088CC]/10 text-xl font-bold text-[#0088CC]">
                T
              </div>
              <span className="text-sm font-bold text-foreground">
                Telegram
              </span>
            </a>
          </div>
        </section>
      </PremiumModalBody>

      <PremiumModalFooter className="px-8 py-6">
        <button
          onClick={handleSend}
          disabled={selected.size === 0 || isSending || sent}
          className="w-full rounded-2xl bg-primary py-5 font-headline text-lg font-black tracking-tight text-white shadow-[0_12px_40px_rgba(232,93,4,0.25)] transition-all hover:shadow-[0_16px_50px_rgba(232,93,4,0.35)] hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          {sent
            ? t("sent")
            : isSending
              ? t("sending")
              : selected.size > 0
                ? t("sendInvites", { count: selected.size })
                : t("selectFriends")}
        </button>
      </PremiumModalFooter>
    </PremiumModal>
  );
}

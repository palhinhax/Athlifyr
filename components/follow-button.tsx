"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FollowButtonProps {
  readonly userId: string;
  readonly initialFollowing?: boolean;
  readonly variant?: "default" | "outline" | "ghost" | "pill";
  readonly size?: "sm" | "default" | "lg";
  readonly onFollowChange?: (following: boolean) => void;
}

export function FollowButton({
  userId,
  initialFollowing = false,
  variant = "default",
  size = "sm",
  onFollowChange,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const t = useTranslations("follow");
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: t("loginRequired"),
        description: t("loginRequiredDesc"),
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const res = await fetch(`/api/follow/${userId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setIsFollowing(false);
          onFollowChange?.(false);
        } else {
          const error = await res.json();
          toast({
            variant: "destructive",
            title: t("error"),
            description: error.error || t("unfollowError"),
          });
        }
      } else {
        // Follow
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (res.ok) {
          setIsFollowing(true);
          onFollowChange?.(true);
        } else {
          const error = await res.json();
          toast({
            variant: "destructive",
            title: t("error"),
            description: error.error || t("followError"),
          });
        }
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("genericError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button for own profile
  if (session?.user?.id === userId) return null;

  if (variant === "pill") {
    return (
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
          isFollowing
            ? "border-muted-foreground/20 bg-muted text-muted-foreground hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            : "border-primary/20 text-primary hover:bg-primary/5"
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isFollowing ? (
          t("following")
        ) : (
          t("follow")
        )}
      </button>
    );
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size={size}
      onClick={handleFollow}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          {t("following")}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {t("follow")}
        </>
      )}
    </Button>
  );
}

"use client";

import Image from "next/image";
import { MessageCircleIcon, MoreHorizontal, Ban } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/follow-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface PublicProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  stats: {
    upcomingEvents: number;
    pastEvents: number;
    followersCount: number;
    followingCount: number;
  };
  isFollowing: boolean;
  isLoggedIn: boolean;
}

export function PublicProfileHeader({
  user,
  stats,
  isFollowing,
  isLoggedIn,
}: PublicProfileHeaderProps) {
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("follow");
  const tBlock = useTranslations("block");
  const tProfile = useTranslations("profile");
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlockUser = async () => {
    setIsBlocking(true);
    try {
      const res = await fetch("/api/users/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: user.id }),
      });

      if (res.ok) {
        toast({
          title: tBlock("blockSuccess"),
          description: tBlock("blockSuccessDesc"),
        });
        setBlockDialogOpen(false);
        router.refresh();
      } else {
        const error = await res.json();
        toast({
          variant: "destructive",
          title: tBlock("blockError"),
          description: error.error || tBlock("blockError"),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: tBlock("blockError"),
        description: tBlock("blockError"),
      });
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:items-start">
      {/* Profile Image */}
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-muted">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {isLoggedIn && (
              <>
                {/* Message button - always show for logged in users */}
                <>
                  {/* Desktop: Open chat widget */}
                  <Button
                    variant="outline"
                    onClick={() => setShowChatWidget(true)}
                    className="hidden gap-2 md:inline-flex"
                  >
                    <MessageCircleIcon className="h-4 w-4" />
                    {t("sendMessage")}
                  </Button>
                  {/* Mobile: Navigate to chat page */}
                  <Link
                    href={`/chat?startWith=${user.id}`}
                    className="md:hidden"
                  >
                    <Button variant="outline" className="gap-2">
                      <MessageCircleIcon className="h-4 w-4" />
                      {t("sendMessage")}
                    </Button>
                  </Link>
                </>

                <FollowButton userId={user.id} initialFollowing={isFollowing} />

                {/* Block user dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setBlockDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      {tBlock("blockUser")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.upcomingEvents}
            </div>
            <div className="text-sm text-muted-foreground">
              {tProfile("upcomingEvents")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.pastEvents}
            </div>
            <div className="text-sm text-muted-foreground">
              {tProfile("pastEvents")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.followersCount}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("followers")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.followingCount}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("following")}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget - Desktop only */}
      {showChatWidget && (
        <ChatWidget
          recipientId={user.id}
          recipientName={user.name}
          recipientImage={user.image}
          onClose={() => setShowChatWidget(false)}
        />
      )}

      {/* Block User Confirmation Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tBlock("blockDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tBlock("blockDialog.description", { name: user.name || "User" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBlocking}>
              {tBlock("blockDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockUser}
              disabled={isBlocking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBlocking ? "..." : tBlock("blockDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

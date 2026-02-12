"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebPush } from "@/hooks/use-web-push";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function WebPushToggle() {
  const { isSubscribed, isLoading, isSupported, subscribe, unsubscribe } =
    useWebPush();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description:
          "Push notifications are not supported in your browser. Try Chrome, Firefox, or Edge.",
        variant: "destructive",
      });
      return;
    }

    const success = isSubscribed ? await unsubscribe() : await subscribe();

    if (success) {
      toast({
        title: isSubscribed
          ? "Notifications Disabled"
          : "Notifications Enabled",
        description: isSubscribed
          ? "You will no longer receive browser notifications"
          : "You will now receive browser notifications for new messages",
      });
    } else {
      toast({
        title: "Error",
        description:
          "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Don't render anything until mounted on client
  if (!mounted || !isSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={isLoading}
            className="relative"
          >
            {isSubscribed ? (
              <Bell className="h-5 w-5" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
            {isSubscribed && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-green-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isSubscribed
              ? "Disable browser notifications"
              : "Enable browser notifications"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

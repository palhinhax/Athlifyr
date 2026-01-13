"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Friend {
  id: string;
  name: string | null;
  image: string | null;
}

interface FriendsGoingProps {
  friends: Friend[];
  totalCount: number;
}

export function FriendsGoing({ friends, totalCount }: FriendsGoingProps) {
  if (totalCount === 0) return null;

  const displayedFriends = friends.slice(0, 5);
  const remainingCount = totalCount - displayedFriends.length;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 transition-colors hover:bg-green-500/20">
            <div className="flex -space-x-2">
              {displayedFriends.map((friend) => (
                <Link
                  key={friend.id}
                  href={`/user/${friend.id}`}
                  className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-background bg-muted transition-opacity hover:opacity-80"
                >
                  {friend.image ? (
                    <Image
                      src={friend.image}
                      alt={friend.name || "Amigo"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                      {friend.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </Link>
              ))}
              {remainingCount > 0 && (
                <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                  +{remainingCount}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              {totalCount === 1 ? "1 amigo vai" : `${totalCount} amigos vão`}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <div className="space-y-1">
            {friends.map((friend) => (
              <Link
                key={friend.id}
                href={`/user/${friend.id}`}
                className="block text-sm transition-colors hover:text-primary"
              >
                {friend.name}
              </Link>
            ))}
            {remainingCount > 0 && (
              <p className="text-xs text-muted-foreground">
                e mais {remainingCount}...
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

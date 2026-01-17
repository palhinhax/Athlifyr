import { getSportIcon } from "@/lib/sport-config";
import { sportTypeLabels } from "@/lib/event-utils";
import { cn } from "@/lib/utils";
import { SportType } from "@prisma/client";

interface SportBadgeProps {
  sportType: SportType | string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function SportBadge({
  sportType,
  className,
  size = "md",
  showIcon = true,
}: SportBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-xs sm:text-sm gap-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-primary font-medium text-primary-foreground",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <span className="text-base leading-none">
          {getSportIcon(sportType)}
        </span>
      )}
      <span>{sportTypeLabels[sportType as SportType]}</span>
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveTab {
  value: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

interface ResponsiveTabsProps {
  tabs: ResponsiveTab[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

interface ResponsiveTabsContentProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTabs({
  tabs,
  value,
  onValueChange,
  className,
}: ResponsiveTabsProps) {
  return (
    <div
      className={cn(
        "grid w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        `grid-cols-${tabs.length}`,
        className
      )}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-sm px-1 py-1.5 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm",
            value === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
        >
          <span className="h-4 w-4 shrink-0 [&>svg]:h-4 [&>svg]:w-4">
            {tab.icon}
          </span>
          <span className="hidden sm:inline">{tab.label}</span>
          {tab.badge}
        </button>
      ))}
    </div>
  );
}

export function ResponsiveTabsContent({
  value,
  activeValue,
  children,
  className,
}: ResponsiveTabsContentProps) {
  if (value !== activeValue) return null;

  return <div className={cn("mt-6", className)}>{children}</div>;
}

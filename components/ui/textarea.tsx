import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border-0 bg-card p-4 text-sm shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-border transition-all placeholder:text-muted-foreground/60 hover:ring-muted-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:ring-border",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

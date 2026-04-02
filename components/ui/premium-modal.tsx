"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * PremiumModal — M3-styled modal system for Athlifyr
 *
 * Built on top of Radix Dialog primitives with structured header / body / footer
 * sections, backdrop blur, and smooth enter/exit animations.
 *
 * Usage:
 *   <PremiumModal open={open} onOpenChange={setOpen}>
 *     <PremiumModalHeader title="Share Activity" description="optional" />
 *     <PremiumModalBody>…content…</PremiumModalBody>
 *     <PremiumModalFooter>
 *       <PremiumModalCancel>Not now</PremiumModalCancel>
 *       <PremiumModalAction>Post Activity</PremiumModalAction>
 *     </PremiumModalFooter>
 *   </PremiumModal>
 * ──────────────────────────────────────────────────────────────────────────── */

// ── Root ─────────────────────────────────────────────────────────────────────

interface PremiumModalProps extends DialogPrimitive.DialogProps {
  children: React.ReactNode;
  /** Max-width Tailwind class. Defaults to "max-w-lg". */
  size?: string;
}

function PremiumModal({
  children,
  size = "max-w-lg",
  ...props
}: PremiumModalProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-neutral-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Centering wrapper */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <DialogPrimitive.Content
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-xl border border-surface-container-high bg-white shadow-2xl",
              "max-h-[90vh]",
              "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "dark:border-neutral-800 dark:bg-neutral-900",
              size
            )}
          >
            {children}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

interface PremiumModalHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

function PremiumModalHeader({
  title,
  description,
  className,
}: PremiumModalHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-surface-container-high px-6 py-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <DialogPrimitive.Title className="font-headline text-xl font-bold tracking-tight text-foreground">
          {title}
        </DialogPrimitive.Title>
        {description && (
          <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
            {description}
          </DialogPrimitive.Description>
        )}
      </div>
      <DialogPrimitive.Close className="ml-4 flex-shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </div>
  );
}

// ── Body ─────────────────────────────────────────────────────────────────────

interface PremiumModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function PremiumModalBody({
  className,
  children,
  ...props
}: PremiumModalBodyProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-6", className)} {...props}>
      {children}
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

interface PremiumModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function PremiumModalFooter({
  className,
  children,
  ...props
}: PremiumModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-surface-container-high bg-surface-container-lowest px-6 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Action Buttons ───────────────────────────────────────────────────────────

interface PremiumModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/** Primary action button (filled, orange). */
function PremiumModalAction({
  className,
  children,
  ...props
}: PremiumModalButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(232,93,4,0.3)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Secondary / cancel button (ghost text). Closes the dialog by default. */
function PremiumModalCancel({
  className,
  children,
  ...props
}: PremiumModalButtonProps) {
  return (
    <DialogPrimitive.Close asChild>
      <button
        className={cn(
          "px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </DialogPrimitive.Close>
  );
}

// ── Trigger (re-export) ──────────────────────────────────────────────────────

const PremiumModalTrigger = DialogPrimitive.Trigger;

export {
  PremiumModal,
  PremiumModalHeader,
  PremiumModalBody,
  PremiumModalFooter,
  PremiumModalAction,
  PremiumModalCancel,
  PremiumModalTrigger,
};

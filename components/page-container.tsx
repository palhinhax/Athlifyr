import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Vertical padding preset.
   * - "md"  → py-8  (default — most pages)
   * - "lg"  → py-12 (pages with a hero/header image above)
   * - "sm"  → py-6  (compact pages)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional inner max-width constraint.
   * Use this when the content should not stretch full-width on large screens.
   * e.g. "max-w-4xl" for settings/legal, "max-w-6xl" for profile.
   */
  maxWidth?: string;
}

/**
 * PageContainer — consistent horizontal spacing and max-width for all pages.
 *
 * Uses the Tailwind `container` class which is already configured in
 * tailwind.config.ts with `center: true` and `padding: { DEFAULT: "1rem", sm: "2rem" }`.
 * This means `container` already provides `mx-auto` + responsive horizontal padding.
 *
 * Usage:
 *   <PageContainer>...</PageContainer>
 *   <PageContainer size="lg">...</PageContainer>
 *   <PageContainer maxWidth="max-w-4xl">...</PageContainer>
 */
export function PageContainer({
  children,
  className,
  size = "md",
  maxWidth,
}: PageContainerProps) {
  const verticalPadding = {
    sm: "py-6",
    md: "py-8",
    lg: "py-12",
  }[size];

  return (
    <div className={cn("container", verticalPadding, className)}>
      {maxWidth ? (
        <div className={cn("mx-auto", maxWidth)}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}

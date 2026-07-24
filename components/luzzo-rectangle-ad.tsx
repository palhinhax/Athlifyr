import { cn } from "@/lib/utils";

interface LuzzoRectangleAdProps {
  readonly className?: string;
  readonly src?: string;
}

const DEFAULT_LUZZO_RECTANGLE_SRC =
  "https://www.luzzo-eletronica.com/embed/anuncio/retangulo";

/**
 * Sidebar advertising card. Renders a 250px-tall Luzzo ad slot inside the
 * rounded card frame used by the other event sidebar cards, edge-to-edge with
 * no margin or padding.
 */
export function LuzzoRectangleAd({
  className,
  src = DEFAULT_LUZZO_RECTANGLE_SRC,
}: LuzzoRectangleAdProps) {
  return (
    <div
      className={cn(
        "flex justify-center overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_8px_32px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <iframe
        src={src}
        title="Luzzo"
        loading="lazy"
        scrolling="no"
        width="100%"
        height={250}
        className="h-[250px] w-full border-0"
      />
    </div>
  );
}

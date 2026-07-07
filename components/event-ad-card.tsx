interface EventAdCardProps {
  /** Ad embed src. Defaults to the Voga mixed-format 336x280 slot. */
  readonly src?: string;
  /** Optional label shown above the ad (e.g. "Publicidade"). */
  readonly label?: string;
}

const DEFAULT_AD_SRC =
  "https://voga-services.com/embed/anuncios?formato=336x280&tipo=misto";

/**
 * Sidebar advertising card. Renders a fixed 336x280 ad slot inside a
 * full-width card that matches the other event sidebar cards.
 */
export function EventAdCard({ src = DEFAULT_AD_SRC, label }: EventAdCardProps) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
      {label && (
        <p className="text-on-surface-variant mb-3 text-center text-[0.625rem] font-bold uppercase tracking-widest">
          {label}
        </p>
      )}
      <div className="flex w-full justify-center">
        <iframe
          src={src}
          width={336}
          height={280}
          loading="lazy"
          scrolling="no"
          title="Voga — anúncios"
          className="max-w-full overflow-hidden border-0"
        />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface LuzzoLeaderboardAdProps {
  readonly className?: string;
  readonly src?: string;
}

const DEFAULT_LUZZO_LEADERBOARD_SRC =
  "https://www.luzzo-eletronica.com/embed/anuncio/faixa";

export function LuzzoLeaderboardAd({
  className,
  src = DEFAULT_LUZZO_LEADERBOARD_SRC,
}: LuzzoLeaderboardAdProps) {
  return (
    <section
      data-site-ad
      className={cn("w-full bg-background py-3", className)}
    >
      <div className="container flex justify-center overflow-hidden">
        <iframe
          src={src}
          title="Luzzo"
          loading="lazy"
          scrolling="no"
          width={970}
          height={90}
          className="h-[90px] w-full max-w-[970px] border-0"
        />
      </div>
    </section>
  );
}

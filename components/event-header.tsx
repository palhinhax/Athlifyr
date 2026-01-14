import Image from "next/image";
import { SportType } from "@prisma/client";
import { sportTypeLabels } from "@/lib/event-utils";

interface EventHeaderProps {
  title: string;
  imageUrl: string | null;
  sportTypes: SportType[];
}

export function EventHeader({ title, imageUrl, sportTypes }: EventHeaderProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
      <Image
        src={imageUrl || "/placeholder-event.jpg"}
        alt={title}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <div className="container mx-auto">
          <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
            {sportTypes.map((sportType) => (
              <div
                key={sportType}
                className="inline-block rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg sm:text-sm"
              >
                {sportTypeLabels[sportType]}
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

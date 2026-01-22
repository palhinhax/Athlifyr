import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/event-utils";
import { FriendsGoing } from "@/components/friends-going";
import { useLocale } from "next-intl";

interface EventMetaInfoProps {
  startDate: Date;
  endDate: Date | null;
  city: string;
  country: string;
  friendsGoing: Array<{
    id: string;
    name: string | null;
    image: string | null;
  }>;
  friendsGoingCount: number;
}

export function EventMetaInfo({
  startDate,
  endDate,
  city,
  country,
  friendsGoing,
  friendsGoingCount,
}: EventMetaInfoProps) {
  const locale = useLocale();
  return (
    <div className="mb-6 flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2.5">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <span className="text-muted-foreground">
          {formatDate(startDate, locale)}
          {endDate && ` - ${formatDate(endDate, locale)}`}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <MapPin className="h-5 w-5 text-muted-foreground" />
        <span className="text-muted-foreground">
          {city}, {country}
        </span>
      </div>
      {friendsGoingCount > 0 && (
        <FriendsGoing friends={friendsGoing} totalCount={friendsGoingCount} />
      )}
    </div>
  );
}

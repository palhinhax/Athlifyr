import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/event-utils";
import { FriendsGoing } from "@/components/friends-going";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("events");
  const locale = useLocale();
  return (
    <div className="mb-8 grid gap-6 rounded-lg bg-muted/50 p-6 md:grid-cols-2">
      <div className="flex items-start gap-3">
        <Calendar className="mt-1 h-5 w-5 text-primary" />
        <div>
          <div className="font-medium">{t("date")}</div>
          <div className="text-muted-foreground">
            {formatDate(startDate, locale)}
            {endDate && ` - ${formatDate(endDate, locale)}`}
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 h-5 w-5 text-primary" />
        <div>
          <div className="font-medium">{t("location")}</div>
          <div className="text-muted-foreground">
            {city}, {country}
          </div>
        </div>
      </div>
      {friendsGoingCount > 0 && (
        <div className="md:col-span-2">
          <FriendsGoing friends={friendsGoing} totalCount={friendsGoingCount} />
        </div>
      )}
    </div>
  );
}

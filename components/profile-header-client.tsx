"use client";

import { ProfileImageUpload } from "@/components/profile-image-upload";
import { EventCalendar } from "@/components/event-calendar";

interface EventParticipation {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: Date;
    city: string;
    sportType: string;
  };
  variant?: {
    name: string;
    distanceKm: number | null;
  } | null;
}

interface ProfileHeaderClientProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  stats: {
    upcomingEvents: number;
    pastEvents: number;
    friendsCount: number;
    commentsCount: number;
  };
  participations: EventParticipation[];
}

export function ProfileHeaderClient({
  user,
  stats,
  participations,
}: ProfileHeaderClientProps) {
  return (
    <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:items-start">
      <ProfileImageUpload currentImage={user.image} userName={user.name} />

      <div className="flex-1 text-center md:text-left">
        <div className="mb-4 flex flex-col items-center gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <EventCalendar participations={participations} />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.upcomingEvents}
            </div>
            <div className="text-sm text-muted-foreground">
              Próximos Eventos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.pastEvents}
            </div>
            <div className="text-sm text-muted-foreground">
              Eventos Passados
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.friendsCount}
            </div>
            <div className="text-sm text-muted-foreground">Amigos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.commentsCount}
            </div>
            <div className="text-sm text-muted-foreground">Comentários</div>
          </div>
        </div>
      </div>
    </div>
  );
}

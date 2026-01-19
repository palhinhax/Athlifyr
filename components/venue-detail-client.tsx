"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VenueProfileHeader } from "@/components/venue-profile-header";
import { VenueFeed } from "@/components/venue-feed";

interface Venue {
  id: string;
  slug: string;
  name: string;
  type: string;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  address: string | null;
  city: string | null;
  country: string;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }>;
  plans: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    currency: string;
  }>;
  _count: {
    sessions: number;
    bookings: number;
  };
}

export function VenueDetailClient({
  slug,
  userId,
  userName,
  userImage,
}: {
  slug: string;
  userId?: string;
  userName?: string | null;
  userImage?: string | null;
}) {
  const t = useTranslations("venues");
  const tRoles = useTranslations("venues.roles");
  const tInfo = useTranslations("venues.info");
  const tPlans = useTranslations("venues.plans");

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is owner or admin
  const isOwnerOrAdmin = Boolean(
    userId &&
    venue?.members.some(
      (m) => m.user.id === userId && (m.role === "OWNER" || m.role === "ADMIN")
    )
  );

  // Check if user is a member (any role)
  const isMember = Boolean(
    userId && venue?.members.some((m) => m.user.id === userId)
  );

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`/api/venues/${slug}`);

        if (!response.ok) {
          throw new Error("Venue not found");
        }

        const data = await response.json();
        setVenue(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load venue");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="mb-2 text-lg font-medium">{t("venueNotFound")}</p>
          <p className="text-sm text-muted-foreground">
            {t("venueNotFoundDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Profile Header */}
      <VenueProfileHeader
        venue={venue}
        userId={userId}
        isOwnerOrAdmin={isOwnerOrAdmin}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList>
            <TabsTrigger value="feed">{t("tabs.feed")}</TabsTrigger>
            <TabsTrigger value="about">{t("tabs.about")}</TabsTrigger>
            <TabsTrigger value="plans">{tPlans("title")}</TabsTrigger>
            <TabsTrigger value="sessions">{t("tabs.sessions")}</TabsTrigger>
            <TabsTrigger value="team">{t("tabs.team")}</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed">
            <VenueFeed
              venueId={venue.id}
              userId={userId}
              userName={userName}
              userImage={userImage}
              isMember={isMember}
            />
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-2xl font-semibold">
                {tInfo("description")}
              </h2>
              <p className="text-muted-foreground">
                {venue.description || t("noDescription")}
              </p>
            </div>

            {!userId && (
              <div className="rounded-lg bg-muted p-6">
                <p className="mb-4 text-sm">{t("signInToJoin")}</p>
                <Button>{t("signIn")}</Button>
              </div>
            )}
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            {venue.plans.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">{t("noPlansAvailable")}</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {venue.plans.map((plan) => (
                  <div key={plan.id} className="rounded-lg border bg-card p-6">
                    <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                    {plan.description && (
                      <p className="mb-4 text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                    {plan.price && (
                      <p className="mb-4 text-2xl font-bold">
                        {plan.price} {plan.currency}
                        <span className="text-sm font-normal text-muted-foreground">
                          {" "}
                          / {tPlans("perMonth")}
                        </span>
                      </p>
                    )}
                    <Button className="w-full">{tPlans("subscribe")}</Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">{t("sessionsComingSoon")}</p>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            {venue.members.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">{t("noTeamMembers")}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {venue.members.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      {member.user.image ? (
                        <Image
                          src={member.user.image}
                          alt={member.user.name || "User"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {member.user.name?.[0] || "?"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tRoles(member.role)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Users,
  Calendar,
} from "lucide-react";

interface Venue {
  id: string;
  slug: string;
  name: string;
  type: string;
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
}: {
  slug: string;
  userId?: string;
}) {
  const t = useTranslations("venues");
  const tTypes = useTranslations("venues.types");
  const tRoles = useTranslations("venues.roles");
  const tInfo = useTranslations("venues.info");
  const tPlans = useTranslations("venues.plans");

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {tTypes(venue.type)}
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-bold">{venue.name}</h1>

        {/* Location */}
        {venue.city && (
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>
              {venue.address && `${venue.address}, `}
              {venue.city}, {venue.country}
            </span>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          {venue.phone && (
            <a
              href={`tel:${venue.phone}`}
              className="flex items-center gap-2 hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {venue.phone}
            </a>
          )}
          {venue.email && (
            <a
              href={`mailto:${venue.email}`}
              className="flex items-center gap-2 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              {venue.email}
            </a>
          )}
          {venue.website && (
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary"
            >
              <Globe className="h-4 w-4" />
              Website
            </a>
          )}
          {venue.instagram && (
            <a
              href={`https://instagram.com/${venue.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary"
            >
              <Instagram className="h-4 w-4" />@
              {venue.instagram.replace("@", "")}
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="plans">{tPlans("title")}</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              {tInfo("description")}
            </h2>
            <p className="text-muted-foreground">
              {venue.description || "No description available."}
            </p>

            <div className="mt-6 flex gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{venue.members.length}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{venue._count.sessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </div>
            </div>
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
                <div key={plan.id} className="rounded-lg border p-6">
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
                <div key={member.id} className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    {member.user.image ? (
                      <img
                        src={member.user.image}
                        alt={member.user.name || "User"}
                        className="h-12 w-12 rounded-full"
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
  );
}

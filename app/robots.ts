import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.athlifyr.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/settings/",
          "/chat/",
          "/notifications/",
          "/profile/",
          "/workouts/",
          "/exercises/",
          "/my-schedule/",
          "/feed/",
          "/auth/reset-password/",
          "/auth/verify/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

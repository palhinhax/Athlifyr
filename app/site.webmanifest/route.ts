import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    name: "Athlifyr - Sports Events & Community",
    short_name: "Athlifyr",
    description:
      "Discover and participate in sports events, track your progress, and connect with the sports community",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4F46E5",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["sports", "health", "lifestyle"],
    screenshots: [],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}

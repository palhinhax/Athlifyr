"use client";

import { useEffect, useState } from "react";

// Available background videos
const backgroundVideos = [
  "/promo/group-running.mp4",
  "/promo/woman-running.mp4",
  "/promo/crossfit-workout.mp4",
  "/promo/warm-up-girl.mp4",
  "/promo/promo.mp4",
];

interface AuthVideoBackgroundProps {
  children: React.ReactNode;
}

export function AuthVideoBackground({ children }: AuthVideoBackgroundProps) {
  const [videoSrc, setVideoSrc] = useState<string>(backgroundVideos[0]);

  useEffect(() => {
    // Select random video on mount
    const randomIndex = Math.floor(Math.random() * backgroundVideos.length);
    setVideoSrc(backgroundVideos[randomIndex]);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Video */}
      {videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          key={videoSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay to darken video */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

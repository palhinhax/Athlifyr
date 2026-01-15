"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CommunityPromoPage() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Autoplay failed:", err));
    }

    const overlayTimeout = setTimeout(() => {
      setShowOverlay(true);
    }, 4000);

    return () => clearTimeout(overlayTimeout);
  }, []);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/promo/group-running.mp4"
        muted
        loop
        playsInline
        preload="auto"
      />

      <div className="absolute inset-0 bg-black/40" />

      {showOverlay && (
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.5 }}
          >
            <motion.h2
              className="mb-8 text-2xl font-light tracking-[0.3em] text-white md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              TOGETHER WE ARE STRONGER
            </motion.h2>

            <motion.h1
              className="mb-6 text-7xl font-black tracking-tighter text-white md:text-9xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6,
                duration: 1,
                type: "spring",
                stiffness: 100,
              }}
            >
              COMMUNITY
            </motion.h1>

            <motion.p
              className="text-lg font-light tracking-[0.2em] text-white/90 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              FIND YOUR TRIBE • SHARE THE JOURNEY
            </motion.p>

            <motion.div
              className="mx-auto mt-12 h-px w-32 bg-white/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>
      )}

      {!isPlaying && !showOverlay && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              className="h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}

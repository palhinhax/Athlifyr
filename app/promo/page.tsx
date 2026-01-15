"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROMO_CONFIG } from "./config";

export default function PromoPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Auto-start first video
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Autoplay failed:", err));
    }

    // Setup video sequence
    const videoTimings = PROMO_CONFIG.videos.map((video, index) => {
      const startTime = PROMO_CONFIG.videos
        .slice(0, index)
        .reduce((acc, v) => acc + v.duration, 0);

      return setTimeout(() => {
        if (index < PROMO_CONFIG.videos.length - 1) {
          setCurrentVideoIndex(index + 1);
          const nextVideo = videoRefs.current[index + 1];
          nextVideo?.play().catch((err) => console.warn("Play failed:", err));
        }
      }, startTime);
    });

    // Show final overlay
    const overlayTimeout = setTimeout(() => {
      setShowOverlay(true);
    }, PROMO_CONFIG.finalOverlay.delay);

    return () => {
      videoTimings.forEach((t) => clearTimeout(t));
      clearTimeout(overlayTimeout);
    };
  }, []);

  const handleVideoClick = () => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (!currentVideo) return;

    if (isPlaying) {
      currentVideo.pause();
      setIsPlaying(false);
    } else {
      currentVideo.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      onClick={handleVideoClick}
    >
      {/* Video Layers */}
      {PROMO_CONFIG.videos.map((video, index) => (
        <motion.div
          key={video.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentVideoIndex === index ? 1 : 0,
          }}
          transition={{
            duration: PROMO_CONFIG.animation.videoFadeDuration / 1000,
          }}
        >
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            className="h-full w-full object-cover"
            src={video.src}
            muted
            playsInline
            preload="auto"
          />
        </motion.div>
      ))}

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Final Text Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: PROMO_CONFIG.animation.textFadeInDuration / 1000,
            }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: PROMO_CONFIG.animation.textFadeInDuration / 1000,
              }}
            >
              {/* Tagline */}
              <motion.h2
                className="mb-8 text-2xl font-light tracking-[0.3em] text-white md:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                {PROMO_CONFIG.finalOverlay.tagline}
              </motion.h2>

              {/* Logo - Large and bold */}
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
                {PROMO_CONFIG.finalOverlay.logo}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg font-light tracking-[0.2em] text-white/90 md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                {PROMO_CONFIG.finalOverlay.subtitle}
              </motion.p>

              {/* Decorative line */}
              <motion.div
                className="mx-auto mt-12 h-px w-32 bg-white/50"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause indicator (subtle) */}
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

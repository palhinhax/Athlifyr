"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROMO_CONFIG } from "./config";
import { Play, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

type StepId = "intro" | "message" | "features" | "cta" | "final";
type FeatureKey = "nearYou" | "filters" | "details" | "favorites" | "share";

// Default translations (English/Portuguese mix as fallback)
const DEFAULT_TRANSLATIONS = {
  intro: "Athlifyr",
  message: "Todos os eventos desportivos num só lugar.",
  featuresTitle: "Funcionalidades",
  features: {
    nearYou: "Eventos perto de ti",
    filters: "Filtros por desporto e data",
    details: "Detalhes e links diretos para inscrição",
    favorites: "Guardar favoritos",
    share: "Partilhar com amigos",
  } as Record<FeatureKey, string>,
  ctaTitle: "Encontra o teu próximo desafio",
  ctaSubtitle: "Explora • filtra • guarda • partilha",
  slogan: "one place. all events.",
  playVideo: "Tocar vídeo",
  videoLoadError: "Não foi possível carregar o vídeo",
};

function PromoContent() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [showPlayButton, setShowPlayButton] = useState<boolean>(false);
  const [showRestartButton, setShowRestartButton] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  // Get query parameters for customization
  const city = searchParams.get("city");
  const sport = searchParams.get("sport");

  const t = DEFAULT_TRANSLATIONS;

  const currentStepId = PROMO_CONFIG.steps[currentStep]?.id as StepId;

  // Handle video autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        await video.play();
        setShowPlayButton(false);
      } catch (error) {
        console.warn("Autoplay failed, showing play button", error);
        setShowPlayButton(true);
      }
    };

    // Wait for video to be ready
    if (video.readyState >= 2) {
      attemptAutoplay();
    } else {
      video.addEventListener("canplay", attemptAutoplay, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", attemptAutoplay);
    };
  }, []);

  // Timeline progression
  useEffect(() => {
    const currentStepData = PROMO_CONFIG.steps[currentStep];
    if (!currentStepData) return;

    const duration = currentStepData.duration * 1000; // Convert to milliseconds

    timeoutRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        // Loop back to start after final step
        return nextStep >= PROMO_CONFIG.steps.length ? 0 : nextStep;
      });
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStep]);

  const handlePlayVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.error("Failed to play video:", err);
      });
      setShowPlayButton(false);
    }
  };

  const handleVideoError = () => {
    console.error("Video failed to load");
    setVideoError(true);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fadeVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

  // Customize message based on query parameters
  const customMessage =
    city && sport
      ? `Encontra eventos de ${sport} em ${city}`
      : city
        ? `Encontra eventos desportivos em ${city}`
        : sport
          ? `Encontra eventos de ${sport} perto de ti`
          : t.message;

  return (
    <div
      className="group relative h-screen w-screen overflow-hidden bg-black"
      onMouseEnter={() => setShowRestartButton(true)}
      onMouseLeave={() => setShowRestartButton(false)}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
            {...(PROMO_CONFIG.video.poster && {
              poster: PROMO_CONFIG.video.poster,
            })}
            onError={handleVideoError}
          >
            <source src={PROMO_CONFIG.video.mp4} type="video/mp4" />
            {PROMO_CONFIG.video.webm && (
              <source src={PROMO_CONFIG.video.webm} type="video/webm" />
            )}
            {t.videoLoadError}
          </video>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black" />
        )}
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Play Button Fallback */}
      {showPlayButton && (
        <button
          onClick={handlePlayVideo}
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-black shadow-lg transition-all hover:scale-105 hover:bg-white"
          aria-label={t.playVideo}
        >
          <Play className="h-5 w-5" />
          <span className="font-semibold">{t.playVideo}</span>
        </button>
      )}

      {/* Restart Button (Desktop only, shows on hover) */}
      {showRestartButton && (
        <button
          onClick={handleRestart}
          className="absolute right-6 top-6 z-20 hidden items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/30 md:flex"
          aria-label="Restart"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restart</span>
        </button>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white md:px-12">
        <AnimatePresence mode="wait">
          {currentStepId === "intro" && (
            <motion.div
              key="intro"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: PROMO_CONFIG.animation.fadeInDuration }}
              className="flex flex-col items-center"
            >
              <motion.h1
                className="text-6xl font-bold tracking-tight md:text-8xl"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
              >
                {t.intro}
              </motion.h1>
            </motion.div>
          )}

          {currentStepId === "message" && (
            <motion.div
              key="message"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: PROMO_CONFIG.animation.fadeInDuration }}
              className="max-w-3xl"
            >
              <p
                className="text-3xl font-medium leading-relaxed md:text-5xl"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
              >
                {customMessage}
              </p>
            </motion.div>
          )}

          {currentStepId === "features" && (
            <motion.div
              key="features"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: PROMO_CONFIG.animation.fadeInDuration }}
              className="max-w-2xl space-y-6"
            >
              <motion.ul className="space-y-4 text-left text-2xl md:text-3xl">
                {PROMO_CONFIG.featureKeys.map((key, index) => (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * PROMO_CONFIG.animation.staggerDelay,
                      duration: PROMO_CONFIG.animation.fadeInDuration,
                    }}
                    className="flex items-start gap-3"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                  >
                    <span className="text-primary">•</span>
                    <span>{t.features[key]}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}

          {currentStepId === "cta" && (
            <motion.div
              key="cta"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: PROMO_CONFIG.animation.fadeInDuration }}
              className="max-w-3xl space-y-4"
            >
              <h2
                className="text-4xl font-bold md:text-6xl"
                style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
              >
                {t.ctaTitle}
              </h2>
              <p
                className="text-2xl font-light md:text-3xl"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                {t.ctaSubtitle}
              </p>
            </motion.div>
          )}

          {currentStepId === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1
                  className="text-7xl font-bold tracking-tight md:text-9xl"
                  style={{
                    textShadow:
                      "0 0 30px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  Athlifyr
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-2xl font-light tracking-widest md:text-3xl"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                {t.slogan}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PromoPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
      <PromoContent />
    </Suspense>
  );
}

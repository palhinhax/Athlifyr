/**
 * CrossFit Promo Configuration
 */

export const CROSSFIT_PROMO_CONFIG = {
  // Video sequence - plays in order
  videos: [
    {
      src: "/promo/crossfit-workout.mp4",
      duration: 3000, // ms
    },
    {
      src: "/promo/woman-running.mp4",
      duration: 3000,
    },
    {
      src: "/promo/group-running.mp4",
      duration: 3000,
    },
    {
      src: "/promo/promo.mp4",
      duration: 3000,
    },
  ],

  // Text overlay appears after all videos
  finalOverlay: {
    delay: 12000, // ms - after all videos
    tagline: "FIND YOUR NEXT CHALLENGE",
    logo: "ATHLIFYR",
    subtitle: "ONE PLACE. ALL sports.",
  },

  // Animation settings
  animation: {
    videoFadeDuration: 1000, // ms
    textFadeInDuration: 1500, // ms
    textStagger: 200, // ms between each text element
  },
};

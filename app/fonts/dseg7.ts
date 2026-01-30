/**
 * DSEG7 Font - 7-Segment Display Font
 *
 * Authentic 7-segment LED display font for timer
 * Source: https://github.com/keshikan/DSEG
 */

import localFont from "next/font/local";

export const dseg7 = localFont({
  src: "./DSEG7Modern-Bold.woff2",
  variable: "--font-dseg7",
  display: "swap",
  weight: "700",
});

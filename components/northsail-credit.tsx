"use client";

import Script from "next/script";

/**
 * NorthSail credit badge - loaded from the central embed.
 *
 * The badge's visuals, link and styles live in the NorthSail app
 * (`https://www.north-sail.com/embed/credit.js`) and are controlled centrally:
 * change them once there and every client site updates. This component only
 * loads the script, so Athlifyr stays consistent with the official mark and any
 * future changes.
 *
 * In React, `document.currentScript` is unavailable, so we always render an
 * explicit container and point the script at it via `data-target`.
 */
export function NorthSailCredit() {
  return (
    <>
      <div id="northsail-credit" />
      <Script
        src="https://www.north-sail.com/embed/credit.js"
        data-client="athlifyr"
        data-target="northsail-credit"
        data-variant="light"
        strategy="afterInteractive"
      />
    </>
  );
}

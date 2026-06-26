"use client";
import Script from "next/script";

export function NorthSailCredit() {
  return (
    <>
      <div id="northsail-credit" />
      <Script
        src="https://www.north-sail.com/embed/credit.js"
        data-client="athlifyr"
        data-target="northsail-credit"
        strategy="afterInteractive"
      />
    </>
  );
}

// Type declarations for Google Analytics (gtag.js)

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}

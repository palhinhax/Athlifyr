import {
  type AthliChatPromoPayload,
  type InstagramFormat,
} from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateAthliChatPromoProps {
  payload: AthliChatPromoPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T14: Athli Chat Promo
 * Announces the Athli AI assistant with a mock chat window in the center
 * Features the chat welcome screen with gradient header, Bot icon, and suggestion cards
 */
export function TemplateAthliChatPromo({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateAthliChatPromoProps) {
  const { headline, subheadline, chatSuggestions, cta, background } = payload;

  const headlineScale = getAutoFontScale(headline.length, 50);
  const subScale = getAutoFontScale(subheadline.length, 60);
  const isVertical =
    format === "STORY" || format === "REELS" || format === "TIKTOK";

  // Suggestion icons as simple SVG elements (CalendarDays, MapPin, Dumbbell, Zap)
  const suggestionIcons = [
    // CalendarDays
    <svg
      key="cal"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: "16px", height: "16px", flexShrink: 0 }}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>,
    // MapPin
    <svg
      key="map"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: "16px", height: "16px", flexShrink: 0 }}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>,
    // Dumbbell
    <svg
      key="dumb"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: "16px", height: "16px", flexShrink: 0 }}
    >
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </svg>,
    // Zap
    <svg
      key="zap"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: "16px", height: "16px", flexShrink: 0 }}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>,
  ];

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 text-center text-white">
        {/* Headline */}
        <h1
          className="mb-4 font-black uppercase leading-tight tracking-wider"
          style={{
            fontSize: `${(isVertical ? 80 : 72) * headlineScale}px`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p
          className="mb-10 font-medium leading-snug"
          style={{
            fontSize: `${40 * subScale}px`,
            textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            opacity: 0.9,
          }}
        >
          {subheadline}
        </p>

        {/* Mock Chat Window */}
        <div
          style={{
            width: isVertical ? "82%" : "72%",
            maxWidth: "680px",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
            background: "#ffffff",
          }}
        >
          {/* Chat Header - Purple Gradient */}
          <div
            style={{
              background: "linear-gradient(to right, #8b5cf6, #9333ea)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Bot Avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Bot icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "20px", height: "20px" }}
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                Athli
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.2,
                }}
              >
                O teu assistente desportivo IA
              </div>
            </div>
          </div>

          {/* Chat Welcome Body */}
          <div
            style={{
              padding: isVertical ? "24px 16px" : "20px 14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              background: "#ffffff",
            }}
          >
            {/* Bot Avatar (inside body) */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5cf6, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "28px", height: "28px" }}
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>

            {/* Welcome Text */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#111827",
                  lineHeight: 1.3,
                }}
              >
                Olá! Sou o Athli 👋
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginTop: "4px",
                  lineHeight: 1.4,
                }}
              >
                O teu assistente desportivo com IA
              </div>
            </div>

            {/* Suggestion Chips Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                width: "100%",
                maxWidth: "360px",
              }}
            >
              {chatSuggestions.slice(0, 4).map((suggestion, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    background: "#f9fafb",
                    color: "#8b5cf6",
                  }}
                >
                  {suggestionIcons[index % suggestionIcons.length]}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#374151",
                      lineHeight: 1.3,
                      fontWeight: 500,
                    }}
                  >
                    {suggestion}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "8px 14px",
                borderRadius: "20px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              Escreve a tua mensagem...
            </div>
            {/* Send button */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5cf6, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="white"
                style={{ width: "14px", height: "14px" }}
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* CTA Text */}
        {cta && (
          <p
            className="mt-8 font-semibold uppercase tracking-wider"
            style={{
              fontSize: "32px",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {cta}
          </p>
        )}
      </div>
    </BrandFrame>
  );
}

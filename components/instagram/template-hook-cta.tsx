import { type HookCtaPayload, type InstagramFormat } from "@/types/instagram";
import { getAutoFontScale } from "@/lib/instagram-export";
import { BrandFrame } from "./brand-frame";
import { BackgroundRenderer } from "./background-renderer";

interface TemplateHookCtaProps {
  payload: HookCtaPayload;
  format: InstagramFormat;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * Template T10: Hook + CTA
 * Viral TikTok format: Attention-grabbing hook → Value → Strong CTA
 * Perfect for converting viewers to followers/customers
 */
export function TemplateHookCta({
  payload,
  format,
  showGuides = false,
  showLogo = true,
}: TemplateHookCtaProps) {
  const { hook, body, cta, background } = payload;

  // Auto-scale text if too long
  const hookScale = getAutoFontScale(hook.length, 80);
  const bodyScale = getAutoFontScale(body.length, 120);

  return (
    <BrandFrame
      format={format}
      showGuides={showGuides}
      showLogo={showLogo}
      background={<BackgroundRenderer background={background} />}
      isTransparent={background.type === "transparent"}
    >
      <div className="relative z-10 flex flex-1 flex-col justify-between px-12 py-24 text-white">
        {/* Hook - Top third (attention grabber) */}
        <div className="flex-1">
          <div className="flex h-full items-start justify-center pt-12">
            <h1
              className="text-center font-black uppercase leading-[0.95] tracking-tight"
              style={{
                fontSize: `${130 * hookScale}px`,
                textShadow: "0 6px 24px rgba(0,0,0,0.6)",
              }}
            >
              {hook}
            </h1>
          </div>
        </div>

        {/* Body - Middle (value proposition) */}
        <div className="flex-1">
          <div className="flex h-full items-center justify-center">
            <p
              className="text-center font-semibold leading-snug"
              style={{
                fontSize: `${56 * bodyScale}px`,
                textShadow: "0 4px 16px rgba(0,0,0,0.5)",
              }}
            >
              {body}
            </p>
          </div>
        </div>

        {/* CTA - Bottom (call to action) */}
        <div className="flex-1">
          <div className="flex h-full items-end justify-center pb-12">
            <div
              className="rounded-full bg-white px-16 py-6 font-black uppercase text-black shadow-2xl"
              style={{
                fontSize: "48px",
                letterSpacing: "0.05em",
              }}
            >
              {cta}
            </div>
          </div>
        </div>
      </div>
    </BrandFrame>
  );
}

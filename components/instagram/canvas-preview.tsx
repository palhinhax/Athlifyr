import { forwardRef } from "react";
import {
  type TemplateKey,
  type InstagramFormat,
  type TemplatePayload,
} from "@/types/instagram";
import { TemplateEventHero } from "./template-event-hero";
import { TemplateCategoryCard } from "./template-category-card";
import { TemplateWeeklyPicks } from "./template-weekly-picks";
import { TemplateMinimalQuote } from "./template-minimal-quote";

interface CanvasPreviewProps {
  templateKey: TemplateKey;
  format: InstagramFormat;
  payload: TemplatePayload;
  showGuides?: boolean;
  showLogo?: boolean;
}

/**
 * CanvasPreview renders the selected template with the given payload
 * This component is used for both preview and export
 */
export const CanvasPreview = forwardRef<HTMLDivElement, CanvasPreviewProps>(
  (
    { templateKey, format, payload, showGuides = false, showLogo = true },
    ref
  ) => {
    const renderTemplate = () => {
      switch (templateKey) {
        case "T1":
          return (
            <TemplateEventHero
              payload={
                payload as Parameters<typeof TemplateEventHero>[0]["payload"]
              }
              format={format}
              showGuides={showGuides}
              showLogo={showLogo}
            />
          );
        case "T2":
          return (
            <TemplateCategoryCard
              payload={
                payload as Parameters<typeof TemplateCategoryCard>[0]["payload"]
              }
              format={format}
              showGuides={showGuides}
              showLogo={showLogo}
            />
          );
        case "T3":
          return (
            <TemplateWeeklyPicks
              payload={
                payload as Parameters<typeof TemplateWeeklyPicks>[0]["payload"]
              }
              format={format}
              showGuides={showGuides}
              showLogo={showLogo}
            />
          );
        case "T4":
          return (
            <TemplateMinimalQuote
              payload={
                payload as Parameters<typeof TemplateMinimalQuote>[0]["payload"]
              }
              format={format}
              showGuides={showGuides}
              showLogo={showLogo}
            />
          );
        default:
          return (
            <div className="p-8 text-center text-red-500">
              Unknown template: {templateKey}. Expected T1, T2, T3, or T4.
            </div>
          );
      }
    };

    return (
      <div ref={ref} className="inline-block">
        {renderTemplate()}
      </div>
    );
  }
);

CanvasPreview.displayName = "CanvasPreview";

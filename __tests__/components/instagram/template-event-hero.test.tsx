import { render } from "@testing-library/react";
import { TemplateEventHero } from "@/components/instagram/template-event-hero";
import type { EventHeroPayload } from "@/types/instagram";

describe("TemplateEventHero", () => {
  const mockPayload: EventHeroPayload = {
    title: "Test Event",
    subtitle: "Test Subtitle",
    metaLine: "Jan 2024 • Lisboa",
    cta: "Register Now",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  };

  it("should render background with gradient", () => {
    const { container } = render(
      <TemplateEventHero payload={mockPayload} format="SQUARE" />
    );

    // Check if background element exists with gradient style
    const backgroundDiv = container.querySelector('[style*="background"]');
    expect(backgroundDiv).toBeInTheDocument();
  });

  it("should render background with solid color", () => {
    const solidPayload: EventHeroPayload = {
      ...mockPayload,
      background: {
        type: "solid",
        value: "#000000",
      },
    };

    const { container } = render(
      <TemplateEventHero payload={solidPayload} format="SQUARE" />
    );

    const backgroundDiv = container.querySelector(
      '[style*="background-color"]'
    );
    expect(backgroundDiv).toBeInTheDocument();
  });

  it("should render background with photo and overlay", () => {
    const photoPayload: EventHeroPayload = {
      ...mockPayload,
      background: {
        type: "photo",
        value: "https://example.com/photo.jpg",
        overlayIntensity: 50,
      },
    };

    const { container } = render(
      <TemplateEventHero payload={photoPayload} format="SQUARE" />
    );

    const backgroundDiv = container.querySelector(
      '[style*="background-image"]'
    );
    expect(backgroundDiv).toBeInTheDocument();
  });

  it("should render content with proper z-index layering", () => {
    const { container } = render(
      <TemplateEventHero payload={mockPayload} format="SQUARE" />
    );

    // Check for z-index on content elements
    const contentDiv = container.querySelector(".z-10");
    expect(contentDiv).toBeInTheDocument();

    // Check for z-index on background elements
    const backgroundDiv = container.querySelector(".z-0");
    expect(backgroundDiv).toBeInTheDocument();
  });
});

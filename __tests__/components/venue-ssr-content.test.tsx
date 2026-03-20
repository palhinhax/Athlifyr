import React from "react";
import { render, screen } from "@testing-library/react";
import {
  VenueSSRContent,
  VenueSSRFallback,
} from "@/components/venue-ssr-content";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("lucide-react", () => ({
  Phone: ({ className }: { className?: string }) => (
    <span data-testid="icon-phone" className={className} />
  ),
  Mail: ({ className }: { className?: string }) => (
    <span data-testid="icon-mail" className={className} />
  ),
  Globe: ({ className }: { className?: string }) => (
    <span data-testid="icon-globe" className={className} />
  ),
  Instagram: ({ className }: { className?: string }) => (
    <span data-testid="icon-instagram" className={className} />
  ),
  MapPin: ({ className }: { className?: string }) => (
    <span data-testid="icon-mappin" className={className} />
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-check" className={className} />
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => <span data-variant={variant}>{children}</span>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    variant?: string;
  }) => <div>{children}</div>,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// ── Test Data ─────────────────────────────────────────────────────────────────

function makeVenue(
  overrides: Partial<Parameters<typeof VenueSSRContent>[0]["venue"]> = {}
) {
  return {
    id: "venue-1",
    slug: "test-gym",
    name: "Test Gym",
    type: "GYM",
    services: ["CROSSFIT", "WEIGHTLIFTING"],
    description: "A great gym",
    phone: "+351912345678",
    email: "info@testgym.com",
    website: "https://testgym.com",
    instagram: "@testgym",
    whatsapp: "+351912345678",
    address: "Rua do Teste 123",
    city: "Lisbon",
    country: "PT",
    isVerified: true,
    logo: null,
    coverImage: null,
    ...overrides,
  };
}

// ── VenueSSRContent ───────────────────────────────────────────────────────────

describe("VenueSSRContent", () => {
  it("renders venue name as heading", () => {
    render(
      <VenueSSRContent venue={makeVenue()} translation={null} locale="en" />
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Test Gym" })
    ).toBeInTheDocument();
  });

  it("renders venue type badge", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ type: "CROSSFIT_BOX" })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.getByText("CrossFit Box")).toBeInTheDocument();
  });

  it("renders venue type badge in Portuguese", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ type: "GYM" })}
        translation={null}
        locale="pt"
      />
    );
    expect(screen.getByText("Ginásio")).toBeInTheDocument();
  });

  it("renders verified badge when venue is verified", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ isVerified: true })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("does not render verified badge when venue is not verified", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ isVerified: false })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
  });

  it("renders services as badges", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ services: ["CROSSFIT", "YOGA"] })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.getByText("CrossFit")).toBeInTheDocument();
    expect(screen.getByText("Yoga")).toBeInTheDocument();
  });

  it("does not render services section when empty", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ services: [] })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.queryByText("Services")).not.toBeInTheDocument();
  });

  it("renders location with address and city", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ address: "Rua ABC 10", city: "Porto" })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.getByText("Rua ABC 10")).toBeInTheDocument();
    expect(screen.getByText("Porto")).toBeInTheDocument();
  });

  it("does not render location section when no address/city", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ address: null, city: null })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.queryByText("Location")).not.toBeInTheDocument();
  });

  it("renders contact info (phone, email, website)", () => {
    render(
      <VenueSSRContent venue={makeVenue()} translation={null} locale="en" />
    );
    expect(screen.getAllByText("+351912345678").length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getByText("info@testgym.com")).toBeInTheDocument();
    expect(screen.getAllByText("Visit Website").length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("renders instagram link", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ instagram: "@mygym" })}
        translation={null}
        locale="en"
      />
    );
    const link = screen.getByText(/@mygym/);
    expect(link.closest("a")).toHaveAttribute(
      "href",
      "https://instagram.com/mygym"
    );
  });

  it("renders whatsapp link", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ whatsapp: "+351 912 345 678" })}
        translation={null}
        locale="en"
      />
    );
    const link = screen.getByText("+351 912 345 678");
    expect(link.closest("a")).toHaveAttribute(
      "href",
      "https://wa.me/351912345678"
    );
  });

  it("does not render contact section when no contact info", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({
          phone: null,
          email: null,
          website: null,
          instagram: null,
          whatsapp: null,
        })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.queryByText("Contact")).not.toBeInTheDocument();
  });

  it("renders description from venue data", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ description: "Best gym in town" })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.getByText(/Best gym in town/)).toBeInTheDocument();
  });

  it("prefers translation description over venue description", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ description: "English desc" })}
        translation={{
          language: "pt",
          description: "Descrição em PT",
          metaTitle: null,
          metaDescription: null,
        }}
        locale="pt"
      />
    );
    expect(screen.getByText(/Descrição em PT/)).toBeInTheDocument();
    expect(screen.queryByText(/English desc/)).not.toBeInTheDocument();
  });

  it("does not render about section when no description", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ description: null })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.queryByText(/About/)).not.toBeInTheDocument();
  });

  it("renders CTA buttons for phone, email, and website", () => {
    render(
      <VenueSSRContent venue={makeVenue()} translation={null} locale="en" />
    );
    expect(screen.getByText("Call Now")).toBeInTheDocument();
    expect(screen.getByText("Send Email")).toBeInTheDocument();
    // "Visit Website" appears in both contact and CTA sections
    expect(screen.getAllByText("Visit Website").length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("renders localized UI labels in Portuguese", () => {
    render(
      <VenueSSRContent venue={makeVenue()} translation={null} locale="pt" />
    );
    expect(screen.getByText("Contacto")).toBeInTheDocument();
    expect(screen.getByText("Serviços")).toBeInTheDocument();
    expect(screen.getByText("Localização")).toBeInTheDocument();
  });

  it("renders localized service labels", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ services: ["HYROX"] })}
        translation={null}
        locale="pt"
      />
    );
    expect(screen.getByText("Treino HYROX")).toBeInTheDocument();
  });

  it("falls back to English for unknown locale", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ services: ["YOGA"] })}
        translation={null}
        locale="ja"
      />
    );
    expect(screen.getByText("Yoga")).toBeInTheDocument();
  });

  it("falls back to raw key for unknown venue type", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ type: "UNKNOWN_TYPE" })}
        translation={null}
        locale="en"
      />
    );
    expect(screen.getByText("UNKNOWN_TYPE")).toBeInTheDocument();
  });

  it("renders markdown description as HTML", () => {
    render(
      <VenueSSRContent
        venue={makeVenue({ description: "**bold text**" })}
        translation={null}
        locale="en"
      />
    );
    const strong = document.querySelector("strong");
    expect(strong).toBeInTheDocument();
    expect(strong?.textContent).toBe("bold text");
  });

  it("renders schema.org microdata attributes", () => {
    const { container } = render(
      <VenueSSRContent venue={makeVenue()} translation={null} locale="en" />
    );
    expect(
      container.querySelector('[itemtype="https://schema.org/LocalBusiness"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[itemprop="name"][content="Test Gym"]')
    ).toBeInTheDocument();
  });
});

// ── VenueSSRFallback ──────────────────────────────────────────────────────────

describe("VenueSSRFallback", () => {
  it("renders fallback with venue name in English", () => {
    render(<VenueSSRFallback venueName="My Gym" locale="en" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "My Gym" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This venue profile is being updated/)
    ).toBeInTheDocument();
  });

  it("renders fallback in Portuguese", () => {
    render(<VenueSSRFallback venueName="O Meu Ginásio" locale="pt" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "O Meu Ginásio" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Este perfil de espaço está a ser atualizado/)
    ).toBeInTheDocument();
  });

  it("renders default title when venueName is not provided", () => {
    render(<VenueSSRFallback locale="en" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Venue" })
    ).toBeInTheDocument();
  });

  it("renders default title in Portuguese when venueName is not provided", () => {
    render(<VenueSSRFallback locale="pt" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Espaço" })
    ).toBeInTheDocument();
  });

  it("falls back to English for unsupported locale", () => {
    render(<VenueSSRFallback venueName="Test" locale="zh" />);
    expect(
      screen.getByText(/This venue profile is being updated/)
    ).toBeInTheDocument();
  });

  it("renders fallback in all supported languages", () => {
    const cases = [
      { locale: "es", expected: /actualizado/ },
      { locale: "fr", expected: /mise à jour/ },
      { locale: "de", expected: /aktualisiert/ },
      { locale: "it", expected: /aggiornamento/ },
    ];
    for (const { locale, expected } of cases) {
      const { unmount } = render(
        <VenueSSRFallback venueName="Test" locale={locale} />
      );
      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    }
  });
});

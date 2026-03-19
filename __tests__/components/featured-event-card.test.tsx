import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  FeaturedEventCard,
  HyroxEventCardDemo,
} from "@/components/featured-event-card";
import type { FeaturedEventData } from "@/components/featured-event-card";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...rest} />
  ),
}));

jest.mock("@/lib/event-utils", () => ({
  formatDateRange: () => "Jan 1 – Jan 3, 2026",
}));

jest.mock("@/components/sport-badge", () => ({
  SportBadge: ({ sportType }: { sportType: string }) => (
    <span data-testid="sport-badge">{sportType}</span>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_EVENT: FeaturedEventData = {
  id: "event-1",
  title: "Trail Run 2026",
  slug: "trail-run-2026",
  description: "An awesome trail run event",
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-01-03"),
  city: "Lisbon",
  country: "Portugal",
  imageUrl: "https://example.com/image.jpg",
  isFeatured: true,
  sportTypes: ["TRAIL"],
  variants: [
    { id: "v1", name: "Trail 30km", distanceKm: 30 },
    { id: "v2", name: "Trail 15km", distanceKm: 15 },
  ],
  stats: [
    { label: "Duration", value: "3 days" },
    { label: "Variants", value: "2" },
  ],
  friendsGoing: 5,
  interestedCount: 120,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("FeaturedEventCard", () => {
  it("renders event title and location", () => {
    render(<FeaturedEventCard event={BASE_EVENT} />);

    expect(screen.getByText("Trail Run 2026")).toBeInTheDocument();
    expect(screen.getByText("Lisbon, Portugal")).toBeInTheDocument();
  });

  it("renders formatted date range", () => {
    render(<FeaturedEventCard event={BASE_EVENT} />);
    expect(screen.getByText("Jan 1 – Jan 3, 2026")).toBeInTheDocument();
  });

  it("renders event description when showDescription is true", () => {
    render(<FeaturedEventCard event={BASE_EVENT} showDescription />);
    expect(screen.getByText("An awesome trail run event")).toBeInTheDocument();
  });

  it("hides description when showDescription is false", () => {
    render(<FeaturedEventCard event={BASE_EVENT} showDescription={false} />);
    expect(
      screen.queryByText("An awesome trail run event")
    ).not.toBeInTheDocument();
  });

  it("renders sport badges", () => {
    render(<FeaturedEventCard event={BASE_EVENT} />);
    expect(screen.getByTestId("sport-badge")).toHaveTextContent("TRAIL");
  });

  it("renders featured badge when isFeatured is true", () => {
    render(<FeaturedEventCard event={BASE_EVENT} />);
    expect(screen.getByText(/featured/)).toBeInTheDocument();
  });

  it("hides featured badge when not featured", () => {
    render(<FeaturedEventCard event={{ ...BASE_EVENT, isFeatured: false }} />);
    expect(screen.queryByText(/featured/)).not.toBeInTheDocument();
  });

  it("renders event image when imageUrl is provided", () => {
    render(<FeaturedEventCard event={BASE_EVENT} />);
    const img = screen.getByAltText("Trail Run 2026");
    expect(img).toBeInTheDocument();
  });

  it("renders custom header content when no image", () => {
    render(
      <FeaturedEventCard
        event={{
          ...BASE_EVENT,
          imageUrl: null,
          customHeaderContent: <div data-testid="custom-header">Custom</div>,
        }}
      />
    );
    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
  });

  it("renders title in header when no image or custom content", () => {
    render(
      <FeaturedEventCard
        event={{
          ...BASE_EVENT,
          imageUrl: null,
          customHeaderContent: undefined,
        }}
      />
    );
    // Title should appear twice: once in header, once in content
    const titles = screen.getAllByText("Trail Run 2026");
    expect(titles.length).toBeGreaterThanOrEqual(2);
  });

  it("renders event stats when showStats is true", () => {
    render(<FeaturedEventCard event={BASE_EVENT} showStats />);
    expect(screen.getByText("3 days")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
  });

  it("hides stats when showStats is false", () => {
    render(<FeaturedEventCard event={BASE_EVENT} showStats={false} />);
    expect(screen.queryByText("3 days")).not.toBeInTheDocument();
  });

  it("renders variants when showVariants is true", () => {
    render(<FeaturedEventCard event={BASE_EVENT} showVariants />);
    expect(screen.getByText("30 km")).toBeInTheDocument();
    expect(screen.getByText("15 km")).toBeInTheDocument();
  });

  it("shows variant name when distanceKm is null", () => {
    render(
      <FeaturedEventCard
        event={{
          ...BASE_EVENT,
          variants: [{ id: "v1", name: "Open Category", distanceKm: null }],
        }}
      />
    );
    expect(screen.getByText("Open Category")).toBeInTheDocument();
  });

  it("shows +N badge when more than 6 variants", () => {
    const manyVariants = Array.from({ length: 8 }, (_, i) => ({
      id: `v${i}`,
      name: `Variant ${i}`,
      distanceKm: (i + 1) * 5,
    }));

    render(
      <FeaturedEventCard event={{ ...BASE_EVENT, variants: manyVariants }} />
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders friends going section", () => {
    render(<FeaturedEventCard event={BASE_EVENT} showFriendsGoing />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("friendsParticipating")).toBeInTheDocument();
  });

  it("renders interested count", () => {
    render(<FeaturedEventCard event={BASE_EVENT} />);
    expect(screen.getByText(/120/)).toBeInTheDocument();
    expect(screen.getByText(/interested/)).toBeInTheDocument();
  });

  it("hides friends section when showFriendsGoing is false", () => {
    render(<FeaturedEventCard event={BASE_EVENT} showFriendsGoing={false} />);
    expect(screen.queryByText("friendsParticipating")).not.toBeInTheDocument();
  });

  it("renders link to event when linkToEvent is true", () => {
    render(<FeaturedEventCard event={BASE_EVENT} linkToEvent />);
    const link = screen.getByText("viewEvent").closest("a");
    expect(link).toHaveAttribute("href", "/events/trail-run-2026");
  });

  it("renders button without link when linkToEvent is false", () => {
    const onViewEvent = jest.fn();
    render(
      <FeaturedEventCard
        event={BASE_EVENT}
        linkToEvent={false}
        onViewEvent={onViewEvent}
      />
    );
    const button = screen.getByText("viewEvent");
    fireEvent.click(button);
    expect(onViewEvent).toHaveBeenCalled();
  });

  it("calls onViewEvent callback when button is clicked", () => {
    const onViewEvent = jest.fn();
    render(<FeaturedEventCard event={BASE_EVENT} onViewEvent={onViewEvent} />);
    fireEvent.click(screen.getByText("viewEvent"));
    expect(onViewEvent).toHaveBeenCalled();
  });

  it("handles date strings as startDate/endDate", () => {
    render(
      <FeaturedEventCard
        event={{
          ...BASE_EVENT,
          startDate: "2026-01-01T00:00:00Z",
          endDate: "2026-01-03T00:00:00Z",
        }}
      />
    );
    expect(screen.getByText("Jan 1 – Jan 3, 2026")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FeaturedEventCard event={BASE_EVENT} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("HyroxEventCardDemo", () => {
  it("renders HYROX demo card", () => {
    render(<HyroxEventCardDemo />);
    expect(screen.getByText("HYROX Lisboa")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<HyroxEventCardDemo className="demo-class" />);
    expect(container.firstChild).toHaveClass("demo-class");
  });
});

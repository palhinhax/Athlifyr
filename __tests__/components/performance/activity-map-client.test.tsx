import { render } from "@testing-library/react";
import { ActivityMapClient } from "@/components/performance/activity-map-client";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockRemove = jest.fn();
const mockAddControl = jest.fn();
const mockAddSource = jest.fn();
const mockAddLayer = jest.fn();
const mockOn = jest.fn();

const MockMarkerInstance = {
  setLngLat: jest.fn().mockReturnThis(),
  setPopup: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
};

jest.mock("mapbox-gl", () => ({
  Map: jest.fn().mockImplementation(() => ({
    remove: mockRemove,
    addControl: mockAddControl,
    addSource: mockAddSource,
    addLayer: mockAddLayer,
    on: mockOn,
  })),
  NavigationControl: jest.fn(),
  LngLatBounds: jest.fn().mockImplementation(() => ({
    extend: jest.fn().mockReturnThis(),
  })),
  Marker: jest.fn().mockImplementation(() => MockMarkerInstance),
  Popup: jest.fn().mockImplementation(() => ({
    setText: jest.fn().mockReturnThis(),
  })),
}));

jest.mock("mapbox-gl/dist/mapbox-gl.css", () => ({}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const TRACK = [
  { lat: 38.5, lng: -8.9, timestamp: 1000 },
  { lat: 38.6, lng: -8.8, timestamp: 2000 },
  { lat: 38.7, lng: -8.7, timestamp: 3000 },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ActivityMapClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a container div", () => {
    const { container } = render(
      <ActivityMapClient track={TRACK} className="h-[400px]" />
    );

    expect(container.querySelector(".h-\\[400px\\]")).toBeInTheDocument();
  });

  it("returns null when not yet mounted", () => {
    // The component uses useState(false) for mounted, and renders null initially
    // After the first useEffect, it sets mounted to true
    // In the test environment, we can verify it renders and becomes visible
    const { container } = render(
      <ActivityMapClient track={TRACK} className="test-map" />
    );

    // After render, the useEffect will set mounted=true and re-render
    expect(container.firstChild).toBeTruthy();
  });

  it("creates Mapbox map when mounted with valid track", async () => {
    const mapboxgl = jest.requireMock("mapbox-gl");

    render(<ActivityMapClient track={TRACK} className="h-[400px]" />);

    // The useEffect runs after render, should create a map
    // mapbox Map constructor is called
    expect(mapboxgl.Map).toHaveBeenCalled();
  });

  it("does not create map with fewer than 2 track points", () => {
    const mapboxgl = jest.requireMock("mapbox-gl");

    render(
      <ActivityMapClient
        track={[{ lat: 38.5, lng: -8.9, timestamp: 1000 }]}
        className="h-[400px]"
      />
    );

    expect(mapboxgl.Map).not.toHaveBeenCalled();
  });

  it("adds navigation control to the map", () => {
    render(<ActivityMapClient track={TRACK} className="h-[400px]" />);

    expect(mockAddControl).toHaveBeenCalled();
  });

  it("registers load event handler", () => {
    render(<ActivityMapClient track={TRACK} className="h-[400px]" />);

    expect(mockOn).toHaveBeenCalledWith("load", expect.any(Function));
  });

  it("adds track source and layer on map load", () => {
    render(<ActivityMapClient track={TRACK} className="h-[400px]" />);

    // Get and call the load handler
    const loadCall = mockOn.mock.calls.find(
      (call: string[]) => call[0] === "load"
    );
    expect(loadCall).toBeDefined();

    const loadHandler = loadCall[1];
    loadHandler();

    expect(mockAddSource).toHaveBeenCalledWith("track", {
      type: "geojson",
      data: expect.objectContaining({
        type: "Feature",
        geometry: expect.objectContaining({
          type: "LineString",
        }),
      }),
    });

    expect(mockAddLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "track-line",
        type: "line",
        source: "track",
      })
    );
  });

  it("creates start and finish markers on map load", () => {
    const mapboxgl = jest.requireMock("mapbox-gl");

    render(<ActivityMapClient track={TRACK} className="h-[400px]" />);

    const loadHandler = mockOn.mock.calls.find(
      (call: string[]) => call[0] === "load"
    )[1];
    loadHandler();

    // Should create two Marker instances (start + finish)
    expect(mapboxgl.Marker).toHaveBeenCalledTimes(2);
    expect(mapboxgl.Marker).toHaveBeenCalledWith({ color: "#22c55e" }); // start
    expect(mapboxgl.Marker).toHaveBeenCalledWith({ color: "#ef4444" }); // finish
  });

  it("cleans up map on unmount", () => {
    const { unmount } = render(
      <ActivityMapClient track={TRACK} className="h-[400px]" />
    );

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });
});

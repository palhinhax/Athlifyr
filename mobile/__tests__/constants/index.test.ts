import {
  SPORTS,
  SPORT_LABELS,
  SPORT_COLORS,
  API_ENDPOINTS,
  SCREENS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE,
  MAP_DEFAULTS,
  DATE_FORMATS,
  IMAGE_UPLOAD,
  STORAGE_KEYS,
} from "@/src/constants";

describe("SPORTS", () => {
  it("contains 13 sport types", () => {
    expect(SPORTS).toHaveLength(13);
  });

  it("includes common sports", () => {
    expect(SPORTS).toContain("RUNNING");
    expect(SPORTS).toContain("CYCLING");
    expect(SPORTS).toContain("SWIMMING");
    expect(SPORTS).toContain("TRAIL_RUNNING");
    expect(SPORTS).toContain("OTHER");
  });
});

describe("SPORT_LABELS", () => {
  it("has a label for every sport", () => {
    SPORTS.forEach((sport) => {
      expect(SPORT_LABELS[sport]).toBeDefined();
      expect(typeof SPORT_LABELS[sport]).toBe("string");
    });
  });

  it("has human-readable labels", () => {
    expect(SPORT_LABELS.RUNNING).toBe("Running");
    expect(SPORT_LABELS.TRAIL_RUNNING).toBe("Trail Running");
  });
});

describe("SPORT_COLORS", () => {
  it("has an entry for every sport", () => {
    SPORTS.forEach((sport) => {
      expect(sport in SPORT_COLORS).toBe(true);
    });
  });
});

describe("API_ENDPOINTS", () => {
  it("has auth endpoints", () => {
    expect(API_ENDPOINTS.AUTH_LOGIN).toBe("/auth/login");
    expect(API_ENDPOINTS.AUTH_REGISTER).toBe("/auth/register");
    expect(API_ENDPOINTS.AUTH_ME).toBe("/auth/me");
  });

  it("has dynamic event endpoints", () => {
    expect(API_ENDPOINTS.EVENT_DETAILS("test-slug")).toBe("/events/test-slug");
    expect(API_ENDPOINTS.EVENT_REGISTER("123")).toBe("/events/123/register");
  });

  it("has dynamic venue endpoints", () => {
    expect(API_ENDPOINTS.VENUE_DETAILS("my-gym")).toBe("/venues/my-gym");
  });

  it("has dynamic user endpoints", () => {
    expect(API_ENDPOINTS.USER_PROFILE("abc")).toBe("/users/abc");
    expect(API_ENDPOINTS.USER_EVENTS("abc")).toBe("/users/abc/events");
  });

  it("has comments endpoint with type", () => {
    expect(API_ENDPOINTS.COMMENTS("post", "123")).toBe("/posts/123/comments");
    expect(API_ENDPOINTS.COMMENTS("event", "456")).toBe("/events/456/comments");
  });
});

describe("SCREENS", () => {
  it("has auth screens", () => {
    expect(SCREENS.LOGIN).toBe("Login");
    expect(SCREENS.REGISTER).toBe("Register");
  });

  it("has main tab screens", () => {
    expect(SCREENS.HOME).toBe("Home");
    expect(SCREENS.PROFILE).toBe("Profile");
    expect(SCREENS.EVENTS).toBe("Events");
  });
});

describe("MAP_DEFAULTS", () => {
  it("has valid coordinates", () => {
    expect(MAP_DEFAULTS.LATITUDE).toBeCloseTo(40.416775, 3);
    expect(MAP_DEFAULTS.LONGITUDE).toBeCloseTo(-3.70379, 3);
    expect(MAP_DEFAULTS.DELTA).toBe(0.1);
  });
});

describe("DATE_FORMATS", () => {
  it("has display and API formats", () => {
    expect(DATE_FORMATS.DISPLAY).toBeDefined();
    expect(DATE_FORMATS.API).toBe("yyyy-MM-dd");
  });
});

describe("IMAGE_UPLOAD", () => {
  it("has 5MB max size", () => {
    expect(IMAGE_UPLOAD.MAX_SIZE).toBe(5 * 1024 * 1024);
  });

  it("allows jpeg, png, webp", () => {
    expect(IMAGE_UPLOAD.ALLOWED_TYPES).toContain("image/jpeg");
    expect(IMAGE_UPLOAD.ALLOWED_TYPES).toContain("image/png");
    expect(IMAGE_UPLOAD.ALLOWED_TYPES).toContain("image/webp");
  });
});

describe("STORAGE_KEYS", () => {
  it("has auth token key", () => {
    expect(STORAGE_KEYS.AUTH_TOKEN).toBe("auth-token");
  });
});

describe("DEFAULT_PAGE_SIZE", () => {
  it("is 20", () => {
    expect(DEFAULT_PAGE_SIZE).toBe(20);
  });
});

describe("DEFAULT_PAGE", () => {
  it("is 1", () => {
    expect(DEFAULT_PAGE).toBe(1);
  });
});

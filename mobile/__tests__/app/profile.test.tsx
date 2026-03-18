import React from "react";
import { render, screen } from "@testing-library/react-native";
import ProfileScreen from "@/app/(tabs)/profile";

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: View,
    SafeAreaProvider: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock CachedImage
jest.mock("@/src/components/CachedImage", () => ({
  CachedAvatar: ({ alt }: { alt: string }) => {
    const { Text } = require("react-native");
    return <Text>{alt}</Text>;
  },
}));

// Mock auth store
const mockAuthStore = {
  user: null as {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  } | null,
  isAuthenticated: false,
  isLoading: true,
  loadStoredAuth: jest.fn(),
};

jest.mock("@/src/lib/auth-store", () => ({
  useAuthStore: () => mockAuthStore,
}));

// Mock useProfile hook
const mockProfileData = {
  stats: { upcomingEvents: 2, pastEvents: 5, friendsCount: 10 },
  upcomingEvents: [] as Array<{
    id: string;
    status: string;
    event: {
      id: string;
      title: string;
      slug: string;
      startDate: string;
      city: string | null;
      country: string | null;
      sportTypes: string[];
    };
    variant: { name: string; distanceKm: number | null } | null;
  }>,
  pastEvents: [] as Array<{
    id: string;
    status: string;
    event: {
      id: string;
      title: string;
      slug: string;
      startDate: string;
      city: string | null;
      country: string | null;
      sportTypes: string[];
    };
    variant: { name: string; distanceKm: number | null } | null;
  }>,
  isLoading: false,
  error: null,
  refetch: jest.fn().mockResolvedValue(undefined),
  profile: null,
};

jest.mock("@/src/hooks/useProfile", () => ({
  useProfile: () => mockProfileData,
}));

// Mock PerformanceSection (complex component with modals)
jest.mock("@/src/components/profile/PerformanceSection", () => ({
  PerformanceSection: () => {
    const { Text } = require("react-native");
    return <Text>PerformanceSection</Text>;
  },
}));

// Mock AnalysesSection (complex component with video)
jest.mock("@/src/components/profile/AnalysesSection", () => ({
  AnalysesSection: () => {
    const { Text } = require("react-native");
    return <Text>AnalysesSection</Text>;
  },
}));

// Mock OtherSections (includes gallery and friends)
jest.mock("@/src/components/profile/OtherSections", () => ({
  OtherSections: ({ friendsCount }: { friendsCount: number }) => {
    const { Text } = require("react-native");
    return <Text>OtherSections-{friendsCount}</Text>;
  },
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to default state
    mockAuthStore.user = null;
    mockAuthStore.isAuthenticated = false;
    mockAuthStore.isLoading = true;
    mockProfileData.isLoading = false;
    mockProfileData.stats = {
      upcomingEvents: 2,
      pastEvents: 5,
      friendsCount: 10,
    };
    mockProfileData.upcomingEvents = [];
    mockProfileData.pastEvents = [];
  });

  describe("loading state", () => {
    it("shows loading indicator when auth is loading", () => {
      mockAuthStore.isLoading = true;

      render(<ProfileScreen />);

      // Should render without crashing (ActivityIndicator)
      expect(screen.toJSON()).toBeTruthy();
    });

    it("shows loading indicator when profile is loading", () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "USER",
      };
      mockProfileData.isLoading = true;

      render(<ProfileScreen />);

      expect(screen.toJSON()).toBeTruthy();
    });
  });

  describe("unauthenticated state", () => {
    it("shows auth required view when not authenticated", () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = false;
      mockAuthStore.user = null;

      render(<ProfileScreen />);

      expect(screen.getByText("common.authTitle")).toBeTruthy();
      expect(screen.getByText("common.authDescription")).toBeTruthy();
    });

    it("shows sign in button when not authenticated", () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = false;
      mockAuthStore.user = null;

      render(<ProfileScreen />);

      expect(screen.getByText("common.signInButton")).toBeTruthy();
    });
  });

  describe("authenticated state", () => {
    beforeEach(() => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        id: "user-1",
        name: "João Silva",
        email: "joao@example.com",
        image: "https://example.com/avatar.jpg",
        role: "USER",
      };
      mockProfileData.isLoading = false;
    });

    it("renders profile header with user info", () => {
      render(<ProfileScreen />);

      // Name appears in both CachedAvatar alt and header display
      expect(
        screen.getAllByText("João Silva").length
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("joao@example.com")).toBeTruthy();
    });

    it("renders profile stats", () => {
      render(<ProfileScreen />);

      expect(screen.getByText("2")).toBeTruthy();
      expect(screen.getByText("5")).toBeTruthy();
      expect(screen.getByText("10")).toBeTruthy();
    });

    it("renders performance section", () => {
      render(<ProfileScreen />);

      expect(screen.getByText("PerformanceSection")).toBeTruthy();
    });

    it("renders analyses section", () => {
      render(<ProfileScreen />);

      expect(screen.getByText("AnalysesSection")).toBeTruthy();
    });

    it("passes friendsCount to OtherSections", () => {
      render(<ProfileScreen />);

      expect(screen.getByText("OtherSections-10")).toBeTruthy();
    });

    it("calls loadStoredAuth on mount", () => {
      render(<ProfileScreen />);

      expect(mockAuthStore.loadStoredAuth).toHaveBeenCalled();
    });

    it("renders empty states when no events", () => {
      mockProfileData.upcomingEvents = [];
      mockProfileData.pastEvents = [];

      render(<ProfileScreen />);

      expect(screen.getByText("profile.noUpcomingEvents")).toBeTruthy();
      expect(screen.getByText("profile.noPastEvents")).toBeTruthy();
    });

    it("renders event cards when events exist", () => {
      mockProfileData.upcomingEvents = [
        {
          id: "p1",
          status: "going",
          event: {
            id: "e1",
            title: "Trail Manuelino 2027",
            slug: "trail-manuelino-2027",
            startDate: "2027-02-01T00:00:00.000Z",
            city: "Abiul",
            country: "Portugal",
            sportTypes: ["TRAIL"],
          },
          variant: { name: "Trail 32km", distanceKm: 32 },
        },
      ];

      render(<ProfileScreen />);

      expect(screen.getByText("Trail Manuelino 2027")).toBeTruthy();
      expect(screen.getByText("Trail 32km")).toBeTruthy();
    });
  });

  describe("edge cases", () => {
    it("handles user with no name", () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        id: "user-2",
        name: "",
        email: "noname@example.com",
        role: "USER",
      };
      mockProfileData.isLoading = false;

      render(<ProfileScreen />);

      expect(screen.getByText("noname@example.com")).toBeTruthy();
    });

    it("handles zero stats without crashing", () => {
      mockAuthStore.isLoading = false;
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = {
        id: "user-1",
        name: "Test",
        email: "test@example.com",
        role: "USER",
      };
      mockProfileData.isLoading = false;
      mockProfileData.stats = {
        upcomingEvents: 0,
        pastEvents: 0,
        friendsCount: 0,
      };

      render(<ProfileScreen />);

      const zeros = screen.getAllByText("0");
      expect(zeros).toHaveLength(3);
    });
  });
});

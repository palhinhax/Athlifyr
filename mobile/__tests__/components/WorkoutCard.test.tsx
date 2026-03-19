import React from "react";
import { render } from "@testing-library/react-native";
import { WorkoutCard } from "@/src/components/WorkoutCard";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("lucide-react-native", () => ({
  Clock: () => "Clock",
  Dumbbell: () => "Dumbbell",
  Globe: () => "Globe",
  Bookmark: () => "Bookmark",
  Play: () => "Play",
  User: () => "User",
}));

jest.mock("@/src/components/CachedImage", () => ({
  CachedAvatar: () => "CachedAvatar",
}));

jest.mock("@/src/components/ui/ConfirmModal", () => ({
  ConfirmModal: () => null,
}));

jest.mock("@/src/hooks/useWorkouts", () => ({
  useToggleSaveWorkout: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/src/lib/auth-store", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ isAuthenticated: true }),
}));

describe("WorkoutCard", () => {
  const workout = {
    id: "w1",
    name: "Upper Body",
    description: "Chest and back workout",
    isSaved: false,
    isPublic: true,
    estimatedTime: 45,
    difficulty: 3,
    tags: ["chest", "back", "arms", "shoulders"],
    blocks: [
      { type: "WARMUP", exercises: [{ id: "e1" }] },
      { type: "STRENGTH", exercises: [{ id: "e2" }, { id: "e3" }] },
    ],
    createdBy: { name: "John", image: null },
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders workout name", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("Upper Body")).toBeTruthy();
  });

  it("renders description", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("Chest and back workout")).toBeTruthy();
  });

  it("renders estimated time", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("45 min")).toBeTruthy();
  });

  it("renders total exercises count", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    // 3 exercises - displayed as "3 workouts.exercisesLabel"
    expect(getByText(/3 workouts\.exercisesLabel/)).toBeTruthy();
  });

  it("renders block type badges", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("workouts.blocks.WARMUP")).toBeTruthy();
    expect(getByText("workouts.blocks.STRENGTH")).toBeTruthy();
  });

  it("renders tag chips with overflow", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("chest")).toBeTruthy();
    expect(getByText("+1")).toBeTruthy();
  });

  it("renders difficulty bars", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("workouts.difficultyLevels.3")).toBeTruthy();
  });

  it("renders start workout button", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("workouts.startWorkout")).toBeTruthy();
  });

  it("renders creator info for public workouts", () => {
    const { getByText } = render(<WorkoutCard workout={workout} />);
    expect(getByText("John")).toBeTruthy();
  });

  it("hides time when not provided", () => {
    const w = { ...workout, estimatedTime: null };
    const { queryByText } = render(<WorkoutCard workout={w} />);
    expect(queryByText(/min/)).toBeNull();
  });
});

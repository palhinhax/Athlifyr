import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkoutLogger } from "@/components/workout-logger";
import type { WorkoutWithBlocks } from "@/types/workout";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, unknown>): string =>
      params ? `${key}:${JSON.stringify(params)}` : key,
}));

const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/time-input", () => ({
  TimeInput: () => <input data-testid="time-input" />,
}));

// Mock Prisma enums
jest.mock("@prisma/client", () => ({
  WeightUnit: { KG: "KG", LB: "LB" },
  DistanceUnit: { KM: "KM", MI: "MI", M: "M" },
}));

jest.mock("@/types/workout", () => ({
  BLOCK_TYPE_INFO: {
    STRENGTH: { color: "#4CAF50" },
    AMRAP: { color: "#FF9800" },
    FOR_TIME: { color: "#2196F3" },
    CHIPPER: { color: "#9C27B0" },
  },
  formatTime: (s: number) => `${s}s`,
}));

// Simple UI component stubs
jest.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <div data-testid="card" style={style}>
      {children}
    </div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (
    props: React.InputHTMLAttributes<HTMLInputElement> & {
      className?: string;
    }
  ) => <input {...props} />,
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange: _onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange?: (v: string) => void;
    value?: string;
  }) => <div data-testid="select">{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: () => <span />,
}));

jest.mock("lucide-react", () => ({
  ArrowLeftIcon: () => <span>←</span>,
  CheckCircleIcon: () => <span>✓</span>,
  PlusIcon: () => <span>+</span>,
  TrashIcon: () => <span>🗑</span>,
}));

// ── Test data ──────────────────────────────────────────────────────────────

function makeWorkout(): WorkoutWithBlocks {
  return {
    id: "w_1",
    name: "Test Workout",
    description: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    venueId: null,
    tags: [],
    createdById: "user_1",
    isPublic: false,
    estimatedTime: null,
    difficulty: null,
    isTemplate: false,
    createdBy: { id: "user_1", name: "Test User", email: "test@test.com" },
    blocks: [
      {
        id: "b_1",
        type: "STRENGTH",
        name: "Strength Block",
        rounds: 3,
        timeCap: null,
        workoutId: "w_1",
        orderIndex: 0,
        workTime: null,
        notes: null,
        restBetweenRoundsSec: 60,
        exercises: [
          {
            id: "be_1",
            orderIndex: 0,
            prescribedReps: 10,
            prescribedWeight: 60,
            prescribedWeightUnit: "KG",
            prescribedDistance: null,
            prescribedDistanceUnit: null,
            prescribedTime: null,
            prescribedCalories: null,
            exercise: {
              id: "ex_1",
              name: "Back Squat",
              hasReps: true,
              hasWeight: true,
              hasDistance: false,
              hasTime: false,
              hasCalories: false,
            },
          },
        ],
      },
    ],
  } as unknown as WorkoutWithBlocks;
}

// ── Tests ──────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Global fetch mock
const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeAmrapWorkout(): WorkoutWithBlocks {
  return {
    id: "w_2",
    name: "AMRAP Workout",
    description: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    venueId: null,
    tags: [],
    createdById: "user_1",
    isPublic: false,
    estimatedTime: null,
    difficulty: null,
    isTemplate: false,
    createdBy: { id: "user_1", name: "Test User", email: "test@test.com" },
    blocks: [
      {
        id: "b_2",
        type: "AMRAP",
        name: "AMRAP Block",
        rounds: null,
        timeCap: 720,
        workoutId: "w_2",
        orderIndex: 0,
        workTime: null,
        notes: null,
        restBetweenRoundsSec: null,
        exercises: [
          {
            id: "be_2",
            orderIndex: 0,
            prescribedReps: 15,
            prescribedWeight: null,
            prescribedWeightUnit: null,
            prescribedDistance: null,
            prescribedDistanceUnit: null,
            prescribedTime: null,
            prescribedCalories: null,
            exercise: {
              id: "ex_2",
              name: "Air Squat",
              hasReps: true,
              hasWeight: false,
              hasDistance: false,
              hasTime: false,
              hasCalories: false,
            },
          },
        ],
      },
    ],
  } as unknown as WorkoutWithBlocks;
}

function makeForTimeWorkout(): WorkoutWithBlocks {
  return {
    id: "w_3",
    name: "For Time WOD",
    description: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    venueId: null,
    tags: [],
    createdById: "user_1",
    isPublic: false,
    estimatedTime: null,
    difficulty: null,
    isTemplate: false,
    createdBy: { id: "user_1", name: "Test User", email: "test@test.com" },
    blocks: [
      {
        id: "b_3",
        type: "FOR_TIME",
        name: "For Time Block",
        rounds: null,
        timeCap: 600,
        workoutId: "w_3",
        orderIndex: 0,
        workTime: null,
        notes: null,
        restBetweenRoundsSec: null,
        exercises: [
          {
            id: "be_3",
            orderIndex: 0,
            prescribedReps: 21,
            prescribedWeight: 60,
            prescribedWeightUnit: "KG",
            prescribedDistance: null,
            prescribedDistanceUnit: null,
            prescribedTime: null,
            prescribedCalories: null,
            exercise: {
              id: "ex_3",
              name: "Thruster",
              hasReps: true,
              hasWeight: true,
              hasDistance: false,
              hasTime: false,
              hasCalories: false,
            },
          },
        ],
      },
    ],
  } as unknown as WorkoutWithBlocks;
}

function makeFullExerciseWorkout(): WorkoutWithBlocks {
  return {
    id: "w_4",
    name: "Full Exercise WOD",
    description: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    venueId: null,
    tags: [],
    createdById: "user_1",
    isPublic: false,
    estimatedTime: null,
    difficulty: null,
    isTemplate: false,
    createdBy: { id: "user_1", name: "Test User", email: "test@test.com" },
    blocks: [
      {
        id: "b_4",
        type: "AMRAP",
        name: null,
        rounds: null,
        timeCap: 600,
        workoutId: "w_4",
        orderIndex: 0,
        workTime: null,
        notes: null,
        restBetweenRoundsSec: null,
        exercises: [
          {
            id: "be_4",
            orderIndex: 0,
            prescribedReps: null,
            prescribedWeight: null,
            prescribedWeightUnit: null,
            prescribedDistance: null,
            prescribedDistanceUnit: null,
            prescribedTime: null,
            prescribedCalories: null,
            exercise: {
              id: "ex_4",
              name: "Row",
              hasReps: false,
              hasWeight: false,
              hasDistance: true,
              hasTime: true,
              hasCalories: true,
            },
          },
        ],
      },
    ],
  } as unknown as WorkoutWithBlocks;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("WorkoutLogger", () => {
  it("renders workout name and block", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);
    expect(screen.getByText("Test Workout")).toBeInTheDocument();
    expect(screen.getByText("Back Squat")).toBeInTheDocument();
  });

  it("renders add set button for strength block", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);
    // The "+ log.addSet" button should exist for STRENGTH blocks
    const addSetButtons = screen.getAllByRole("button");
    const addSetBtn = addSetButtons.find((btn) =>
      btn.textContent?.includes("log.addSet")
    );
    expect(addSetBtn).toBeDefined();
  });

  it("adds a set and handles weight input with Number.parseFloat", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);

    // Click add set button
    const addSetButtons = screen.getAllByRole("button");
    const addSetBtn = addSetButtons.find((btn) =>
      btn.textContent?.includes("log.addSet")
    );
    expect(addSetBtn).toBeDefined();
    fireEvent.click(addSetBtn!);

    // After adding a set, the SetInputRow renders with weight input
    // The weight input uses Number.parseFloat
    const weightInputs = screen.getAllByPlaceholderText("Weight");
    expect(weightInputs.length).toBeGreaterThan(0);

    // Change the weight value — exercises the Number.parseFloat path
    fireEvent.change(weightInputs[0], { target: { value: "72.5" } });

    // Value should be set (Number.parseFloat("72.5") = 72.5)
    expect(weightInputs[0]).toHaveValue(72.5);
  });

  it("handles empty weight input (Number.parseFloat fallback to 0)", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);

    // Add a set first
    const addSetButtons = screen.getAllByRole("button");
    const addSetBtn = addSetButtons.find((btn) =>
      btn.textContent?.includes("log.addSet")
    );
    fireEvent.click(addSetBtn!);

    const weightInputs = screen.getAllByPlaceholderText("Weight");

    // Set a value then clear it — exercises the `? Number.parseFloat(v) : 0` branch
    fireEvent.change(weightInputs[0], { target: { value: "" } });

    // Empty string should result in empty display (value is 0 but renders as "")
    expect(weightInputs[0]).toHaveValue(null);
  });

  it("pre-populates from existing log", () => {
    const existingLog = {
      id: "log_1",
      notes: "Great session",
      feeling: 4,
      perceivedEffort: 7,
      blockResults: [
        {
          blockId: "b_1",
          completedRounds: null,
          extraReps: null,
          completedTime: null,
          notes: null,
          exerciseResults: [
            {
              blockExerciseId: "be_1",
              exerciseId: "ex_1",
              actualReps: 12,
              actualWeight: 65,
              actualWeightUnit: "KG",
              actualTime: null,
              actualDistance: null,
              actualDistanceUnit: null,
              actualCalories: null,
              sets: [
                {
                  setNumber: 1,
                  reps: 10,
                  weight: 65,
                  weightUnit: "KG",
                  notes: null,
                },
              ],
            },
          ],
        },
      ],
    };

    render(
      <WorkoutLogger
        workout={makeWorkout()}
        existingLog={existingLog as never}
      />
    );

    // Notes should be pre-populated
    const notesTextarea = screen.getByPlaceholderText("log.notesPlaceholder");
    expect(notesTextarea).toHaveValue("Great session");
  });

  it("renders AMRAP block with completed rounds and extra reps inputs", () => {
    render(<WorkoutLogger workout={makeAmrapWorkout()} />);
    expect(screen.getByText("AMRAP Block")).toBeInTheDocument();
    expect(screen.getByText("blocks.types.AMRAP")).toBeInTheDocument();
    expect(screen.getByText("log.completedRounds")).toBeInTheDocument();
    expect(screen.getByText("log.extraReps")).toBeInTheDocument();
  });

  it("renders FOR_TIME block with time input", () => {
    render(<WorkoutLogger workout={makeForTimeWorkout()} />);
    expect(screen.getByText("For Time Block")).toBeInTheDocument();
    expect(screen.getByText("log.completedTime")).toBeInTheDocument();
    expect(screen.getByTestId("time-input")).toBeInTheDocument();
  });

  it("renders timeCap when block has one", () => {
    render(<WorkoutLogger workout={makeAmrapWorkout()} />);
    expect(screen.getByText(/blocks.timeCap/)).toBeInTheDocument();
    expect(screen.getByText(/720s/)).toBeInTheDocument();
  });

  it("renders exercise with distance, time, and calories fields", () => {
    render(<WorkoutLogger workout={makeFullExerciseWorkout()} />);
    expect(screen.getByText("Row")).toBeInTheDocument();
    expect(screen.getByText("log.actualDistance")).toBeInTheDocument();
    expect(screen.getByText("log.actualCalories")).toBeInTheDocument();
  });

  it("renders reps input for non-strength exercise with hasReps", () => {
    render(<WorkoutLogger workout={makeAmrapWorkout()} />);
    expect(screen.getByText("log.actualReps")).toBeInTheDocument();
  });

  it("renders weight input for non-strength exercise with hasWeight", () => {
    render(<WorkoutLogger workout={makeForTimeWorkout()} />);
    expect(screen.getByText("log.actualWeight")).toBeInTheDocument();
  });

  it("handles reps input change in set row", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);

    // Add a set
    const addSetBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("log.addSet"));
    fireEvent.click(addSetBtn!);

    const repsInputs = screen.getAllByPlaceholderText("Reps");
    fireEvent.change(repsInputs[0], { target: { value: "8" } });
    expect(repsInputs[0]).toHaveValue(8);
  });

  it("handles empty reps input in set row", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);

    const addSetBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("log.addSet"));
    fireEvent.click(addSetBtn!);

    const repsInputs = screen.getAllByPlaceholderText("Reps");
    fireEvent.change(repsInputs[0], { target: { value: "" } });
    expect(repsInputs[0]).toHaveValue(null);
  });

  it("removes a set when trash button is clicked", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);

    // Add a set
    const addSetBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("log.addSet"));
    fireEvent.click(addSetBtn!);

    // Verify set is rendered
    expect(screen.getAllByPlaceholderText("Weight").length).toBe(1);

    // Click the trash button (🗑)
    const trashBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("🗑"));
    fireEvent.click(trashBtn!);

    // Set should be removed
    expect(screen.queryAllByPlaceholderText("Weight").length).toBe(0);
  });

  it("handles completed rounds input for AMRAP block", () => {
    render(<WorkoutLogger workout={makeAmrapWorkout()} />);
    const roundsInputs = screen.getAllByRole("spinbutton");
    // Find the completed rounds input (first numeric input)
    const roundsInput = roundsInputs[0];
    fireEvent.change(roundsInput, { target: { value: "5" } });
    expect(roundsInput).toHaveValue(5);
  });

  it("handles clearing completed rounds input", () => {
    render(<WorkoutLogger workout={makeAmrapWorkout()} />);
    const roundsInputs = screen.getAllByRole("spinbutton");
    const roundsInput = roundsInputs[0];
    fireEvent.change(roundsInput, { target: { value: "5" } });
    fireEvent.change(roundsInput, { target: { value: "" } });
    expect(roundsInput).toHaveValue(null);
  });

  it("handles distance input change", () => {
    render(<WorkoutLogger workout={makeFullExerciseWorkout()} />);
    const numericInputs = screen.getAllByRole("spinbutton");
    // Distance input exists for this exercise
    expect(numericInputs.length).toBeGreaterThan(0);
    fireEvent.change(numericInputs[0], { target: { value: "5" } });
    expect(numericInputs[0]).toHaveValue(5);
  });

  it("handles calories input change", () => {
    render(<WorkoutLogger workout={makeFullExerciseWorkout()} />);
    const numericInputs = screen.getAllByRole("spinbutton");
    // Last numeric input should be calories
    const lastInput = numericInputs[numericInputs.length - 1];
    fireEvent.change(lastInput, { target: { value: "150" } });
    expect(lastInput).toHaveValue(150);
  });

  it("handles notes textarea change", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);
    const notesTextarea = screen.getByPlaceholderText("log.notesPlaceholder");
    fireEvent.change(notesTextarea, { target: { value: "Felt strong today" } });
    expect(notesTextarea).toHaveValue("Felt strong today");
  });

  it("saves workout log successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ performanceEntriesCreated: 3 }),
    });

    render(<WorkoutLogger workout={makeWorkout()} sessionId="s_1" />);

    const saveBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("log.saveLog"));
    fireEvent.click(saveBtn!);

    await screen.findByText("...");

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockFetch).toHaveBeenCalledWith("/api/workouts/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.any(String),
    });
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "success.logged",
      })
    );
    expect(mockPush).toHaveBeenCalledWith("/workouts");
  });

  it("shows error toast on save failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<WorkoutLogger workout={makeWorkout()} />);

    const saveBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("log.saveLog"));
    fireEvent.click(saveBtn!);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "errors.logFailed",
        variant: "destructive",
      })
    );
  });

  it("shows updated toast when editing existing log", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ performanceEntriesCreated: 0 }),
    });

    const existingLog = {
      id: "log_1",
      notes: "",
      feeling: null,
      perceivedEffort: null,
      blockResults: [
        {
          blockId: "b_1",
          completedRounds: null,
          extraReps: null,
          completedTime: null,
          notes: null,
          exerciseResults: [
            {
              blockExerciseId: "be_1",
              exerciseId: "ex_1",
              actualReps: null,
              actualWeight: null,
              actualWeightUnit: null,
              actualTime: null,
              actualDistance: null,
              actualDistanceUnit: null,
              actualCalories: null,
              sets: [],
            },
          ],
        },
      ],
    };

    render(
      <WorkoutLogger
        workout={makeWorkout()}
        existingLog={existingLog as never}
      />
    );

    const saveBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("log.saveLog"));
    fireEvent.click(saveBtn!);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "success.logUpdated",
      })
    );
  });

  it("renders prescribed info for exercise", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);
    expect(screen.getByText(/10 reps/)).toBeInTheDocument();
    expect(screen.getByText(/60KG/)).toBeInTheDocument();
  });

  it("renders cancel button linking to workouts page", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);
    const cancelLink = screen.getByText("form.cancel");
    expect(cancelLink.closest("a")).toHaveAttribute("href", "/workouts");
  });

  it("renders back button linking to workouts page", () => {
    render(<WorkoutLogger workout={makeWorkout()} />);
    const backLink = screen.getByText("←").closest("a");
    expect(backLink).toHaveAttribute("href", "/workouts");
  });
});

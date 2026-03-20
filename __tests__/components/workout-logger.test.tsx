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
});

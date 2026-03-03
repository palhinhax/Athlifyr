import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TrainingPlanWeekEditor } from "@/components/training-plans/training-plan-week-editor";
import type { TrainingPlanWeekWithWorkouts } from "@/types/training-plan";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      "weeks.weekNumber": `Week ${params?.number ?? ""}`,
      "weeks.editWeek": "Edit Week",
      "weeks.deleteWeek": "Delete Week",
      "weeks.duplicateWeek": "Duplicate Week",
      "weeks.moveUp": "Move Up",
      "weeks.moveDown": "Move Down",
      "weeks.moreActions": "More actions",
      "weeks.name": "Name",
      "weeks.namePlaceholder": "Week name",
      "weeks.description": "Description",
      "weeks.descriptionPlaceholder": "Week description",
      "stats.totalWorkouts": `${params?.count ?? 0} workouts`,
      "form.cancel": "Cancel",
      "form.save": "Save",
      "progress.leavePlanConfirm": "Are you sure?",
    };
    return translations[key] ?? key;
  },
}));

// Mock child component that has complex dependencies
jest.mock("@/components/training-plans/training-plan-week-days", () => ({
  TrainingPlanWeekDays: () => <div data-testid="week-days">Week Days</div>,
}));

const mockWeek = {
  id: "week-1",
  name: "Push Day Week",
  description: "Focus on push movements",
  orderIndex: 0,
  trainingPlanId: "plan-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  workouts: [
    {
      id: "pw-1",
      weekId: "week-1",
      workoutId: "w-1",
      dayOfWeek: 1,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      workout: {
        id: "w-1",
        name: "Chest & Triceps",
        description: null,
        type: "STRENGTH",
        difficulty: "INTERMEDIATE",
        isPublic: true,
        createdById: "user-1",
        venueId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        blocks: [],
      },
    },
  ],
} as unknown as TrainingPlanWeekWithWorkouts;

const defaultProps = {
  week: mockWeek,
  weekNumber: 1,
  planId: "plan-1",
  onUpdate: jest.fn().mockResolvedValue(undefined),
  onDelete: jest.fn().mockResolvedValue(undefined),
  onDuplicate: jest.fn().mockResolvedValue(undefined),
};

describe("TrainingPlanWeekEditor", () => {
  it("renders the week name and number", () => {
    render(<TrainingPlanWeekEditor {...defaultProps} />);

    expect(screen.getByText("Push Day Week")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<TrainingPlanWeekEditor {...defaultProps} />);

    expect(screen.getByText("Focus on push movements")).toBeInTheDocument();
  });

  it("uses a native button for the expand/collapse toggle", () => {
    render(<TrainingPlanWeekEditor {...defaultProps} />);

    // The toggle area should be a <button> with aria-expanded, not a <div>
    const toggleButton = screen.getByText("Push Day Week").closest("button");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton!.tagName).toBe("BUTTON");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("sets aria-expanded to true when expanded", () => {
    render(<TrainingPlanWeekEditor {...defaultProps} isExpanded={true} />);

    const toggleButton = screen.getByText("Push Day Week").closest("button");
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onToggleExpand when the toggle button is clicked", async () => {
    const onToggleExpand = jest.fn();
    render(
      <TrainingPlanWeekEditor
        {...defaultProps}
        onToggleExpand={onToggleExpand}
      />
    );

    const toggleButton = screen.getByText("Push Day Week").closest("button")!;
    await userEvent.click(toggleButton);

    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });

  it("renders mobile more-actions button with aria-label when canEdit", () => {
    render(<TrainingPlanWeekEditor {...defaultProps} canEdit={true} />);

    const moreBtn = screen.getByRole("button", { name: "More actions" });
    expect(moreBtn).toBeInTheDocument();
    expect(moreBtn).toHaveAttribute("title", "More actions");
  });

  it("hides action buttons when canEdit is false", () => {
    render(<TrainingPlanWeekEditor {...defaultProps} canEdit={false} />);

    expect(
      screen.queryByRole("button", { name: "More actions" })
    ).not.toBeInTheDocument();
  });

  it("shows expanded content when isExpanded is true", () => {
    render(<TrainingPlanWeekEditor {...defaultProps} isExpanded={true} />);

    expect(screen.getByTestId("week-days")).toBeInTheDocument();
  });
});

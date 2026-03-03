import { render, screen, within, waitFor } from "@testing-library/react";
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

const emptyWeek = {
  ...mockWeek,
  name: null,
  description: null,
  workouts: [],
} as unknown as TrainingPlanWeekWithWorkouts;

const createProps = (overrides = {}) => ({
  week: mockWeek,
  weekNumber: 1,
  planId: "plan-1",
  onUpdate: jest.fn().mockResolvedValue(undefined),
  onDelete: jest.fn().mockResolvedValue(undefined),
  onDuplicate: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe("TrainingPlanWeekEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────

  it("renders the week name and number", () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    expect(screen.getByText("Push Day Week")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    expect(screen.getByText("Focus on push movements")).toBeInTheDocument();
  });

  it("renders fallback week number when name is empty", () => {
    render(<TrainingPlanWeekEditor {...createProps({ week: emptyWeek })} />);
    expect(screen.getByText("Week 1")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<TrainingPlanWeekEditor {...createProps({ week: emptyWeek })} />);
    expect(
      screen.queryByText("Focus on push movements")
    ).not.toBeInTheDocument();
  });

  it("renders workout count badge", () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    expect(screen.getByText("1 workouts")).toBeInTheDocument();
  });

  it("hides expanded content when isExpanded is false", () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    expect(screen.queryByTestId("week-days")).not.toBeInTheDocument();
  });

  it("shows expanded content when isExpanded is true", () => {
    render(
      <TrainingPlanWeekEditor {...createProps({ isExpanded: true })} />
    );
    expect(screen.getByTestId("week-days")).toBeInTheDocument();
  });

  // ── Toggle expand/collapse button ─────────────────────────────────

  it("uses a native button for the expand/collapse toggle", () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    const toggleButton = screen.getByText("Push Day Week").closest("button");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton!.tagName).toBe("BUTTON");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("sets aria-expanded to true when expanded", () => {
    render(
      <TrainingPlanWeekEditor {...createProps({ isExpanded: true })} />
    );
    const toggleButton = screen.getByText("Push Day Week").closest("button");
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onToggleExpand when the toggle button is clicked", async () => {
    const onToggleExpand = jest.fn();
    render(
      <TrainingPlanWeekEditor {...createProps({ onToggleExpand })} />
    );
    const toggleButton = screen.getByText("Push Day Week").closest("button")!;
    await userEvent.click(toggleButton);
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });

  // ── canEdit visibility ────────────────────────────────────────────

  it("renders mobile more-actions button with aria-label when canEdit", () => {
    render(<TrainingPlanWeekEditor {...createProps({ canEdit: true })} />);
    const moreBtn = screen.getByRole("button", { name: "More actions" });
    expect(moreBtn).toBeInTheDocument();
    expect(moreBtn).toHaveAttribute("title", "More actions");
  });

  it("hides action buttons when canEdit is false", () => {
    render(<TrainingPlanWeekEditor {...createProps({ canEdit: false })} />);
    expect(
      screen.queryByRole("button", { name: "More actions" })
    ).not.toBeInTheDocument();
  });

  // ── Move Up / Move Down ───────────────────────────────────────────

  it("calls onMoveUp when move up button is clicked", async () => {
    const onMoveUp = jest.fn();
    render(
      <TrainingPlanWeekEditor
        {...createProps({ canMoveUp: true, onMoveUp })}
      />
    );
    // Open the mobile dropdown
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    const moveUpItem = await screen.findByText("Move Up");
    await userEvent.click(moveUpItem);
    expect(onMoveUp).toHaveBeenCalledTimes(1);
  });

  it("calls onMoveDown when move down button is clicked", async () => {
    const onMoveDown = jest.fn();
    render(
      <TrainingPlanWeekEditor
        {...createProps({ canMoveDown: true, onMoveDown })}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    const moveDownItem = await screen.findByText("Move Down");
    await userEvent.click(moveDownItem);
    expect(onMoveDown).toHaveBeenCalledTimes(1);
  });

  it("does not render move up option when canMoveUp is false", async () => {
    render(
      <TrainingPlanWeekEditor
        {...createProps({ canMoveUp: false, canMoveDown: true })}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    await screen.findByText("Move Down");
    expect(screen.queryByText("Move Up")).not.toBeInTheDocument();
  });

  it("does not render move down option when canMoveDown is false", async () => {
    render(
      <TrainingPlanWeekEditor
        {...createProps({ canMoveUp: true, canMoveDown: false })}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    await screen.findByText("Move Up");
    expect(screen.queryByText("Move Down")).not.toBeInTheDocument();
  });

  // ── Duplicate ─────────────────────────────────────────────────────

  it("calls onDuplicate when duplicate menu item is clicked", async () => {
    const onDuplicate = jest.fn().mockResolvedValue(undefined);
    render(
      <TrainingPlanWeekEditor {...createProps({ onDuplicate })} />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    const dupItem = await screen.findByText("Duplicate Week");
    await userEvent.click(dupItem);
    expect(onDuplicate).toHaveBeenCalledWith("week-1");
  });

  // ── Edit Dialog ───────────────────────────────────────────────────

  it("opens edit dialog when edit menu item is clicked", async () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    const editItem = await screen.findByText("Edit Week");
    await userEvent.click(editItem);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(
      within(screen.getByRole("dialog")).getByText("Edit Week")
    ).toBeInTheDocument();
  });

  it("saves edited week data when Save is clicked", async () => {
    const onUpdate = jest.fn().mockResolvedValue(undefined);
    render(<TrainingPlanWeekEditor {...createProps({ onUpdate })} />);

    // Open edit dialog via mobile dropdown
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    await userEvent.click(await screen.findByText("Edit Week"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const dialog = screen.getByRole("dialog");
    const nameInput = within(dialog).getByPlaceholderText("Week name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Week");

    await userEvent.click(within(dialog).getByText("Save"));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith("week-1", {
        name: "Updated Week",
        description: "Focus on push movements",
      });
    });
  });

  it("closes edit dialog when Cancel is clicked", async () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    await userEvent.click(await screen.findByText("Edit Week"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await userEvent.click(
      within(screen.getByRole("dialog")).getByText("Cancel")
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // ── Delete Dialog ─────────────────────────────────────────────────

  it("opens delete confirmation when delete menu item is clicked", async () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );

    // Click the delete item in the dropdown (identified by text)
    const deleteItem = await screen.findByRole("menuitem", {
      name: /Delete Week/i,
    });
    await userEvent.click(deleteItem);

    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
  });

  it("calls onDelete when delete is confirmed", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    render(<TrainingPlanWeekEditor {...createProps({ onDelete })} />);

    // Open dropdown and click delete
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    const deleteItem = await screen.findByRole("menuitem", {
      name: /Delete Week/i,
    });
    await userEvent.click(deleteItem);

    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    // Confirm delete
    const alertDialog = screen.getByRole("alertdialog");
    const confirmBtn = within(alertDialog).getByRole("button", {
      name: /Delete Week/i,
    });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith("week-1");
    });
  });

  it("closes delete dialog when Cancel is clicked", async () => {
    render(<TrainingPlanWeekEditor {...createProps()} />);
    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    const deleteItem = await screen.findByRole("menuitem", {
      name: /Delete Week/i,
    });
    await userEvent.click(deleteItem);

    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    const alertDialog = screen.getByRole("alertdialog");
    await userEvent.click(within(alertDialog).getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  // ── Desktop inline buttons ─────────────────────────────────────────
  // These are hidden via CSS on mobile but rendered in DOM (jsdom ignores CSS)

  it("renders desktop inline action buttons when canEdit is true", () => {
    const { container } = render(
      <TrainingPlanWeekEditor
        {...createProps({ canMoveUp: true, canMoveDown: true })}
      />
    );
    // The desktop container has class "hidden ... sm:flex"
    const desktopDiv = container.querySelector(".hidden.sm\\:flex");
    expect(desktopDiv).toBeInTheDocument();
    // 5 buttons: moveUp, moveDown, edit, duplicate, delete
    const buttons = desktopDiv!.querySelectorAll("button");
    expect(buttons.length).toBe(5);
  });

  it("calls onMoveUp from desktop inline button", async () => {
    const onMoveUp = jest.fn();
    const { container } = render(
      <TrainingPlanWeekEditor
        {...createProps({ canMoveUp: true, onMoveUp })}
      />
    );
    const desktopDiv = container.querySelector(".hidden.sm\\:flex");
    const buttons = desktopDiv!.querySelectorAll("button");
    // First button is move up
    await userEvent.click(buttons[0]);
    expect(onMoveUp).toHaveBeenCalledTimes(1);
  });

  it("calls onMoveDown from desktop inline button", async () => {
    const onMoveDown = jest.fn();
    const { container } = render(
      <TrainingPlanWeekEditor
        {...createProps({ canMoveDown: true, onMoveDown })}
      />
    );
    const desktopDiv = container.querySelector(".hidden.sm\\:flex");
    const buttons = desktopDiv!.querySelectorAll("button");
    // First button is move down (no move up button rendered)
    await userEvent.click(buttons[0]);
    expect(onMoveDown).toHaveBeenCalledTimes(1);
  });

  it("opens edit dialog from desktop inline edit button", async () => {
    const { container } = render(
      <TrainingPlanWeekEditor {...createProps()} />
    );
    const desktopDiv = container.querySelector(".hidden.sm\\:flex");
    const buttons = desktopDiv!.querySelectorAll("button");
    // With no move up/down, buttons: edit(0), duplicate(1), delete(2)
    await userEvent.click(buttons[0]);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls onDuplicate from desktop inline duplicate button", async () => {
    const onDuplicate = jest.fn().mockResolvedValue(undefined);
    const { container } = render(
      <TrainingPlanWeekEditor {...createProps({ onDuplicate })} />
    );
    const desktopDiv = container.querySelector(".hidden.sm\\:flex");
    const buttons = desktopDiv!.querySelectorAll("button");
    // buttons: edit(0), duplicate(1), delete(2)
    await userEvent.click(buttons[1]);
    expect(onDuplicate).toHaveBeenCalledWith("week-1");
  });

  it("opens delete dialog from desktop inline delete button", async () => {
    const { container } = render(
      <TrainingPlanWeekEditor {...createProps()} />
    );
    const desktopDiv = container.querySelector(".hidden.sm\\:flex");
    const buttons = desktopDiv!.querySelectorAll("button");
    // buttons: edit(0), duplicate(1), delete(2)
    await userEvent.click(buttons[2]);

    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
  });

  // ── Edit dialog description change ────────────────────────────────

  it("saves updated description from edit dialog", async () => {
    const onUpdate = jest.fn().mockResolvedValue(undefined);
    render(<TrainingPlanWeekEditor {...createProps({ onUpdate })} />);

    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    await userEvent.click(await screen.findByText("Edit Week"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const dialog = screen.getByRole("dialog");
    const descInput = within(dialog).getByPlaceholderText("Week description");
    await userEvent.clear(descInput);
    await userEvent.type(descInput, "New description");

    await userEvent.click(within(dialog).getByText("Save"));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith("week-1", {
        name: "Push Day Week",
        description: "New description",
      });
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────

  it("saves with undefined values when fields are empty", async () => {
    const onUpdate = jest.fn().mockResolvedValue(undefined);
    render(
      <TrainingPlanWeekEditor
        {...createProps({ week: emptyWeek, onUpdate })}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: "More actions" })
    );
    await userEvent.click(await screen.findByText("Edit Week"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await userEvent.click(
      within(screen.getByRole("dialog")).getByText("Save")
    );

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith("week-1", {
        name: undefined,
        description: undefined,
      });
    });
  });
});

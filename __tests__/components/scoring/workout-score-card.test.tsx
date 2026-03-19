import React from "react";
import { render, screen } from "@testing-library/react";
import {
  ScorePillarBar,
  WorkoutScoreCard,
} from "@/components/scoring/workout-score-card";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

// ── ScorePillarBar ────────────────────────────────────────────────────────────

describe("ScorePillarBar", () => {
  it("renders label and value", () => {
    render(
      <ScorePillarBar label="Strength" value={450} colorClass="bg-red-500" />
    );
    expect(screen.getByText("Strength")).toBeInTheDocument();
    expect(screen.getByText("450")).toBeInTheDocument();
  });

  it("calculates percentage width correctly", () => {
    const { container } = render(
      <ScorePillarBar label="Engine" value={500} colorClass="bg-amber-500" />
    );
    const bar = container.querySelector("[style]");
    expect(bar).toHaveStyle({ width: "50%" });
  });

  it("caps percentage at 100%", () => {
    const { container } = render(
      <ScorePillarBar label="Over" value={1500} colorClass="bg-red-500" />
    );
    const bar = container.querySelector("[style]");
    expect(bar).toHaveStyle({ width: "100%" });
  });

  it("uses custom maxValue", () => {
    const { container } = render(
      <ScorePillarBar
        label="Custom"
        value={50}
        maxValue={200}
        colorClass="bg-blue-500"
      />
    );
    const bar = container.querySelector("[style]");
    expect(bar).toHaveStyle({ width: "25%" });
  });
});

// ── WorkoutScoreCard ──────────────────────────────────────────────────────────

describe("WorkoutScoreCard", () => {
  const defaultProps = {
    totalScore: 750,
    breakdown: {
      strength: 300,
      endurance: 250,
      engine: 150,
      volumeBonus: 30,
      prBonus: 20,
    },
    highlights: ["High strength contribution", "PR bonus applied (+20)"],
  };

  it("renders total score", () => {
    render(<WorkoutScoreCard {...defaultProps} />);
    expect(screen.getByText("750")).toBeInTheDocument();
    expect(screen.getByText("/ 1000")).toBeInTheDocument();
  });

  it("renders workout score heading", () => {
    render(<WorkoutScoreCard {...defaultProps} />);
    expect(screen.getByText("workoutScore")).toBeInTheDocument();
  });

  it("renders all three pillar bars", () => {
    render(<WorkoutScoreCard {...defaultProps} />);
    expect(screen.getByText("pillars.strength")).toBeInTheDocument();
    expect(screen.getByText("pillars.endurance")).toBeInTheDocument();
    expect(screen.getByText("pillars.engine")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("renders volume and PR bonuses when > 0", () => {
    render(<WorkoutScoreCard {...defaultProps} />);
    expect(screen.getByText(/bonuses\.volume/)).toBeInTheDocument();
    expect(screen.getByText(/bonuses\.pr/)).toBeInTheDocument();
  });

  it("hides bonuses when both are 0", () => {
    render(
      <WorkoutScoreCard
        totalScore={500}
        breakdown={{
          strength: 200,
          endurance: 200,
          engine: 100,
          volumeBonus: 0,
          prBonus: 0,
        }}
      />
    );
    expect(screen.queryByText(/bonuses\.volume/)).not.toBeInTheDocument();
    expect(screen.queryByText(/bonuses\.pr/)).not.toBeInTheDocument();
  });

  it("renders only volume bonus when PR bonus is 0", () => {
    render(
      <WorkoutScoreCard
        totalScore={500}
        breakdown={{
          strength: 200,
          endurance: 200,
          engine: 100,
          volumeBonus: 15,
          prBonus: 0,
        }}
      />
    );
    expect(screen.getByText(/bonuses\.volume/)).toBeInTheDocument();
    expect(screen.queryByText(/bonuses\.pr/)).not.toBeInTheDocument();
  });

  it("renders only PR bonus when volume bonus is 0", () => {
    render(
      <WorkoutScoreCard
        totalScore={500}
        breakdown={{
          strength: 200,
          endurance: 200,
          engine: 100,
          volumeBonus: 0,
          prBonus: 10,
        }}
      />
    );
    expect(screen.queryByText(/bonuses\.volume/)).not.toBeInTheDocument();
    expect(screen.getByText(/bonuses\.pr/)).toBeInTheDocument();
  });

  it("renders highlights", () => {
    render(<WorkoutScoreCard {...defaultProps} />);
    expect(screen.getByText("High strength contribution")).toBeInTheDocument();
    expect(screen.getByText("PR bonus applied (+20)")).toBeInTheDocument();
  });

  it("does not render highlights section when empty", () => {
    render(
      <WorkoutScoreCard
        totalScore={500}
        breakdown={{
          strength: 200,
          endurance: 200,
          engine: 100,
          volumeBonus: 0,
          prBonus: 0,
        }}
        highlights={[]}
      />
    );
    expect(
      screen.queryByText("High strength contribution")
    ).not.toBeInTheDocument();
  });

  it("does not render highlights when undefined", () => {
    render(
      <WorkoutScoreCard
        totalScore={500}
        breakdown={{
          strength: 200,
          endurance: 200,
          engine: 100,
          volumeBonus: 0,
          prBonus: 0,
        }}
      />
    );
    // Just confirm it renders without crashing
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <WorkoutScoreCard {...defaultProps} className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });
});

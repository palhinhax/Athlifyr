/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import {
  AXIS_TICK_STYLE,
  AXIS_TICK_STYLE_SM,
  CLEAN_AXIS_PROPS,
  GRID_PROPS,
  ChartTooltipWrapper,
  ChartGradient,
} from "@/components/charts/chart-helpers";

// ── Constant exports ──────────────────────────────────────────────────────────

describe("AXIS_TICK_STYLE", () => {
  it("has correct fontSize", () => {
    expect(AXIS_TICK_STYLE.fontSize).toBe(12);
  });

  it("has the muted-foreground fill", () => {
    expect(AXIS_TICK_STYLE.fill).toBe("hsl(var(--muted-foreground))");
  });
});

describe("AXIS_TICK_STYLE_SM", () => {
  it("has smaller fontSize than AXIS_TICK_STYLE", () => {
    expect(AXIS_TICK_STYLE_SM.fontSize).toBe(11);
  });

  it("has the muted-foreground fill", () => {
    expect(AXIS_TICK_STYLE_SM.fill).toBe("hsl(var(--muted-foreground))");
  });
});

describe("CLEAN_AXIS_PROPS", () => {
  it("disables tickLine", () => {
    expect(CLEAN_AXIS_PROPS.tickLine).toBe(false);
  });

  it("disables axisLine", () => {
    expect(CLEAN_AXIS_PROPS.axisLine).toBe(false);
  });
});

describe("GRID_PROPS", () => {
  it("has correct strokeDasharray", () => {
    expect(GRID_PROPS.strokeDasharray).toBe("3 3");
  });

  it("has correct opacity", () => {
    expect(GRID_PROPS.opacity).toBe(0.2);
  });
});

// ── ChartTooltipWrapper ───────────────────────────────────────────────────────

describe("ChartTooltipWrapper", () => {
  const payload = [{ name: "Revenue", value: 100 }] as ReadonlyArray<
    Record<string, unknown>
  >;

  it("renders children when active and payload is non-empty", () => {
    render(
      <ChartTooltipWrapper active payload={payload}>
        <span>Tooltip content</span>
      </ChartTooltipWrapper>
    );
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("renders in a styled container div", () => {
    const { container } = render(
      <ChartTooltipWrapper active payload={payload}>
        <span>content</span>
      </ChartTooltipWrapper>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toMatch(/rounded-lg/);
    expect(wrapper.className).toMatch(/border/);
    expect(wrapper.className).toMatch(/bg-background/);
  });

  it("returns null when active is false", () => {
    const { container } = render(
      <ChartTooltipWrapper active={false} payload={payload}>
        <span>Hidden</span>
      </ChartTooltipWrapper>
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when payload is empty array", () => {
    const { container } = render(
      <ChartTooltipWrapper active payload={[]}>
        <span>Hidden</span>
      </ChartTooltipWrapper>
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when payload is null", () => {
    const { container } = render(
      <ChartTooltipWrapper active payload={null}>
        <span>Hidden</span>
      </ChartTooltipWrapper>
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when active is undefined", () => {
    const { container } = render(
      <ChartTooltipWrapper payload={payload}>
        <span>Hidden</span>
      </ChartTooltipWrapper>
    );
    expect(container.firstChild).toBeNull();
  });
});

// ── ChartGradient ─────────────────────────────────────────────────────────────

describe("ChartGradient", () => {
  const renderSvg = (props: React.ComponentProps<typeof ChartGradient>) =>
    render(
      <svg>
        <defs>
          <ChartGradient {...props} />
        </defs>
      </svg>
    );

  it("renders a linearGradient with the given id", () => {
    const { container } = renderSvg({ id: "grad1", color: "#ff0000" });
    const gradient = container.querySelector("linearGradient");
    expect(gradient).not.toBeNull();
    expect(gradient?.getAttribute("id")).toBe("grad1");
  });

  it("renders two stop elements", () => {
    const { container } = renderSvg({ id: "grad2", color: "#00ff00" });
    const stops = container.querySelectorAll("stop");
    expect(stops).toHaveLength(2);
  });

  it("applies default startOpacity 0.4 to the first stop", () => {
    const { container } = renderSvg({ id: "grad3", color: "#0000ff" });
    const stops = container.querySelectorAll("stop");
    expect(stops[0].getAttribute("stop-opacity")).toBe("0.4");
  });

  it("applies default endOpacity 0 to the second stop", () => {
    const { container } = renderSvg({ id: "grad4", color: "#0000ff" });
    const stops = container.querySelectorAll("stop");
    expect(stops[1].getAttribute("stop-opacity")).toBe("0");
  });

  it("accepts custom startOpacity", () => {
    const { container } = renderSvg({
      id: "grad5",
      color: "#ff0000",
      startOpacity: 0.8,
    });
    const stops = container.querySelectorAll("stop");
    expect(stops[0].getAttribute("stop-opacity")).toBe("0.8");
  });

  it("accepts custom endOpacity", () => {
    const { container } = renderSvg({
      id: "grad6",
      color: "#ff0000",
      endOpacity: 0.1,
    });
    const stops = container.querySelectorAll("stop");
    expect(stops[1].getAttribute("stop-opacity")).toBe("0.1");
  });

  it("sets the stopColor to the given color", () => {
    const { container } = renderSvg({ id: "grad7", color: "#abcdef" });
    const stops = container.querySelectorAll("stop");
    expect(stops[0].getAttribute("stop-color")).toBe("#abcdef");
    expect(stops[1].getAttribute("stop-color")).toBe("#abcdef");
  });

  it("renders vertical gradient coordinates", () => {
    const { container } = renderSvg({ id: "grad8", color: "#000" });
    const gradient = container.querySelector("linearGradient");
    expect(gradient?.getAttribute("x1")).toBe("0");
    expect(gradient?.getAttribute("y1")).toBe("0");
    expect(gradient?.getAttribute("x2")).toBe("0");
    expect(gradient?.getAttribute("y2")).toBe("1");
  });
});

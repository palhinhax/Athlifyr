import { render, screen } from "@testing-library/react";
import { BrandFrame } from "@/components/instagram/brand-frame";

describe("BrandFrame", () => {
  it("should render logo by default", () => {
    render(
      <BrandFrame format="SQUARE">
        <div>Content</div>
      </BrandFrame>
    );

    const logo = screen.getByAltText("Athlifyr");
    expect(logo).toBeInTheDocument();
  });

  it("should hide logo when showLogo is false", () => {
    render(
      <BrandFrame format="SQUARE" showLogo={false}>
        <div>Content</div>
      </BrandFrame>
    );

    const logo = screen.queryByAltText("Athlifyr");
    expect(logo).not.toBeInTheDocument();
  });

  it("should show logo when showLogo is true", () => {
    render(
      <BrandFrame format="SQUARE" showLogo={true}>
        <div>Content</div>
      </BrandFrame>
    );

    const logo = screen.getByAltText("Athlifyr");
    expect(logo).toBeInTheDocument();
  });

  it("should render children content", () => {
    render(
      <BrandFrame format="SQUARE">
        <div>Test Content</div>
      </BrandFrame>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render safe area guides when showGuides is true", () => {
    render(
      <BrandFrame format="SQUARE" showGuides={true}>
        <div>Content</div>
      </BrandFrame>
    );

    const safeAreaText = screen.getByText("SAFE AREA");
    expect(safeAreaText).toBeInTheDocument();
  });

  it("should not render safe area guides when showGuides is false", () => {
    render(
      <BrandFrame format="SQUARE" showGuides={false}>
        <div>Content</div>
      </BrandFrame>
    );

    const safeAreaText = screen.queryByText("SAFE AREA");
    expect(safeAreaText).not.toBeInTheDocument();
  });
});

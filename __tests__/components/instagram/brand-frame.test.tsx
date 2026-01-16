import { render } from "@testing-library/react";
import { BrandFrame } from "@/components/instagram/brand-frame";

describe("BrandFrame", () => {
  it("should render logo by default", () => {
    const { getByAltText } = render(
      <BrandFrame format="SQUARE">
        <div>Content</div>
      </BrandFrame>
    );

    const logo = getByAltText("Athlifyr");
    expect(logo).toBeInTheDocument();
  });

  it("should hide logo when showLogo is false", () => {
    const { queryByAltText } = render(
      <BrandFrame format="SQUARE" showLogo={false}>
        <div>Content</div>
      </BrandFrame>
    );

    const logo = queryByAltText("Athlifyr");
    expect(logo).not.toBeInTheDocument();
  });

  it("should show logo when showLogo is true", () => {
    const { getByAltText } = render(
      <BrandFrame format="SQUARE" showLogo={true}>
        <div>Content</div>
      </BrandFrame>
    );

    const logo = getByAltText("Athlifyr");
    expect(logo).toBeInTheDocument();
  });

  it("should render children content", () => {
    const { getByText } = render(
      <BrandFrame format="SQUARE">
        <div>Test Content</div>
      </BrandFrame>
    );

    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("should render safe area guides when showGuides is true", () => {
    const { getByText } = render(
      <BrandFrame format="SQUARE" showGuides={true}>
        <div>Content</div>
      </BrandFrame>
    );

    const safeAreaText = getByText("SAFE AREA");
    expect(safeAreaText).toBeInTheDocument();
  });

  it("should not render safe area guides when showGuides is false", () => {
    const { queryByText } = render(
      <BrandFrame format="SQUARE" showGuides={false}>
        <div>Content</div>
      </BrandFrame>
    );

    const safeAreaText = queryByText("SAFE AREA");
    expect(safeAreaText).not.toBeInTheDocument();
  });
});

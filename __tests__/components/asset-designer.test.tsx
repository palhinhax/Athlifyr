import React from "react";
import { render, screen } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

jest.mock("@/types/app-store-assets", () => ({
  DEFAULT_CANVAS_DESIGN: {
    backgroundType: "gradient",
    backgroundColor: "#1a1a2e",
    backgroundGradientEnd: "#16213e",
    backgroundImageUrl: null,
    showDevice: true,
    deviceType: "iphone",
    screenImageUrl: null,
    headlineText: "Athlifyr",
    subheadlineText: "",
    textColor: "#ffffff",
    textAlign: "center",
    textPosition: "top",
    showLogo: true,
    fontSize: 48,
  },
  getAssetsForPlatform: jest.fn().mockReturnValue([
    {
      id: "ios-6.7",
      name: 'iPhone 6.7"',
      width: 1290,
      height: 2796,
      platform: "ios",
    },
  ]),
}));

jest.mock("@/components/app-store-assets/asset-canvas", () => ({
  AssetCanvas: () => <div data-testid="asset-canvas">Canvas</div>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    ...rest
  }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...rest}>{children}</label>
  ),
}));

jest.mock("@/components/ui/slider", () => ({
  Slider: ({
    value,
    onValueChange,
  }: {
    value: number[];
    onValueChange?: (v: number[]) => void;
  }) => (
    <input
      type="range"
      data-testid="slider"
      value={value[0]}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
    />
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (v: string) => void;
  }) => <div data-value={value}>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-value={value}>{children}</div>,
}));

jest.mock("@/components/ui/switch", () => ({
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked?: boolean;
    onCheckedChange?: (c: boolean) => void;
  }) => (
    <input
      type="checkbox"
      data-testid="switch"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
  CardContent: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>,
  CardDescription: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement>) => <p {...rest}>{children}</p>,
  CardHeader: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
  CardTitle: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <h3 {...rest}>{children}</h3>
  ),
}));

import { AssetDesigner } from "@/components/app-store-assets/asset-designer";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AssetDesigner", () => {
  it("renders with ios platform", () => {
    render(<AssetDesigner platform="ios" />);

    expect(screen.getByTestId("asset-canvas")).toBeInTheDocument();
  });

  it("renders with google platform", () => {
    const { getAssetsForPlatform } = jest.requireMock<{
      getAssetsForPlatform: jest.Mock;
    }>("@/types/app-store-assets");
    getAssetsForPlatform.mockReturnValue([
      {
        id: "google-phone",
        name: 'Phone 6.7"',
        width: 1080,
        height: 1920,
        platform: "google",
      },
    ]);

    render(<AssetDesigner platform="google" />);

    expect(screen.getByTestId("asset-canvas")).toBeInTheDocument();
  });

  it("shows export button", () => {
    render(<AssetDesigner platform="ios" />);

    expect(screen.getByText("designer.export")).toBeInTheDocument();
    expect(screen.getByText("PNG")).toBeInTheDocument();
    expect(screen.getByText("JPEG")).toBeInTheDocument();
  });
});

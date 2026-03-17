import React from "react";
import { render, screen } from "@testing-library/react";
import { CreditLegalDisclaimer } from "@/components/credits/credit-legal-disclaimer";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => <a href={href}>{children}</a>,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CreditLegalDisclaimer", () => {
  it("renders the disclaimer text", () => {
    render(<CreditLegalDisclaimer />);
    expect(screen.getByText(/legal\.disclaimer/)).toBeInTheDocument();
  });

  it("renders the terms link", () => {
    render(<CreditLegalDisclaimer />);
    const link = screen.getByRole("link", { name: /legal\.termsApply/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/terms#credits");
  });
});

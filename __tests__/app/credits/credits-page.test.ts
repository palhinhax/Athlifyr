/**
 * @jest-environment node
 */

import { generateMetadata } from "@/app/[locale]/credits/page";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn().mockResolvedValue({ user: { id: "u1" } }),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string): string => key),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/credits/wallet-page-client", () => ({
  WalletPageClient: () => null,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("WalletPage metadata", () => {
  it("generates metadata with title and description", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });
    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
  });
});
